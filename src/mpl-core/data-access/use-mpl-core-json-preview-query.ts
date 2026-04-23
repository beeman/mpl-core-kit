import { useQuery } from '@tanstack/react-query'

import { isValidUrl } from '@/mpl-core/data-access/mpl-core-create-draft'

export type MplCoreJsonPreview = Record<string, unknown>

const mplCoreJsonPreviewStaleTime = 30_000

export async function fetchMplCoreJsonPreview({ uri }: { uri: string }): Promise<MplCoreJsonPreview> {
  const trimmedUri = uri.trim()
  const response = await fetch(trimmedUri)
  if (!response.ok) {
    throw new Error(`Preview fetch failed with status ${response.status}.`)
  }

  const data = (await response.json()) as Record<string, unknown>
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Metadata preview must resolve to a JSON object.')
  }

  return data
}

export function getMplCoreJsonPreviewQueryKey({ uri }: { uri: string }) {
  return ['mpl-core-json-preview', uri.trim()] as const
}

export function getMplCoreJsonPreviewQueryOptions({ uri }: { uri: string }) {
  const trimmedUri = uri.trim()

  return {
    queryFn: () => fetchMplCoreJsonPreview({ uri: trimmedUri }),
    queryKey: getMplCoreJsonPreviewQueryKey({ uri: trimmedUri }),
    retry: false,
    staleTime: mplCoreJsonPreviewStaleTime,
  }
}

export function useMplCoreJsonPreviewQuery({ uri }: { uri: string }) {
  const trimmedUri = uri.trim()

  return useQuery({
    enabled: isValidUrl(trimmedUri),
    ...getMplCoreJsonPreviewQueryOptions({ uri: trimmedUri }),
  })
}
