import { ChevronDownIcon, PlusIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@/core/ui/button'
import { ButtonGroup } from '@/core/ui/button-group'
import { Checkbox } from '@/core/ui/checkbox'
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/core/ui/field'
import { Input } from '@/core/ui/input'
import { Textarea } from '@/core/ui/textarea'
import { cn } from '@/core/util/utils'
import {
  createMplCoreAttributeDraft,
  createMplCoreCreatorDraft,
  createMplCoreOracleDraft,
  createMplCoreSeedDraft,
  type MplCoreCreateFieldErrors,
  type MplCoreExtraAccountDraft,
  type MplCoreOracleDraft,
  type MplCorePluginsDraft,
  type MplCoreSeedDraft,
  type MplCoreValidationOffsetType,
} from '@/mpl-core/data-access/mpl-core-create-draft'

const extraAccountTypes: Array<{ label: string; value: MplCoreExtraAccountDraft['type'] }> = [
  { label: 'None', value: 'None' },
  { label: 'Address', value: 'Address' },
  { label: 'Program', value: 'PreconfiguredProgram' },
  { label: 'Collection', value: 'PreconfiguredCollection' },
  { label: 'Owner', value: 'PreconfiguredOwner' },
  { label: 'Recipient', value: 'PreconfiguredRecipient' },
  { label: 'Asset', value: 'PreconfiguredAsset' },
  { label: 'Custom PDA', value: 'CustomPda' },
]

const lifecycleOptions = ['Burn', 'Create', 'Transfer', 'Update'] as const
const offsetOptions: MplCoreValidationOffsetType[] = ['Anchor', 'Custom', 'NoOffset']
const ruleSetOptions = ['None', 'Allow list', 'Deny list'] as const
const seedTypeOptions: MplCoreSeedDraft['type'][] = ['Asset', 'Collection', 'Owner', 'Recipient', 'Address', 'Bytes']

export function MplCoreUiPluginConfigurator({
  errors,
  onChange,
  plugins,
  type,
}: {
  errors: MplCoreCreateFieldErrors
  onChange(plugins: MplCorePluginsDraft): void
  plugins: MplCorePluginsDraft
  type: 'asset' | 'collection'
}) {
  const errorPrefix = type === 'asset' ? 'assetPlugins' : 'collection.plugins'

  return (
    <div className="space-y-4">
      <PluginSection
        description={`Add royalty enforcement to the ${type}.`}
        enabled={plugins.royalties.enabled}
        label="Royalties"
        onEnabledChange={(enabled) => onChange({ ...plugins, royalties: { ...plugins.royalties, enabled } })}
      >
        <FieldGroup>
          <Field>
            <FieldLabel>Basis points</FieldLabel>
            <FieldContent>
              <Input
                aria-invalid={Boolean(errors[`${errorPrefix}.royalties.basisPoints`])}
                onChange={(event) =>
                  onChange({
                    ...plugins,
                    royalties: { ...plugins.royalties, basisPoints: event.currentTarget.value },
                  })
                }
                type="number"
                value={plugins.royalties.basisPoints}
              />
              <FieldDescription>500 basis points represents 5% royalties.</FieldDescription>
              <FieldError>{errors[`${errorPrefix}.royalties.basisPoints`]}</FieldError>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Creators</FieldLabel>
            <FieldContent className="gap-3">
              {plugins.royalties.creators.map((creator, index) => (
                <div
                  className="grid gap-2 rounded-md border border-border/60 p-3 sm:grid-cols-[minmax(0,1fr)_8rem_auto]"
                  key={`${errorPrefix}.creator.${index}`}
                >
                  <Input
                    aria-invalid={Boolean(errors[`${errorPrefix}.royalties.creators.${index}.address`])}
                    onChange={(event) =>
                      onChange({
                        ...plugins,
                        royalties: {
                          ...plugins.royalties,
                          creators: plugins.royalties.creators.map((item, creatorIndex) =>
                            creatorIndex === index ? { ...item, address: event.currentTarget.value } : item,
                          ),
                        },
                      })
                    }
                    placeholder="Creator public key"
                    value={creator.address}
                  />
                  <Input
                    aria-invalid={Boolean(errors[`${errorPrefix}.royalties.creators.${index}.percentage`])}
                    onChange={(event) =>
                      onChange({
                        ...plugins,
                        royalties: {
                          ...plugins.royalties,
                          creators: plugins.royalties.creators.map((item, creatorIndex) =>
                            creatorIndex === index ? { ...item, percentage: event.currentTarget.value } : item,
                          ),
                        },
                      })
                    }
                    placeholder="%"
                    type="number"
                    value={creator.percentage}
                  />
                  <Button
                    disabled={plugins.royalties.creators.length === 1}
                    onClick={() =>
                      onChange({
                        ...plugins,
                        royalties: {
                          ...plugins.royalties,
                          creators: plugins.royalties.creators.filter((_, creatorIndex) => creatorIndex !== index),
                        },
                      })
                    }
                    size="icon-sm"
                    type="button"
                    variant="outline"
                  >
                    <Trash2Icon />
                  </Button>
                  <div className="sm:col-span-3">
                    <FieldError>{errors[`${errorPrefix}.royalties.creators.${index}.address`]}</FieldError>
                    <FieldError>{errors[`${errorPrefix}.royalties.creators.${index}.percentage`]}</FieldError>
                  </div>
                </div>
              ))}
              <FieldError>{errors[`${errorPrefix}.royalties.total`]}</FieldError>
              <Button
                onClick={() =>
                  onChange({
                    ...plugins,
                    royalties: {
                      ...plugins.royalties,
                      creators: [...plugins.royalties.creators, { ...createMplCoreCreatorDraft(), percentage: '0' }],
                    },
                  })
                }
                type="button"
                variant="outline"
              >
                <PlusIcon />
                Add creator
              </Button>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Rule set</FieldLabel>
            <FieldContent className="gap-3">
              <ButtonGroup>
                {ruleSetOptions.map((ruleSet) => (
                  <Button
                    key={ruleSet}
                    onClick={() =>
                      onChange({
                        ...plugins,
                        royalties: { ...plugins.royalties, ruleSet },
                      })
                    }
                    type="button"
                    variant={plugins.royalties.ruleSet === ruleSet ? 'default' : 'outline'}
                  >
                    {ruleSet}
                  </Button>
                ))}
              </ButtonGroup>
              {plugins.royalties.ruleSet !== 'None' ? (
                <>
                  <Textarea
                    aria-invalid={Boolean(errors[`${errorPrefix}.royalties.programs`])}
                    onChange={(event) =>
                      onChange({
                        ...plugins,
                        royalties: { ...plugins.royalties, programs: event.currentTarget.value },
                      })
                    }
                    placeholder="One program address per line"
                    value={plugins.royalties.programs}
                  />
                  <FieldError>{errors[`${errorPrefix}.royalties.programs`]}</FieldError>
                </>
              ) : null}
            </FieldContent>
          </Field>
        </FieldGroup>
      </PluginSection>

      <PluginSection
        description={`Make the ${type} non-transferable by minting it in a permanently frozen state without a delegate.`}
        enabled={plugins.soulbound.enabled}
        label="Soulbound"
        onEnabledChange={(enabled) => onChange({ ...plugins, soulbound: { enabled } })}
      >
        <div className="text-xs/relaxed text-muted-foreground">
          Soulbound uses the permanent freeze delegate plugin with no authority and starts the {type} frozen.
        </div>
        <FieldError>{errors[`${errorPrefix}.soulbound.enabled`]}</FieldError>
      </PluginSection>

      <PluginSection
        description={`Store arbitrary key-value metadata directly on the ${type}.`}
        enabled={plugins.attributes.enabled}
        label="Attributes"
        onEnabledChange={(enabled) => onChange({ ...plugins, attributes: { ...plugins.attributes, enabled } })}
      >
        <Field>
          <FieldLabel>Attribute list</FieldLabel>
          <FieldContent className="gap-3">
            {plugins.attributes.items.map((attribute, index) => (
              <div
                className="grid gap-2 rounded-md border border-border/60 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                key={`${errorPrefix}.attribute.${index}`}
              >
                <Input
                  aria-invalid={Boolean(errors[`${errorPrefix}.attributes.items.${index}.key`])}
                  onChange={(event) =>
                    onChange({
                      ...plugins,
                      attributes: {
                        ...plugins.attributes,
                        items: plugins.attributes.items.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, key: event.currentTarget.value } : item,
                        ),
                      },
                    })
                  }
                  placeholder="key"
                  value={attribute.key}
                />
                <Input
                  aria-invalid={Boolean(errors[`${errorPrefix}.attributes.items.${index}.value`])}
                  onChange={(event) =>
                    onChange({
                      ...plugins,
                      attributes: {
                        ...plugins.attributes,
                        items: plugins.attributes.items.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, value: event.currentTarget.value } : item,
                        ),
                      },
                    })
                  }
                  placeholder="value"
                  value={attribute.value}
                />
                <Button
                  disabled={plugins.attributes.items.length === 1}
                  onClick={() =>
                    onChange({
                      ...plugins,
                      attributes: {
                        ...plugins.attributes,
                        items: plugins.attributes.items.filter((_, itemIndex) => itemIndex !== index),
                      },
                    })
                  }
                  size="icon-sm"
                  type="button"
                  variant="outline"
                >
                  <Trash2Icon />
                </Button>
                <div className="sm:col-span-3">
                  <FieldError>{errors[`${errorPrefix}.attributes.items.${index}.key`]}</FieldError>
                  <FieldError>{errors[`${errorPrefix}.attributes.items.${index}.value`]}</FieldError>
                </div>
              </div>
            ))}
            <Button
              onClick={() =>
                onChange({
                  ...plugins,
                  attributes: {
                    ...plugins.attributes,
                    items: [...plugins.attributes.items, createMplCoreAttributeDraft()],
                  },
                })
              }
              type="button"
              variant="outline"
            >
              <PlusIcon />
              Add attribute
            </Button>
          </FieldContent>
        </Field>
      </PluginSection>

      <PluginSection
        description={`Assign an update delegate that can mutate the ${type} after creation.`}
        enabled={plugins.update.enabled}
        label="Update delegate"
        onEnabledChange={(enabled) => onChange({ ...plugins, update: { ...plugins.update, enabled } })}
      >
        <Field>
          <FieldLabel>Authority</FieldLabel>
          <FieldContent>
            <Input
              aria-invalid={Boolean(errors[`${errorPrefix}.update.authority`])}
              onChange={(event) =>
                onChange({ ...plugins, update: { ...plugins.update, authority: event.currentTarget.value } })
              }
              placeholder="Delegate public key"
              value={plugins.update.authority}
            />
            <FieldError>{errors[`${errorPrefix}.update.authority`]}</FieldError>
          </FieldContent>
        </Field>
      </PluginSection>

      <PluginSection
        description={`Set a permanent freeze authority on the ${type}.`}
        enabled={plugins.permanentFreeze.enabled}
        label="Permanent freeze delegate"
        onEnabledChange={(enabled) =>
          onChange({
            ...plugins,
            permanentFreeze: { ...plugins.permanentFreeze, enabled },
          })
        }
      >
        <FieldGroup>
          <Field>
            <FieldLabel>Authority</FieldLabel>
            <FieldContent>
              <Input
                aria-invalid={Boolean(errors[`${errorPrefix}.permanentFreeze.authority`])}
                onChange={(event) =>
                  onChange({
                    ...plugins,
                    permanentFreeze: { ...plugins.permanentFreeze, authority: event.currentTarget.value },
                  })
                }
                placeholder="Freeze authority public key"
                value={plugins.permanentFreeze.authority}
              />
              <FieldError>{errors[`${errorPrefix}.permanentFreeze.authority`]}</FieldError>
            </FieldContent>
          </Field>
          <ToggleRow
            checked={plugins.permanentFreeze.frozen}
            label={`Start the ${type} frozen`}
            onCheckedChange={(frozen) =>
              onChange({
                ...plugins,
                permanentFreeze: { ...plugins.permanentFreeze, frozen },
              })
            }
          />
          <FieldError>{errors[`${errorPrefix}.permanentFreeze.enabled`]}</FieldError>
        </FieldGroup>
      </PluginSection>

      <PluginSection
        description={`Set a permanent transfer authority on the ${type}.`}
        enabled={plugins.permanentTransfer.enabled}
        label="Permanent transfer delegate"
        onEnabledChange={(enabled) =>
          onChange({ ...plugins, permanentTransfer: { ...plugins.permanentTransfer, enabled } })
        }
      >
        <Field>
          <FieldLabel>Authority</FieldLabel>
          <FieldContent>
            <Input
              aria-invalid={Boolean(errors[`${errorPrefix}.permanentTransfer.authority`])}
              onChange={(event) =>
                onChange({
                  ...plugins,
                  permanentTransfer: { ...plugins.permanentTransfer, authority: event.currentTarget.value },
                })
              }
              placeholder="Transfer authority public key"
              value={plugins.permanentTransfer.authority}
            />
            <FieldError>{errors[`${errorPrefix}.permanentTransfer.authority`]}</FieldError>
          </FieldContent>
        </Field>
      </PluginSection>

      <PluginSection
        description={`Set a permanent burn authority on the ${type}.`}
        enabled={plugins.permanentBurn.enabled}
        label="Permanent burn delegate"
        onEnabledChange={(enabled) => onChange({ ...plugins, permanentBurn: { ...plugins.permanentBurn, enabled } })}
      >
        <Field>
          <FieldLabel>Authority</FieldLabel>
          <FieldContent>
            <Input
              aria-invalid={Boolean(errors[`${errorPrefix}.permanentBurn.authority`])}
              onChange={(event) =>
                onChange({
                  ...plugins,
                  permanentBurn: { ...plugins.permanentBurn, authority: event.currentTarget.value },
                })
              }
              placeholder="Burn authority public key"
              value={plugins.permanentBurn.authority}
            />
            <FieldError>{errors[`${errorPrefix}.permanentBurn.authority`]}</FieldError>
          </FieldContent>
        </Field>
      </PluginSection>

      <PluginSection
        description={`Register oracle adapters that can reject lifecycle events on the ${type}.`}
        enabled={plugins.oracle.enabled}
        label="Oracle"
        onEnabledChange={(enabled) => onChange({ ...plugins, oracle: { ...plugins.oracle, enabled } })}
      >
        <div className="space-y-4">
          {plugins.oracle.items.map((oracle, index) => (
            <div className="space-y-3" key={`${errorPrefix}.oracle.${index}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium">Oracle {index + 1}</div>
                <Button
                  disabled={plugins.oracle.items.length === 1}
                  onClick={() =>
                    onChange({
                      ...plugins,
                      oracle: {
                        ...plugins.oracle,
                        items: plugins.oracle.items.filter((_, itemIndex) => itemIndex !== index),
                      },
                    })
                  }
                  size="icon-sm"
                  type="button"
                  variant="outline"
                >
                  <Trash2Icon />
                </Button>
              </div>
              <OracleEditor
                errors={errors}
                onChange={(nextOracle) =>
                  onChange({
                    ...plugins,
                    oracle: {
                      ...plugins.oracle,
                      items: plugins.oracle.items.map((item, itemIndex) => (itemIndex === index ? nextOracle : item)),
                    },
                  })
                }
                oracle={oracle}
                path={`${errorPrefix}.oracle.items.${index}`}
              />
            </div>
          ))}
          <FieldError>{errors[`${errorPrefix}.oracle.items`]}</FieldError>
          <Button
            onClick={() =>
              onChange({
                ...plugins,
                oracle: {
                  ...plugins.oracle,
                  items: [...plugins.oracle.items, createMplCoreOracleDraft()],
                },
              })
            }
            type="button"
            variant="outline"
          >
            <PlusIcon />
            Add oracle
          </Button>
        </div>
      </PluginSection>

      {type === 'asset' ? (
        <PluginSection
          description="Mark the asset as an edition with its edition number."
          enabled={plugins.edition.enabled}
          label="Edition"
          onEnabledChange={(enabled) => onChange({ ...plugins, edition: { ...plugins.edition, enabled } })}
        >
          <Field>
            <FieldLabel>Edition number</FieldLabel>
            <FieldContent>
              <Input
                aria-invalid={Boolean(errors[`${errorPrefix}.edition.number`])}
                onChange={(event) =>
                  onChange({ ...plugins, edition: { ...plugins.edition, number: event.currentTarget.value } })
                }
                type="number"
                value={plugins.edition.number}
              />
              <FieldError>{errors[`${errorPrefix}.edition.number`]}</FieldError>
            </FieldContent>
          </Field>
        </PluginSection>
      ) : null}

      {type === 'collection' ? (
        <PluginSection
          description="Configure collection-level master edition metadata."
          enabled={plugins.masterEdition.enabled}
          label="Master edition"
          onEnabledChange={(enabled) => onChange({ ...plugins, masterEdition: { ...plugins.masterEdition, enabled } })}
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Name override</FieldLabel>
              <FieldContent>
                <Input
                  onChange={(event) =>
                    onChange({
                      ...plugins,
                      masterEdition: { ...plugins.masterEdition, name: event.currentTarget.value },
                    })
                  }
                  placeholder="Optional master edition name"
                  value={plugins.masterEdition.name}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>URI override</FieldLabel>
              <FieldContent>
                <Input
                  aria-invalid={Boolean(errors[`${errorPrefix}.masterEdition.uri`])}
                  onChange={(event) =>
                    onChange({
                      ...plugins,
                      masterEdition: { ...plugins.masterEdition, uri: event.currentTarget.value },
                    })
                  }
                  placeholder="Optional master edition metadata URI"
                  value={plugins.masterEdition.uri}
                />
                <FieldError>{errors[`${errorPrefix}.masterEdition.uri`]}</FieldError>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Max supply</FieldLabel>
              <FieldContent>
                <Input
                  aria-invalid={Boolean(errors[`${errorPrefix}.masterEdition.maxSupply`])}
                  onChange={(event) =>
                    onChange({
                      ...plugins,
                      masterEdition: { ...plugins.masterEdition, maxSupply: event.currentTarget.value },
                    })
                  }
                  placeholder="Leave empty for open edition"
                  type="number"
                  value={plugins.masterEdition.maxSupply}
                />
                <FieldError>{errors[`${errorPrefix}.masterEdition.maxSupply`]}</FieldError>
              </FieldContent>
            </Field>
          </FieldGroup>
        </PluginSection>
      ) : null}
    </div>
  )
}

function ExtraAccountEditor({
  account,
  errors,
  onChange,
  path,
}: {
  account: MplCoreExtraAccountDraft
  errors: MplCoreCreateFieldErrors
  onChange(account: MplCoreExtraAccountDraft): void
  path: string
}) {
  return (
    <FieldSet className="rounded-lg border border-border/60 p-4">
      <Field>
        <FieldLabel>Account derivation</FieldLabel>
        <FieldContent className="gap-3">
          <ButtonGroup className="flex-wrap">
            {extraAccountTypes.map((option) => (
              <Button
                key={option.value}
                onClick={() => onChange({ ...account, type: option.value })}
                type="button"
                variant={account.type === option.value ? 'default' : 'outline'}
              >
                {option.label}
              </Button>
            ))}
          </ButtonGroup>
        </FieldContent>
      </Field>

      {account.type !== 'None' ? (
        <div className="grid gap-2 sm:grid-cols-2">
          <ToggleRow
            checked={account.isSigner}
            label="Mark as signer"
            onCheckedChange={(isSigner) => onChange({ ...account, isSigner })}
          />
          <ToggleRow
            checked={account.isWritable}
            label="Mark as writable"
            onCheckedChange={(isWritable) => onChange({ ...account, isWritable })}
          />
        </div>
      ) : null}

      {account.type === 'Address' ? (
        <Field>
          <FieldLabel>Address</FieldLabel>
          <FieldContent>
            <Input
              aria-invalid={Boolean(errors[`${path}.address`])}
              onChange={(event) => onChange({ ...account, address: event.currentTarget.value })}
              placeholder="Static account public key"
              value={account.address}
            />
            <FieldError>{errors[`${path}.address`]}</FieldError>
          </FieldContent>
        </Field>
      ) : null}

      {account.type === 'CustomPda' ? (
        <FieldGroup>
          <Field>
            <FieldLabel>Custom program ID</FieldLabel>
            <FieldContent>
              <Input
                aria-invalid={Boolean(errors[`${path}.customProgramId`])}
                onChange={(event) => onChange({ ...account, customProgramId: event.currentTarget.value })}
                placeholder="Optional PDA program ID"
                value={account.customProgramId}
              />
              <FieldDescription>Leave this empty to derive the PDA with the MPL Core program ID.</FieldDescription>
              <FieldError>{errors[`${path}.customProgramId`]}</FieldError>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Seeds</FieldLabel>
            <FieldContent className="gap-3">
              {account.seeds.map((seed, index) => (
                <div className="space-y-2" key={`${path}.seed.${index}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs/relaxed font-medium">Seed {index + 1}</div>
                    <Button
                      disabled={account.seeds.length === 1}
                      onClick={() =>
                        onChange({
                          ...account,
                          seeds: account.seeds.filter((_, seedIndex) => seedIndex !== index),
                        })
                      }
                      size="icon-sm"
                      type="button"
                      variant="outline"
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                  <SeedEditor
                    errors={errors}
                    onChange={(nextSeed) =>
                      onChange({
                        ...account,
                        seeds: account.seeds.map((seedItem, seedIndex) => (seedIndex === index ? nextSeed : seedItem)),
                      })
                    }
                    path={`${path}.seeds.${index}`}
                    seed={seed}
                  />
                </div>
              ))}
              <FieldError>{errors[`${path}.seeds`]}</FieldError>
              <Button
                onClick={() => onChange({ ...account, seeds: [...account.seeds, createMplCoreSeedDraft()] })}
                type="button"
                variant="outline"
              >
                <PlusIcon />
                Add seed
              </Button>
            </FieldContent>
          </Field>
        </FieldGroup>
      ) : null}
    </FieldSet>
  )
}

