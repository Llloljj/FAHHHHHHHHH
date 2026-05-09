'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { updateBookingStatus } from '@/app/actions/booking-actions'

interface BookingCardProps {
  booking: {
    id: string
    start_date: string
    end_date: string
    total_price: number
    status: string
    listings: {
      title: string
      location: string
      images: string[]
    }
  }
  isHost?: boolean
}

export function BookingCard({ booking, isHost }: BookingCardProps) {
  const [loading, setLoading] = useState(false)
  const statusConfig: any = {
    pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Pending' },
    confirmed: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Confirmed' },
    cancelled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Cancelled' },
  }

  const config = statusConfig[booking.status] || statusConfig.pending
  const Icon = config.icon

  return (
    <Card className="border-0 bg-white rounded-[32px] overflow-hidden shadow-xl shadow-[#262626]/5 group hover:shadow-2xl transition-super">
      <CardContent className="p-0 flex flex-col md:flex-row">
        <div className="w-full md:w-[200px] h-[150px] md:h-auto relative overflow-hidden">
          <img 
            src={booking.listings.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'} 
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
            alt={booking.listings.title}
          />
          <div className={`absolute top-4 left-4 ${config.bg} ${config.color} backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-2`}>
            <Icon className="w-3 h-3" />
            {config.label}
          </div>
        </div>
        
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#3B9ECC] mb-2">
              <MapPin className="w-3 h-3 mr-1" />
              {booking.listings.location}
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-[#262626] mb-4">
              {booking.listings.title}
            </h3>
            
            <div className="flex gap-6">
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-[#262626]/40 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Check-in
                </span>
                <span className="text-sm font-bold text-[#262626]">{format(new Date(booking.start_date), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-[#262626]/40 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Check-out
                </span>
                <span className="text-sm font-bold text-[#262626]">{format(new Date(booking.end_date), 'MMM dd, yyyy')}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#262626]/5 flex justify-between items-end">
            <div>
              <span className="text-[8px] font-black uppercase tracking-widest text-[#262626]/40 block mb-1">Total Paid</span>
              <span className="text-2xl font-black text-[#262626]">₹{booking.total_price}</span>
            </div>
            {isHost && booking.status === 'pending' && (
              <div className="flex gap-2">
                <button 
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true)
                    await updateBookingStatus(booking.id, 'confirmed')
                    setLoading(false)
                  }}
                  className="px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.15em] bg-[#262626] text-white hover:bg-[#3B9ECC] hover:text-[#262626] transition-all disabled:opacity-50"
                >
                  {loading ? '...' : 'Approve'}
                </button>
                <button 
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true)
                    await updateBookingStatus(booking.id, 'cancelled')
                    setLoading(false)
                  }}
                  className="px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border border-[#262626]/10 hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-50"
                >
                  {loading ? '...' : 'Reject'}
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
