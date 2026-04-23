import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { Button } from '@/core/ui/button'

export function MplCoreUiExplorerStat({
  copyValue,
  href,
  label,
  to,
  value,
}: {
  copyValue?: string
  href?: string
  label: string
  to?: string
  value: React.ReactNode
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!copyValue || typeof navigator === 'undefined' || !navigator.clipboard) {
      return
    }

    await navigator.clipboard.writeText(copyValue)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="grid gap-1 rounded-lg border border-border/60 bg-muted/10 p-3">
      <div className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 text-sm leading-6 break-all text-foreground">
          {to ? (
            <Link className="underline underline-offset-4 hover:text-primary" to={to}>
              {value}
            </Link>
          ) : href ? (
            <a
              className="underline underline-offset-4 hover:text-primary"
              href={href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {value}
            </a>
          ) : (
            value
          )}
        </div>
        {copyValue ? (
          <Button
            aria-label={`Copy ${label}`}
            className="shrink-0"
            onClick={() => void handleCopy()}
            size="icon-xs"
            variant="ghost"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
