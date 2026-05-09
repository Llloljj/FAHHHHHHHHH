import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogOut, User } from 'lucide-react'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="fixed top-0 left-0 right-0 h-[80px] z-50 bg-[#fdf8f3]/80 backdrop-blur-[12px] border-b border-[#262626]/5 transition-super">
      <div className="flex h-full items-center justify-between px-8 md:px-16 mx-auto">
        {/* Left: Brand */}
        <Link href="/" className="font-black text-2xl tracking-tighter uppercase text-[#262626]">
          VOYAGE
        </Link>
        
        {/* Center: Menu */}
        <div className="hidden md:flex items-center space-x-12">
          <Link href="/destinations" className="text-[10px] uppercase tracking-[0.2em] font-black text-[#262626] hover:text-[#e4a4bd] transition-colors duration-300">
            Destinations
          </Link>
          <Link href="/experiences" className="text-[10px] uppercase tracking-[0.2em] font-black text-[#262626] hover:text-[#e4a4bd] transition-colors duration-300">
            Experiences
          </Link>
          <Link href="/concierge" className="text-[10px] uppercase tracking-[0.2em] font-black text-[#262626] hover:text-[#e4a4bd] transition-colors duration-300">
            Concierge
          </Link>
        </div>

        {/* Right: CTA / Auth */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-[10px] uppercase tracking-[0.2em] font-black text-[#262626] hover:text-[#e4a4bd] transition-colors duration-300">
                Dashboard
              </Link>
              <form action="/api/auth/signout" method="POST">
                <button type="submit" className="bg-[#e4a4bd] text-[#262626] rounded-full px-[32px] py-[12px] text-[10px] uppercase tracking-[0.2em] font-black hover:opacity-80 transition-opacity flex items-center">
                  <LogOut className="h-3 w-3 mr-2" />
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="bg-[#e4a4bd] text-[#262626] rounded-full px-[32px] py-[12px] text-[10px] uppercase tracking-[0.2em] font-black hover:opacity-80 transition-opacity flex items-center">
              <User className="h-3 w-3 mr-2" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
