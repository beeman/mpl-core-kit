import { useState } from 'react'
import { useNavigate } from 'react-router'

import { executeMplCoreExplorerAddressLookup } from '@/mpl-core/data-access/execute-mpl-core-explorer-address-lookup'
import { isValidAddress } from '@/mpl-core/data-access/mpl-core-create-draft'
import { MplCoreUiExplorerSearch } from '@/mpl-core/ui/mpl-core-ui-explorer-search'
import { useSolanaClient } from '@/solana/data-access/use-solana-client'

export function MplCoreFeatureExplorerSearch() {
  const client = useSolanaClient()
  const navigate = useNavigate()
  const [error, setError] = useState<null | string>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSearch(value: string) {
    const trimmedValue = value.trim()

    if (!trimmedValue) {
      setError('Search cannot be empty.')
      return
    }

    if (!isValidAddress(trimmedValue)) {
      setError('Enter a valid Solana address.')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const result = await executeMplCoreExplorerAddressLookup({
        client,
        value: trimmedValue,
      })

      if (!result) {
        setError('No Core asset or collection was found at this address.')
        return
      }

      navigate(result.kind === 'asset' ? `/explorer/${result.address}` : `/explorer/collection/${result.address}`)
    } catch (lookupError) {
      setError(lookupError instanceof Error ? lookupError.message : 'The explorer lookup failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return <MplCoreUiExplorerSearch error={error} isLoading={isLoading} onSearch={(value) => void handleSearch(value)} />
}
