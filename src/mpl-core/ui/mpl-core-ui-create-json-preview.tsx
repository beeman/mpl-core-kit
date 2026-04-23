import { Alert, AlertDescription, AlertTitle } from '@/core/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { Spinner } from '@/core/ui/spinner'

export function MplCoreUiCreateJsonPreview({
  data,
  error,
  isLoading,
  title,
  uri,
}: {
  data?: Record<string, unknown>
  error: unknown
  isLoading: boolean
  title: string
  uri: string
}) {
  if (isLoading) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Loading preview for {uri.trim()}.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Spinner />
          <span>Fetching metadata preview…</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Preview could not be loaded for the current URI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Metadata preview failed</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'The metadata URI did not return a usable JSON document.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return null
  }

  const image = typeof data.image === 'string' ? data.image : undefined
  const name = typeof data.name === 'string' ? data.name : undefined

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{name ? `Resolved metadata for ${name}.` : 'Resolved metadata JSON.'}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        {image ? (
          <div className="overflow-hidden rounded-lg border border-border/60 bg-muted/20">
            <img alt={name ?? 'Metadata preview'} className="aspect-square h-full w-full object-cover" src={image} />
          </div>
        ) : null}
        <pre className="max-h-[32rem] overflow-auto rounded-lg border border-border/60 bg-muted/20 p-4 text-[11px] leading-5 whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}
