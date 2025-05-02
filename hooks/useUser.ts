// hooks/useUser.ts
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import { Session } from '@supabase/supabase-js'

export function useUser() {
  const [user, setUser] = useState<Session['user'] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}