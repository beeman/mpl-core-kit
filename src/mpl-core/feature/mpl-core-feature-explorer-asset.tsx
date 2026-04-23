import { useParams } from 'react-router'

import { Alert, AlertDescription, AlertTitle } from '@/core/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { Spinner } from '@/core/ui/spinner'
import { isValidAddress } from '@/mpl-core/data-access/mpl-core-create-draft'
import { useMplCoreAssetWithCollectionQuery } from '@/mpl-core/data-access/use-mpl-core-asset-with-collection-query'
import { useMplCoreJsonPreviewQuery } from '@/mpl-core/data-access/use-mpl-core-json-preview-query'
import { MplCoreUiExplorerAssetDetails } from '@/mpl-core/ui/mpl-core-ui-explorer-asset-details'
import { MplCoreUiExplorerMetadataCard } from '@/mpl-core/ui/mpl-core-ui-explorer-metadata-card'
import { MplCoreUiExplorerPluginDetails } from '@/mpl-core/ui/mpl-core-ui-explorer-plugin-details'
import { getErrorMessage } from '@/wallet/ui/wallet-ui-error'

export function MplCoreFeatureExplorerAsset() {
  const { mint = '' } = useParams()
  const hasValidMint = isValidAddress(mint)
  const { data, error, isPending } = useMplCoreAssetWithCollectionQuery({ assetAddress: hasValidMint ? mint : '' })
  const asset = data?.asset
  const collection = data?.collection
  const metadata = useMplCoreJsonPreviewQuery({ uri: asset?.data.uri ?? '' })
  const metadataDescription = typeof metadata.data?.description === 'string' ? metadata.data.description : undefined
  const metadataName = typeof metadata.data?.name === 'string' ? metadata.data.name : undefined

  if (!hasValidMint) {
    return (
      <div className="mx-auto my-4 max-w-6xl px-4">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Invalid Asset Address</CardTitle>
            <CardDescription>The current route does not contain a valid Solana address.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto my-4 max-w-6xl px-4">
      <div className="space-y-6">
        {isPending ? (
          <Card className="border-border/60">
            <CardContent className="flex items-center gap-2 py-6">
              <Spinner />
              <span>Loading asset…</span>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Asset Load Failed</CardTitle>
              <CardDescription>No Core asset could be loaded for this address.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertTitle>Asset query failed</AlertTitle>
                <AlertDescription>{getErrorMessage(error, 'The asset could not be loaded.')}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ) : asset ? (
          <>
            <div className="grid gap-6 xl:grid-cols-2">
              <Card className="border-border/60">
                <CardContent className="pt-4">
                  <MplCoreUiExplorerAssetDetails
                    asset={asset}
                    metadataDescription={metadataDescription}
                    metadataName={metadataName}
                  />
                </CardContent>
              </Card>
              <MplCoreUiExplorerMetadataCard
                data={metadata.data}
                error={metadata.error}
                isLoading={metadata.isPending}
                title="Asset Metadata"
                uri={asset.data.uri}
              />
            </div>

            <div className={`grid gap-6 ${collection ? 'xl:grid-cols-2' : ''}`}>
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle>Asset Plugins</CardTitle>
                  <CardDescription>Standard and external plugin state decoded from the asset account.</CardDescription>
                </CardHeader>
                <CardContent>
                  <MplCoreUiExplorerPluginDetails plugins={asset.data} type="asset" />
                </CardContent>
              </Card>

              {collection ? (
                <Card className="border-border/60">
                  <CardHeader>
                    <CardTitle>Collection Plugins</CardTitle>
                    <CardDescription>
                      The collection plugin state inherited or referenced by this asset.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MplCoreUiExplorerPluginDetails plugins={collection.data} type="collection" />
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export { MplCoreFeatureExplorerAsset as Component }
