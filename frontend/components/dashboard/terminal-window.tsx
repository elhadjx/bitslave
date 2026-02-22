'use client'

import { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { GlassCard } from './glass-card'
import { Copy, RotateCcw } from 'lucide-react'

interface TerminalWindowProps {
  logs: string[]
  onRestart?: () => void
  title?: string
}

export function TerminalWindow({
  logs,
  onRestart,
  title = 'Terminal',
}: TerminalWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  // Auto-scroll to bottom when logs change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const copyLogs = () => {
    const logsText = logs.join('\n')
    navigator.clipboard.writeText(logsText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <GlassCard className="flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={copyLogs}
            className="text-muted-foreground hover:text-foreground"
          >
            <Copy className="w-4 h-4 mr-1" />
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          {onRestart && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onRestart}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Restart
            </Button>
          )}
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto bg-[oklch(0.05_0_0)] p-4 font-mono text-sm space-y-1"
      >
        {logs.length === 0 ? (
          <div className="text-muted-foreground opacity-50">
            No logs yet. Deploy your agent to see terminal output.
          </div>
        ) : (
          logs.map((log, idx) => (
            <div
              key={idx}
              className={
                log.includes('error')
                  ? 'text-[oklch(0.62_0.21_15)]'
                  : log.includes('success') || log.includes('deployed')
                  ? 'text-[oklch(0.70_0.25_142.5)]'
                  : log.includes('warning')
                  ? 'text-[oklch(0.75_0.22_252)]'
                  : 'text-[oklch(0.85_0_0)]'
              }
            >
              <span className="text-muted-foreground mr-3">
                {new Date().toLocaleTimeString()}
              </span>
              <span>{log}</span>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  )
}
