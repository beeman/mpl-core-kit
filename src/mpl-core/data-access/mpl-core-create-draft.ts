import { address } from '@solana/kit'

export interface MplCoreAttributeDraft {
  key: string
  value: string
}
export type MplCoreCollectionMode = 'Existing' | 'New' | 'None'
export interface MplCoreCreateDraft {
  assetPlugins: MplCorePluginsDraft
  collection: {
    address: string
    mode: MplCoreCollectionMode
    name: string
    plugins: MplCorePluginsDraft
    uri: string
  }
  name: string
  owner: string
  uri: string
}
export type MplCoreCreateFieldErrors = Record<string, string>
export interface MplCoreCreatorDraft {
  address: string
  percentage: string
}
export interface MplCoreExtraAccountDraft {
  address: string
  customProgramId: string
  isSigner: boolean
  isWritable: boolean
  seeds: MplCoreSeedDraft[]
  type:
    | 'Address'
    | 'CustomPda'
    | 'None'
    | 'PreconfiguredAsset'
    | 'PreconfiguredCollection'
    | 'PreconfiguredOwner'
    | 'PreconfiguredProgram'
    | 'PreconfiguredRecipient'
}

export interface MplCoreOracleDraft {
  baseAddress: string
  baseAddressConfig: MplCoreExtraAccountDraft
  lifecycles: MplCoreOracleLifecycle[]
  resultsOffset: {
    offset: string
    type: MplCoreValidationOffsetType
  }
}

export type MplCoreOracleLifecycle = 'Burn' | 'Create' | 'Transfer' | 'Update'

export type MplCorePluginRuleSet = 'Allow list' | 'Deny list' | 'None'

export interface MplCorePluginsDraft {
  attributes: {
    enabled: boolean
    items: MplCoreAttributeDraft[]
  }
  edition: {
    enabled: boolean
    number: string
  }
  masterEdition: {
    enabled: boolean
    maxSupply: string
    name: string
    uri: string
  }
  oracle: {
    enabled: boolean
    items: MplCoreOracleDraft[]
  }
  permanentBurn: {
    authority: string
    enabled: boolean
  }
  permanentFreeze: {
    authority: string
    enabled: boolean
    frozen: boolean
  }
  permanentTransfer: {
    authority: string
    enabled: boolean
  }
  royalties: {
    basisPoints: string
    creators: MplCoreCreatorDraft[]
    enabled: boolean
    programs: string
    ruleSet: MplCorePluginRuleSet
  }
  soulbound: {
    enabled: boolean
  }
  update: {
    authority: string
    enabled: boolean
  }
}

export interface MplCoreSeedDraft {
  type: MplCoreSeedType
  value: string
}

export type MplCoreSeedType = 'Address' | 'Asset' | 'Bytes' | 'Collection' | 'Owner' | 'Recipient'

export type MplCoreValidationOffsetType = 'Anchor' | 'Custom' | 'NoOffset'

export function createMplCoreAttributeDraft(): MplCoreAttributeDraft {
  return { key: '', value: '' }
}

export function createMplCoreCreatorDraft(): MplCoreCreatorDraft {
  return { address: '', percentage: '100' }
}

export function createMplCoreExtraAccountDraft(): MplCoreExtraAccountDraft {
  return {
    address: '',
    customProgramId: '',
    isSigner: false,
    isWritable: false,
    seeds: [createMplCoreSeedDraft()],
    type: 'None',
  }
}

export function createMplCoreOracleDraft(): MplCoreOracleDraft {
  return {
    baseAddress: '',
    baseAddressConfig: createMplCoreExtraAccountDraft(),
    lifecycles: ['Transfer'],
    resultsOffset: { offset: '', type: 'Anchor' },
  }
}

export function createMplCorePluginsDraft(): MplCorePluginsDraft {
  return {
    attributes: {
      enabled: false,
      items: [createMplCoreAttributeDraft()],
    },
    edition: {
      enabled: false,
      number: '0',
    },
    masterEdition: {
      enabled: false,
      maxSupply: '',
      name: '',
      uri: '',
    },
    oracle: {
      enabled: false,
      items: [createMplCoreOracleDraft()],
    },
    permanentBurn: {
      authority: '',
      enabled: false,
    },
    permanentFreeze: {
      authority: '',
      enabled: false,
      frozen: false,
    },
    permanentTransfer: {
      authority: '',
      enabled: false,
    },
    royalties: {
      basisPoints: '500',
      creators: [createMplCoreCreatorDraft()],
      enabled: false,
      programs: '',
      ruleSet: 'None',
    },
    soulbound: {
      enabled: false,
    },
    update: {
      authority: '',
      enabled: false,
    },
  }
}

