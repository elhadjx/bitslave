'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ArrowRight, Bot, Key, CreditCard } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard } from '@/components/dashboard/glass-card'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [telegramToken, setTelegramToken] = useState('')
  const [llmProvider, setLlmProvider] = useState('openai')
  const [llmApiKey, setLlmApiKey] = useState('')
  
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const router = useRouter()

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (step === 1 && (!email || !password)) {
      setError('Email and password are required.')
      return
    }
    setStep(step + 1)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!telegramToken || !llmApiKey) {
      setError('Deployment configuration is required.')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, telegramToken, llmProvider, llmApiKey })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Log in the user locally
      login(data.token, data.user)
      
      // Redirect to Polar checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
      setStep(1) // Return to first step to display the error
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <GlassCard className="w-full max-w-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">Create Account</h1>
          <p className="text-sm text-muted-foreground">Join Bitslave and deploy your agent</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-border -z-10 -translate-y-1/2" />
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background font-semibold transition-colors
                ${step === num ? 'border-accent text-accent' : 
                  step > num ? 'border-foreground text-foreground bg-foreground/10' : 
                  'border-muted text-muted-foreground'}`
              }
            >
              {num === 1 && <Key className="w-4 h-4" />}
              {num === 2 && <Bot className="w-4 h-4" />}
              {num === 3 && <CreditCard className="w-4 h-4" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-md bg-destructive/10 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        {/* Step 1: Credentials */}
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input/50"
              />
            </div>
            <Button type="submit" className="w-full h-11">
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        )}

        {/* Step 2: Configuration */}
        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="telegramToken">Telegram Bot Token</Label>
              <Input
                id="telegramToken"
                type="text"
                required
                placeholder="123456:ABCdefGHIjklmnoPQRstuvwxyz"
                value={telegramToken}
                onChange={(e) => setTelegramToken(e.target.value)}
                className="bg-input/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">LLM Provider</Label>
              <select
                id="provider"
                value={llmProvider}
                onChange={(e) => setLlmProvider(e.target.value)}
                className="w-full px-3 py-2 bg-input/50 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="deepseek">DeepSeek</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">LLM API Key</Label>
              <Input
                id="apiKey"
                type="password"
                required
                placeholder="sk-..."
                value={llmApiKey}
                onChange={(e) => setLlmApiKey(e.target.value)}
                className="bg-input/50"
              />
            </div>
            
            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <form onSubmit={handleRegister} className="space-y-6 text-center">
            <div className="py-6 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">Complete Registration</h3>
              <p className="text-muted-foreground text-sm">
                To launch your bot, you'll be redirected to Polar.sh to activate your subscription plan.
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(2)} disabled={isLoading}>
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                ) : (
                  'Proceed to Payment'
                )}
              </Button>
            </div>
          </form>
        )}

        {step === 1 && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-accent flex-inline hover:underline ml-1">
              Sign In
            </Link>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
