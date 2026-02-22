'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

export function Mermaid({ code }: { code: string }) {
  const id = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const [svg, setSvg] = useState<string>('')

  useEffect(() => {
    let cancelled = false

    async function render() {
      const mermaid = (await import('mermaid')).default
      const mermaidId = `mermaid-${id.replace(/:/g, '')}`

      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === 'dark' ? 'dark' : 'default',
        fontFamily: 'inherit',
        securityLevel: 'loose',
      })

      try {
        const { svg: renderedSvg } = await mermaid.render(mermaidId, code)
        if (!cancelled) {
          setSvg(renderedSvg)
        }
      } catch {
        if (!cancelled) {
          setSvg('')
        }
      }
    }

    render()
    return () => {
      cancelled = true
    }
  }, [code, resolvedTheme, id])

  if (!svg) {
    return (
      <div className="my-6 flex items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-700 dark:bg-zinc-800/50">
        <span className="text-sm text-zinc-400">Loading diagram...</span>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center overflow-x-auto rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800/50 [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
