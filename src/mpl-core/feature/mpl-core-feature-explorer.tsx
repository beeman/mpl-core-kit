import { useWalletUi } from '@wallet-ui/react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { MplCoreFeatureExplorerOwned } from '@/mpl-core/feature/mpl-core-feature-explorer-owned'
import { MplCoreFeatureExplorerSearch } from '@/mpl-core/feature/mpl-core-feature-explorer-search'

export function MplCoreFeatureExplorer() {
  const { account } = useWalletUi()

  return (
    <div className="mx-auto my-4 max-w-6xl px-4">
      <div className="space-y-6">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Explorer</CardTitle>
            <CardDescription>
              Search any Core asset or collection by address, then inspect its metadata and parsed plugins.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MplCoreFeatureExplorerSearch />
          </CardContent>
        </Card>

        {account ? (
          <MplCoreFeatureExplorerOwned ownerAddress={account.address} />
        ) : (
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Wallet Not Connected</CardTitle>
              <CardDescription>
                Connect a wallet to browse the assets you own and the collections you manage.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}

export { MplCoreFeatureExplorer as Component }
