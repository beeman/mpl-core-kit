import {
  type BaseAppData,
  type BaseAppDataInitInfoArgs,
  type BaseAppDataUpdateInfoArgs,
  type ExternalPluginAdapterSchema,
  type ExternalRegistryRecord,
} from '../generated'
import { type ExternalPluginAdapterKey } from './externalPluginAdapterKey'
import { type ExternalPluginAdapterManifest } from './externalPluginAdapterManifest'
import { type BaseExternalPluginAdapter } from './externalPluginAdapters'
import { parseExternalPluginAdapterData } from './lib'
import { type LifecycleChecks } from './lifecycleChecks'
import { type PluginAuthority, pluginAuthorityFromBase, pluginAuthorityToBase } from './pluginAuthority'

export type AppData = {
  data?: unknown
  dataAuthority: PluginAuthority
} & Omit<BaseAppData, 'dataAuthority'>

export type AppDataInitInfoArgs = {
  dataAuthority: PluginAuthority
  initPluginAuthority?: PluginAuthority
  lifecycleChecks?: LifecycleChecks
  schema?: ExternalPluginAdapterSchema
  type: 'AppData'
} & Omit<BaseAppDataInitInfoArgs, 'dataAuthority' | 'initPluginAuthority' | 'lifecycleChecks'>

export type AppDataPlugin = {
  dataAuthority: PluginAuthority
  type: 'AppData'
} & AppData &
  BaseExternalPluginAdapter

export type AppDataUpdateInfoArgs = {
  key: ExternalPluginAdapterKey
  schema?: ExternalPluginAdapterSchema
} & Omit<BaseAppDataUpdateInfoArgs, 'schema'>

export function appDataFromBase(s: BaseAppData, r: ExternalRegistryRecord, account: Uint8Array): AppData {
  return {
    ...s,
    data: parseExternalPluginAdapterData(s, r, account),
    dataAuthority: pluginAuthorityFromBase(s.dataAuthority),
  }
}

export function appDataInitInfoArgsToBase(d: AppDataInitInfoArgs): BaseAppDataInitInfoArgs {
  return {
    dataAuthority: pluginAuthorityToBase(d.dataAuthority),
    initPluginAuthority: d.initPluginAuthority ? pluginAuthorityToBase(d.initPluginAuthority) : null,
    schema: d.schema ?? null,
  }
}

export function appDataUpdateInfoArgsToBase(d: AppDataUpdateInfoArgs): BaseAppDataUpdateInfoArgs {
  return {
    schema: d.schema ?? null,
  }
}

export const appDataManifest: ExternalPluginAdapterManifest<
  AppData,
  BaseAppData,
  AppDataInitInfoArgs,
  BaseAppDataInitInfoArgs,
  AppDataUpdateInfoArgs,
  BaseAppDataUpdateInfoArgs
> = {
  fromBase: appDataFromBase,
  initToBase: appDataInitInfoArgsToBase,
  type: 'AppData',
  updateToBase: appDataUpdateInfoArgsToBase,
}
