import { useParams } from 'react-router'

import { Alert, AlertDescription, AlertTitle } from '@/core/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { Spinner } from '@/core/ui/spinner'
import { isValidAddress } from '@/mpl-core/data-access/mpl-core-create-draft'
import { useMplCoreCollectionQuery } from '@/mpl-core/data-access/use-mpl-core-collection-query'
import { useMplCoreJsonPreviewQuery } from '@/mpl-core/data-access/use-mpl-core-json-preview-query'
import { MplCoreFeatureExplorerCollectionAssets } from '@/mpl-core/feature/mpl-core-feature-explorer-collection-assets'
import { MplCoreUiExplorerCollectionDetails } from '@/mpl-core/ui/mpl-core-ui-explorer-collection-details'
import { MplCoreUiExplorerMetadataCard } from '@/mpl-core/ui/mpl-core-ui-explorer-metadata-card'
import { MplCoreUiExplorerPluginDetails } from '@/mpl-core/ui/mpl-core-ui-explorer-plugin-details'
import { getErrorMessage } from '@/wallet/ui/wallet-ui-error'

export function MplCoreFeatureExplorerCollection() {
  const { mint = '' } = useParams()
  const hasValidMint = isValidAddress(mint)
  const {
    data: collection,
    error,
    isPending,
  } = useMplCoreCollectionQuery({
    collectionAddress: hasValidMint ? mint : '',
  })
  const metadata = useMplCoreJsonPreviewQuery({ uri: collection?.data.uri ?? '' })
  const metadataDescription = typeof metadata.data?.description === 'string' ? metadata.data.description : undefined
  const metadataName = typeof metadata.data?.name === 'string' ? metadata.data.name : undefined

  if (!hasValidMint) {
    return (
      <div className="mx-auto my-4 max-w-6xl px-4">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Invalid Collection Address</CardTitle>
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
              <span>Loading collection…</span>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Collection Load Failed</CardTitle>
              <CardDescription>No Core collection could be loaded for this address.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertTitle>Collection query failed</AlertTitle>
                <AlertDescription>{getErrorMessage(error, 'The collection could not be loaded.')}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ) : collection ? (
          <>
            <div className="grid gap-6 xl:grid-cols-2">
              <Card className="border-border/60">
                <CardContent className="pt-4">
                  <MplCoreUiExplorerCollectionDetails
                    collection={collection}
                    metadataDescription={metadataDescription}
                    metadataName={metadataName}
                  />
                </CardContent>
              </Card>
              <MplCoreUiExplorerMetadataCard
                data={metadata.data}
                error={metadata.error}
                isLoading={metadata.isPending}
                title="Collection Metadata"
                uri={collection.data.uri}
              />
            </div>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle>Collection Plugins</CardTitle>
                <CardDescription>
                  Standard and external plugin state decoded from the collection account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MplCoreUiExplorerPluginDetails plugins={collection.data} type="collection" />
              </CardContent>
            </Card>

            <MplCoreFeatureExplorerCollectionAssets collectionAddress={collection.address} />
          </>
        ) : null}
      </div>
    </div>
  )
}

export { MplCoreFeatureExplorerCollection as Component }
