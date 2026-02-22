import clsx from 'clsx'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6 text-emerald-500"
        aria-hidden="true"
      >
        <path
          d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-lg font-semibold text-zinc-900 dark:text-white">
        AgentFlow
      </span>
    </div>
  )
}