export function createMplCoreSeedDraft(): MplCoreSeedDraft {
  return { type: 'Asset', value: '' }
}

export function getDefaultMplCoreCreateDraft(): MplCoreCreateDraft {
  return {
    assetPlugins: createMplCorePluginsDraft(),
    collection: {
      address: '',
      mode: 'None',
      name: '',
      plugins: createMplCorePluginsDraft(),
      uri: '',
    },
    name: '',
    owner: '',
    uri: '',
  }
}

export function isValidAddress(value: string) {
  if (!value.trim()) {
    return false
  }

  try {
    address(value.trim())
    return true
  } catch {
    return false
  }
}

export function isValidUrl(value: string) {
  if (!value.trim()) {
    return false
  }

  try {
    new URL(value.trim())
    return true
  } catch {
    return false
  }
}

export function normalizeAddressList(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function parseByteList(value: string) {
  const parts = value
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean)

  if (!parts.length) {
    throw new Error('Byte seeds must contain at least one value.')
  }

  return Uint8Array.from(
    parts.map((item) => {
      const parsed = Number(item)
      if (!Number.isInteger(parsed) || parsed < 0 || parsed > 255) {
        throw new Error('Byte seeds must use numbers between 0 and 255.')
      }
      return parsed
    }),
  )
}

export function validateMplCoreCreateDraft(draft: MplCoreCreateDraft): MplCoreCreateFieldErrors {
  const errors: MplCoreCreateFieldErrors = {}

  if (!draft.name.trim()) {
    errors.name = 'Asset name is required.'
  }

  if (!isValidUrl(draft.uri)) {
    errors.uri = 'Enter a valid metadata URL.'
  }

  if (draft.owner.trim() && !isValidAddress(draft.owner)) {
    errors.owner = 'Enter a valid public key.'
  }

  if (draft.collection.mode === 'Existing' && !isValidAddress(draft.collection.address)) {
    errors['collection.address'] = 'Enter a valid collection address.'
  }

  if (draft.collection.mode === 'New') {
    if (!draft.collection.name.trim()) {
      errors['collection.name'] = 'Collection name is required.'
    }
    if (!isValidUrl(draft.collection.uri)) {
      errors['collection.uri'] = 'Enter a valid metadata URL.'
    }
    validatePlugins(errors, 'collection.plugins', draft.collection.plugins, { collection: true })
  }

  validatePlugins(errors, 'assetPlugins', draft.assetPlugins, { collection: false })

  return errors
}

function isValidInteger(value: string, { allowEmpty = false, min }: { allowEmpty?: boolean; min?: number } = {}) {
  if (!value.trim()) {
    return allowEmpty
  }

  const parsed = Number(value)
  if (!Number.isInteger(parsed)) {
    return false
  }

  if (min !== undefined && parsed < min) {
    return false
  }

  return true
}

function validateExtraAccount(account: MplCoreExtraAccountDraft, errors: MplCoreCreateFieldErrors, path: string) {
  if (account.type === 'Address') {
    if (!isValidAddress(account.address)) {
      errors[`${path}.address`] = 'Enter a valid public key.'
    }
    return
  }

  if (account.type !== 'CustomPda') {
    return
  }

  if (account.customProgramId.trim() && !isValidAddress(account.customProgramId)) {
    errors[`${path}.customProgramId`] = 'Enter a valid public key.'
  }

  if (!account.seeds.length) {
    errors[`${path}.seeds`] = 'Add at least one seed.'
    return
  }

  account.seeds.forEach((seed, index) => {
    const seedPath = `${path}.seeds.${index}.value`
    if (seed.type === 'Address' && !isValidAddress(seed.value)) {
      errors[seedPath] = 'Enter a valid public key.'
      return
    }

    if (seed.type === 'Bytes') {
      try {
        parseByteList(seed.value)
      } catch (error) {
        errors[seedPath] = error instanceof Error ? error.message : 'Enter valid byte values.'
      }
    }
  })
}

