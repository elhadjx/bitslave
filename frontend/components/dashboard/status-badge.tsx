import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'live' | 'offline'
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const isLive = status === 'live'

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
        isLive
          ? 'bg-[oklch(0.70_0.25_142.5_/_0.2)] text-[oklch(0.70_0.25_142.5)]'
          : 'bg-muted text-muted-foreground',
        className
      )}
    >
      <div
        className={cn(
          'w-2 h-2 rounded-full',
          isLive ? 'bg-[oklch(0.70_0.25_142.5)] animate-pulse' : 'bg-muted-foreground'
        )}
      />
      <span>{isLive ? 'Live' : 'Offline'}</span>
    </div>
  )
}
