'use client'

export const dynamic = 'force-dynamic' // Désactive le pré-rendering statique

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        router.push('/paiement')
      }
    })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Processing authentication...</p>
    </div>
  )
}

