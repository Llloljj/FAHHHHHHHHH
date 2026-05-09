import { TransportSearch } from '@/components/transport-search'
import { Plane, Train, Bus, Globe2 } from 'lucide-react'
import { RevealUp } from '@/components/reveal-up'

export default function TravelHubPage() {
  return (
    <div className="min-h-screen pt-[100px] px-8 md:px-16 bg-[#262626] text-white pb-24 selection:bg-[#3B9ECC] selection:text-[#262626]">
      <div className="max-w-6xl mx-auto">

        {/* Hero Section */}
        <RevealUp className="mb-24">
          <div className="flex items-center gap-4 text-[#3B9ECC] mb-8">
            <Globe2 className="w-8 h-8 animate-pulse" />
            <span className="text-[12px] font-black uppercase tracking-[0.4em]">Global Transport Hub</span>
          </div>
          <h1 className="text-7xl md:text-[120px] font-black uppercase tracking-tighter leading-[0.8] mb-8">
            BEYOND <br /> <span className="text-transparent border-b-4 border-[#3B9ECC] [-webkit-text-stroke:1px_#3B9ECC]">BORDERS</span>
          </h1>
          <p className="text-2xl text-white/60 font-medium max-w-2xl leading-relaxed">
            BANJARE connects you to every corner of the world. Search and book flights, trains, and buses with our curated global network.
          </p>
        </RevealUp>

        {/* Unified Search Engine */}
        <RevealUp delay={300} className="mb-32">
          <TransportSearch />
        </RevealUp>

        {/* Quick Links / Partners */}
        <RevealUp delay={600} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group p-8 rounded-[40px] bg-white/5 border border-white/10 hover:bg-[#3B9ECC]/10 hover:border-[#3B9ECC]/20 transition-super">
            <Plane className="w-10 h-10 text-[#3B9ECC] mb-6" />
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Elite Airways</h3>
            <p className="text-sm text-white/40 leading-relaxed font-medium">
              Access premium lounge access and business class upgrades with our partnered airlines.
            </p>
          </div>
          <div className="group p-8 rounded-[40px] bg-white/5 border border-white/10 hover:bg-[#3B9ECC]/10 hover:border-[#3B9ECC]/20 transition-super">
            <Train className="w-10 h-10 text-[#3B9ECC] mb-6" />
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Rail Connect</h3>
            <p className="text-sm text-white/40 leading-relaxed font-medium">
              Direct IRCTC integration for 1st Class AC and Vande Bharat express bookings.
            </p>
          </div>
          <div className="group p-8 rounded-[40px] bg-white/5 border border-white/10 hover:bg-[#3B9ECC]/10 hover:border-[#3B9ECC]/20 transition-super">
            <Bus className="w-10 h-10 text-[#3B9ECC] mb-6" />
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Intercity Elite</h3>
            <p className="text-sm text-white/40 leading-relaxed font-medium">
              Luxury sleeper buses and private intercity charters at your fingertips.
            </p>
          </div>
        </RevealUp>

      </div>
    </div>
  )
}
