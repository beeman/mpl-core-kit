import { type StartedSurfpoolContainer, SurfpoolContainer } from '@beeman/testcontainers'
import {
  generateKeyPairSigner,
  getBase58Encoder,
  getBase64EncodedWireTransaction,
  lamports,
  signTransactionWithSigners,
} from '@solana/kit'
import { afterAll, beforeAll, describe, expect, it } from 'bun:test'

import { fetchAssetsByCollection, fetchAssetsByOwner, fetchAssetV1, fetchCollectionV1 } from '../lib'
import { executeMplCoreAssetCreate } from '../src/mpl-core/data-access/execute-mpl-core-asset-create'
import { getDefaultMplCoreCreateDraft } from '../src/mpl-core/data-access/mpl-core-create-draft'
import { createSolanaClient } from '../src/solana/data-access/create-solana-client'

const AIRDROP_AMOUNT = 100_000_000_000
const COLLECTION_NAME = 'Bun Test Collection'
const COLLECTION_URI = 'https://example.com/collections/bun-test.json'
const FIRST_ASSET_NAME = 'Bun Test Asset One'
const FIRST_ASSET_URI = 'https://example.com/assets/bun-test-one.json'
const HEALTHCHECK_INTERVAL_MS = 1_000
const SECOND_ASSET_NAME = 'Bun Test Asset Two'
const SECOND_ASSET_URI = 'https://example.com/assets/bun-test-two.json'
const STARTUP_TIMEOUT_MS = 120_000

describe('mpl-core kit integration', () => {
  let client: ReturnType<typeof createSolanaClient>
  let collectionAddress = ''
  let container: StartedSurfpoolContainer | undefined
  let firstAssetAddress = ''
  let walletSigner: Awaited<ReturnType<typeof createTransactionSendingSigner>>

  beforeAll(async () => {
    const signer = await generateKeyPairSigner()

    container = await new SurfpoolContainer()
      .withAirdrop([signer.address], AIRDROP_AMOUNT)
      .withSolanaNetwork('devnet')
      .start()
    client = createSolanaClient({ http: container.url, ws: container.urlWs })
    walletSigner = await createTransactionSendingSigner({ client, signer })

    await waitForValue({
      action: () => client.rpc.getHealth().send(),
      isReady: (health) => health === 'ok',
    })
    await waitForValue({
      action: () => client.rpc.getBalance(walletSigner.address).send(),
      isReady: (result) => result.value === lamports(BigInt(AIRDROP_AMOUNT)),
    })

    const draft = getDefaultMplCoreCreateDraft()
    draft.collection.mode = 'New'
    draft.collection.name = COLLECTION_NAME
    draft.collection.uri = COLLECTION_URI
    draft.name = FIRST_ASSET_NAME
    draft.owner = walletSigner.address
    draft.uri = FIRST_ASSET_URI

    const result = await executeMplCoreAssetCreate({ client, draft, walletSigner })

    collectionAddress = result.collectionAddress!
    firstAssetAddress = result.assetAddress

    await waitForValue({ action: () => fetchAssetV1(client.rpc, firstAssetAddress) })
    await waitForValue({ action: () => fetchCollectionV1(client.rpc, collectionAddress) })
  }, STARTUP_TIMEOUT_MS)

  afterAll(async () => {
    await container?.stop()
  })

  it(
    'creates a collection and fetches its first asset with the vendored kit client',
    async () => {
      const asset = await fetchAssetV1(client.rpc, firstAssetAddress)
      const collection = await fetchCollectionV1(client.rpc, collectionAddress)

      expect(asset.address).toBe(firstAssetAddress)
      expect(asset.data.name).toBe(FIRST_ASSET_NAME)
      expect(asset.data.uri).toBe(FIRST_ASSET_URI)
      expect(collection.address).toBe(collectionAddress)
      expect(collection.data.name).toBe(COLLECTION_NAME)
      expect(collection.data.uri).toBe(COLLECTION_URI)
    },
    STARTUP_TIMEOUT_MS,
  )

  it(
    'creates another asset in the existing collection and finds both assets through GPA helpers',
    async () => {
      const draft = getDefaultMplCoreCreateDraft()
      draft.collection.address = collectionAddress
      draft.collection.mode = 'Existing'
      draft.name = SECOND_ASSET_NAME
      draft.owner = walletSigner.address
      draft.uri = SECOND_ASSET_URI

      const result = await executeMplCoreAssetCreate({ client, draft, walletSigner })
      const secondAsset = await waitForValue({ action: () => fetchAssetV1(client.rpc, result.assetAddress) })
      const assetsByCollection = await waitForValue({
        action: () => fetchAssetsByCollection(client.rpc, collectionAddress),
        isReady: (accounts) => hasAddress(accounts, firstAssetAddress) && hasAddress(accounts, result.assetAddress),
      })
      const assetsByOwner = await waitForValue({
        action: () => fetchAssetsByOwner(client.rpc, walletSigner.address),
        isReady: (accounts) => hasAddress(accounts, firstAssetAddress) && hasAddress(accounts, result.assetAddress),
      })

      expect(result.collectionAddress).toBe(collectionAddress)
      expect(secondAsset.data.name).toBe(SECOND_ASSET_NAME)
      expect(secondAsset.data.uri).toBe(SECOND_ASSET_URI)
      expect(hasAddress(assetsByCollection, firstAssetAddress)).toBe(true)
      expect(hasAddress(assetsByCollection, result.assetAddress)).toBe(true)
      expect(hasAddress(assetsByOwner, firstAssetAddress)).toBe(true)
      expect(hasAddress(assetsByOwner, result.assetAddress)).toBe(true)
    },
    STARTUP_TIMEOUT_MS,
  )
})

async function createTransactionSendingSigner({
  client,
  signer,
}: {
  client: ReturnType<typeof createSolanaClient>
  signer: Awaited<ReturnType<typeof generateKeyPairSigner>>
}) {
  return Object.freeze({
    ...signer,
    async signAndSendTransactions(transactions) {
      return Promise.all(
        transactions.map(async (transaction) => {
          const signedTransaction = await signTransactionWithSigners([signer], transaction)
          const signature = await client.rpc
            .sendTransaction(getBase64EncodedWireTransaction(signedTransaction), { encoding: 'base64' })
            .send()

          return getBase58Encoder().encode(signature)
        }),
      )
    },
  })
}

function hasAddress(accounts: { address: string }[], value: string) {
  return accounts.some((account) => account.address === value)
}

async function waitForValue<T>({ action, isReady }: { action(): Promise<T>; isReady?(value: T): boolean }) {
  const startedAt = Date.now()
  let lastError: Error | undefined

  while (Date.now() - startedAt < STARTUP_TIMEOUT_MS) {
    try {
      const value = await action()

      if (!isReady || isReady(value)) {
        return value
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
    }

    await Bun.sleep(HEALTHCHECK_INTERVAL_MS)
  }

  throw new Error(lastError ? lastError.message : 'The operation did not become ready before the timeout.')
}
