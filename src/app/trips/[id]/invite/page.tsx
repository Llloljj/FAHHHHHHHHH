import { createClient } from '@/lib/supabase/server'
import { joinTrip } from '@/app/actions/member-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Calendar, Users } from 'lucide-react'

export default async function InvitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch trip details
  const { data: trip, error } = await supabase
    .from('trips')
    .select('*, trip_members(count)')
    .eq('id', id)
    .single()

  if (error || !trip) {
    return (
      <div className="min-h-screen pt-[100px] flex items-center justify-center">
        <p className="text-xl">Invite link invalid or expired.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-[100px] px-4 flex items-center justify-center bg-background">
      <Card className="max-w-md w-full border-[#262626]/10 shadow-2xl rounded-[24px] overflow-hidden reveal-up-start [animation:reveal-up-active_1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
        <div className="h-48 bg-[#f5f0eb] relative flex items-center justify-center">
          <MapPin className="w-16 h-16 text-[#3B9ECC] opacity-50" />
        </div>
        <CardContent className="p-8 text-center -mt-12 relative z-10">
          <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg border-4 border-white mb-6">
            <span className="text-4xl italic font-black text-[#3B9ECC]">V</span>
          </div>
          
          <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B9ECC] mb-2">You're Invited To</h1>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[#262626] mb-6">{trip.title}</h2>
          
          <div className="flex flex-col items-center space-y-3 mb-8 text-[#262626]/70 font-medium text-sm">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-[#3B9ECC]" /> {trip.destination}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-[#3B9ECC]" /> {new Date(trip.start_date).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-[#3B9ECC]" /> {trip.trip_members[0].count} Explorer(s) already joined
            </div>
          </div>

          <form action={async () => {
            'use server'
            await joinTrip(id)
          }}>
            <Button type="submit" className="w-full bg-[#262626] text-white hover:bg-[#3B9ECC] hover:text-[#262626] transition-super rounded-full py-6 text-[12px] font-black uppercase tracking-[0.2em]">
              Accept Invitation
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
