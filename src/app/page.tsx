import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pt-[80px]">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center px-8 md:px-16 overflow-hidden bg-[#fdf8f3]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 w-full">
          {/* Left Side */}
          <div className="col-span-1 md:col-span-7 flex flex-col justify-center z-10">
            <h1 className="text-[15vw] md:text-[12vw] font-black leading-[0.8] tracking-tighter text-[#262626] uppercase">
              BEYOND <br />
              <span className="lowercase italic text-[#e4a4bd] font-normal tracking-normal">the</span> <br />
              ORDINARY
            </h1>
            <p className="mt-12 text-2xl font-medium text-[#262626]/70 max-w-xl leading-relaxed">
              Experience peer-to-peer luxury travel. Group itineraries curated by AI, powered by verified locals.
            </p>
            <div className="mt-12 flex flex-wrap gap-6">
              <Link href="/login" className="inline-flex items-center text-xl font-bold uppercase tracking-widest text-white bg-[#262626] rounded-full px-10 py-5 hover:bg-[#e4a4bd] hover:text-[#262626] transition-super">
                Start Planning <span className="ml-4">→</span>
              </Link>
              <Link href="/login" className="inline-flex items-center text-xl font-bold uppercase tracking-widest text-[#262626] border-b-2 border-[#e4a4bd] pb-2 hover:text-[#e4a4bd] transition-colors">
                See How It Works
              </Link>
            </div>
          </div>
          
          {/* Right Side */}
          <div className="col-span-1 md:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-[3/4] rounded-[24px] overflow-hidden group">
              <div className="absolute inset-0 bg-[#262626]/10 mix-blend-multiply group-hover:mix-blend-normal transition-super z-10" />
              <div className="w-full h-full bg-[#f5f0eb] group-hover:bg-[#e4a4bd] transition-super flex items-center justify-center grayscale group-hover:grayscale-0 scale-100 group-hover:scale-[1.08]">
                 <span className="text-[#262626]/30 font-black text-6xl">IMAGE</span>
              </div>
            </div>
            
            {/* Floating Concierge Badge */}
            <div className="absolute -left-16 bottom-24 w-[160px] h-[160px] rounded-full bg-[#e4a4bd] flex flex-col items-center justify-center text-[#262626] animate-bounce-slow z-20 shadow-2xl border-4 border-[#fdf8f3]">
              <span className="text-3xl italic font-black">01</span>
              <span className="text-[8px] uppercase tracking-[0.2em] font-black mt-2 text-center px-4">AI Travel<br/>Concierge</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 px-8 md:px-16 bg-[#f5f0eb]">
        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-[#262626] mb-16">
          The <span className="text-[#e4a4bd]">Voyage</span> Suite
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 border-y border-[#262626]/10">
          {[
            {
              title: "AI ITINERARIES",
              desc: "Hyper-personalized day-by-day group plans, optimized for energy levels and shared budgets.",
              icon: "01"
            },
            {
              title: "P2P MARKETPLACE",
              desc: "Verified luxury homes, premium vehicles, and expert local guides. Direct access, no middlemen.",
              icon: "02"
            },
            {
              title: "SMART SPLITS",
              desc: "Real-time expense tracking and intelligent debt settling using minimum transaction algorithms.",
              icon: "03"
            }
          ].map((service, i) => (
            <div key={i} className={`p-10 border-[#262626]/10 group hover:bg-[#e4a4bd] transition-super ${i !== 2 ? 'md:border-r' : ''}`}>
              <div className="text-4xl font-black italic text-[#e4a4bd] group-hover:text-[#262626] transition-super mb-12">
                {service.icon}
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-[#262626] mb-4">
                {service.title}
              </h3>
              <p className="text-base text-[#262626]/70 group-hover:text-[#262626]/90 leading-relaxed font-medium">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Staggered Grid */}
      <section className="py-32 px-8 md:px-16 bg-[#fdf8f3]">
        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-[#262626] mb-24 text-center">
          Curated <span className="text-[#e4a4bd]">Destinations</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 max-w-6xl mx-auto">
          {[
            { tag: "CULTURE", title: "Kyoto Heritage", img: "KYOTO", offset: false },
            { tag: "ADVENTURE", title: "Swiss Alps", img: "ALPS", offset: true },
            { tag: "WELLNESS", title: "Bali Retreat", img: "BALI", offset: false },
            { tag: "LEISURE", title: "Amalfi Coast", img: "AMALFI", offset: true },
          ].map((item, i) => (
            <div key={i} className={`flex flex-col group cursor-pointer ${item.offset ? 'md:mt-[100px]' : ''}`}>
              <div className="relative w-full aspect-[3/4] rounded-[16px] overflow-hidden mb-8 bg-[#f5f0eb]">
                <div className="w-full h-full grayscale group-hover:grayscale-0 scale-100 group-hover:scale-[1.08] transition-super flex items-center justify-center">
                  <span className="text-[#262626]/20 font-black text-4xl">{item.img}</span>
                </div>
                {/* Hover Circle */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-super">
                  <div className="w-[96px] h-[96px] rounded-full bg-[#262626] flex items-center justify-center">
                    <span className="text-[#fdf8f3] text-[10px] uppercase tracking-[0.2em] font-black">View Case</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-[#e4a4bd] font-black uppercase tracking-[0.2em] mb-3">
                {item.tag}
              </div>
              <h3 className="text-3xl font-black text-[#262626] uppercase tracking-tighter flex items-center">
                {item.title}
                <span className="inline-block mx-4 text-xl opacity-30">•</span>
                <span className="text-xl font-medium opacity-50">2026</span>
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f5f0eb] pt-24 pb-8 px-8 md:px-16 border-t border-[#262626]/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          <div className="col-span-1 md:col-span-5">
            <h2 className="font-black text-4xl tracking-tighter uppercase text-[#262626] mb-6">VOYAGE</h2>
            <p className="text-xl text-[#262626]/70 max-w-md leading-relaxed font-medium">
              Elevating group travel through intelligent curation, peer-to-peer luxury, and seamless collaboration.
            </p>
          </div>
          <div className="col-span-1 md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e4a4bd] underline underline-offset-8 mb-8">Platform</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-[#262626] hover:text-[#e4a4bd] font-bold text-sm uppercase tracking-widest transition-colors">AI Concierge</Link></li>
                <li><Link href="#" className="text-[#262626] hover:text-[#e4a4bd] font-bold text-sm uppercase tracking-widest transition-colors">Homes</Link></li>
                <li><Link href="#" className="text-[#262626] hover:text-[#e4a4bd] font-bold text-sm uppercase tracking-widest transition-colors">Vehicles</Link></li>
                <li><Link href="#" className="text-[#262626] hover:text-[#e4a4bd] font-bold text-sm uppercase tracking-widest transition-colors">Guides</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e4a4bd] underline underline-offset-8 mb-8">Social</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-[#262626] hover:text-[#e4a4bd] font-bold text-sm uppercase tracking-widest transition-colors">Instagram</Link></li>
                <li><Link href="#" className="text-[#262626] hover:text-[#e4a4bd] font-bold text-sm uppercase tracking-widest transition-colors">Twitter</Link></li>
                <li><Link href="#" className="text-[#262626] hover:text-[#e4a4bd] font-bold text-sm uppercase tracking-widest transition-colors">LinkedIn</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e4a4bd] underline underline-offset-8 mb-8">Locations</h4>
              <ul className="space-y-4">
                <li><span className="text-[#262626] font-bold text-sm uppercase tracking-widest">New York</span></li>
                <li><span className="text-[#262626] font-bold text-sm uppercase tracking-widest">London</span></li>
                <li><span className="text-[#262626] font-bold text-sm uppercase tracking-widest">Tokyo</span></li>
                <li><span className="text-[#262626] font-bold text-sm uppercase tracking-widest">Mumbai</span></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[#262626]/10 flex flex-col md:flex-row justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-[#262626]/30">
          <p>© 2026 VOYAGE. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <Link href="#" className="hover:text-[#e4a4bd] transition-colors">PRIVACY POLICY</Link>
            <Link href="#" className="hover:text-[#e4a4bd] transition-colors">TERMS OF SERVICE</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
