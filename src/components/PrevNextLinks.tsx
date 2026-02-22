'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigation, type NavItem } from './Navigation'

function flattenNav(): NavItem[] {
  return navigation.flatMap((group) => group.items)
}

export function PrevNextLinks() {
  const pathname = usePathname()
  const pages = flattenNav()
  const currentIndex = pages.findIndex((p) => p.href === pathname)

  if (currentIndex === -1) return null

  const prev = currentIndex > 0 ? pages[currentIndex - 1] : null
  const next = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null

  return (
    <div className="mt-12 flex items-center border-t border-zinc-200 pt-6 dark:border-zinc-700">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex items-center gap-2 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-0.5">
            &larr;
          </span>
          {prev.title}
        </Link>
      ) : (
        <div />
      )}
      {next && (
        <Link
          href={next.href}
          className="group ml-auto flex items-center gap-2 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          {next.title}
          <span className="inline-block transition-transform group-hover:translate-x-0.5">
            &rarr;
          </span>
        </Link>
      )}
    </div>
  )
}
