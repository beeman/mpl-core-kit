import { LibraryBigIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/core/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from '@/core/ui/empty'
import { Spinner } from '@/core/ui/spinner'
import { type MplCoreCollectionRecord } from '@/mpl-core/data-access/mpl-core-explorer-records'
import { MplCoreUiExplorerCollectionCard } from '@/mpl-core/ui/mpl-core-ui-explorer-collection-card'

export function MplCoreUiExplorerCollectionList({
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
    collection: MplCoreCollectionRecord
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
            <span>Loading collections…</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Collection query failed</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'Collections could not be loaded.'}
            </AlertDescription>
          </Alert>
        ) : items.length === 0 ? (
          <Empty className="border border-border/60 bg-muted/10">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <LibraryBigIcon />
              </EmptyMedia>
              <EmptyTitle>No collections found</EmptyTitle>
            </EmptyHeader>
            <EmptyContent>{emptyMessage}</EmptyContent>
          </Empty>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
              <MplCoreUiExplorerCollectionCard
                collection={item.collection}
                isMetadataLoading={item.isMetadataLoading}
                key={item.collection.address}
                metadata={item.metadata}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