function OracleEditor({
  errors,
  onChange,
  oracle,
  path,
}: {
  errors: MplCoreCreateFieldErrors
  onChange(oracle: MplCoreOracleDraft): void
  oracle: MplCoreOracleDraft
  path: string
}) {
  return (
    <div className="space-y-4 rounded-lg border border-border/60 p-4">
      <Field>
        <FieldLabel>Base address</FieldLabel>
        <FieldContent>
          <Input
            aria-invalid={Boolean(errors[`${path}.baseAddress`])}
            onChange={(event) => onChange({ ...oracle, baseAddress: event.currentTarget.value })}
            placeholder="Oracle base address"
            value={oracle.baseAddress}
          />
          <FieldDescription>The oracle program or account that owns the validation data.</FieldDescription>
          <FieldError>{errors[`${path}.baseAddress`]}</FieldError>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Registered lifecycles</FieldLabel>
        <FieldContent className="gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {lifecycleOptions.map((lifecycle) => (
              <ToggleRow
                checked={oracle.lifecycles.includes(lifecycle)}
                key={lifecycle}
                label={lifecycle}
                onCheckedChange={(checked) =>
                  onChange({
                    ...oracle,
                    lifecycles: checked
                      ? [...oracle.lifecycles, lifecycle].sort()
                      : oracle.lifecycles.filter((item) => item !== lifecycle),
                  })
                }
              />
            ))}
          </div>
          <FieldError>{errors[`${path}.lifecycles`]}</FieldError>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Results offset</FieldLabel>
        <FieldContent className="gap-3">
          <ButtonGroup>
            {offsetOptions.map((option) => (
              <Button
                key={option}
                onClick={() =>
                  onChange({
                    ...oracle,
                    resultsOffset: {
                      offset: option === 'Custom' ? oracle.resultsOffset.offset : '',
                      type: option,
                    },
                  })
                }
                type="button"
                variant={oracle.resultsOffset.type === option ? 'default' : 'outline'}
              >
                {option}
              </Button>
            ))}
          </ButtonGroup>
          {oracle.resultsOffset.type === 'Custom' ? (
            <>
              <Input
                aria-invalid={Boolean(errors[`${path}.resultsOffset.offset`])}
                onChange={(event) =>
                  onChange({
                    ...oracle,
                    resultsOffset: { ...oracle.resultsOffset, offset: event.currentTarget.value },
                  })
                }
                placeholder="Custom byte offset"
                type="number"
                value={oracle.resultsOffset.offset}
              />
              <FieldError>{errors[`${path}.resultsOffset.offset`]}</FieldError>
            </>
          ) : null}
        </FieldContent>
      </Field>

      <ExtraAccountEditor
        account={oracle.baseAddressConfig}
        errors={errors}
        onChange={(baseAddressConfig) => onChange({ ...oracle, baseAddressConfig })}
        path={`${path}.baseAddressConfig`}
      />
    </div>
  )
}

