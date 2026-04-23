import { useMutation } from '@tanstack/react-query'
import { type UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'

import { executeMplCoreAssetCreate } from '@/mpl-core/data-access/execute-mpl-core-asset-create'
import { type MplCoreCreateDraft } from '@/mpl-core/data-access/mpl-core-create-draft'
import { type SolanaClient } from '@/solana/data-access/solana-client'

export function useMplCoreAssetCreate({ account, client }: { account: UiWalletAccount; client: SolanaClient }) {
  const walletSigner = useWalletUiSigner({ account })
  const { isPending: isLoading, mutateAsync: createAsset } = useMutation({
    mutationFn: (draft: MplCoreCreateDraft) => executeMplCoreAssetCreate({ client, draft, walletSigner }),
  })

  return {
    createAsset,
    isLoading,
  }
}
