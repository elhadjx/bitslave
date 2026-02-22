import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hoverable?: boolean
}

export function GlassCard({
  children,
  hoverable = true,
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        hoverable ? 'glass-card-hover' : 'glass-card',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
