import { BoxesIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/core/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from '@/core/ui/empty'
import { Spinner } from '@/core/ui/spinner'
import { type MplCoreAssetRecord } from '@/mpl-core/data-access/mpl-core-explorer-records'
import { MplCoreUiExplorerAssetCard } from '@/mpl-core/ui/mpl-core-ui-explorer-asset-card'

export function MplCoreUiExplorerAssetList({
  description,
  emptyMessage,
  error,
  isLoading,
  items,
  title,
}: {
  description: string
  emptyMessage: string
  error: unknown
  isLoading: boolean
  items: Array<{
    asset: MplCoreAssetRecord
    isMetadataLoading: boolean
    metadata?: Record<string, unknown>
  }>
  title: string
}) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Spinner />
            <span>Loading assets…</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Asset query failed</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'Assets could not be loaded.'}
            </AlertDescription>
          </Alert>
        ) : items.length === 0 ? (
          <Empty className="border border-border/60 bg-muted/10">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BoxesIcon />
              </EmptyMedia>
              <EmptyTitle>No assets found</EmptyTitle>
            </EmptyHeader>
            <EmptyContent>{emptyMessage}</EmptyContent>
          </Empty>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
              <MplCoreUiExplorerAssetCard
                asset={item.asset}
                isMetadataLoading={item.isMetadataLoading}
                key={item.asset.address}
                metadata={item.metadata}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
