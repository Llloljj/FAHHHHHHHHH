'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * GuestSession is now disabled as per user request to remove anonymous sign-ins.
 * It will just check if a session exists but won't force one.
 */
export function GuestSession() {
  useEffect(() => {
    const supabase = createClient()
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        console.log('Active session found:', session.user.email)
      }
    }
    
    checkSession()
  }, [])

  return null
}
