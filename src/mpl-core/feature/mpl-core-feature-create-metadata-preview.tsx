import { useDeferredValue } from 'react'

import { useMplCoreJsonPreviewQuery } from '@/mpl-core/data-access/use-mpl-core-json-preview-query'
import { MplCoreUiCreateJsonPreview } from '@/mpl-core/ui/mpl-core-ui-create-json-preview'

export function MplCoreFeatureCreateMetadataPreview({ title, uri }: { title: string; uri: string }) {
  const deferredUri = useDeferredValue(uri)
  const { data, error, isPending } = useMplCoreJsonPreviewQuery({ uri: deferredUri })

  if (!uri.trim()) {
    return null
  }

  return <MplCoreUiCreateJsonPreview data={data} error={error} isLoading={isPending} title={title} uri={uri} />
}
