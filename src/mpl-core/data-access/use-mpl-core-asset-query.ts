import { address } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import { useWalletUi } from '@wallet-ui/react'

import { isValidAddress } from '@/mpl-core/data-access/mpl-core-create-draft'
import { fetchMplCoreAssetRecord } from '@/mpl-core/data-access/mpl-core-explorer-records'
import { useSolanaClient } from '@/solana/data-access/use-solana-client'

export function useMplCoreAssetQuery({ assetAddress }: { assetAddress: string }) {
  const client = useSolanaClient()
  const { cluster } = useWalletUi()
  const trimmedAddress = assetAddress.trim()

  return useQuery(getMplCoreAssetQueryOptions({ assetAddress: trimmedAddress, client, clusterId: cluster.id }))
}

function getMplCoreAssetQueryOptions({
  assetAddress,
  client,
  clusterId,
}: {
  assetAddress: string
  client: ReturnType<typeof useSolanaClient>
  clusterId: string
}) {
  // client.rpc is derived from the selected cluster and should not participate in cache identity.
  // eslint-disable-next-line @tanstack/query/exhaustive-deps
  return {
    enabled: isValidAddress(assetAddress),
    queryFn: () =>
      fetchMplCoreAssetRecord({
        client,
        recordAddress: address(assetAddress),
      }),
    queryKey: ['mpl-core-asset', clusterId, assetAddress],
    retry: false,
    staleTime: 30_000,
  }
}
