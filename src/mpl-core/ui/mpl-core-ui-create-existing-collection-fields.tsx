import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/core/ui/field'
import { Input } from '@/core/ui/input'

export function MplCoreUiCreateExistingCollectionFields({
  address,
  error,
  onAddressChange,
}: {
  address: string
  error?: string
  onAddressChange(value: string): void
}) {
  return (
    <Field>
      <FieldLabel htmlFor="mpl-core-existing-collection">Collection address</FieldLabel>
      <FieldContent>
        <Input
          aria-invalid={Boolean(error)}
          id="mpl-core-existing-collection"
          onChange={(event) => onAddressChange(event.currentTarget.value)}
          placeholder="Existing collection public key"
          value={address}
        />
        <FieldDescription>
          The create flow checks that this collection account exists before it submits the transaction.
        </FieldDescription>
        <FieldError>{error}</FieldError>
      </FieldContent>
    </Field>
  )
}
