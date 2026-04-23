import { ArrowRightIcon, SearchIcon } from 'lucide-react'
import { useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/core/ui/alert'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '@/core/ui/input-group'
import { Spinner } from '@/core/ui/spinner'

export function MplCoreUiExplorerSearch({
  error,
  isLoading,
  onSearch,
}: {
  error?: null | string
  isLoading: boolean
  onSearch(value: string): void
}) {
  const [value, setValue] = useState('')

  return (
    <div className="space-y-3">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          onSearch(value)
        }}
      >
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>{isLoading ? <Spinner className="size-3.5" /> : <SearchIcon />}</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Find an asset or collection by address"
            onChange={(event) => setValue(event.currentTarget.value)}
            placeholder="Find an asset or collection by address"
            value={value}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton aria-label="Search" disabled={isLoading} size="icon-xs" type="submit">
              <ArrowRightIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Search failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}
