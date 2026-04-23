import { address } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import { useWalletUi } from '@wallet-ui/react'

import { isValidAddress } from '@/mpl-core/data-access/mpl-core-create-draft'
import { fetchMplCoreCollectionRecord } from '@/mpl-core/data-access/mpl-core-explorer-records'
import { useSolanaClient } from '@/solana/data-access/use-solana-client'

export function useMplCoreCollectionQuery({ collectionAddress }: { collectionAddress: string }) {
  const client = useSolanaClient()
  const { cluster } = useWalletUi()
  const trimmedAddress = collectionAddress.trim()

  return useQuery(
    getMplCoreCollectionQueryOptions({
      client,
      clusterId: cluster.id,
      collectionAddress: trimmedAddress,
    }),
  )
}

function getMplCoreCollectionQueryOptions({
  client,
  clusterId,
  collectionAddress,
}: {
  client: ReturnType<typeof useSolanaClient>
  clusterId: string
  collectionAddress: string
}) {
  // client.rpc is derived from the selected cluster and should not participate in cache identity.
  // eslint-disable-next-line @tanstack/query/exhaustive-deps
  return {
    enabled: isValidAddress(collectionAddress),
    queryFn: () =>
      fetchMplCoreCollectionRecord({
        client,
        recordAddress: address(collectionAddress),
      }),
    queryKey: ['mpl-core-collection', clusterId, collectionAddress],
    retry: false,
    staleTime: 30_000,
  }
}
