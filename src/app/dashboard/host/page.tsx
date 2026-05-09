import { createClient } from '@/lib/supabase/server'
import { BookingCard } from '@/components/booking-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusCircle, Wallet, Home, CalendarCheck } from 'lucide-react'
import Link from 'next/link'

export default async function HostDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch Host Profile
  const { data: profile } = await supabase
    .from('host_profiles')
    .select('*')
    .eq('user_id', user?.id)
    .single()

  // Fetch Listings
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('host_id', user?.id)

  // Fetch Bookings for Host's Listings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, listings(*)')
    .in('listing_id', listings?.map(l => l.id) || [])
    .order('created_at', { ascending: false })

  const totalEarnings = bookings?.reduce((acc, curr) => acc + curr.total_price, 0) || 0

  if (!profile) {
    return (
      <div className="min-h-screen pt-[100px] px-8 flex items-center justify-center bg-[#fdf8f3]">
        <div className="max-w-md w-full text-center space-y-8 reveal-up-start [animation:reveal-up-active_1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          <Home className="w-16 h-16 text-[#e4a4bd] mx-auto opacity-20" />
          <h1 className="text-4xl font-black uppercase tracking-tighter text-[#262626]">Host Profile Required</h1>
          <p className="text-[#262626]/60 font-medium">
            You need to complete your host registration and KYC to access this dashboard.
          </p>
          <Link href="/marketplace/become-host" className="inline-block bg-[#262626] text-white rounded-full px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#e4a4bd] hover:text-[#262626] transition-super">
            Start Hosting
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-[100px] px-8 md:px-16 bg-[#fdf8f3] pb-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="reveal-up-start [animation:reveal-up-active_1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <div className="flex items-center gap-3 text-[#e4a4bd] mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-[#e4a4bd]/10 px-3 py-1 rounded-full">Verified Host</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-[#262626] leading-[0.85]">
              HOST <br /> <span className="text-[#e4a4bd]">CENTRAL</span>
            </h1>
          </div>
          <Link href="/marketplace/new" className="bg-[#262626] text-white rounded-full px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#e4a4bd] hover:text-[#262626] transition-super flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            New Listing
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 reveal-up-start [animation:reveal-up-active_1s_cubic-bezier(0.16,1,0.3,1)_0.2s_forwards]">
          <Card className="bg-[#262626] text-white border-0 rounded-[32px] overflow-hidden">
            <CardContent className="p-8">
              <Wallet className="w-8 h-8 text-[#e4a4bd] mb-6" />
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Total Earnings</div>
              <div className="text-4xl font-black tracking-tighter">₹{totalEarnings.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-xl shadow-[#262626]/5 rounded-[32px] overflow-hidden">
            <CardContent className="p-8">
              <Home className="w-8 h-8 text-[#e4a4bd] mb-6" />
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/40 mb-1">Active Listings</div>
              <div className="text-4xl font-black tracking-tighter text-[#262626]">{listings?.length || 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-xl shadow-[#262626]/5 rounded-[32px] overflow-hidden">
            <CardContent className="p-8">
              <CalendarCheck className="w-8 h-8 text-[#e4a4bd] mb-6" />
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/40 mb-1">Total Bookings</div>
              <div className="text-4xl font-black tracking-tighter text-[#262626]">{bookings?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <div className="space-y-8 reveal-up-start [animation:reveal-up-active_1s_cubic-bezier(0.16,1,0.3,1)_0.4s_forwards]">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[#262626]">Recent Activity</h2>
          {(!bookings || bookings.length === 0) ? (
            <div className="p-12 bg-white rounded-[32px] border border-[#262626]/5 text-center">
              <p className="text-[#262626]/40 font-medium">No bookings received yet for your listings.</p>
            </div>
          ) : (
            bookings.map((booking: any) => (
              <BookingCard key={booking.id} booking={booking} isHost={true} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
