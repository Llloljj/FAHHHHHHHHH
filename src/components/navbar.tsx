import Link from 'next/link'
import { LayoutDashboard, PlusCircle } from 'lucide-react'

export async function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-[80px] z-50 bg-[#fdf8f3]/80 backdrop-blur-[12px] border-b border-[#262626]/5 transition-super">
      <div className="flex h-full items-center justify-between px-8 md:px-16 mx-auto">
        {/* Left: Brand */}
        <Link href="/" className="font-black text-2xl tracking-tighter uppercase text-[#262626]">
          VOYAGE
        </Link>

        {/* Center: Menu */}
        <div className="hidden md:flex items-center space-x-12">
          <Link href="/dashboard" className="text-[10px] uppercase tracking-[0.2em] font-black text-[#262626] hover:text-[#e4a4bd] transition-colors duration-300">
            My Trips
          </Link>
          <Link href="/trips/new" className="text-[10px] uppercase tracking-[0.2em] font-black text-[#262626] hover:text-[#e4a4bd] transition-colors duration-300">
            Plan a Trip
          </Link>
        </div>

        {/* Right: CTA */}
        <div className="flex items-center space-x-4">
          <Link href="/trips/new" className="bg-[#e4a4bd] text-[#262626] rounded-full px-[32px] py-[12px] text-[10px] uppercase tracking-[0.2em] font-black hover:opacity-80 transition-opacity flex items-center gap-2">
            <PlusCircle className="h-3 w-3" />
            New Trip
          </Link>
        </div>
      </div>
    </nav>
  )
}
