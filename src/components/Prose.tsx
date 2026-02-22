import clsx from 'clsx'

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={clsx(
        'prose prose-zinc dark:prose-invert mx-auto max-w-3xl',
        'prose-headings:font-semibold',
        'prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:text-emerald-500',
        'dark:prose-a:text-emerald-400 dark:hover:prose-a:text-emerald-300',
        'prose-code:rounded prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-medium',
        'dark:prose-code:bg-zinc-800',
        'prose-pre:rounded-lg prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-800/50 dark:prose-pre:ring-1 dark:prose-pre:ring-zinc-700',
        className,
      )}
    >
      {children}
    </div>
  )
}
