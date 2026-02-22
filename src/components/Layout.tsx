'use client'

import { useCallback, useEffect, useState } from 'react'
import { Logo } from './Logo'
import { Navigation } from './Navigation'
import { Header } from './Header'
import { TableOfContents } from './TableOfContents'

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const closeMobileNav = useCallback(() => setMobileNavOpen(false), [])

  useEffect(() => {
    if (!mobileNavOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileNavOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mobileNavOpen])

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 overflow-y-auto border-r border-zinc-200 bg-white px-6 py-6 dark:border-zinc-700 dark:bg-zinc-900 lg:block">
        <Logo />
        <Navigation className="mt-8" />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileNavOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={closeMobileNav}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white px-6 py-6 dark:bg-zinc-900 lg:hidden">
            <Logo />
            <Navigation className="mt-8" onLinkClick={closeMobileNav} />
          </aside>
        </>
      )}

      <Header onMenuToggle={() => setMobileNavOpen((o) => !o)} />

      {/* Main content */}
      <main className="lg:ml-72 xl:mr-64 pt-14">
        <div className="px-4 py-10 sm:px-6 lg:px-8">{children}</div>
      </main>

      <TableOfContents />
    </>
  )
}
