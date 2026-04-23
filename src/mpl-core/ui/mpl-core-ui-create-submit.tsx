import { ArrowRightIcon } from 'lucide-react'

import { Button } from '@/core/ui/button'
import { Spinner } from '@/core/ui/spinner'

export function MplCoreUiCreateSubmit({ isLoading, onSubmit }: { isLoading: boolean; onSubmit(): void }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled={isLoading} onClick={onSubmit} size="lg" type="button">
        {isLoading ? <Spinner /> : <ArrowRightIcon />}
        {isLoading ? 'Submitting…' : 'Create asset'}
      </Button>
      <div className="text-xs/relaxed text-muted-foreground">
        The wallet signs and submits the transaction immediately. Watch the explorer link for finalized status.
      </div>
    </div>
  )
}
