import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Compass, Calendar, Users } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { deleteTrip } from '@/app/actions/trip-actions'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Use Admin Client to bypass RLS
  const { createClient: createSupabaseAdmin } = await import('@supabase/supabase-js')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  
  const adminClient = createSupabaseAdmin(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Fetch trips for this guest/user
  const tripsQuery = user
    ? adminClient
      .from('trips')
      .select(`id, title, destination, start_date, end_date, trip_members!inner(user_id)`)
      .eq('trip_members.user_id', user.id)
      .order('start_date', { ascending: true })
    : { data: [], error: null }

  const { data: trips, error } = await (user ? tripsQuery as any : Promise.resolve({ data: [], error: null }))

  return (
    <div className="min-h-screen pt-[100px] px-8 md:px-16 bg-background pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
          <div>
            <h1 className="text-6xl font-black uppercase tracking-tighter text-[#262626]">
              Your <span className="text-[#3B9ECC]">BANJAREs</span>
            </h1>
            <p className="text-xl text-[#262626]/70 mt-4 font-medium">Manage your upcoming and past group trips.</p>
          </div>
          <Link href="/trips/new" className="mt-8 md:mt-0 bg-[#3B9ECC] text-[#262626] rounded-full px-[32px] py-[16px] text-[10px] uppercase tracking-[0.2em] font-black hover:opacity-80 transition-opacity">
            + New BANJARE
          </Link>
        </div>

        {!trips || trips.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="No trips planned yet"
            message="It's time to start organizing your next great adventure with your favorite group."
            actionLabel="Create your first trip"
            actionHref="/trips/new"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip: any) => (
              <Card key={trip.id} className="h-full hover:-translate-y-2 transition-all duration-500 border-[#262626]/10 rounded-[24px] overflow-hidden group flex flex-col justify-between">
                <Link href={`/trips/${trip.id}`} className="cursor-pointer flex-1">
                  <div className="h-48 bg-[#f5f0eb] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#262626]/5 group-hover:bg-[#3B9ECC]/20 transition-colors z-10" />
                    <div className="absolute bottom-4 left-4 z-20">
                      <span className="bg-white/90 backdrop-blur-sm text-[#262626] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-sm">
                        {trip.destination}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-[#262626] mb-4 group-hover:text-[#3B9ECC] transition-colors">
                      {trip.title}
                    </h3>
                    <div className="flex flex-col space-y-3 text-sm text-[#262626]/70 font-medium">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-3 text-[#3B9ECC]" />
                        {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-3 text-[#3B9ECC]" />
                        {trip.trip_members?.length ?? 1} Explorer(s)
                      </div>
                    </div>
                  </CardContent>
                </Link>
                <div className="p-6 pt-0 flex justify-end">
                  <form action={deleteTrip.bind(null, trip.id)}>
                    <button type="submit" className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:text-red-700 transition-colors">
                      Delete Trip
                    </button>
                  </form>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
