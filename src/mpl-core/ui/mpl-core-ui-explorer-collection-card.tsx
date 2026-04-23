import { SnowflakeIcon } from 'lucide-react'
import { Link } from 'react-router'

import { Badge } from '@/core/ui/badge'
import { Card, CardContent } from '@/core/ui/card'
import { type MplCoreCollectionRecord } from '@/mpl-core/data-access/mpl-core-explorer-records'
import { SolanaUiAddress } from '@/solana/ui/solana-ui-address'

export function MplCoreUiExplorerCollectionCard({
  collection,
  isMetadataLoading,
  metadata,
}: {
  collection: MplCoreCollectionRecord
  isMetadataLoading: boolean
  metadata?: Record<string, unknown>
}) {
  const image = typeof metadata?.image === 'string' ? metadata.image : undefined
  const metadataName = typeof metadata?.name === 'string' ? metadata.name : undefined

  return (
    <Link className="block outline-none" to={`/explorer/collection/${collection.address}`}>
      <Card className="h-full border-border/60 transition-all hover:ring-2 hover:ring-primary/30 focus-visible:ring-2 focus-visible:ring-primary/30">
        <div className="aspect-square overflow-hidden border-b border-border/60 bg-muted/20">
          {image ? (
            <img alt={metadataName ?? collection.data.name} className="h-full w-full object-cover" src={image} />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              {isMetadataLoading ? 'Loading preview…' : 'No preview image'}
            </div>
          )}
        </div>
        <CardContent className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{metadataName ?? collection.data.name}</div>
              <div className="mt-1 text-xs/relaxed text-muted-foreground">
                <SolanaUiAddress address={collection.address} len={8} />
              </div>
            </div>
            {collection.data.permanentFreezeDelegate?.frozen ? (
              <Badge variant="outline">
                <SnowflakeIcon />
                Frozen
              </Badge>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
