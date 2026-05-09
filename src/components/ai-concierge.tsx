'use client'

import { useState } from 'react'
import { AI_MODES, AiMode } from '@/lib/ai/prompts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, Map, DollarSign, Activity, PieChart, Vote, Send, Sparkles } from 'lucide-react'

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

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function AiConcierge({ tripContext }: { tripContext: TripContext }) {
  const [activeMode, setActiveMode] = useState<AiMode>(AI_MODES.ITINERARY)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const contextParam = encodeURIComponent(JSON.stringify(tripContext))
  const apiUrl = `/api/chat?mode=${activeMode}&ctx=${contextParam}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
        })
      })

      if (!res.ok) throw new Error('API request failed')
      
      const data = await res.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text || 'Sorry, I could not generate a response.'
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat Error:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-[#262626]/10 shadow-2xl shadow-[#262626]/5 rounded-[24px] overflow-hidden flex flex-col h-[600px] border">
      {/* Header */}
      <CardHeader className="bg-[#1A1A1A] text-white p-6 pb-4 shrink-0">
        <CardTitle className="text-2xl font-black uppercase tracking-tighter flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="w-6 h-6 mr-3 text-[#e4a4bd]" />
            AI Concierge
          </div>
          <div className="flex items-center text-[10px] bg-[#e4a4bd]/20 text-[#e4a4bd] px-3 py-1 rounded-full font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 mr-1" />
            Gemini Powered
          </div>
        </CardTitle>
        
        {/* Mode Selector */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
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

      {/* Chat Area */}
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-[#FAF7F2]">
        <ScrollArea className="flex-1 p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[280px] text-center text-[#262626]/50">
              <div className="w-16 h-16 mb-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#262626]/5">
                <Bot className="w-8 h-8 text-[#e4a4bd]" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black mb-2 text-[#262626]">
                Ask the {activeMode} assistant
              </p>
              <p className="text-sm font-medium text-[#262626]/60 max-w-xs">
                Plan your trip to {tripContext.destination} with zero hassle.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-6 py-4 text-sm font-medium leading-relaxed whitespace-pre-wrap shadow-sm transition-all ${
                    m.role === 'user'
                      ? 'bg-[#262626] text-white rounded-br-none'
                      : 'bg-white text-[#262626] rounded-bl-none border border-[#262626]/5'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              
              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-[#262626] rounded-2xl rounded-bl-none px-6 py-4 text-sm font-medium border border-[#262626]/5 shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#e4a4bd] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#e4a4bd] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#e4a4bd] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[#262626]/50 ml-1">AI is thinking...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-[#262626]/5 shrink-0">
          <form onSubmit={handleSubmit} className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message the ${activeMode} assistant...`}
              className="w-full rounded-full bg-[#FAF7F2] border-0 px-6 py-6 pr-14 focus-visible:ring-[#e4a4bd] text-sm font-medium"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 p-0 bg-[#262626] text-[#e4a4bd] hover:bg-[#e4a4bd] hover:text-[#262626] transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
