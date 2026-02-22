'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface NavItem {
  title: string
  href: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const navigation: NavGroup[] = [
  {
    title: 'Guides',
    items: [
      { title: 'Introduction', href: '/' },
      { title: 'Quickstart', href: '/quickstart' },
      { title: 'Architecture', href: '/architecture' },
      { title: 'Authentication', href: '/authentication' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { title: 'Agents', href: '/agents' },
      { title: 'Workflows', href: '/workflows' },
      { title: 'Tasks', href: '/tasks' },
      { title: 'Webhooks', href: '/webhooks' },
    ],
  },
]

export function Navigation({
  className,
  onLinkClick,
}: {
  className?: string
  onLinkClick?: () => void
}) {
  const pathname = usePathname()

  return (
    <nav className={clsx('text-sm', className)}>
      <ul role="list" className="space-y-6">
        {navigation.map((group) => (
          <li key={group.title}>
            <h3 className="font-semibold text-zinc-900 dark:text-white">
              {group.title}
            </h3>
            <ul
              role="list"
              className="mt-2 space-y-1 border-l border-zinc-200 dark:border-zinc-700"
            >
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onLinkClick}
                      className={clsx(
                        '-ml-px block border-l pl-4 py-1 transition',
                        isActive
                          ? 'border-emerald-500 font-medium text-emerald-600 dark:text-emerald-400'
                          : 'border-transparent text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white',
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}
