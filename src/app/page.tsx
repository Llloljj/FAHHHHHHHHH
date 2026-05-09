import Link from 'next/link'
import Image from 'next/image'
import { RevealUp } from '@/components/reveal-up'

const DESTINATIONS = [
  { tag: "CULTURE", title: "Kyoto Heritage", img: "/kyoto.png", offset: false, year: "2026" },
  { tag: "ADVENTURE", title: "Swiss Alps", img: "/alps.png", offset: true, year: "2026" },
  { tag: "WELLNESS", title: "Bali Retreat", img: "/bali.png", offset: false, year: "2026" },
  { tag: "LEISURE", title: "Amalfi Coast", img: "/amalfi.png", offset: true, year: "2026" },
]

const SERVICES = [
  {
    title: "AI ITINERARIES",
    desc: "Hyper-personalized day-by-day group plans, optimized for energy levels and shared budgets.",
    icon: "01",
  },
  {
    title: "P2P MARKETPLACE",
    desc: "Verified luxury homes, premium vehicles, and expert local guides. Direct access, no middlemen.",
    icon: "02",
  },
  {
    title: "SMART SPLITS",
    desc: "Real-time expense tracking and intelligent debt settling using minimum transaction algorithms.",
    icon: "03",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pt-[80px]">

      {/* ── HERO ──────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center px-8 md:px-16 overflow-hidden">

        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1669719022178-d00c119bb24d?q=80&w=1149&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
        />
        
        {/* Light Overlay for readability */}
        <div className="absolute inset-0 z-0 bg-[#fdf8f3]/30" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 w-full relative z-10">

          {/* Left Side */}
          <div className="col-span-1 md:col-span-7 flex flex-col justify-center hero-slide-left">

            {/* Kicker label */}
            <div className="flex items-center gap-4 mb-10">
              <span style={{ fontSize: '18px' }} className="font-black uppercase tracking-[0.2em] accent-gradient-text">Peer-to-Peer Luxury Travel</span>
              <span className="block w-12 h-px accent-gradient" />
            </div>

            <h1 className="font-black leading-[0.82] tracking-widest text-[#262626] uppercase"
              style={{ fontSize: 'clamp(48px, 10vw, 120px)' }}>
              BEYOND <br />
              <span className="lowercase italic accent-gradient-text font-light tracking-widest">the</span>{' '}
              <br />
              ORDINARY
            </h1>

            <p className="mt-12 text-xl md:text-2xl font-medium text-white max-w-xl leading-relaxed">
              Group itineraries curated by AI, powered by verified local experts. Travel elevated.
            </p>

            <div className="mt-14 flex flex-wrap items-center gap-8">
              <Link
                href="/login"
                className="inline-flex items-center gap-4 font-black uppercase tracking-widest text-white bg-[#262626] rounded-full px-10 py-5 hover:accent-gradient hover:text-[#262626] transition-colors text-sm"
              >
                Start Planning
                <span className="text-base leading-none">→</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-3 font-black uppercase tracking-widest text-[#262626] border-b-2 accent-gradient-border pb-1 hover:accent-gradient-text transition-colors text-sm"
              >
                See How It Works
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="col-span-1 md:col-span-5 relative flex items-center justify-center hero-slide-right">

            {/* Hero Video Card */}
            <div className="relative w-4/5 md:w-3/4 aspect-[3/4] rounded-[24px] overflow-hidden group cursor-pointer border-[6px] border-white transition-transform duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/hero-video.mp4" type="video/mp4" />
              </video>
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-[#262626]/55 z-10 pointer-events-none" />
              {/* Quote text centered */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
                <blockquote className="font-black italic text-white leading-tight"
                  style={{ fontSize: 'clamp(20px, 3vw, 42px)' }}>
                  &ldquo;Just in case&rdquo;
                  <br />
                  is the curse of packing.
                </blockquote>
              </div>
              {/* Corner label */}
              <div className="absolute bottom-6 left-6 z-20">
                <p className="label-utility text-white">Premium Experience</p>
              </div>
            </div>

            {/* Floating Concierge Badge */}
            <div className="absolute -left-8 md:-left-16 bottom-20 w-[180px] h-[180px] rounded-full accent-gradient flex flex-col items-center justify-center text-white animate-bounce-slow z-20 shadow-2xl border-4 border-[#fdf8f3]">
              <span className="text-6xl italic font-medium leading-none">01</span>
              <span className="text-xs uppercase tracking-[0.25em] font-black mt-3 text-center leading-tight px-4">
                AI Travel<br />Concierge
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ─────────────────────────── */}
      <section className="py-32 px-8 md:px-16 bg-[#f5f0eb]">
        <RevealUp>
          <div className="flex items-end justify-between mb-16 flex-wrap gap-8">
            <h2 className="font-black uppercase tracking-tighter text-[#262626] leading-[0.85]"
              style={{ fontSize: 'clamp(48px, 8vw, 120px)' }}>
              The <span className="accent-gradient-text italic font-light">BANJARE</span><br /> Suite
            </h2>
            <p className="label-utility text-[#262626]/40 max-w-[200px] text-right leading-loose">
              Three pillars of premium group travel
            </p>
          </div>
        </RevealUp>

        <div className="grid grid-cols-1 md:grid-cols-3 border-y border-[#262626]/10">
          {SERVICES.map((service, i) => (
            <RevealUp key={i}>
              <div
                className={`p-10 md:p-12 border-[#262626]/10 group hover:accent-gradient transition-all duration-500 cursor-pointer ${i !== 2 ? 'md:border-r' : ''} border-b md:border-b-0`}
                style={{ minHeight: '320px' }}
              >
                <div className="text-4xl font-black italic accent-gradient-text group-hover:text-[#262626] transition-all duration-500 mb-10 leading-none">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-[#262626] mb-5">
                  {service.title}
                </h3>
                <p className="text-sm text-[#262626]/60 group-hover:text-[#262626]/80 leading-relaxed font-medium">
                  {service.desc}
                </p>
                <div className="mt-10 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-colors">
                  <span className="label-utility text-[#262626]/70">Explore</span>
                  <span className="text-[#262626]">→</span>
                </div>
              </div>
            </RevealUp>
          ))}
        </div>
      </section>

      {/* ── MANIFESTO STRIP ────────────────────────── */}
      <section className="relative py-32 px-8 md:px-16 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1705081439303-6a82c35bd9c7?q=80&w=2018&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
        />
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 z-0 bg-[#262626]/60" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <RevealUp direction="left">
              <h2 className="font-black uppercase tracking-tighter text-[#fdf8f3] leading-[0.85]"
                style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>
                Travel is not a<br />
                <span className="accent-gradient-text italic font-light">destination</span>,<br />
                it&apos;s a state of mind.
              </h2>
            </RevealUp>
            <RevealUp direction="right">
              <div className="flex flex-col gap-6 md:max-w-md">
                <p className="text-lg md:text-xl text-[#fdf8f3]/80 font-medium leading-relaxed">
                  BANJARE connects you with verified local experts and AI-curated experiences that redefine what group travel means.
                </p>
                <Link href="/login" className="text-sm md:text-base font-black uppercase tracking-[0.2em] accent-gradient-text hover:text-white transition-colors inline-flex items-center gap-3">
                  Join the community <span className="text-xl">→</span>
                </Link>
              </div>
            </RevealUp>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO STAGGERED GRID ───────────────── */}
      <section className="py-32 px-8 md:px-16 bg-[#fdf8f3]">
        <RevealUp>
          <div className="mb-24">
            <p className="label-utility accent-gradient-text mb-6">Our Portfolio</p>
            <h2 className="font-black uppercase tracking-tighter text-[#262626] leading-[0.85]"
              style={{ fontSize: 'clamp(48px, 8vw, 120px)' }}>
              Curated <br />
              <span className="accent-gradient-text italic font-light">Destinations</span>
            </h2>
          </div>
        </RevealUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 max-w-6xl mx-auto">
          {DESTINATIONS.map((item, i) => (
            <RevealUp key={i}>
              <div className={`flex flex-col group cursor-pointer ${item.offset ? 'md:mt-[100px]' : ''}`}>
                <div className="relative w-full aspect-[3/4] rounded-[16px] overflow-hidden mb-8 bg-[#f5f0eb]">
                  {/* Image with grayscale → color */}
                  <div className="img-grayscale group-hover:grayscale-0 w-full h-full relative">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Hover circle */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
                    <div className="w-[96px] h-[96px] rounded-full bg-[#262626] flex items-center justify-center shadow-2xl">
                      <span className="text-[#fdf8f3] label-utility tracking-[0.15em]">View</span>
                    </div>
                  </div>
                </div>
                <div className="label-utility accent-gradient-text mb-3">{item.tag}</div>
                <h3 className="text-3xl font-black text-[#262626] uppercase tracking-tighter flex items-center gap-4 flex-wrap">
                  {item.title}
                  <span className="text-lg opacity-20">•</span>
                  <span className="text-lg font-medium opacity-40">{item.year}</span>
                </h3>
              </div>
            </RevealUp>
          ))}
        </div>
      </section>


      {/* ── FOOTER ────────────────────────────────── */}
      <footer className="bg-[#f5f0eb] pt-24 pb-8 px-8 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          <div className="col-span-1 md:col-span-5">
            <h2 className="font-black text-5xl tracking-tighter uppercase text-[#262626] mb-6">BANJARE</h2>
            <p className="text-lg text-[#262626]/60 max-w-md leading-relaxed font-medium">
              Elevating group travel through intelligent curation, peer-to-peer luxury, and seamless collaboration.
            </p>
          </div>
          <div className="col-span-1 md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                heading: "Platform",
                links: [
                  { label: "AI Concierge", href: "#" },
                  { label: "Homes", href: "#" },
                  { label: "Vehicles", href: "#" },
                  { label: "Guides", href: "#" },
                ]
              },
              {
                heading: "Social",
                links: [
                  { label: "Instagram", href: "#" },
                  { label: "Twitter", href: "#" },
                  { label: "LinkedIn", href: "#" },
                ]
              },
              {
                heading: "Locations",
                links: [
                  { label: "New York", href: undefined },
                  { label: "London", href: undefined },
                  { label: "Tokyo", href: undefined },
                  { label: "Mumbai", href: undefined },
                ]
              }
            ].map((col) => (
              <div key={col.heading}>
                <h4 className="label-utility accent-gradient-text underline underline-offset-8 mb-8">
                  {col.heading}
                </h4>
                <ul className="space-y-4">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href ? (
                        <Link
                          href={link.href}
                          className="text-[#262626] hover:accent-gradient-text font-bold text-xs uppercase tracking-widest transition-colors"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <span className="text-[#262626]/60 font-bold text-xs uppercase tracking-widest">
                          {link.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-[#262626]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#262626]/30">
          <p>© 2026 BANJARE. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:accent-gradient-text transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:accent-gradient-text transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
