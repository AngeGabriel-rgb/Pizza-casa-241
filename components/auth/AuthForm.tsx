'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthForm({ type }: { type: 'login' | 'register' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/paiement'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (type === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone
            },
            emailRedirectTo: `${location.origin}/auth/callback?redirect=${redirectTo}`
          }
        })
        if (error) throw error
        router.push('/verify-email')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push(redirectTo)
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 p-2 rounded bg-red-50 border border-red-200">
          {error}
        </div>
      )}

      {type === 'register' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1 text-[#ac1f1f]">
              Nom complet
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#ac1f1f] focus:border-[#ac1f1f]"
              placeholder="ange Gabriel"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[#ac1f1f]">
              Téléphone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#ac1f1f] focus:border-[#ac1f1f]"
              placeholder="+241 XX XX XX XX"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium mb-1 text-[#ac1f1f]">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#ac1f1f] focus:border-[#ac1f1f]"
          placeholder="votre@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-[#ac1f1f]">
          Mot de passe
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#ac1f1f] focus:border-[#ac1f1f]"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
          loading ? 'bg-[#ac1f1f]/80' : 'bg-[#ac1f1f] hover:bg-[#8e1a1a]'
        } focus:outline-none focus:ring-2 focus:ring-[#ac1f1f] focus:ring-offset-2`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {type === 'login' ? 'Connexion...' : 'Inscription...'}
          </span>
        ) : (
          type === 'login' ? 'Se connecter' : 'S\'inscrire'
        )}
      </button>

      <div className="text-center text-sm mt-4 text-gray-600">
        {type === 'login' ? (
          <span>
            Pas de compte ?{' '}
            <Link 
              href={`/register?redirect=${redirectTo}`} 
              className="font-medium text-[#ac1f1f] hover:underline"
            >
              Inscrivez-vous
            </Link>
          </span>
        ) : (
          <span>
            Déjà un compte ?{' '}
            <Link 
              href={`/login?redirect=${redirectTo}`} 
              className="font-medium text-[#ac1f1f] hover:underline"
            >
              Connectez-vous
            </Link>
          </span>
        )}
      </div>
    </form>
  )
}