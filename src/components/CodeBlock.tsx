'use client'

import { useRef, useCallback } from 'react'
import { CopyButton } from './CopyButton'

export function CodeBlock(props: React.ComponentPropsWithoutRef<'pre'>) {
  const preRef = useRef<HTMLPreElement>(null)
  const getText = useCallback(() => preRef.current?.textContent ?? '', [])

  return (
    <div className="group relative">
      <CopyButton getText={getText} />
      <pre ref={preRef} {...props} />
    </div>
  )
}
