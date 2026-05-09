'use client'

import { format } from 'date-fns'
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Home, 
  Car, 
  UserCheck, 
  Star, 
  Trash2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { deleteItineraryActivity } from '@/app/actions/itinerary-actions'
import { useState } from 'react'

interface ItineraryTimelineProps {
  tripId: string
  items: any[]
}

export function ItineraryTimeline({ tripId, items }: ItineraryTimelineProps) {
  const [loading, setLoading] = useState(false)

  // Sort items by date
  const sortedItems = [...items].sort((a, b) => {
    const dateA = new Date(a.activity_date || a.start_date || a.date).getTime()
    const dateB = new Date(b.activity_date || b.start_date || b.date).getTime()
    return dateA - dateB
  })

  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      await deleteItineraryActivity(id, tripId)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (item: any) => {
    if (item.listings) {
      switch (item.listings.type) {
        case 'home': return <Home className="w-5 h-5" />
        case 'vehicle': return <Car className="w-5 h-5" />
        case 'guide': return <UserCheck className="w-5 h-5" />
      }
    }
    switch (item.type) {
      case 'meal': return <Star className="w-5 h-5 text-yellow-500" />
      case 'transport': return <Car className="w-5 h-5 text-blue-500" />
      default: return <Clock className="w-5 h-5 text-[#3B9ECC]" />
    }
  }

  return (
    <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#3B9ECC]/20 before:to-transparent">
      
      {sortedItems.map((item) => {
        const itemDate = new Date(item.activity_date || item.start_date || item.date)
        const isBooking = !!item.listings

        return (
          <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            
            {/* Dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[#262626] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-super group-hover:scale-125 group-hover:border-[#3B9ECC]">
              {getTypeIcon(item)}
            </div>

            {/* Content */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-[32px] transition-super">
              <Card className={cn(
                "border-0 overflow-hidden rounded-[32px] transition-super group-hover:shadow-2xl",
                isBooking ? "bg-white shadow-xl" : "bg-[#262626] text-white border border-white/5"
              )}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#3B9ECC]">
                      <Calendar className="w-3 h-3" />
                      {format(itemDate, 'MMM dd, yyyy')}
                      <span className="opacity-20 mx-2">|</span>
                      <Clock className="w-3 h-3" />
                      {format(itemDate, 'hh:mm a')}
                    </div>
                    {!isBooking && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(item.id)}
                        disabled={loading}
                        className="h-8 w-8 text-white/20 hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <h3 className={cn(
                    "text-xl font-black uppercase tracking-tighter mb-2",
                    isBooking ? "text-[#262626]" : "text-white"
                  )}>
                    {item.title || item.listings?.title}
                  </h3>
                  
                  {item.location && (
                    <div className="flex items-center gap-2 text-xs font-bold opacity-60 mb-4">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </div>
                  )}

                  {item.description && (
                    <p className="text-sm opacity-40 font-medium leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {isBooking && (
                    <div className="mt-4 pt-4 border-t border-[#262626]/5 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#262626]/40">Status</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
                        {item.status}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}
