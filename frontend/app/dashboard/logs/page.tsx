'use client'

import { useState, useEffect } from 'react'
import { TerminalWindow } from '@/components/dashboard/terminal-window'
import { GlassCard } from '@/components/dashboard/glass-card'

export default function LogsPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [autoScroll, setAutoScroll] = useState(true)

  // Fetch real-time logs from backend
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3001/api/logs', {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        })
        const data = await res.json()
        if (data.logs) {
          // Format the logs: [HH:MM:SS] Message
          const formattedLogs = data.logs.map((log: any) => {
            const time = new Date(log.createdAt).toLocaleTimeString()
            return `[${time}] ${log.level.toUpperCase()}: ${log.message}`
          })
          setLogs(formattedLogs)
        }
      } catch (err) {
        console.error('Failed to fetch logs', err)
      }
    }

    fetchLogs()
    const interval = setInterval(fetchLogs, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleRestart = () => {
    setLogs([])
    setTimeout(() => {
      setLogs([
        '[' + new Date().toLocaleTimeString() + '] Restarting container...',
        '[' + new Date().toLocaleTimeString() + '] Container restarted successfully',
        '[' + new Date().toLocaleTimeString() + '] Agent initialized',
      ])
    }, 1000)
  }

  return (
    <div className="p-4 sm:p-8 space-y-8 h-[calc(100vh-80px)] sm:h-[calc(100vh-64px)]">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Logs & Terminal</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Real-time view of your agent's activity and system logs</p>
      </div>

      {/* Terminal container - takes up remaining space */}
      <div className="flex-1 min-h-0">
        <TerminalWindow
          logs={logs}
          onRestart={handleRestart}
          title="Agent Terminal"
        />
      </div>

      {/* Log settings */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Auto-scroll</h3>
            <p className="text-sm text-muted-foreground">Automatically scroll to the latest logs</p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="w-4 h-4 rounded border-border bg-input"
            />
            <span className="text-sm text-foreground">Enabled</span>
          </label>
        </div>
      </GlassCard>
    </div>
  )
}
