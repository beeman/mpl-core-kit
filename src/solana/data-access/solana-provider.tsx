import {
  createSolanaDevnet,
  createSolanaLocalnet,
  createSolanaMainnet,
  createSolanaTestnet,
  createWalletUiConfig,
  type SolanaCluster,
  WalletUi,
} from '@wallet-ui/react'
import { type ReactNode, useEffect } from 'react'

import { solanaMobileWalletAdapter } from './solana-mobile-wallet-adapter'

const clusters: SolanaCluster[] = [
  createSolanaDevnet('https://api.devnet.solana.com'),
  createSolanaLocalnet('http://127.0.0.1:8899'),
  createSolanaTestnet('https://api.testnet.solana.com'),
]

const solanaMainnetUrl = import.meta.env['VITE_SOLANA_MAINNET_URL']
if (solanaMainnetUrl?.trim()?.startsWith('http')) {
  clusters.unshift(createSolanaMainnet(solanaMainnetUrl))
}

const config = createWalletUiConfig({ clusters })

let solanaMobileWalletAdapterLoaded = false

export function SolanaProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (solanaMobileWalletAdapterLoaded) {
      return
    }

    solanaMobileWalletAdapterLoaded = true
    solanaMobileWalletAdapter({ clusters: config.clusters })
  }, [])

  return <WalletUi config={config}>{children}</WalletUi>
}
