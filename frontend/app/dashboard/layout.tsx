'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SidebarNav } from '@/components/dashboard/sidebar-nav'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Basic mounting check because localStorage is read in useAuth's useEffect
    setIsChecking(false)
  }, [])

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push('/login')
    }
  }, [isChecking, isAuthenticated, router])

  if (isChecking || !isAuthenticated) {
    return <div className="flex h-screen w-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <SidebarNav />
      <main className="flex-1 overflow-auto pt-16 md:pt-0">
        {children}
      </main>
    </div>
  )
}
