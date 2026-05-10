import { createClient } from '@/lib/supabase/server'
import { ItineraryTimeline } from '@/components/itinerary-timeline'
import { EmptyState } from '@/components/empty-state'
import { addItineraryActivity } from '@/app/actions/itinerary-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Plus, MapPin, Calendar, Clock, Star } from 'lucide-react'
import { RevealUp } from '@/components/reveal-up'

export default async function TripItineraryPage({ params }: { params: { id: string } }) {
  const { id } = params
  const supabase = await createClient()

  // Fetch Trip Details
  const { data: trip } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .single()

  // Fetch Manual Activities
  const { data: activities } = await supabase
    .from('itinerary_activities')
    .select('*')
    .eq('trip_id', id)

  // Fetch Marketplace Bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, listings(*)')
    .eq('trip_id', id)
    .eq('status', 'confirmed')

  const allItems = [
    ...(activities || []),
    ...(bookings || [])
  ]

  return (
    <div className="min-h-screen pt-[100px] px-8 md:px-16 bg-[#fdf8f3] pb-24">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <RevealUp>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-[#262626] leading-[0.85]">
              MASTER <br /> <span className="accent-gradient-text">ITINERARY</span>
            </h1>
            <p className="text-xl text-[#262626]/60 mt-6 font-medium max-w-lg uppercase tracking-tight">
              {trip?.destination} | {new Date(trip?.start_date).toLocaleDateString()} - {new Date(trip?.end_date).toLocaleDateString()}
            </p>
          </RevealUp>

          <Dialog>
            <DialogTrigger>
              <Button className="bg-[#262626] text-white rounded-full px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:accent-gradient hover:text-[#262626] transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-0 rounded-[32px] p-10 max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-[#262626] mb-8">
                  New Activity
                </DialogTitle>
              </DialogHeader>
              <form action={addItineraryActivity} className="space-y-6">
                <input type="hidden" name="trip_id" value={id} />
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/40">Title</label>
                  <Input name="title" placeholder="Dinner at Taj Palace" required className="rounded-full px-6 py-6 border-[#262626]/10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/40">Date & Time</label>
                    <Input name="activity_date" type="datetime-local" required className="rounded-full px-6 py-6 border-[#262626]/10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/40">Type</label>
                    <select name="type" className="w-full rounded-full px-6 py-3 border border-[#262626]/10 bg-transparent text-sm font-bold">
                      <option value="event">Event</option>
                      <option value="meal">Meal</option>
                      <option value="transport">Transport</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/40">Location</label>
                  <Input name="location" placeholder="Colaba, Mumbai" className="rounded-full px-6 py-6 border-[#262626]/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/40">Notes</label>
                  <Textarea name="description" placeholder="Dress code: Formal..." className="rounded-[24px] p-6 border-[#262626]/10" />
                </div>
                <Button type="submit" className="w-full bg-[#262626] text-white rounded-full py-8 text-[10px] font-black uppercase tracking-[0.2em] hover:accent-gradient hover:text-[#262626] transition-all">
                  Save Activity
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Timeline */}
        <RevealUp delay={300}>
          {allItems.length === 0 ? (
            <EmptyState 
              title="Empty Timeline"
              message="Start adding activities or book through the marketplace to populate your trip itinerary."
              actionLabel="Explore Marketplace"
              actionHref="/marketplace"
            />
          ) : (
            <ItineraryTimeline tripId={id} items={allItems} />
          )}
        </RevealUp>

      </div>
    </div>
  )
}