function validatePlugins(
  errors: MplCoreCreateFieldErrors,
  path: string,
  plugins: MplCorePluginsDraft,
  { collection }: { collection: boolean },
) {
  if (plugins.attributes.enabled) {
    if (!plugins.attributes.items.length) {
      errors[`${path}.attributes.items`] = 'Add at least one attribute.'
    }
    plugins.attributes.items.forEach((item, index) => {
      if (!item.key.trim()) {
        errors[`${path}.attributes.items.${index}.key`] = 'Attribute keys are required.'
      }
      if (!item.value.trim()) {
        errors[`${path}.attributes.items.${index}.value`] = 'Attribute values are required.'
      }
    })
  }

  if (!collection && plugins.edition.enabled && !isValidInteger(plugins.edition.number, { min: 0 })) {
    errors[`${path}.edition.number`] = 'Edition number must be a whole number.'
  }

  if (collection && plugins.masterEdition.enabled) {
    if (plugins.masterEdition.maxSupply.trim() && !isValidInteger(plugins.masterEdition.maxSupply, { min: 0 })) {
      errors[`${path}.masterEdition.maxSupply`] = 'Max supply must be a whole number.'
    }
    if (plugins.masterEdition.uri.trim() && !isValidUrl(plugins.masterEdition.uri)) {
      errors[`${path}.masterEdition.uri`] = 'Enter a valid metadata URL.'
    }
  }

  if (plugins.oracle.enabled) {
    if (!plugins.oracle.items.length) {
      errors[`${path}.oracle.items`] = 'Add at least one oracle.'
    }
    plugins.oracle.items.forEach((oracle, index) => {
      const oraclePath = `${path}.oracle.items.${index}`
      if (!isValidAddress(oracle.baseAddress)) {
        errors[`${oraclePath}.baseAddress`] = 'Enter a valid public key.'
      }
      if (!oracle.lifecycles.length) {
        errors[`${oraclePath}.lifecycles`] = 'Select at least one lifecycle.'
      }
      if (oracle.resultsOffset.type === 'Custom' && !isValidInteger(oracle.resultsOffset.offset, { min: 0 })) {
        errors[`${oraclePath}.resultsOffset.offset`] = 'Offset must be a whole number.'
      }
      validateExtraAccount(oracle.baseAddressConfig, errors, `${oraclePath}.baseAddressConfig`)
    })
  }

  if (plugins.permanentBurn.enabled && !isValidAddress(plugins.permanentBurn.authority)) {
    errors[`${path}.permanentBurn.authority`] = 'Enter a valid public key.'
  }

  if (plugins.permanentFreeze.enabled && !isValidAddress(plugins.permanentFreeze.authority)) {
    errors[`${path}.permanentFreeze.authority`] = 'Enter a valid public key.'
  }

  if (plugins.permanentTransfer.enabled && !isValidAddress(plugins.permanentTransfer.authority)) {
    errors[`${path}.permanentTransfer.authority`] = 'Enter a valid public key.'
  }

  if (plugins.royalties.enabled) {
    if (!isValidInteger(plugins.royalties.basisPoints, { min: 0 })) {
      errors[`${path}.royalties.basisPoints`] = 'Basis points must be a whole number.'
    }

    if (!plugins.royalties.creators.length) {
      errors[`${path}.royalties.creators`] = 'Add at least one creator.'
    }

    let total = 0
    plugins.royalties.creators.forEach((creator, index) => {
      const creatorPath = `${path}.royalties.creators.${index}`
      if (!isValidAddress(creator.address)) {
        errors[`${creatorPath}.address`] = 'Enter a valid public key.'
      }
      if (!isValidInteger(creator.percentage, { min: 0 })) {
        errors[`${creatorPath}.percentage`] = 'Creator share must be a whole number.'
      } else {
        total += Number(creator.percentage)
      }
    })

    if (total !== 100) {
      errors[`${path}.royalties.total`] = 'Creator percentages must add up to 100.'
    }

    if (plugins.royalties.ruleSet !== 'None') {
      const addresses = normalizeAddressList(plugins.royalties.programs)
      if (!addresses.length) {
        errors[`${path}.royalties.programs`] = 'Add at least one program address.'
      }
      addresses.forEach((programAddress, index) => {
        if (!isValidAddress(programAddress)) {
          errors[`${path}.royalties.programs.${index}`] = 'Enter valid program addresses.'
        }
      })
    }
  }

  if (plugins.soulbound.enabled && plugins.permanentFreeze.enabled) {
    errors[`${path}.permanentFreeze.enabled`] = 'Permanent freeze and soulbound cannot both be enabled.'
    errors[`${path}.soulbound.enabled`] = 'Permanent freeze and soulbound cannot both be enabled.'
  }

  if (plugins.update.enabled && !isValidAddress(plugins.update.authority)) {
    errors[`${path}.update.authority`] = 'Enter a valid public key.'
  }
}
