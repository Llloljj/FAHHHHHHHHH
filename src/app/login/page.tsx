'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Mail, Lock, Sparkles, ArrowRight } from 'lucide-react'

type Mode = 'signin' | 'signup' | 'magic'

export default function LoginPage() {
  const supabase = createClient()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else window.location.href = '/dashboard'
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${location.origin}/api/auth/callback` }
    })
    if (error) { setError(error.message); setLoading(false) }
    else { setSuccess('Check your email for a confirmation link!'); setLoading(false) }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/api/auth/callback` }
    })
    if (error) { setError(error.message); setLoading(false) }
    else { setSuccess('Magic link sent! Check your email.'); setLoading(false) }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/api/auth/callback?next=/trips/new` }
    })
    if (error) setError(error.message)
  }

  return (
    <div className="flex min-h-screen pt-[80px] bg-[#fdf8f3]">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#262626] items-center justify-center p-16 flex-col">
        <div className="max-w-md">
          <div className="accent-gradient-text text-[10px] font-black uppercase tracking-[0.3em] mb-8">Welcome to</div>
          <h1 className="text-7xl font-black tracking-tighter uppercase text-white leading-[0.85] mb-8">
            BANJARE
          </h1>
          <p className="text-white/60 text-xl font-medium leading-relaxed mb-16">
            Plan group trips with AI, split expenses seamlessly, and discover luxury peer-to-peer travel.
          </p>
          <div className="flex flex-col space-y-6">
            {['AI Itinerary Generator', 'Group Expense Splitter', 'P2P Luxury Marketplace', 'Smart Voting System'].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full accent-gradient/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 accent-gradient-text" />
                </div>
                <span className="text-white/80 font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-[#262626] mb-2">
              {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Magic Link'}
            </h2>
            <p className="text-[#262626]/60 font-medium">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setSuccess(null) }}
                className="ml-2 accent-gradient-text font-black uppercase text-sm hover:underline">
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex rounded-full bg-[#f5f0eb] p-1 mb-8">
            {([['signin', 'Sign In'], ['signup', 'Sign Up'], ['magic', 'Magic Link']] as [Mode, string][]).map(([m, label]) => (
              <button key={m} onClick={() => { setMode(m); setError(null); setSuccess(null) }}
                className={`flex-1 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all ${mode === m ? 'bg-[#262626] text-white shadow' : 'text-[#262626]/60 hover:text-[#262626]'}`}>
                {label}
              </button>
            ))}
          </div>

          {success ? (
            <div className="accent-gradient/20 border accent-gradient-border rounded-[16px] p-6 text-center">
              <p className="text-[#262626] font-bold">{success}</p>
            </div>
          ) : (
            <form onSubmit={mode === 'signin' ? handleSignIn : mode === 'signup' ? handleSignUp : handleMagicLink}
              className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#262626]/40" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-full pl-12 py-6 border-[#262626]/20 focus-visible:ring-[#3B9ECC] bg-white"
                />
              </div>

              {mode !== 'magic' && (
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#262626]/40" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-full pl-12 py-6 border-[#262626]/20 focus-visible:ring-[#3B9ECC] bg-white"
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 text-sm text-red-600 font-medium">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-[#262626] text-white hover:accent-gradient hover:text-[#262626] transition-all rounded-full py-4 text-[12px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-60">
                {loading ? 'Please wait...' : (
                  <>
                    {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Magic Link'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#262626]/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#fdf8f3] px-4 text-[10px] uppercase tracking-[0.2em] font-black text-[#262626]/40">
                    Or
                  </span>
                </div>
              </div>

              <button type="button" onClick={handleGoogleLogin}
                className="w-full border-2 border-[#262626]/10 rounded-full py-4 text-[12px] font-black uppercase tracking-[0.15em] text-[#262626] hover:accent-gradient-border hover:accent-gradient-text transition-all flex items-center justify-center gap-3 bg-white">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
