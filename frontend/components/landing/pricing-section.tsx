import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/dashboard/glass-card";
import { Check, ArrowRight } from "lucide-react";

const proFeatures = [
  "Unlimited Telegram bot messages",
  "Host 1 concurrent Openclaw agent",
  "All LLM Providers supported",
  "Access to all Openclaw skills",
  "Live dashboard & logs",
  "Automatic process restarts",
  "99.9% uptime SLA",
];

const enterpriseFeatures = [
  "Whitelabel custom branding",
  "Host 10+ concurrent Openclaw agents",
  "Custom skill development",
  "Dedicated account manager",
  "Priority 24/7 support channel",
  "99.99% uptime SLA",
];

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
            Start Now, scale as you grow. No hidden fees.
          </p>
        </div>

        {/* Pricing cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Pro Plan */}
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
                  <span className="text-5xl font-bold text-accent">$29.99</span>
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
              <div
                className="space-y-3 pt-6 border-t"
                style={{ borderColor: "var(--glass-border)" }}
              >
                {proFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[oklch(0.70_0.25_142.5)] flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Footer note */}
              <div className="text-xs text-muted-foreground text-center pt-4">
                {/* Footer note */}
              </div>
            </div>
          </GlassCard>

          {/* Enterprise Plan (Coming Soon) */}
          <GlassCard className="relative p-8 overflow-hidden opacity-75">
            <div className="absolute top-6 right-6">
              <div className="px-3 py-1 rounded-full bg-muted border border-muted-foreground/30 text-muted-foreground text-xs font-semibold">
                COMING SOON
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-muted-foreground">
                  Master Plan
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-muted-foreground">
                    Custom
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  For enterprises wanting multiple specialized Openclaw agents.
                </p>
              </div>

              <Button
                disabled
                size="lg"
                variant="outline"
                className="w-full border-muted-foreground/30 text-muted-foreground"
              >
                Join Waitlist
              </Button>

              <div
                className="space-y-3 pt-6 border-t"
                style={{ borderColor: "var(--glass-border)" }}
              >
                {enterpriseFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 opacity-60">
                    <Check className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {[
              {
                q: "What is an Openclaw agent?",
                a: "Openclaw is a powerful, autonomous AI framework. An Openclaw agent can browse data, use tools, and maintain context over time, operating independently on Telegram based on your instructions.",
              },
              {
                q: "Do I need my own OpenAI / Anthropic keys?",
                a: "Yes. Bitslave acts as the orchestration and hosting layer. You provide your own LLM API keys via our secure dashboard so you only pay the exact API costs for what you use.",
              },
              {
                q: "What skills can I assign my bot?",
                a: "You can equip your bot with specialized skills like email reading, schedule management, report generation, and data analysis through our Skill Marketplace.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border"
                style={{
                  borderColor: "var(--glass-border)",
                  backgroundColor: "var(--glass-bg)",
                }}
              >
                <h4 className="font-semibold text-foreground mb-2">{faq.q}</h4>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
