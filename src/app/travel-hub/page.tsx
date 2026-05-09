import { TransportSearch } from '@/components/transport-search'
import { Plane, Train, Bus, Globe2 } from 'lucide-react'

export default function TravelHubPage() {
  return (
    <div className="min-h-screen pt-[100px] px-8 md:px-16 bg-[#262626] text-white pb-24 selection:bg-[#e4a4bd] selection:text-[#262626]">
      <div className="max-w-6xl mx-auto">
        
        {/* Hero Section */}
        <div className="mb-24 reveal-up-start [animation:reveal-up-active_1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          <div className="flex items-center gap-4 text-[#e4a4bd] mb-8">
            <Globe2 className="w-8 h-8 animate-pulse" />
            <span className="text-[12px] font-black uppercase tracking-[0.4em]">Global Transport Hub</span>
          </div>
          <h1 className="text-7xl md:text-[120px] font-black uppercase tracking-tighter leading-[0.8] mb-8">
            BEYOND <br /> <span className="text-transparent border-b-4 border-[#e4a4bd] [-webkit-text-stroke:1px_#e4a4bd]">BORDERS</span>
          </h1>
          <p className="text-2xl text-white/60 font-medium max-w-2xl leading-relaxed">
            Banjara connects you to every corner of the world. Search and book flights, trains, and buses with our curated global network.
          </p>
        </div>

        {/* Unified Search Engine */}
        <div className="mb-32 reveal-up-start [animation:reveal-up-active_1s_cubic-bezier(0.16,1,0.3,1)_0.3s_forwards]">
          <TransportSearch />
        </div>

        {/* Quick Links / Partners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-up-start [animation:reveal-up-active_1s_cubic-bezier(0.16,1,0.3,1)_0.6s_forwards]">
          <div className="group p-8 rounded-[40px] bg-white/5 border border-white/10 hover:bg-[#e4a4bd]/10 hover:border-[#e4a4bd]/20 transition-super">
            <Plane className="w-10 h-10 text-[#e4a4bd] mb-6" />
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Elite Airways</h3>
            <p className="text-sm text-white/40 leading-relaxed font-medium">
              Access premium lounge access and business class upgrades with our partnered airlines.
            </p>
          </div>
          <div className="group p-8 rounded-[40px] bg-white/5 border border-white/10 hover:bg-[#e4a4bd]/10 hover:border-[#e4a4bd]/20 transition-super">
            <Train className="w-10 h-10 text-[#e4a4bd] mb-6" />
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Rail Connect</h3>
            <p className="text-sm text-white/40 leading-relaxed font-medium">
              Direct IRCTC integration for 1st Class AC and Vande Bharat express bookings.
            </p>
          </div>
          <div className="group p-8 rounded-[40px] bg-white/5 border border-white/10 hover:bg-[#e4a4bd]/10 hover:border-[#e4a4bd]/20 transition-super">
            <Bus className="w-10 h-10 text-[#e4a4bd] mb-6" />
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Intercity Elite</h3>
            <p className="text-sm text-white/40 leading-relaxed font-medium">
              Luxury sleeper buses and private intercity charters at your fingertips.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
