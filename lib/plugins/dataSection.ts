import {
  type BaseDataSection,
  type BaseDataSectionInitInfoArgs,
  type BaseDataSectionUpdateInfoArgs,
  type ExternalRegistryRecord,
} from '../generated'
import { type ExternalPluginAdapterKey } from './externalPluginAdapterKey'
import { type ExternalPluginAdapterManifest } from './externalPluginAdapterManifest'
import { type BaseExternalPluginAdapter } from './externalPluginAdapters'
import { parseExternalPluginAdapterData } from './lib'
import { type LinkedDataKey, linkedDataKeyFromBase, linkedDataKeyToBase } from './linkedDataKey'
import { type PluginAuthority, pluginAuthorityFromBase } from './pluginAuthority'

export type DataSection = {
  data?: unknown
  dataAuthority?: PluginAuthority
  parentKey: LinkedDataKey
} & Omit<BaseDataSection, 'dataAuthority' | 'parentKey'>

export type DataSectionInitInfoArgs = {
  parentKey: LinkedDataKey
  type: 'DataSection'
} & Omit<BaseDataSectionInitInfoArgs, 'parentKey'>

export type DataSectionPlugin = {
  type: 'DataSection'
} & BaseExternalPluginAdapter &
  DataSection

export type DataSectionUpdateInfoArgs = {
  key: ExternalPluginAdapterKey
} & BaseDataSectionUpdateInfoArgs

export function dataSectionFromBase(s: BaseDataSection, r: ExternalRegistryRecord, account: Uint8Array): DataSection {
  return {
    ...s,
    data: parseExternalPluginAdapterData(s, r, account),
    dataAuthority:
      s.parentKey.__kind !== 'LinkedLifecycleHook' ? pluginAuthorityFromBase(s.parentKey.fields[0]) : undefined,
    parentKey: linkedDataKeyFromBase(s.parentKey),
  }
}

export function dataSectionInitInfoArgsToBase(d: DataSectionInitInfoArgs): BaseDataSectionInitInfoArgs {
  return {
    parentKey: linkedDataKeyToBase(d.parentKey),
    schema: d.schema,
  }
}

export function dataSectionUpdateInfoArgsToBase(_d: DataSectionUpdateInfoArgs): BaseDataSectionUpdateInfoArgs {
  // You can't update the data section directly
  return {}
}

export const dataSectionManifest: ExternalPluginAdapterManifest<
  DataSection,
  BaseDataSection,
  DataSectionInitInfoArgs,
  BaseDataSectionInitInfoArgs,
  DataSectionUpdateInfoArgs,
  BaseDataSectionUpdateInfoArgs
> = {
  fromBase: dataSectionFromBase,
  initToBase: dataSectionInitInfoArgsToBase,
  type: 'DataSection',
  updateToBase: dataSectionUpdateInfoArgsToBase,
}
