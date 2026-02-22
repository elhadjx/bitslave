'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard } from './glass-card'
import { HelpCircle, Loader2 } from 'lucide-react'

interface DeploymentFormProps {
  onDeploy?: (data: DeploymentData) => Promise<void>
  onStop?: () => Promise<void>
  isDeployed?: boolean
  initialData?: DeploymentData | null
}

export interface DeploymentData {
  token: string
  provider: string
  apiKey: string
}

export function DeploymentForm({
  onDeploy,
  onStop,
  isDeployed = false,
  initialData,
}: DeploymentFormProps) {
  const [token, setToken] = useState('')
  const [provider, setProvider] = useState('openai')
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  useEffect(() => {
    if (initialData) {
      setToken(initialData.token || '')
      setProvider(initialData.provider || 'openai')
      setApiKey(initialData.apiKey || '')
    }
  }, [initialData])

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !apiKey) return

    setIsLoading(true)
    try {
      if (onDeploy) await onDeploy({ token, provider, apiKey })
      setToken('')
      setApiKey('')
    } catch (error) {
      console.error('Deployment failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStop = async () => {
    setIsLoading(true)
    try {
      if (onStop) await onStop()
    } catch (error) {
      console.error('Stop failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Deployment Wizard</h2>
        <p className="text-muted-foreground text-sm">
          {isDeployed
            ? 'Your agent is currently live. Update settings or stop the deployment.'
            : 'Configure and deploy your AI agent in seconds.'}
        </p>
      </div>

      <form onSubmit={handleDeploy} className="space-y-6">
        {/* Token Input */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="token" className="text-sm font-medium">
              Telegram Bot Token
            </Label>
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
              <div className="hidden group-hover:block absolute left-0 top-6 bg-popover text-popover-foreground text-xs p-2 rounded border border-border whitespace-nowrap z-10">
                Get this from @BotFather on Telegram
              </div>
            </div>
          </div>
          <Input
            id="token"
            type="password"
            placeholder="123456:ABCdefGHIjklmnoPQRstuvwxyz"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={isLoading}
            className="bg-input border-border"
          />
        </div>

        {/* Provider Select */}
        <div className="space-y-2">
          <Label htmlFor="provider" className="text-sm font-medium">
            LLM Provider
          </Label>
          <select
            id="provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="deepseek">DeepSeek</option>
          </select>
        </div>

        {/* API Key Input */}
        <div className="space-y-2">
          <Label htmlFor="apiKey" className="text-sm font-medium">
            API Key
          </Label>
          <div className="relative">
            <Input
              id="apiKey"
              type={showApiKey ? 'text' : 'password'}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isLoading}
              className="bg-input border-border pr-10"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm disabled:opacity-50"
            >
              {showApiKey ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading || !token || !apiKey}
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deploying...
              </>
            ) : (
              'Deploy Agent'
            )}
          </Button>

          {isDeployed && (
            <Button
              type="button"
              onClick={handleStop}
              disabled={isLoading}
              variant="destructive"
              className="px-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Stopping...
                </>
              ) : (
                'Stop Agent'
              )}
            </Button>
          )}
        </div>
      </form>
    </GlassCard>
  )
}
