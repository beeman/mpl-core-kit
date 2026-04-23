import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/core/ui/field'
import { Input } from '@/core/ui/input'

export function MplCoreUiCreateAssetFields({
  errors,
  name,
  onNameChange,
  onOwnerChange,
  onUriChange,
  owner,
  uri,
}: {
  errors: Record<string, string>
  name: string
  onNameChange(value: string): void
  onOwnerChange(value: string): void
  onUriChange(value: string): void
  owner: string
  uri: string
}) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="mpl-core-asset-uri">Asset metadata URI</FieldLabel>
        <FieldContent>
          <Input
            aria-invalid={Boolean(errors.uri)}
            id="mpl-core-asset-uri"
            onChange={(event) => onUriChange(event.currentTarget.value)}
            placeholder="https://example.com/asset.json"
            value={uri}
          />
          <FieldDescription>Provide a JSON document that follows the Metaplex metadata shape.</FieldDescription>
          <FieldError>{errors.uri}</FieldError>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="mpl-core-asset-name">Asset name</FieldLabel>
        <FieldContent>
          <Input
            aria-invalid={Boolean(errors.name)}
            id="mpl-core-asset-name"
            onChange={(event) => onNameChange(event.currentTarget.value)}
            placeholder="Auto-filled from metadata"
            value={name}
          />
          <FieldDescription>
            Filled from the metadata JSON name when available, but you can still override it.
          </FieldDescription>
          <FieldError>{errors.name}</FieldError>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="mpl-core-asset-owner">Owner</FieldLabel>
        <FieldContent>
          <Input
            aria-invalid={Boolean(errors.owner)}
            id="mpl-core-asset-owner"
            onChange={(event) => onOwnerChange(event.currentTarget.value)}
            placeholder="Optional wallet address"
            value={owner}
          />
          <FieldDescription>Leave this empty to mint the asset to the connected wallet.</FieldDescription>
          <FieldError>{errors.owner}</FieldError>
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
