import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin, DollarSign, Users } from 'lucide-react'
import { AiConcierge } from '@/components/ai-concierge'
import { ExpenseLedger } from '@/components/expense-ledger'
import { DistanceChecker } from '@/components/distance-checker'
import { RevealUp } from '@/components/reveal-up'

export default async function TripDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch trip details and members
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

  // Fetch expenses for this trip
  const { data: expenses } = await supabase
    .from('expenses')
    .select('*')
    .eq('trip_id', id)
    .order('date', { ascending: false })


  // Fetch settlements
  const { data: settlements } = await supabase
    .from('settlements')
    .select('*')
    .eq('trip_id', id)

  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/trips/${id}/invite`

  return (
    <div className="min-h-screen pt-[100px] px-8 md:px-16 bg-background pb-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <RevealUp>
          <div className="mb-16">
            <Link href="/dashboard" className="text-[10px] uppercase tracking-[0.2em] font-black text-[#3B9ECC] hover:text-[#262626] transition-colors mb-8 inline-block">
              ← Back to Dashboard
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-4 gap-8">
              <div>
                <div className="text-[10px] text-[#3B9ECC] font-black uppercase tracking-[0.2em] mb-4 flex items-center">
                  <MapPin className="w-3 h-3 mr-2" />
                  {trip.destination}
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#262626]">
                  {trip.title}
                </h1>
              </div>
              <Link 
                href={`/trips/${id}/itinerary`}
                className="bg-[#262626] text-white rounded-full px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#3B9ECC] hover:text-[#262626] transition-all flex items-center gap-2 shadow-xl"
              >
                <Calendar className="w-4 h-4" />
                Master Itinerary
              </Link>
            </div>
          </div>
        </RevealUp>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Quick Stats */}
            <RevealUp delay={200}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-[#262626]/10 shadow-sm bg-[#f5f0eb] border-0 rounded-[16px]">
                  <CardContent className="p-6">
                    <Calendar className="w-6 h-6 text-[#3B9ECC] mb-4" />
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/50 mb-1">Start Date</div>
                    <div className="text-xl font-bold text-[#262626]">{new Date(trip.start_date).toLocaleDateString()}</div>
                  </CardContent>
                </Card>
                <Card className="border-[#262626]/10 shadow-sm bg-[#f5f0eb] border-0 rounded-[16px]">
                  <CardContent className="p-6">
                    <Calendar className="w-6 h-6 text-[#3B9ECC] mb-4" />
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/50 mb-1">End Date</div>
                    <div className="text-xl font-bold text-[#262626]">{new Date(trip.end_date).toLocaleDateString()}</div>
                  </CardContent>
                </Card>
                <Card className="border-[#262626]/10 shadow-sm bg-[#f5f0eb] border-0 rounded-[16px]">
                  <CardContent className="p-6">
                    <DollarSign className="w-6 h-6 text-[#3B9ECC] mb-4" />
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/50 mb-1">Per Person</div>
                    <div className="text-xl font-bold text-[#262626]">₹{trip.budget_per_person}</div>
                  </CardContent>
                </Card>
                <Card className="border-[#262626]/10 shadow-sm bg-[#f5f0eb] border-0 rounded-[16px]">
                  <CardContent className="p-6">
                    <Users className="w-6 h-6 text-[#3B9ECC] mb-4" />
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/50 mb-1">Members</div>
                    <div className="text-xl font-bold text-[#262626]">{trip.trip_members?.length || 0}</div>
                  </CardContent>
                </Card>
              </div>
            </RevealUp>

            {/* AI Assistant */}
            <AiConcierge tripContext={{
              destination: trip.destination,
              start_date: trip.start_date,
              end_date: trip.end_date,
              budget_per_person: trip.budget_per_person,
              member_count: trip.trip_members?.length || 1,
              expenses: expenses || [],
              members: trip.trip_members
            }} />

            {/* Distance Checker (Phase 5+) */}
            <DistanceChecker />

            {/* Expense Ledger (Phase 4) */}
            <ExpenseLedger 
              tripId={id}
              expenses={expenses || []}
              settlements={settlements || []}
              members={trip.trip_members}
              currentUserId={user?.id}
            />

          </div>

          {/* Sidebar (Right) */}
          <RevealUp delay={400} className="space-y-8">
            <Card className="border-[#262626]/10 shadow-xl shadow-[#262626]/5 rounded-[24px]">
              <CardContent className="p-8">
                <h3 className="text-xl font-black uppercase tracking-tighter text-[#262626] mb-6">Explorers</h3>
                
                <div className="space-y-4 mb-8">
                  {trip.trip_members?.map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-background rounded-xl border border-[#262626]/5">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#f5f0eb] flex items-center justify-center text-[10px] font-black text-[#3B9ECC]">
                          {member.user_id === user?.id ? 'YOU' : member.role === 'admin' ? 'A' : 'M'}
                        </div>
                        <span className="ml-3 text-sm font-bold text-[#262626]">
                          {member.user_id === user?.id ? 'You (Guest)' : `User ${member.user_id.substring(0,6)}`}
                        </span>
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
          </RevealUp>
        </div>

      </div>
    </div>
  )
}
