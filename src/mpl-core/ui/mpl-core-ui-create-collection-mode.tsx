import { Button } from '@/core/ui/button'
import { ButtonGroup } from '@/core/ui/button-group'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/core/ui/field'
import { type MplCoreCollectionMode } from '@/mpl-core/data-access/mpl-core-create-draft'

const collectionModes: Array<{ description: string; label: string; value: MplCoreCollectionMode }> = [
  {
    description: 'Create the asset without any collection account.',
    label: 'No collection',
    value: 'None',
  },
  {
    description: 'Attach the new asset to a collection that already exists.',
    label: 'Existing collection',
    value: 'Existing',
  },
  {
    description: 'Create the collection first, then create the asset into it.',
    label: 'New collection',
    value: 'New',
  },
]

export function MplCoreUiCreateCollectionMode({
  mode,
  onModeChange,
}: {
  mode: MplCoreCollectionMode
  onModeChange(mode: MplCoreCollectionMode): void
}) {
  const selectedMode = collectionModes.find((option) => option.value === mode)

  return (
    <Field>
      <FieldLabel>Collection mode</FieldLabel>
      <FieldContent className="gap-3">
        <ButtonGroup>
          {collectionModes.map((option) => (
            <Button
              key={option.value}
              onClick={() => onModeChange(option.value)}
              type="button"
              variant={mode === option.value ? 'default' : 'outline'}
            >
              {option.label}
            </Button>
          ))}
        </ButtonGroup>
        <FieldDescription>{selectedMode?.description}</FieldDescription>
      </FieldContent>
    </Field>
  )
}
