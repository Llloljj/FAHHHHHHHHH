import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { RevealUp } from '@/components/reveal-up'
import { Search, MapPin, Star, Filter, PlusCircle } from 'lucide-react'
import { BookingModal } from '@/components/booking-modal'

const MOCK_LISTINGS = [
  {
    id: 'mock-1',
    service_type: 'food',
    full_name: "Mama's Nagpuri Saoji",
    details: {
      city: 'Nagpur',
      price: 150,
      spice_level: 'high',
      food_type: 'home',
      menu_details: 'Authentic Saoji Thali (Chicken/Mutton/Veg)',
      image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500' // Fallback realistic
    }
  },
  {
    id: 'mock-2',
    service_type: 'food',
    full_name: "Nagpur Tarri Poha Center",
    details: {
      city: 'Nagpur',
      price: 50,
      spice_level: 'medium',
      food_type: 'cloud_kitchen',
      menu_details: 'Famous Tarri Poha with Jalebi',
      image_url: 'https://thelivenagpur.com/wp-content/uploads/2023/02/WhatsApp-Image-2023-02-22-at-12.41.24-PM-1170x1170.jpeg'
    }
  },
  {
    id: 'mock-3',
    service_type: 'food',
    full_name: "Vidarbha Special Thali",
    details: {
      city: 'Nagpur',
      price: 120,
      spice_level: 'medium',
      food_type: 'hotel',
      menu_details: 'Zunka Bhakar with Thecha',
      image_url: 'https://images.unsplash.com/photo-1585934443912-2905ef77023c?w=500' // Fallback realistic
    }
  },
  {
    id: 'mock-4',
    service_type: 'food',
    full_name: "Nagpur Biryani House",
    details: {
      city: 'Nagpur',
      price: 200,
      spice_level: 'high',
      food_type: 'hotel',
      menu_details: 'Spicy Matka Biryani',
      image_url: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb893a?w=500' // Fallback realistic
    }
  },
  {
    id: 'mock-5',
    service_type: 'home',
    full_name: "Cozy Student Homestay",
    details: {
      city: 'Nagpur',
      price: 500,
      size: '1room',
      washrooms: 1,
      facilities: ['fan', 'wi-fi'],
      image_url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=500' // Fallback realistic
    }
  },
  {
    id: 'mock-5b',
    service_type: 'home',
    full_name: "Luxury 2BHK Apartment",
    details: {
      city: 'Nagpur',
      price: 2000,
      size: '2bhk',
      washrooms: 2,
      facilities: ['ac', 'wi-fi', 'parking'],
      image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500' // Fallback realistic
    }
  },
  {
    id: 'mock-6',
    service_type: 'guide',
    full_name: "Rajesh Kumar",
    details: {
      city: 'Nagpur',
      guide_rate: 800,
      experience: 'expert',
      area_description: 'Expert in Deekshabhoomi, Sitabuldi Fort, and local lakes.',
      can_make_plan: 'yes',
      image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500' // Fallback realistic
    }
  },
  {
    id: 'mock-7',
    service_type: 'guide',
    full_name: "Amit Sharma",
    details: {
      city: 'Nagpur',
      guide_rate: 1000,
      experience: 'expert',
      area_description: 'Wildlife expert for Pench Tiger Reserve and Umred Karhandla.',
      can_make_plan: 'yes',
      image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500' // Fallback realistic
    }
  },
  {
    id: 'mock-8',
    service_type: 'vehicle',
    full_name: "Activa 6G",
    details: {
      city: 'Nagpur',
      charges_per_hour: 100,
      vehicle_type: '2_wheeler',
      fuel: 'petrol',
      vehicle_model: 'Honda Activa 6G',
      image_url: 'https://cdn.carhp.in/car/64b489df-0b28-4584-b31f-bf9349401b14.jpg?format=webp&width=800&q=75'
    }
  },
  {
    id: 'mock-9',
    service_type: 'vehicle',
    full_name: "Ather 450X",
    details: {
      city: 'Nagpur',
      charges_per_hour: 150,
      vehicle_type: '2_wheeler',
      fuel: 'electric',
      vehicle_model: 'Ather 450X',
      image_url: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/1/versions/ather-450x-29-kwh-20251735974741344.jpg?q=80'
    }
  },
  {
    id: 'mock-10',
    service_type: 'vehicle',
    full_name: "Tata Nexon EV",
    details: {
      city: 'Nagpur',
      charges_per_hour: 500,
      vehicle_type: '4_wheeler',
      fuel: 'electric',
      vehicle_model: 'Tata Nexon EV',
      image_url: 'https://images.carandbike.com/cms/articles/2024/8/3205535/Tata_Nexon_EV_long_term_21_8997b342d0.jpg'
    }
  }
]

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ 
    city?: string;
    type?: string;
    size?: string;
    foodType?: string;
    vehicleType?: string;
    fuel?: string;
    experience?: string;
    spiceLevel?: string;
  }>
}) {
  const params = await searchParams
  const city = params.city
  const type = params.type
  const size = params.size
  const foodType = params.foodType
  const vehicleType = params.vehicleType
  const fuel = params.fuel
  const experience = params.experience
  const spiceLevel = params.spiceLevel

  const supabase = await createClient()

  // Use Admin Client to bypass RLS for now
  const { createClient: createSupabaseAdmin } = await import('@supabase/supabase-js')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  
  const adminClient = createSupabaseAdmin(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const { data: dbListings } = await adminClient
    .from('service_applications')
    .select('*')

  // Filter listings
  const filterListings = (listings: any[]) => {
    return listings.filter(item => {
      const details = item.details || {}
      
      // City filter
      if (city && !details.city?.toLowerCase().includes(city.toLowerCase())) return false
      
      // Service Type filter
      if (type && item.service_type !== type) return false
      
      // Accommodation filters
      if (size && details.size !== size) return false
      
      // Food filters
      if (foodType && details.food_type !== foodType) return false
      if (spiceLevel && details.spice_level !== spiceLevel) return false
      
      // Vehicle filters
      if (vehicleType && details.vehicle_type !== vehicleType) return false
      if (fuel && details.fuel !== fuel) return false
      
      // Guide filters
      if (experience && details.experience !== experience) return false
      
      return true
    })
  }

  const filteredMocks = filterListings(MOCK_LISTINGS)
  const filteredDb = filterListings(dbListings || [])

  const allListings = [...filteredDb, ...filteredMocks]

  return (
    <div className="min-h-screen pt-[100px] px-8 md:px-16 bg-background pb-24">
      <div className="max-w-7xl mx-auto">

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <RevealUp>
            <Link href="/dashboard" className="text-[10px] uppercase tracking-[0.2em] font-black text-[#3B9ECC] hover:text-[#262626] transition-colors mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-[#262626] leading-[0.85]">
              LUXURY <br /> <span className="accent-gradient-text">MARKETPLACE</span>
            </h1>
            <p className="text-xl text-[#262626]/60 mt-6 font-medium max-w-lg">
              Find verified homes, vehicles, and expert local guides for your trip.
            </p>
          </RevealUp>
          <RevealUp delay={200}>
            <Link href="/marketplace/new" className="bg-[#262626] text-white rounded-full px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:accent-gradient hover:text-[#262626] transition-colors flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              List Your Service
            </Link>
          </RevealUp>
        </div>

        {/* Search Bar */}
        <RevealUp delay={200}>
          <div className="mb-12">
            <form className="relative max-w-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#262626]/40 w-5 h-5" />
              <Input 
                name="city" 
                placeholder="Search by city (e.g., Nagpur)..." 
                defaultValue={city || ''}
                className="pl-14 pr-6 py-8 rounded-full border-[#262626]/10 shadow-xl shadow-[#262626]/5 focus-visible:ring-[#3B9ECC] text-lg"
              />
            </form>
          </div>
        </RevealUp>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="col-span-1 space-y-6 bg-white p-6 rounded-[24px] border border-[#262626]/5 h-fit">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-[#3B9ECC]" />
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#262626]">Filters</h2>
            </div>

            {/* Service Type */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/60">Service Type</label>
              <div className="flex flex-col gap-2">
                {[
                  { value: '', label: 'All Services' },
                  { value: 'home', label: 'Accommodation' },
                  { value: 'food', label: 'Local Food' },
                  { value: 'vehicle', label: 'Vehicles' },
                  { value: 'guide', label: 'Tour Guides' }
                ].map((opt) => (
                  <Link 
                    key={opt.value}
                    href={{ query: { ...params, type: opt.value || undefined } }}
                    className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${type === opt.value || (!type && !opt.value) ? 'bg-[#3B9ECC] text-[#262626]' : 'bg-[#f5f0eb] text-[#262626]/70 hover:bg-[#262626]/5'}`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Sub-filters for Home */}
            {type === 'home' && (
              <div className="space-y-2 border-t border-[#262626]/5 pt-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/60">Home Size</label>
                <div className="flex flex-col gap-2">
                  {[
                    { value: '', label: 'Any Size' },
                    { value: '1room', label: '1 Room' },
                    { value: '1bhk', label: '1 BHK' },
                    { value: '2bhk', label: '2 BHK' },
                    { value: '3bhk', label: '3 BHK' }
                  ].map((opt) => (
                    <Link 
                      key={opt.value}
                      href={{ query: { ...params, size: opt.value || undefined } }}
                      className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${size === opt.value || (!size && !opt.value) ? 'bg-[#262626] text-white' : 'bg-[#f5f0eb] text-[#262626]/70 hover:bg-[#262626]/5'}`}
                    >
                      {opt.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-filters for Food */}
            {type === 'food' && (
              <div className="space-y-2 border-t border-[#262626]/5 pt-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/60">Food Source</label>
                <div className="flex flex-col gap-2">
                  {[
                    { value: '', label: 'Any Source' },
                    { value: 'home', label: 'Home Kitchen' },
                    { value: 'hotel', label: 'Restaurant / Hotel' },
                    { value: 'cloud_kitchen', label: 'Cloud Kitchen' }
                  ].map((opt) => (
                    <Link 
                      key={opt.value}
                      href={{ query: { ...params, foodType: opt.value || undefined } }}
                      className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${foodType === opt.value || (!foodType && !opt.value) ? 'bg-[#262626] text-white' : 'bg-[#f5f0eb] text-[#262626]/70 hover:bg-[#262626]/5'}`}
                    >
                      {opt.label}
                    </Link>
                  ))}
                </div>
                
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/60 mt-4 block">Spice Level</label>
                <div className="flex flex-col gap-2">
                  {[
                    { value: '', label: 'Any Spice' },
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' }
                  ].map((opt) => (
                    <Link 
                      key={opt.value}
                      href={{ query: { ...params, spiceLevel: opt.value || undefined } }}
                      className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${spiceLevel === opt.value || (!spiceLevel && !opt.value) ? 'bg-[#262626] text-white' : 'bg-[#f5f0eb] text-[#262626]/70 hover:bg-[#262626]/5'}`}
                    >
                      {opt.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-filters for Vehicle */}
            {type === 'vehicle' && (
              <div className="space-y-2 border-t border-[#262626]/5 pt-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/60">Vehicle Type</label>
                <div className="flex flex-col gap-2">
                  {[
                    { value: '', label: 'Any Type' },
                    { value: '2_wheeler', label: '2 Wheeler' },
                    { value: '3_wheeler', label: '3 Wheeler' },
                    { value: '4_wheeler', label: '4 Wheeler' }
                  ].map((opt) => (
                    <Link 
                      key={opt.value}
                      href={{ query: { ...params, vehicleType: opt.value || undefined } }}
                      className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${vehicleType === opt.value || (!vehicleType && !opt.value) ? 'bg-[#262626] text-white' : 'bg-[#f5f0eb] text-[#262626]/70 hover:bg-[#262626]/5'}`}
                    >
                      {opt.label}
                    </Link>
                  ))}
                </div>
                
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/60 mt-4 block">Fuel Type</label>
                <div className="flex flex-col gap-2">
                  {[
                    { value: '', label: 'Any Fuel' },
                    { value: 'petrol', label: 'Petrol' },
                    { value: 'electric', label: 'Electric' }
                  ].map((opt) => (
                    <Link 
                      key={opt.value}
                      href={{ query: { ...params, fuel: opt.value || undefined } }}
                      className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${fuel === opt.value || (!fuel && !opt.value) ? 'bg-[#262626] text-white' : 'bg-[#f5f0eb] text-[#262626]/70 hover:bg-[#262626]/5'}`}
                    >
                      {opt.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-filters for Guide */}
            {type === 'guide' && (
              <div className="space-y-2 border-t border-[#262626]/5 pt-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/60">Experience Level</label>
                <div className="flex flex-col gap-2">
                  {[
                    { value: '', label: 'Any Experience' },
                    { value: 'beginner', label: 'Local Native (Beginner)' },
                    { value: 'expert', label: 'Certified Expert' }
                  ].map((opt) => (
                    <Link 
                      key={opt.value}
                      href={{ query: { ...params, experience: opt.value || undefined } }}
                      className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${experience === opt.value || (!experience && !opt.value) ? 'bg-[#262626] text-white' : 'bg-[#f5f0eb] text-[#262626]/70 hover:bg-[#262626]/5'}`}
                    >
                      {opt.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Link 
              href="/marketplace" 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:text-red-700 transition-colors block text-center pt-4"
            >
              Clear All Filters
            </Link>
          </div>

          {/* Listings Grid */}
          <div className="col-span-1 md:col-span-3">
            {allListings.length === 0 ? (
              <div className="text-center py-24 text-[#262626]/50 font-medium text-lg bg-white rounded-[24px] border border-[#262626]/5">
                No services found for these filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {allListings.map((listing: any, index: number) => (
                  <RevealUp key={listing.id} delay={100 + index * 50}>
                    <BookingModal 
                      listing={{
                        id: listing.id,
                        title: listing.full_name,
                        price_per_day: listing.details?.price || listing.details?.charges_per_hour || listing.details?.guide_rate || 0,
                        security_deposit_amount: 0
                      }}
                    >
                      <Card className="group border-0 bg-transparent overflow-hidden cursor-pointer h-full flex flex-col justify-between">
                        <CardContent className="p-0 flex flex-col h-full justify-between">
                          <div>
                            <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden mb-6">
                              <img
                                src={listing.details?.image_url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'}
                                alt={listing.full_name}
                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute top-6 right-6">
                                <span className="bg-white/90 backdrop-blur-md text-[#262626] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full flex items-center gap-2">
                                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> 5.0
                                </span>
                              </div>
                              <div className="absolute bottom-6 left-6 z-20">
                                <span className="bg-white text-[#262626] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-sm">
                                  {listing.service_type}
                                </span>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-[#262626]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            <div className="space-y-3 px-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] accent-gradient-text mb-1">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {listing.details?.city || 'Unknown Location'}
                                  </div>
                                  <h3 className="text-xl font-black uppercase tracking-tighter text-[#262626] group-hover:accent-gradient-text transition-colors text-left">
                                    {listing.full_name}
                                  </h3>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-black text-[#262626]">
                                    ₹{listing.details?.price || listing.details?.charges_per_hour || listing.details?.guide_rate || 'N/A'}
                                  </div>
                                  <div className="text-[9px] font-black uppercase text-[#262626]/40">
                                    per {listing.service_type === 'vehicle' ? 'hr' : listing.service_type === 'food' ? 'meal' : 'day'}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="border-t border-[#262626]/5 pt-3 mt-3 space-y-1 text-xs text-[#262626]/60 text-left">
                                {listing.service_type === 'food' && (
                                  <div>Menu: <span className="font-bold text-[#262626]">{listing.details?.menu_details}</span></div>
                                )}
                                {listing.service_type === 'home' && (
                                  <div>Size: <span className="font-bold text-[#262626] uppercase">{listing.details?.size}</span></div>
                                )}
                                {listing.service_type === 'guide' && (
                                  <div>Exp: <span className="font-bold text-[#262626] capitalize">{listing.details?.experience}</span></div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="px-2 pt-4">
                            <button className="w-full bg-[#262626] text-white rounded-full py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:accent-gradient hover:text-[#262626] transition-super">
                              Book Now
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    </BookingModal>
                  </RevealUp>
                ))}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
