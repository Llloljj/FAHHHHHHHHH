'use client'

import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface SuccessStateProps {
  title: string
  message: string
  actionLabel: string
  actionHref: string
}

export function SuccessState({ title, message, actionLabel, actionHref }: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center reveal-up-start [animation:reveal-up-active_1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mb-8 neon-border">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
      </div>
      <h2 className="text-5xl font-black uppercase tracking-tighter text-[#262626] mb-4">
        {title}
      </h2>
      <p className="text-lg text-[#262626]/60 font-medium max-w-md mb-12">
        {message}
      </p>
      <Link href={actionHref}>
        <Button className="bg-[#262626] text-white rounded-full px-12 py-8 text-[12px] font-black uppercase tracking-[0.3em] hover:bg-[#3B9ECC] hover:text-[#262626] transition-super group">
          {actionLabel}
          <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />
        </Button>
      </Link>
    </div>
  )
}
