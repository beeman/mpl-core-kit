import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/core/ui/field'
import { Input } from '@/core/ui/input'

export function MplCoreUiCreateNewCollectionFields({
  errors,
  name,
  onNameChange,
  onUriChange,
  uri,
}: {
  errors: Record<string, string>
  name: string
  onNameChange(value: string): void
  onUriChange(value: string): void
  uri: string
}) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="mpl-core-collection-uri">Collection metadata URI</FieldLabel>
        <FieldContent>
          <Input
            aria-invalid={Boolean(errors['collection.uri'])}
            id="mpl-core-collection-uri"
            onChange={(event) => onUriChange(event.currentTarget.value)}
            placeholder="https://example.com/collection.json"
            value={uri}
          />
          <FieldDescription>
            Use a separate collection JSON if you want different metadata from the asset.
          </FieldDescription>
          <FieldError>{errors['collection.uri']}</FieldError>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="mpl-core-collection-name">Collection name</FieldLabel>
        <FieldContent>
          <Input
            aria-invalid={Boolean(errors['collection.name'])}
            id="mpl-core-collection-name"
            onChange={(event) => onNameChange(event.currentTarget.value)}
            placeholder="Auto-filled from metadata"
            value={name}
          />
          <FieldDescription>
            Filled from the metadata JSON name when available, but you can still override it.
          </FieldDescription>
          <FieldError>{errors['collection.name']}</FieldError>
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
