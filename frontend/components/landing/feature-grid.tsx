import { GlassCard } from '@/components/dashboard/glass-card'
import { Key, Puzzle, Zap } from 'lucide-react'

const features = [
  {
    icon: Key,
    title: 'Connect Keys',
    description: 'Provide your Telegram Bot Token and LLM API Key (OpenAI, Anthropic, DeepSeek).',
    number: '01',
  },
  {
    icon: Puzzle,
    title: 'Assign Skills',
    description: 'Equip your bot with custom abilities like email processing and data analysis.',
    number: '02',
  },
  {
    icon: Zap,
    title: 'Deploy Instantly',
    description: 'We orchestrate and host the Openclaw bot for you. Live and replying 24/7 on Telegram.',
    number: '03',
  },
]

export function FeatureGrid() {
  return (
    <section className="py-20 bg-gradient-to-b from-background via-[oklch(0.12_0_0)] to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            From Token to <span className="bg-gradient-to-r from-[oklch(0.70_0.25_142.5)] to-[oklch(0.75_0.22_252)] bg-clip-text text-transparent">Live in Minutes</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Deploy your Openclaw autonomous agent online in three simple steps.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="relative group"
              >
                <GlassCard className="h-full p-8 flex flex-col transition-all duration-300 group-hover:scale-105">
                  {/* Number badge */}
                  <div className="absolute top-4 right-4 text-4xl font-bold opacity-10 text-accent group-hover:opacity-20 transition-opacity">
                    {feature.number}
                  </div>

                  {/* Icon */}
                  <div className="mb-6 inline-flex p-3 rounded-lg bg-[oklch(0.70_0.25_142.5)]/10 text-accent group-hover:bg-[oklch(0.70_0.25_142.5)]/20 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="mt-auto pt-4">
                    <div className="inline-flex items-center text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-0 group-hover:translate-x-2">
                      Learn more →
                    </div>
                  </div>
                </GlassCard>
              </div>
            )
          })}
        </div>

        {/* Process flow visualization */}
        <div className="mt-16 hidden md:flex items-center justify-between max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-full border flex items-center justify-center text-accent font-bold" style={{ borderColor: 'var(--glass-border)', backgroundColor: 'var(--glass-bg)' }}>1</div>
          <div className="flex-1 h-1 mx-4" style={{ backgroundImage: 'linear-gradient(to right, var(--glass-border), oklch(0.70 0.25 142.5), var(--glass-border))' }} />
          <div className="w-12 h-12 rounded-full border flex items-center justify-center text-accent font-bold" style={{ borderColor: 'var(--glass-border)', backgroundColor: 'var(--glass-bg)' }}>2</div>
          <div className="flex-1 h-1 mx-4" style={{ backgroundImage: 'linear-gradient(to right, var(--glass-border), oklch(0.70 0.25 142.5), var(--glass-border))' }} />
          <div className="w-12 h-12 rounded-full border flex items-center justify-center text-accent font-bold" style={{ borderColor: 'var(--glass-border)', backgroundColor: 'var(--glass-bg)' }}>3</div>
        </div>
      </div>
    </section>
  )
}
