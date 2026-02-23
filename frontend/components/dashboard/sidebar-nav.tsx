'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Bot, Zap, Terminal, CreditCard, LogOut, Menu, X } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'My Agent', icon: Bot },
  { href: '/dashboard/skills', label: 'Skill Marketplace', icon: Zap },
  { href: '/dashboard/logs', label: 'Logs', icon: Terminal },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
]

export function SidebarNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-lg border"
        style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed md:relative w-64 bg-[oklch(0.10_0_0)] border-r flex flex-col h-screen z-30 transform transition-transform duration-200",
        "md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
        style={{ borderColor: 'var(--glass-border)' }}
      >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--glass-border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="/logo.svg" alt="Bitslave Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-semibold text-foreground">Bitslave</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
                isActive
                  ? 'text-accent'
                  : 'text-muted-foreground hover:text-foreground hover:bg-[oklch(0.15_0_0)] border-transparent'
              )}
              style={isActive ? {
                backgroundColor: 'var(--glass-bg)',
                borderColor: 'var(--glass-border)'
              } : undefined}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
        <button
          onClick={() => setIsOpen(false)}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-[oklch(0.15_0_0)] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
      </aside>
    </>
  )
}