function PluginSection({
  children,
  description,
  enabled,
  label,
  onEnabledChange,
}: {
  children: React.ReactNode
  description: string
  enabled: boolean
  label: string
  onEnabledChange(enabled: boolean): void
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/10 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Checkbox checked={enabled} onCheckedChange={(value) => onEnabledChange(Boolean(value))} />
            <div className="text-sm font-medium">{label}</div>
          </div>
          <div className="text-xs/relaxed text-muted-foreground">{description}</div>
        </div>
        <ChevronDownIcon
          className={cn('size-4 text-muted-foreground transition-transform', enabled ? 'rotate-180' : '')}
        />
      </div>
      {enabled ? <div className="mt-4 space-y-4">{children}</div> : null}
    </div>
  )
}

function SeedEditor({
  errors,
  onChange,
  path,
  seed,
}: {
  errors: MplCoreCreateFieldErrors
  onChange(seed: MplCoreSeedDraft): void
  path: string
  seed: MplCoreSeedDraft
}) {
  return (
    <div className="space-y-2 rounded-md border border-border/60 p-3">
      <Field>
        <FieldLabel>Seed type</FieldLabel>
        <FieldContent>
          <ButtonGroup className="flex-wrap">
            {seedTypeOptions.map((seedType) => (
              <Button
                key={seedType}
                onClick={() => onChange({ ...seed, type: seedType, value: seedType === seed.type ? seed.value : '' })}
                type="button"
                variant={seed.type === seedType ? 'default' : 'outline'}
              >
                {seedType}
              </Button>
            ))}
          </ButtonGroup>
        </FieldContent>
      </Field>

      {seed.type === 'Address' || seed.type === 'Bytes' ? (
        <Field>
          <FieldLabel>{seed.type === 'Address' ? 'Public key' : 'Bytes'}</FieldLabel>
          <FieldContent>
            <Input
              aria-invalid={Boolean(errors[`${path}.value`])}
              onChange={(event) => onChange({ ...seed, value: event.currentTarget.value })}
              placeholder={seed.type === 'Address' ? 'Seed public key' : 'Comma separated bytes'}
              value={seed.value}
            />
            <FieldDescription>
              {seed.type === 'Address'
                ? 'Use a wallet or program address as part of the PDA seed list.'
                : 'Provide decimal byte values such as 1, 2, 255.'}
            </FieldDescription>
            <FieldError>{errors[`${path}.value`]}</FieldError>
          </FieldContent>
        </Field>
      ) : null}
    </div>
  )
}

function ToggleRow({
  checked,
  label,
  onCheckedChange,
}: {
  checked: boolean
  label: string
  onCheckedChange(value: boolean): void
}) {
  return (
    <label className="flex items-center gap-2 text-xs/relaxed">
      <Checkbox checked={checked} onCheckedChange={(value) => onCheckedChange(Boolean(value))} />
      <span>{label}</span>
    </label>
  )
}
