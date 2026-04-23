import { type MplCoreCollectionRecord } from '@/mpl-core/data-access/mpl-core-explorer-records'
import { MplCoreUiExplorerStat } from '@/mpl-core/ui/mpl-core-ui-explorer-stat'

export function MplCoreUiExplorerCollectionDetails({
  collection,
  metadataDescription,
  metadataName,
}: {
  collection: MplCoreCollectionRecord
  metadataDescription?: string
  metadataName?: string
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Collection Details</div>
        <div className="text-xl font-semibold tracking-tight">{metadataName ?? collection.data.name}</div>
        {metadataDescription ? <div className="text-sm/6 text-muted-foreground">{metadataDescription}</div> : null}
      </div>
      <div className="grid gap-3">
        <MplCoreUiExplorerStat copyValue={collection.address} label="Mint" value={collection.address} />
        <MplCoreUiExplorerStat
          copyValue={collection.data.updateAuthority}
          label="Update Authority"
          value={collection.data.updateAuthority}
        />
        <MplCoreUiExplorerStat label="Current Size" value={collection.data.currentSize.toString()} />
        <MplCoreUiExplorerStat label="Number Minted" value={collection.data.numMinted.toString()} />
        <MplCoreUiExplorerStat
          copyValue={collection.data.uri}
          href={collection.data.uri}
          label="Metadata URI"
          value={collection.data.uri}
        />
      </div>
    </div>
  )
}
