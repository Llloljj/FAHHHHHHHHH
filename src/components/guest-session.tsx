'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Silently creates an anonymous Supabase session for guest users.
 * This runs once on mount — no login screen needed.
 */
export function GuestSession() {
  useEffect(() => {
    const supabase = createClient()
    
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      // If no session exists at all, sign in anonymously
      if (!session) {
        await supabase.auth.signInAnonymously()
      }
    }
    
    initSession()
  }, [])

  return null
}
