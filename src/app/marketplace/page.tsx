import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Home, 
  Car, 
  UserCheck, 
  MapPin, 
  Star, 
  ShieldCheck, 
  PlusCircle,
  Search
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default async function MarketplacePage() {
  const supabase = await createClient()

  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })

  const categories = [
    { id: 'home', label: 'Homes', icon: Home, color: '#e4a4bd' },
    { id: 'vehicle', label: 'Vehicles', icon: Car, color: '#a4c6e4' },
    { id: 'guide', label: 'Local Guides', icon: UserCheck, color: '#c6e4a4' },
  ]

  return (
    <div className="min-h-screen pt-[100px] px-8 md:px-16 bg-[#fdf8f3] pb-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="reveal-up-start [animation:reveal-up-active_1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-[#262626] leading-[0.85]">
              LUXURY <br /> <span className="text-[#e4a4bd]">MARKETPLACE</span>
            </h1>
            <p className="text-xl text-[#262626]/60 mt-6 font-medium max-w-lg">
              Discover unique homes, private vehicles, and expert local guides verified for the Super Travel community.
            </p>
          </div>
          <div className="flex flex-col items-end gap-4 reveal-up-start [animation:reveal-up-active_1s_cubic-bezier(0.16,1,0.3,1)_0.2s_forwards]">
            <Link href="/marketplace/new" className="bg-[#262626] text-white rounded-full px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#e4a4bd] hover:text-[#262626] transition-super flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              List Your Service
            </Link>
          </div>
        </div>

        {/* Categories & Search */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center reveal-up-start [animation:reveal-up-active_1s_cubic-bezier(0.16,1,0.3,1)_0.3s_forwards]">
          <div className="flex gap-2 p-1 bg-[#f5f0eb] rounded-full overflow-hidden w-full lg:w-auto">
            {categories.map((cat) => (
              <button key={cat.id} className="flex-1 lg:flex-none flex items-center px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all hover:bg-white text-[#262626]">
                <cat.icon className="w-4 h-4 mr-2" style={{ color: cat.color }} />
                {cat.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#262626]/30" />
            <input 
              placeholder="Search destinations, experiences, or hosts..."
              className="w-full bg-[#f5f0eb] border-0 rounded-full py-4 pl-14 pr-6 text-sm font-medium focus:ring-2 focus:ring-[#e4a4bd] transition-all"
            />
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 reveal-up-start [animation:reveal-up-active_1s_cubic-bezier(0.16,1,0.3,1)_0.4s_forwards]">
          {(!listings || listings.length === 0) ? (
             // Mock items for demo
             [
               { type: 'home', title: 'Luxury Villa Overlooking Ganges', price: 12000, loc: 'Rishikesh', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80' },
               { type: 'vehicle', title: 'Vintage Thar Convertible', price: 4500, loc: 'Goa', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80' },
               { type: 'guide', title: 'Curated Old Delhi Food Walk', price: 2500, loc: 'Delhi', img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80' },
               { type: 'home', title: 'Heritage Haveli Suite', price: 8500, loc: 'Jaipur', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80' },
               { type: 'vehicle', title: 'Royal Enfield Interceptor', price: 1800, loc: 'Leh', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80' },
               { type: 'guide', title: 'High Altitude Trek Leader', price: 5000, loc: 'Kasol', img: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=800&q=80' },
             ].map((mock, i) => (
              <Card key={i} className="group border-0 bg-transparent overflow-hidden cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden mb-6">
                    <img 
                      src={mock.img} 
                      alt={mock.title}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 right-6">
                      <span className="bg-white/90 backdrop-blur-md text-[#262626] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-green-500" />
                        Verified
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#262626]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  <div className="space-y-3 px-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#e4a4bd] mb-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {mock.loc}
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tighter text-[#262626] group-hover:text-[#e4a4bd] transition-colors">
                          {mock.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-[#262626]">₹{mock.price}</div>
                        <div className="text-[9px] font-black uppercase text-[#262626]/40">Per Day</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center text-[10px] font-black text-yellow-500">
                        <Star className="w-3 h-3 fill-current mr-1" /> 4.9
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#262626]/30">
                        (24 Reviews)
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
             ))
          ) : (
            listings.map((listing) => (
              // Real listing cards...
              <div key={listing.id}>Real Listing: {listing.title}</div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
