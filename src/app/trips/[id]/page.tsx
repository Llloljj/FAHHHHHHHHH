import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin, DollarSign, Users, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AiConcierge } from '@/components/ai-concierge'

export default async function TripDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch trip details and verify membership (RLS handles this automatically, but we select members too)
  const { data: trip, error } = await supabase
    .from('trips')
    .select(`
      *,
      trip_members (
        id, role, joined_at,
        user_id
      )
    `)
    .eq('id', id)
    .single()

  if (error || !trip) {
    return (
      <div className="min-h-screen pt-[100px] flex items-center justify-center">
        <p className="text-xl">Trip not found or access denied.</p>
      </div>
    )
  }

  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/trips/${id}/invite`

  return (
    <div className="min-h-screen pt-[100px] px-8 md:px-16 bg-background pb-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-16 reveal-up-start [animation:reveal-up-active_1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          <Link href="/dashboard" className="text-[10px] uppercase tracking-[0.2em] font-black text-[#e4a4bd] hover:text-[#262626] transition-colors mb-8 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-4">
            <div>
              <div className="text-[10px] text-[#e4a4bd] font-black uppercase tracking-[0.2em] mb-4 flex items-center">
                <MapPin className="w-3 h-3 mr-2" />
                {trip.destination}
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#262626]">
                {trip.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 reveal-up-start [animation:reveal-up-active_1s_cubic-bezier(0.16,1,0.3,1)_0.2s_forwards]">
              <Card className="border-[#262626]/10 shadow-sm bg-[#f5f0eb] border-0 rounded-[16px]">
                <CardContent className="p-6">
                  <Calendar className="w-6 h-6 text-[#e4a4bd] mb-4" />
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/50 mb-1">Start Date</div>
                  <div className="text-xl font-bold text-[#262626]">{new Date(trip.start_date).toLocaleDateString()}</div>
                </CardContent>
              </Card>
              <Card className="border-[#262626]/10 shadow-sm bg-[#f5f0eb] border-0 rounded-[16px]">
                <CardContent className="p-6">
                  <Calendar className="w-6 h-6 text-[#e4a4bd] mb-4" />
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/50 mb-1">End Date</div>
                  <div className="text-xl font-bold text-[#262626]">{new Date(trip.end_date).toLocaleDateString()}</div>
                </CardContent>
              </Card>
              <Card className="border-[#262626]/10 shadow-sm bg-[#f5f0eb] border-0 rounded-[16px]">
                <CardContent className="p-6">
                  <DollarSign className="w-6 h-6 text-[#e4a4bd] mb-4" />
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/50 mb-1">Per Person</div>
                  <div className="text-xl font-bold text-[#262626]">${trip.budget_per_person}</div>
                </CardContent>
              </Card>
              <Card className="border-[#262626]/10 shadow-sm bg-[#f5f0eb] border-0 rounded-[16px]">
                <CardContent className="p-6">
                  <Users className="w-6 h-6 text-[#e4a4bd] mb-4" />
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/50 mb-1">Members</div>
                  <div className="text-xl font-bold text-[#262626]">{trip.trip_members?.length || 0}</div>
                </CardContent>
              </Card>
            </div>

            {/* AI Assistant */}
            <AiConcierge tripContext={{
              destination: trip.destination,
              start_date: trip.start_date,
              end_date: trip.end_date,
              budget_per_person: trip.budget_per_person,
              member_count: trip.trip_members?.length || 1
            }} />

          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-8 reveal-up-start [animation:reveal-up-active_1s_cubic-bezier(0.16,1,0.3,1)_0.4s_forwards]">
            
            {/* Members Card */}
            <Card className="border-[#262626]/10 shadow-xl shadow-[#262626]/5 rounded-[24px]">
              <CardContent className="p-8">
                <h3 className="text-xl font-black uppercase tracking-tighter text-[#262626] mb-6">Explorers</h3>
                
                <div className="space-y-4 mb-8">
                  {trip.trip_members?.map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-background rounded-xl border border-[#262626]/5">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#f5f0eb] flex items-center justify-center text-[10px] font-black text-[#e4a4bd]">
                          {member.role === 'admin' ? 'A' : 'M'}
                        </div>
                        <span className="ml-3 text-sm font-bold text-[#262626]">User {member.user_id.substring(0,6)}</span>
                      </div>
                      <span className="text-[9px] uppercase tracking-widest text-[#262626]/40 font-black">{member.role}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-[#262626]/10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/60 mb-4">Invite Link</p>
                  <div className="flex items-center gap-2">
                    <input 
                      readOnly 
                      value={inviteUrl}
                      className="flex-1 bg-[#f5f0eb] border-0 rounded-full text-xs p-3 text-[#262626] outline-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  )
}
