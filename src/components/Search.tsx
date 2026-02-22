'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { useRouter, usePathname } from 'next/navigation'
import { create } from 'zustand'
import { navigation } from './Navigation'

type NavGroup = (typeof navigation)[number]
import type { SearchResult } from '@/mdx/search'

const useSearchStore = create<{
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}>()((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
  toggle: () => set((s) => ({ open: !s.open })),
}))

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query || query.length < 2) {
    return <>{text}</>
  }
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="bg-transparent text-emerald-500 underline dark:text-emerald-400"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}

function resolveHierarchy(
  url: string,
  nav: NavGroup[],
): string[] {
  const pathname = url.split('#')[0] || '/'
  for (const group of nav) {
    for (const link of group.links) {
      if (link.href === pathname) {
        return [group.title, link.title]
      }
    }
  }
  return []
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25"
      />
    </svg>
  )
}

function NoResultsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l14 14"
      />
    </svg>
  )
}

function SearchDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const searchModuleRef = useRef<typeof import('@/mdx/search') | null>(null)

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => inputRef.current?.focus())
      return () => cancelAnimationFrame(id)
    } else {
      setQuery('')
      setResults([])
      setSelectedIndex(0)
    }
  }, [open])

  const runSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([])
      setSelectedIndex(0)
      return
    }
    if (!searchModuleRef.current) {
      searchModuleRef.current = await import('@/mdx/search')
    }
    const hits = searchModuleRef.current.search(q, { limit: 10 })
    setResults(hits)
    setSelectedIndex(0)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % Math.max(results.length, 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(
          (i) => (i - 1 + results.length) % Math.max(results.length, 1),
        )
        break
      case 'Enter':
        e.preventDefault()
        if (results[selectedIndex]) {
          router.push(results[selectedIndex].url)
          onClose()
        }
        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
    }
  }

  // Scroll active item into view
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const active = list.children[selectedIndex] as HTMLElement | undefined
    active?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50" onKeyDown={handleKeyDown}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-x-4 top-[25%] mx-auto max-w-xl sm:inset-x-0 sm:top-[15%]">
        <div className="overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4">
            <SearchIcon className="h-5 w-5 shrink-0 stroke-zinc-500 dark:stroke-zinc-400" />
            <input
              ref={inputRef}
              type="search"
              placeholder="Find something..."
              className="h-14 w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-white dark:placeholder:text-zinc-500"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                runSearch(e.target.value)
              }}
            />
          </div>

          {/* Results */}
          {query.length >= 2 && (
            <div className="max-h-72 overflow-y-auto border-t border-zinc-200 dark:border-zinc-700">
              {results.length > 0 ? (
                <ul ref={listRef} role="listbox">
                  {results.map((result, i) => {
                    const hierarchy = resolveHierarchy(
                      result.url,
                      navigation,
                    )
                    return (
                      <li
                        key={result.url}
                        role="option"
                        aria-selected={i === selectedIndex}
                        className={`cursor-pointer border-b border-zinc-100 px-4 py-3 last:border-b-0 dark:border-zinc-700/50 ${
                          i === selectedIndex
                            ? 'bg-zinc-50 dark:bg-zinc-700/30'
                            : ''
                        }`}
                        onMouseEnter={() => setSelectedIndex(i)}
                        onClick={() => {
                          router.push(result.url)
                          onClose()
                        }}
                      >
                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          <Highlight
                            text={result.title}
                            query={query}
                          />
                        </span>
                        {(hierarchy.length > 0 || result.pageTitle) && (
                          <span className="mt-0.5 flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                            {hierarchy.length > 0 && (
                              <>
                                {hierarchy.map((part, idx) => (
                                  <span key={idx} className="flex items-center gap-1">
                                    {idx > 0 && <span className="text-zinc-300 dark:text-zinc-600">/</span>}
                                    <span>{part}</span>
                                  </span>
                                ))}
                              </>
                            )}
                            {result.pageTitle && hierarchy.length > 0 && (
                              <span className="text-zinc-300 dark:text-zinc-600">/</span>
                            )}
                            {result.pageTitle && (
                              <span className="text-emerald-500 dark:text-emerald-400">
                                <Highlight
                                  text={result.pageTitle}
                                  query={query}
                                />
                              </span>
                            )}
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="flex flex-col items-center gap-2 py-8 text-zinc-400 dark:text-zinc-500">
                  <NoResultsIcon className="h-6 w-6 stroke-current stroke-2" />
                  <p className="text-sm">
                    No results for &ldquo;
                    <span className="font-medium text-zinc-600 dark:text-zinc-300">
                      {query}
                    </span>
                    &rdquo;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function MobileSearch() {
  let { open, setOpen } = useSearchStore()

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Search"
      className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 lg:hidden dark:hover:bg-white/5"
    >
      <SearchIcon className="h-5 w-5 stroke-zinc-900 dark:stroke-white" />
    </button>
  )
}

export function Search() {
  let { open, setOpen, toggle } = useSearchStore()
  const pathname = usePathname()

  // Close on navigation
  useEffect(() => {
    setOpen(false)
  }, [pathname, setOpen])

  // Cmd/Ctrl+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggle])

  return (
    <>
      {/* Desktop trigger — wide input-style bar */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-8 w-full max-w-sm items-center gap-2 rounded-full bg-white/90 pl-3 pr-2 text-sm text-zinc-500 ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20 lg:flex dark:bg-white/5 dark:text-zinc-400 dark:ring-white/10 dark:hover:ring-white/20"
      >
        <SearchIcon className="h-4 w-4 shrink-0 stroke-current" />
        <span className="flex-1 text-left">Find something...</span>
        <kbd className="rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 dark:border-zinc-600">
          &#8984;K
        </kbd>
      </button>

      <SearchDialog open={open} onClose={() => setOpen(false)} />
    </>
  )
}
