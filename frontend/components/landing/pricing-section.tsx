import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/dashboard/glass-card'
import { Check, ArrowRight } from 'lucide-react'

const features = [
  'Unlimited Telegram bot messages',
  'Host 1 concurrent Openclaw agent',
  'All LLM Providers supported',
  'Access to all Openclaw skills',
  'Live dashboard & logs',
  'Automatic process restarts',
  '99.9% uptime SLA',
]

export function PricingSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background via-[oklch(0.12_0_0)] to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Start free, scale as you grow. No hidden fees.
          </p>
        </div>

        {/* Pricing card */}
        <div className="max-w-lg mx-auto">
          <GlassCard className="relative p-8 overflow-hidden">
            {/* Premium badge */}
            <div className="absolute top-6 right-6">
              <div className="px-3 py-1 rounded-full bg-[oklch(0.70_0.25_142.5)]/20 border border-[oklch(0.70_0.25_142.5)]/50 text-[oklch(0.70_0.25_142.5)] text-xs font-semibold">
                MOST POPULAR
              </div>
            </div>

            <div className="space-y-6">
              {/* Pricing header */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">Pro Plan</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-accent">$19</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Perfect for teams building with AI. Billed monthly.
                </p>
              </div>

              {/* CTA Button */}
              <Button
                asChild
                size="lg"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 group"
              >
                <a href="/dashboard">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>

              {/* Features list */}
              <div className="space-y-3 pt-6 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[oklch(0.70_0.25_142.5)] flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Footer note */}
              <div className="text-xs text-muted-foreground text-center pt-4">
                Free trial for 7 days. No credit card required.
              </div>
            </div>
          </GlassCard>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {[
              {
                q: 'Can I upgrade or downgrade anytime?',
                a: 'Yes, you can change your plan at any time. Changes take effect on your next billing cycle.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and wire transfers for enterprise customers.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes, we offer a 7-day free trial with full access to all Pro features. No credit card required.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border"
                style={{ borderColor: 'var(--glass-border)', backgroundColor: 'var(--glass-bg)' }}
              >
                <h4 className="font-semibold text-foreground mb-2">{faq.q}</h4>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
