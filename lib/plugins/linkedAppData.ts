import {
  type BaseLinkedAppData,
  type BaseLinkedAppDataInitInfoArgs,
  type BaseLinkedAppDataUpdateInfoArgs,
  type ExternalPluginAdapterSchema,
  type ExternalRegistryRecord,
} from '../generated'
import { type ExternalPluginAdapterKey } from './externalPluginAdapterKey'
import { type ExternalPluginAdapterManifest } from './externalPluginAdapterManifest'
import { type BaseExternalPluginAdapter } from './externalPluginAdapters'
import { type LifecycleChecks } from './lifecycleChecks'
import { type PluginAuthority, pluginAuthorityFromBase, pluginAuthorityToBase } from './pluginAuthority'

export type LinkedAppData = {
  data?: unknown
  dataAuthority: PluginAuthority
} & Omit<BaseLinkedAppData, 'dataAuthority'>

export type LinkedAppDataInitInfoArgs = {
  dataAuthority: PluginAuthority
  initPluginAuthority?: PluginAuthority
  lifecycleChecks?: LifecycleChecks
  schema?: ExternalPluginAdapterSchema
  type: 'LinkedAppData'
} & Omit<BaseLinkedAppDataInitInfoArgs, 'dataAuthority' | 'initPluginAuthority' | 'lifecycleChecks'>

export type LinkedAppDataPlugin = {
  dataAuthority: PluginAuthority
  type: 'LinkedAppData'
} & BaseExternalPluginAdapter &
  LinkedAppData

export type LinkedAppDataUpdateInfoArgs = {
  key: ExternalPluginAdapterKey
  schema?: ExternalPluginAdapterSchema
} & Omit<BaseLinkedAppDataUpdateInfoArgs, 'schema'>

export function linkedAppDataFromBase(
  s: BaseLinkedAppData,
  _r: ExternalRegistryRecord,
  _account: Uint8Array,
): LinkedAppData {
  return {
    ...s,
    dataAuthority: pluginAuthorityFromBase(s.dataAuthority),
    // plugin has no data but injected in the derivation of the asset
  }
}

export function linkedAppDataInitInfoArgsToBase(d: LinkedAppDataInitInfoArgs): BaseLinkedAppDataInitInfoArgs {
  return {
    dataAuthority: pluginAuthorityToBase(d.dataAuthority),
    initPluginAuthority: d.initPluginAuthority ? pluginAuthorityToBase(d.initPluginAuthority) : null,
    schema: d.schema ?? null,
  }
}

export function linkedAppDataUpdateInfoArgsToBase(d: LinkedAppDataUpdateInfoArgs): BaseLinkedAppDataUpdateInfoArgs {
  return {
    schema: d.schema ?? null,
  }
}

export const linkedAppDataManifest: ExternalPluginAdapterManifest<
  LinkedAppData,
  BaseLinkedAppData,
  LinkedAppDataInitInfoArgs,
  BaseLinkedAppDataInitInfoArgs,
  LinkedAppDataUpdateInfoArgs,
  BaseLinkedAppDataUpdateInfoArgs
> = {
  fromBase: linkedAppDataFromBase,
  initToBase: linkedAppDataInitInfoArgsToBase,
  type: 'LinkedAppData',
  updateToBase: linkedAppDataUpdateInfoArgsToBase,
}
