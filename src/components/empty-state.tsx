'use client'

import { Inbox, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EmptyStateProps {
  icon?: any
  title: string
  message: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({ icon: Icon = Inbox, title, message, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-[40px] border-2 border-dashed border-[#262626]/5">
      <div className="w-20 h-20 rounded-full bg-[#262626]/5 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-[#262626]/20" />
      </div>
      <h3 className="text-2xl font-black uppercase tracking-tight text-[#262626] mb-2">
        {title}
      </h3>
      <p className="text-[#262626]/40 font-medium max-w-xs mb-8">
        {message}
      </p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="outline" className="rounded-full px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] border-[#262626]/10 hover:bg-[#262626] hover:text-white transition-super">
            <Plus className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  )
}
