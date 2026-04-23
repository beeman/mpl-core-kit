import { useQueries } from '@tanstack/react-query'

import { isValidUrl } from '@/mpl-core/data-access/mpl-core-create-draft'
import { useMplCoreAssetsByCollectionQuery } from '@/mpl-core/data-access/use-mpl-core-assets-by-collection-query'
import { getMplCoreJsonPreviewQueryOptions } from '@/mpl-core/data-access/use-mpl-core-json-preview-query'
import { MplCoreUiExplorerAssetList } from '@/mpl-core/ui/mpl-core-ui-explorer-asset-list'

export function MplCoreFeatureExplorerCollectionAssets({ collectionAddress }: { collectionAddress: string }) {
  const { data: assets, error, isPending } = useMplCoreAssetsByCollectionQuery({ collectionAddress })
  const metadataQueries = useQueries({
    queries: (assets ?? []).map((asset) => ({
      enabled: isValidUrl(asset.data.uri),
      ...getMplCoreJsonPreviewQueryOptions({ uri: asset.data.uri }),
    })),
  })

  return (
    <MplCoreUiExplorerAssetList
      description="Assets currently attached to this collection."
      emptyMessage="This collection does not currently have any assets."
      error={error}
      isLoading={isPending}
      items={(assets ?? []).map((asset, index) => ({
        asset,
        isMetadataLoading: metadataQueries[index]?.isPending ?? false,
        metadata: metadataQueries[index]?.data,
      }))}
      title="Collection Assets"
    />
  )
}
