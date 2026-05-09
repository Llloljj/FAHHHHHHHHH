import { createClient } from '@/lib/supabase/server'
import { BookingCard } from '@/components/booking-card'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export default async function GuestBookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, listings(*)')
    .eq('guest_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen pt-[100px] px-8 md:px-16 bg-[#fdf8f3] pb-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="reveal-up-start [animation:reveal-up-active_1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-[#262626] leading-[0.85]">
              MY <br /> <span className="accent-gradient-text">BOOKINGS</span>
            </h1>
            <p className="text-xl text-[#262626]/60 mt-6 font-medium max-w-lg">
              Manage your upcoming trips, rentals, and expert guide reservations.
            </p>
          </div>
          <Link href="/marketplace" className="bg-[#262626] text-white rounded-full px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:accent-gradient hover:text-[#262626] transition-super flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Explore Marketplace
          </Link>
        </div>

        <div className="space-y-8 reveal-up-start [animation:reveal-up-active_1s_cubic-bezier(0.16,1,0.3,1)_0.3s_forwards]">
          {(!bookings || bookings.length === 0) ? (
            <div className="text-center py-24 bg-white rounded-[40px] border border-[#262626]/5 shadow-xl shadow-[#262626]/5">
              <ShoppingBag className="w-16 h-16 text-[#262626]/10 mx-auto mb-6" />
              <h2 className="text-2xl font-black uppercase tracking-tight text-[#262626]">No Bookings Yet</h2>
              <p className="text-[#262626]/40 font-medium mt-2 mb-8">Start your journey by booking a luxury home or vehicle.</p>
              <Link href="/marketplace" className="text-[10px] font-black uppercase tracking-widest accent-gradient-text hover:text-[#262626] transition-colors">
                Browse Listings →
              </Link>
            </div>
          ) : (
            bookings.map((booking: any) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
