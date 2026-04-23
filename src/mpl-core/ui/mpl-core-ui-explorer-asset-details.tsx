import { type MplCoreAssetRecord } from '@/mpl-core/data-access/mpl-core-explorer-records'
import { MplCoreUiExplorerStat } from '@/mpl-core/ui/mpl-core-ui-explorer-stat'

export function MplCoreUiExplorerAssetDetails({
  asset,
  metadataDescription,
  metadataName,
}: {
  asset: MplCoreAssetRecord
  metadataDescription?: string
  metadataName?: string
}) {
  const updateAuthority = asset.data.updateAuthority

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Asset Details</div>
        <div className="text-xl font-semibold tracking-tight">{metadataName ?? asset.data.name}</div>
        {metadataDescription ? <div className="text-sm/6 text-muted-foreground">{metadataDescription}</div> : null}
      </div>
      <div className="grid gap-3">
        <MplCoreUiExplorerStat copyValue={asset.address} label="Mint" value={asset.address} />
        <MplCoreUiExplorerStat copyValue={asset.data.owner} label="Owner" value={asset.data.owner} />
        <MplCoreUiExplorerStat label="Update Authority Type" value={updateAuthority.type} />
        {updateAuthority.address ? (
          <MplCoreUiExplorerStat
            copyValue={updateAuthority.address}
            label={updateAuthority.type === 'Collection' ? 'Collection' : 'Update Authority'}
            to={updateAuthority.type === 'Collection' ? `/explorer/collection/${updateAuthority.address}` : undefined}
            value={updateAuthority.address}
          />
        ) : null}
        <MplCoreUiExplorerStat
          copyValue={asset.data.uri}
          href={asset.data.uri}
          label="Metadata URI"
          value={asset.data.uri}
        />
      </div>
    </div>
  )
}
