import { useQueries } from '@tanstack/react-query'

import { isValidUrl } from '@/mpl-core/data-access/mpl-core-create-draft'
import { useMplCoreAssetsByOwnerQuery } from '@/mpl-core/data-access/use-mpl-core-assets-by-owner-query'
import { useMplCoreCollectionsByUpdateAuthorityQuery } from '@/mpl-core/data-access/use-mpl-core-collections-by-update-authority-query'
import { getMplCoreJsonPreviewQueryOptions } from '@/mpl-core/data-access/use-mpl-core-json-preview-query'
import { MplCoreUiExplorerAssetList } from '@/mpl-core/ui/mpl-core-ui-explorer-asset-list'
import { MplCoreUiExplorerCollectionList } from '@/mpl-core/ui/mpl-core-ui-explorer-collection-list'

export function MplCoreFeatureExplorerOwned({ ownerAddress }: { ownerAddress: string }) {
  const {
    data: assets,
    error: assetsError,
    isPending: isAssetsLoading,
  } = useMplCoreAssetsByOwnerQuery({ ownerAddress })
  const {
    data: collections,
    error: collectionsError,
    isPending: isCollectionsLoading,
  } = useMplCoreCollectionsByUpdateAuthorityQuery({
    updateAuthorityAddress: ownerAddress,
  })

  const assetMetadataQueries = useQueries({
    queries: (assets ?? []).map((asset) => ({
      enabled: isValidUrl(asset.data.uri),
      ...getMplCoreJsonPreviewQueryOptions({ uri: asset.data.uri }),
    })),
  })
  const collectionMetadataQueries = useQueries({
    queries: (collections ?? []).map((collection) => ({
      enabled: isValidUrl(collection.data.uri),
      ...getMplCoreJsonPreviewQueryOptions({ uri: collection.data.uri }),
    })),
  })

  return (
    <div className="space-y-6">
      <MplCoreUiExplorerAssetList
        description="Browse the Core assets currently owned by the connected wallet."
        emptyMessage="Create an asset or switch wallets to see owned assets here."
        error={assetsError}
        isLoading={isAssetsLoading}
        items={(assets ?? []).map((asset, index) => ({
          asset,
          isMetadataLoading: assetMetadataQueries[index]?.isPending ?? false,
          metadata: assetMetadataQueries[index]?.data,
        }))}
        title="Your Core Assets"
      />
      <MplCoreUiExplorerCollectionList
        description="Browse the Core collections where the connected wallet is the update authority."
        emptyMessage="Create a collection or switch wallets to see managed collections here."
        error={collectionsError}
        isLoading={isCollectionsLoading}
        items={(collections ?? []).map((collection, index) => ({
          collection,
          isMetadataLoading: collectionMetadataQueries[index]?.isPending ?? false,
          metadata: collectionMetadataQueries[index]?.data,
        }))}
        title="Your Core Collections"
      />
    </div>
  )
}
