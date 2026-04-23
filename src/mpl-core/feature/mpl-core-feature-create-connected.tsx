import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle2Icon } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import type { SolanaUiWalletGuardRenderProps } from '@/solana/ui/solana-ui-wallet-guard'

import { Alert, AlertDescription, AlertTitle } from '@/core/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import {
  getDefaultMplCoreCreateDraft,
  isValidUrl,
  type MplCoreCreateFieldErrors,
  validateMplCoreCreateDraft,
} from '@/mpl-core/data-access/mpl-core-create-draft'
import { useMplCoreAssetCreate } from '@/mpl-core/data-access/use-mpl-core-asset-create'
import { getMplCoreJsonPreviewQueryOptions } from '@/mpl-core/data-access/use-mpl-core-json-preview-query'
import { MplCoreFeatureCreateCollectionSection } from '@/mpl-core/feature/mpl-core-feature-create-collection-section'
import { MplCoreFeatureCreateMetadataPreview } from '@/mpl-core/feature/mpl-core-feature-create-metadata-preview'
import { MplCoreUiCreateAssetFields } from '@/mpl-core/ui/mpl-core-ui-create-asset-fields'
import { MplCoreUiCreateSubmit } from '@/mpl-core/ui/mpl-core-ui-create-submit'
import { MplCoreUiPluginConfigurator } from '@/mpl-core/ui/mpl-core-ui-plugin-configurator'
import { useSolanaClient } from '@/solana/data-access/use-solana-client'
import { getErrorMessage } from '@/solana/ui/solana-ui-error'
import { SolanaUiExplorerLink } from '@/solana/ui/solana-ui-explorer-link'

export function MplCoreFeatureCreateConnected({ account }: SolanaUiWalletGuardRenderProps) {
  const client = useSolanaClient()
  const queryClient = useQueryClient()
  const { createAsset, isLoading } = useMplCoreAssetCreate({ account, client })
  const [draft, setDraft] = useState(getDefaultMplCoreCreateDraft)
  const assetNameEditedRef = useRef(false)
  const [errors, setErrors] = useState<MplCoreCreateFieldErrors>({})
  const [lastSubmission, setLastSubmission] = useState<{
    assetAddress: string
    collectionAddress?: string
    signature: string
  } | null>(null)

  async function submitCreate() {
    const nextErrors = validateMplCoreCreateDraft(draft)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      toast.error('Create form has validation errors', {
        description: 'Fix the highlighted fields and try again.',
      })
      return
    }

    try {
      const result = await createAsset(draft)
      setLastSubmission(result)
      toast.success('Asset transaction submitted', {
        description: (
          <SolanaUiExplorerLink
            className="inline-flex items-center gap-1 underline underline-offset-4"
            label="View transaction on Solana Explorer"
            path={`/tx/${result.signature}`}
          />
        ),
      })
    } catch (error) {
      toast.error('Failed to create asset', {
        description: getErrorMessage(error, 'Unknown error occurred'),
      })
    }
  }

  return (
    <div className="mx-auto my-4 max-w-6xl px-4">
      <div className="space-y-6">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Create</CardTitle>
            <CardDescription>
              Create a Core asset with the vendored kit client, optional collection setup, and mint-time plugin
              configuration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <MplCoreUiCreateAssetFields
              errors={errors}
              name={draft.name}
              onNameChange={(name) => {
                assetNameEditedRef.current = true
                setDraft((current) => ({ ...current, name }))
              }}
              onOwnerChange={(owner) => setDraft((current) => ({ ...current, owner }))}
              onUriChange={async (uri) => {
                const trimmedUri = uri.trim()
                assetNameEditedRef.current = false
                setDraft((current) => ({ ...current, uri }))

                if (!isValidUrl(trimmedUri)) {
                  return
                }

                try {
                  const metadata = await queryClient.fetchQuery(getMplCoreJsonPreviewQueryOptions({ uri: trimmedUri }))
                  const metadataName = typeof metadata.name === 'string' ? metadata.name.trim() : ''

                  if (!metadataName) {
                    return
                  }

                  setDraft((current) =>
                    current.uri.trim() === trimmedUri && !assetNameEditedRef.current
                      ? { ...current, name: metadataName }
                      : current,
                  )
                } catch {
                  // The metadata preview card surfaces fetch errors for the active URI.
                }
              }}
              owner={draft.owner}
              uri={draft.uri}
            />
          </CardContent>
        </Card>

        <MplCoreFeatureCreateMetadataPreview title="Asset metadata preview" uri={draft.uri} />

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Mint-Time Asset Plugins</CardTitle>
            <CardDescription>
              Configure the plugins and external adapters that should be present on the asset at creation time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MplCoreUiPluginConfigurator
              errors={errors}
              onChange={(assetPlugins) => setDraft((current) => ({ ...current, assetPlugins }))}
              plugins={draft.assetPlugins}
              type="asset"
            />
          </CardContent>
        </Card>

        <MplCoreFeatureCreateCollectionSection
          collection={draft.collection}
          errors={errors}
          onChange={(collection) => setDraft((current) => ({ ...current, collection }))}
        />

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Submit</CardTitle>
            <CardDescription>
              The connected wallet pays for the new accounts and becomes the default update authority.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lastSubmission ? (
              <Alert>
                <CheckCircle2Icon className="size-4" />
                <AlertTitle>Most recent submission</AlertTitle>
                <AlertDescription className="space-y-2">
                  <div>Asset address: {lastSubmission.assetAddress}</div>
                  {lastSubmission.collectionAddress ? (
                    <div>Collection address: {lastSubmission.collectionAddress}</div>
                  ) : null}
                  <SolanaUiExplorerLink
                    className="inline-flex items-center gap-1 underline underline-offset-4"
                    label="Open transaction in Solana Explorer"
                    path={`/tx/${lastSubmission.signature}`}
                  />
                </AlertDescription>
              </Alert>
            ) : null}
            <MplCoreUiCreateSubmit isLoading={isLoading} onSubmit={() => void submitCreate()} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
