import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/core/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import {
  isValidUrl,
  type MplCoreCreateDraft,
  type MplCoreCreateFieldErrors,
} from '@/mpl-core/data-access/mpl-core-create-draft'
import { getMplCoreJsonPreviewQueryOptions } from '@/mpl-core/data-access/use-mpl-core-json-preview-query'
import { MplCoreFeatureCreateMetadataPreview } from '@/mpl-core/feature/mpl-core-feature-create-metadata-preview'
import { MplCoreUiCreateCollectionMode } from '@/mpl-core/ui/mpl-core-ui-create-collection-mode'
import { MplCoreUiCreateExistingCollectionFields } from '@/mpl-core/ui/mpl-core-ui-create-existing-collection-fields'
import { MplCoreUiCreateNewCollectionFields } from '@/mpl-core/ui/mpl-core-ui-create-new-collection-fields'
import { MplCoreUiPluginConfigurator } from '@/mpl-core/ui/mpl-core-ui-plugin-configurator'

export function MplCoreFeatureCreateCollectionSection({
  collection,
  errors,
  onChange,
}: {
  collection: MplCoreCreateDraft['collection']
  errors: MplCoreCreateFieldErrors
  onChange(collection: MplCoreCreateDraft['collection']): void
}) {
  const queryClient = useQueryClient()
  const collectionNameEditedRef = useRef(false)
  const collectionRef = useRef(collection)

  useEffect(() => {
    collectionRef.current = collection
  }, [collection])

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Collection</CardTitle>
        <CardDescription>
          Create the asset without a collection, attach it to an existing collection, or create both in one transaction.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <MplCoreUiCreateCollectionMode
          mode={collection.mode}
          onModeChange={(mode) => {
            collectionNameEditedRef.current = false
            const nextCollection = { ...collectionRef.current, mode }
            collectionRef.current = nextCollection
            onChange(nextCollection)
          }}
        />

        {collection.mode === 'None' ? (
          <Alert>
            <AlertTitle>No collection selected</AlertTitle>
            <AlertDescription>The asset will be created as a standalone Core asset.</AlertDescription>
          </Alert>
        ) : null}

        {collection.mode === 'Existing' ? (
          <MplCoreUiCreateExistingCollectionFields
            address={collection.address}
            error={errors['collection.address']}
            onAddressChange={(address) => onChange({ ...collection, address })}
          />
        ) : null}

        {collection.mode === 'New' ? (
          <>
            <MplCoreUiCreateNewCollectionFields
              errors={errors}
              name={collection.name}
              onNameChange={(name) => {
                collectionNameEditedRef.current = true
                const nextCollection = { ...collectionRef.current, name }
                collectionRef.current = nextCollection
                onChange(nextCollection)
              }}
              onUriChange={async (uri) => {
                const trimmedUri = uri.trim()
                collectionNameEditedRef.current = false
                const nextCollection = { ...collectionRef.current, uri }
                collectionRef.current = nextCollection
                onChange(nextCollection)

                if (!isValidUrl(trimmedUri)) {
                  return
                }

                try {
                  const metadata = await queryClient.fetchQuery(getMplCoreJsonPreviewQueryOptions({ uri: trimmedUri }))
                  const metadataName = typeof metadata.name === 'string' ? metadata.name.trim() : ''

                  if (!metadataName) {
                    return
                  }

                  const currentCollection = collectionRef.current
                  if (
                    currentCollection.mode !== 'New' ||
                    currentCollection.uri.trim() !== trimmedUri ||
                    collectionNameEditedRef.current
                  ) {
                    return
                  }

                  const updatedCollection = { ...currentCollection, name: metadataName }
                  collectionRef.current = updatedCollection
                  onChange(updatedCollection)
                } catch {
                  // The metadata preview card surfaces fetch errors for the active URI.
                }
              }}
              uri={collection.uri}
            />
            <MplCoreFeatureCreateMetadataPreview title="Collection metadata preview" uri={collection.uri} />
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle>Mint-Time Collection Plugins</CardTitle>
                <CardDescription>
                  Configure collection-wide plugins that should exist before the asset is created into it.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MplCoreUiPluginConfigurator
                  errors={errors}
                  onChange={(plugins) => onChange({ ...collection, plugins })}
                  plugins={collection.plugins}
                  type="collection"
                />
              </CardContent>
            </Card>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
