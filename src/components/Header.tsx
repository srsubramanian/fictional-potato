'use client'

import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

export function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-4 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/80 lg:ml-72 lg:px-8">
      <button
        type="button"
        aria-label="Open navigation"
        className="lg:hidden flex h-6 w-6 items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        onClick={onMenuToggle}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div className="lg:hidden">
        <Logo />
      </div>

      <div className="flex-1" />

      <ThemeToggle />
    </header>
  )
}
