import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[oklch(0.70_0.25_142.5)] opacity-10 blur-3xl rounded-full animate-float" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-[oklch(0.75_0.22_252)] opacity-5 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-slide-in">
          {/* Tagline */}
          <div className="inline-block">
            <div className="px-4 py-2 rounded-full border backdrop-blur-xl" style={{ borderColor: 'var(--glass-border)', backgroundColor: 'var(--glass-bg)' }}>
              <p className="text-sm font-medium text-muted-foreground">
                Deploy your Telegram Agent in 60 seconds with Bitslave
              </p>
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="block text-foreground">Your AI Assistant,</span>
            <span className="block bg-gradient-to-r from-[oklch(0.70_0.25_142.5)] via-[oklch(0.75_0.22_252)] to-[oklch(0.68_0.28_300)] bg-clip-text text-transparent">
              Always Online
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Turn your Telegram bot into an autonomous LLM-powered assistant with Bitslave. Just plug in your keys and we handle the magic.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8"
            >
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="hover:bg-[oklch(0.15_0_0)]"
              style={{ borderColor: 'var(--glass-border)', backgroundColor: 'var(--glass-bg)' }}
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="pt-12 grid grid-cols-3 gap-8 max-w-xl mx-auto">
            <div className="space-y-2">
              <p className="text-2xl font-bold text-accent">1000+</p>
              <p className="text-sm text-muted-foreground">Active Agents</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-accent">99.9%</p>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-accent">24/7</p>
              <p className="text-sm text-muted-foreground">Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
