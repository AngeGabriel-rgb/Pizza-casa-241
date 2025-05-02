'use client'

import { supabase } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded text-sm"
    >
      Déconnexion
    </button>
  )
}