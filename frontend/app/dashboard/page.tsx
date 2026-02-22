'use client'

import { useState, useEffect } from 'react'
import { GlassCard } from '@/components/dashboard/glass-card'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { DeploymentForm, DeploymentData } from '@/components/dashboard/deployment-form'
import { Clock, Container } from 'lucide-react'
import { useBitslave } from '@/hooks/useBitslave'

export default function DashboardPage() {
  const [isDeployed, setIsDeployed] = useState(false)
  const [deployedData, setDeployedData] = useState<DeploymentData | null>(null)
  const { fetchStatus, deployAgent, stopAgent, isDeploying } = useBitslave()

  // Fetch initial status from backend
  useEffect(() => {
    fetchStatus().then((data: any) => {
      setIsDeployed(data.isDeployed)
      if (data.config) {
        setDeployedData({
          token: data.config.telegramToken,
          provider: data.config.llmProvider,
          apiKey: data.config.llmApiKey,
        })
      }
    })
  }, [fetchStatus])

  const handleDeploy = async (data: DeploymentData) => {
    try {
      await deployAgent(data.token, data.provider, data.apiKey)
      setIsDeployed(true)
      setDeployedData(data)
    } catch (err) {
      console.error('Submission failed', err)
    }
  }

  const handleStop = async () => {
    try {
      await stopAgent()
      setIsDeployed(false)
      setDeployedData(null)
    } catch (err) {
      console.error('Stop failed', err)
    }
  }

  return (
    <div className="p-4 sm:p-8 space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Agent</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage and monitor your autonomous AI agent</p>
      </div>

      {/* Agent Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-foreground">Agent Status</h2>
                  <p className="text-sm text-muted-foreground">Current deployment state</p>
                </div>
                <StatusBadge status={isDeployed ? 'live' : 'offline'} />
              </div>

              {isDeployed && (
                <div className="pt-4 border-t space-y-3" style={{ borderColor: 'var(--glass-border)' }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Container className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Container Status</p>
                        <p className="text-sm font-medium text-foreground">Running</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Last Updated</p>
                        <p className="text-sm font-medium text-foreground">Just now</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                    <p className="text-xs text-muted-foreground mb-2">Provider & Token</p>
                    <div className="space-y-1 font-mono text-xs">
                      <p className="text-foreground">Provider: <span className="text-[oklch(0.75_0.22_252)]">{deployedData?.provider}</span></p>
                      <p className="text-foreground">Token: <span className="text-[oklch(0.75_0.22_252)]">{deployedData?.token.slice(0, 10)}...</span></p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Quick stats */}
        <div className="space-y-4">
          <GlassCard className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Requests</p>
                <p className="text-3xl font-bold text-accent">2,847</p>
              </div>
              <p className="text-xs text-muted-foreground">+12% this month</p>
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-[oklch(0.70_0.25_142.5)]">98.5%</p>
              </div>
              <p className="text-xs text-muted-foreground">Excellent performance</p>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Deployment Form */}
      <DeploymentForm
        onDeploy={handleDeploy}
        onStop={handleStop}
        isDeployed={isDeployed}
        initialData={deployedData}
      />

      {/* Recent Activity */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {isDeployed ? (
            <>
              <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--glass-border)' }}>
                <span className="text-sm text-foreground">Agent deployed successfully</span>
                <span className="text-xs text-muted-foreground">Just now</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--glass-border)' }}>
                <span className="text-sm text-foreground">Configuration updated</span>
                <span className="text-xs text-muted-foreground">2 minutes ago</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No activity yet. Deploy your agent to get started.</p>
          )}
        </div>
      </GlassCard>
    </div>
  )
}
