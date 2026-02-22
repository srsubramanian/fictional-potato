'use client'

import { useEffect, useState } from 'react'

interface TocEntry {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocEntry[]>([])
  const [activeId, setActiveId] = useState<string>('')

  // Scan DOM for headings on mount
  useEffect(() => {
    const article = document.querySelector('article')
    if (!article) return

    const elements = article.querySelectorAll('h2[id], h3[id]')
    const entries: TocEntry[] = Array.from(elements).map((el) => ({
      id: el.id,
      text: el.textContent ?? '',
      level: el.tagName === 'H2' ? 2 : 3,
    }))
    setHeadings(entries)
  }, [])

  // Scroll-spy via IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-56px 0px -80% 0px' },
    )

    for (const { id } of headings) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <aside className="fixed right-0 top-14 hidden h-[calc(100vh-3.5rem)] w-64 overflow-y-auto px-6 py-10 xl:block">
      <h5 className="text-xs font-semibold uppercase tracking-wide text-zinc-900 dark:text-white">
        On this page
      </h5>
      <ul className="mt-4 space-y-2.5 text-sm">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' })
                history.pushState(null, '', `#${h.id}`)
              }}
              className={
                (h.level === 3 ? 'pl-4 ' : '') +
                (activeId === h.id
                  ? 'font-medium text-emerald-600 dark:text-emerald-400'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white') +
                ' block transition'
              }
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
