'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { TextStreamChatTransport } from 'ai'
import { AI_MODES, AiMode } from '@/lib/ai/prompts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, Map, DollarSign, Activity, PieChart, Vote, Send } from 'lucide-react'

const MODE_CONFIG = [
  { id: AI_MODES.ITINERARY, icon: Map, label: 'Itinerary' },
  { id: AI_MODES.BUDGET, icon: DollarSign, label: 'Budget' },
  { id: AI_MODES.ACTIVITY, icon: Activity, label: 'Activity' },
  { id: AI_MODES.LEDGER, icon: PieChart, label: 'Ledger' },
  { id: AI_MODES.VOTING, icon: Vote, label: 'Voting' },
]

type TripContext = {
  destination: string
  start_date: string
  end_date: string
  budget_per_person: number
  member_count: number
}

export function AiConcierge({ tripContext }: { tripContext: TripContext }) {
  const [activeMode, setActiveMode] = useState<AiMode>(AI_MODES.ITINERARY)
  const [input, setInput] = useState('')

  const contextParam = encodeURIComponent(JSON.stringify(tripContext))
  const apiUrl = `/api/chat?mode=${activeMode}&ctx=${contextParam}`

  const { messages, sendMessage, status } = useChat({
    transport: new TextStreamChatTransport({ api: apiUrl }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  return (
    <Card className="border-[#262626]/10 shadow-xl shadow-[#262626]/5 rounded-[24px] overflow-hidden flex flex-col h-[600px]">
      <CardHeader className="bg-[#262626] text-white p-6 pb-4 shrink-0">
        <CardTitle className="text-2xl font-black uppercase tracking-tighter flex items-center">
          <Bot className="w-6 h-6 mr-3 text-[#e4a4bd]" />
          AI Concierge
        </CardTitle>
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {MODE_CONFIG.map((mode) => {
            const Icon = mode.icon
            const isActive = activeMode === mode.id
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id as AiMode)}
                className={`flex items-center px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#e4a4bd] text-[#262626]'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Icon className="w-3 h-3 mr-2" />
                {mode.label}
              </button>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-background">
        <ScrollArea className="flex-1 p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[280px] text-center text-[#262626]/50">
              <Bot className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-black">
                Ask the {activeMode} assistant about {tripContext.destination}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m) => {
                const text = m.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') ?? ''
                return (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-6 py-4 text-sm font-medium leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-[#262626] text-white rounded-br-none'
                        : 'bg-[#f5f0eb] text-[#262626] rounded-bl-none border border-[#262626]/5'
                    }`}>
                      {text}
                    </div>
                  </div>
                )
              })}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#f5f0eb] rounded-2xl rounded-bl-none px-6 py-4 text-[#262626]/50 text-sm font-medium animate-pulse border border-[#262626]/5">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 bg-white border-t border-[#262626]/5 shrink-0">
          <form onSubmit={handleSubmit} className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask the ${activeMode} assistant...`}
              className="w-full rounded-full bg-[#f5f0eb] border-0 px-6 py-6 pr-14 focus-visible:ring-[#e4a4bd] text-sm"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 p-0 bg-[#262626] text-[#e4a4bd] hover:bg-[#e4a4bd] hover:text-[#262626] transition-all"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
