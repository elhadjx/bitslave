'use client'

import { useState, useEffect } from 'react'
import { GlassCard } from '@/components/dashboard/glass-card'
import { Zap, Loader2 } from 'lucide-react'

const defaultSkills = [
  { id: 'emailProcessing', name: 'Email Processing', category: 'Communication', enabled: true },
  { id: 'scheduleManagement', name: 'Schedule Management', category: 'Productivity', enabled: true },
  { id: 'dataAnalysis', name: 'Data Analysis', category: 'Analytics', enabled: false },
  { id: 'reportGeneration', name: 'Report Generation', category: 'Documents', enabled: true },
  { id: 'taskAutomation', name: 'Task Automation', category: 'Workflow', enabled: true },
  { id: 'customerSupport', name: 'Customer Support', category: 'Support', enabled: false },
]

export default function SkillsPage() {
  const [skills, setSkills] = useState(defaultSkills)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/api/skills', {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    })
      .then(res => res.json())
      .then(data => {
        if (data.skills) {
          setSkills(prev => prev.map(s => ({
            ...s,
            enabled: data.skills[s.id] ?? s.enabled
          })))
        }
      })
      .catch(err => console.error('Failed to fetch skills', err))
      .finally(() => setIsLoading(false))
  }, [])

  const handleToggle = async (id: string, currentEnabled: boolean) => {
    const newEnabled = !currentEnabled;
    
    // Optimistic UI update
    setSkills(prev => prev.map(s => s.id === id ? { ...s, enabled: newEnabled } : s))

    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/api/skills', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ skills: { [id]: newEnabled } })
      })
    } catch (err) {
      console.error('Failed to update skill', err)
      // Revert on error
      setSkills(prev => prev.map(s => s.id === id ? { ...s, enabled: currentEnabled } : s))
    }
  }
  return (
    <div className="p-4 sm:p-8 space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Skill Marketplace</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Browse and enable skills for your AI agent</p>
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {skills.map((skill, idx) => (
          <GlassCard key={idx} className="p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[oklch(0.70_0.25_142.5)]/10 text-accent">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{skill.name}</h3>
                  <p className="text-xs text-muted-foreground">{skill.category}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={skill.enabled}
                onChange={() => handleToggle(skill.id, skill.enabled)}
                disabled={isLoading}
                className="w-4 h-4 rounded border-border bg-input"
              />
            </div>
            <p className="text-sm text-muted-foreground flex-1">
              Enable this skill to add functionality to your AI agent.
            </p>
            <button className="mt-4 text-sm text-accent hover:text-accent/80 transition-colors">
              View Details →
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
