'use client'

import { useState, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { TextStreamChatTransport } from 'ai'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, Send, Sparkles } from 'lucide-react'

export function JaipurChat() {
  const [input, setInput] = useState('')
  
  const { messages, sendMessage, status } = useChat({
    transport: new TextStreamChatTransport({ api: '/api/chat/jaipur' }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  return (
    <Card className="border-[#262626]/10 shadow-xl shadow-[#262626]/5 rounded-[24px] overflow-hidden flex flex-col h-[500px] border">
      <CardHeader className="bg-[#262626] text-white p-6 pb-4 shrink-0">
        <CardTitle className="text-2xl font-black uppercase tracking-tighter flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="w-6 h-6 mr-3 text-[#e4a4bd]" />
            Assistant
          </div>
          <div className="flex items-center text-[10px] bg-[#e4a4bd]/20 text-[#e4a4bd] px-3 py-1 rounded-full font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 mr-1" />
            Gemini Powered
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-[#FAF7F2]">
        <ScrollArea className="flex-1 p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[280px] text-center text-[#262626]/50">
              <div className="w-16 h-16 mb-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#262626]/5">
                <Bot className="w-8 h-8 text-[#e4a4bd]" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black mb-2 text-[#262626]">
                Ask me anything!
              </p>
              <p className="text-sm font-medium text-[#262626]/60 max-w-xs">
                I know about rentals, guides, destinations, and safety in Jaipur.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m: any) => {
                const text = m.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') ?? ''
                return (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-6 py-4 text-sm font-medium leading-relaxed whitespace-pre-wrap shadow-sm transition-all ${
                      m.role === 'user'
                        ? 'bg-[#262626] text-white rounded-br-none'
                        : 'bg-white text-[#262626] rounded-bl-none border border-[#262626]/5'
                    }`}>
                      {text}
                    </div>
                  </div>
                )
              })}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-[#262626] rounded-2xl rounded-bl-none px-6 py-4 text-sm font-medium border border-[#262626]/5 shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#e4a4bd] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#e4a4bd] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#e4a4bd] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 bg-white border-t border-[#262626]/5 shrink-0">
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim() || isLoading) return;
            sendMessage({ text: input });
            setInput('');
          }} className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask anything...`}
              className="w-full rounded-full bg-[#FAF7F2] border-0 px-6 py-6 pr-14 focus-visible:ring-[#e4a4bd] text-sm font-medium"
            />
            <Button
              type="submit"
              disabled={isLoading || !input?.trim()}
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
