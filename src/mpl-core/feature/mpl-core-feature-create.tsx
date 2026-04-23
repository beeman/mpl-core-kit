import { SolanaUiWalletGuard } from '@/solana/ui/solana-ui-wallet-guard'

import { MplCoreFeatureCreateConnected } from './mpl-core-feature-create-connected'

export function MplCoreFeatureCreate() {
  return <SolanaUiWalletGuard render={MplCoreFeatureCreateConnected} />
}

export { MplCoreFeatureCreate as Component }
