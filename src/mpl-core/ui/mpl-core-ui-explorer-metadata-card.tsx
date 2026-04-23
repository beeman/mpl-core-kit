import { Alert, AlertDescription, AlertTitle } from '@/core/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { Spinner } from '@/core/ui/spinner'

export function MplCoreUiExplorerMetadataCard({
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
          <CardDescription>Loading metadata from {uri.trim()}.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Spinner />
          <span>Fetching metadata…</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>The metadata URI could not be loaded.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Metadata fetch failed</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'The metadata URI did not return a usable JSON document.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No metadata preview is available for the current URI.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const description = typeof data.description === 'string' ? data.description : undefined
  const image = typeof data.image === 'string' ? data.image : undefined
  const name = typeof data.name === 'string' ? data.name : undefined

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{name ? `Resolved metadata for ${name}.` : 'Resolved metadata JSON.'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {image ? (
          <div className="overflow-hidden rounded-lg border border-border/60 bg-muted/20">
            <img alt={name ?? title} className="aspect-square h-full w-full object-cover" src={image} />
          </div>
        ) : null}
        {description ? <div className="text-sm/6 text-muted-foreground">{description}</div> : null}
        <pre className="max-h-[28rem] overflow-auto rounded-lg border border-border/60 bg-muted/20 p-4 text-[11px] leading-5 whitespace-pre-wrap">
          {stringifyForDisplay(data)}
        </pre>
      </CardContent>
    </Card>
  )
}

function stringifyForDisplay(value: unknown) {
  return JSON.stringify(value, (_, entry) => (typeof entry === 'bigint' ? entry.toString() : entry), 2)
}
