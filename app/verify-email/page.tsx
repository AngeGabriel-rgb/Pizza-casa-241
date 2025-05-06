// app/verify-email/page.tsx
'use client'

import { CheckCircle, Mail, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase/client'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const email = searchParams.get('email')

  // Vérifier l'état de la confirmation
  const checkEmailVerification = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user?.email_confirmed_at) {
        setIsVerified(true)
        // Rediriger après 3 secondes si l'email est confirmé
        setTimeout(() => {
          router.push(searchParams.get('redirect') || '/paiement')
        }, 3000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Vérifier immédiatement et toutes les 5 secondes
  useEffect(() => {
    checkEmailVerification()
    const interval = setInterval(checkEmailVerification, 5000)
    return () => clearInterval(interval)
  }, [])

  // Renvoyer l'email de confirmation
  const resendConfirmation = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email || '',
      })
      
      if (error) throw error
      alert('Email de confirmation renvoyé avec succès!')
    } catch (error) {
      if (error instanceof Error) {
        alert('Erreur lors de l\'envoi: ' + error.message)
      } else {
        alert('Erreur inconnue lors de l\'envoi.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg text-center">
        {isVerified ? (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Email confirmé avec succès!</h2>
            <p className="mt-2 text-gray-600">
              Redirection vers votre espace personnel...
            </p>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ac1f1f] mx-auto"></div>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Vérifiez votre email</h2>
            <p className="mt-2 text-gray-600">
              Nous avons envoyé un lien de confirmation <span className="font-semibold">{email}</span>
            </p>
            
            <div className="bg-blue-50 p-4 rounded-md text-left mt-4">
              <h3 className="text-sm font-medium text-blue-800">Que faire ensuite?</h3>
              <ol className="list-decimal list-inside mt-2 text-sm text-blue-700 space-y-1">
                <li>Ouvrez votre boîte mail</li>
                <li>Cliquez sur le lien de confirmation pour finaliser votre paiement.</li>
              
              </ol>
            </div>

            <div className="mt-6">
              <Button
                onClick={resendConfirmation}
                disabled={isLoading}
                className="w-full bg-[#ac1f1f] hover:bg-[#8e1a1a]"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Renvoyer l'email de confirmation
              </Button>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p>Vous n'avez pas reçu l'email?</p>
              <ul className="mt-1 space-y-1">
                <li>• Vérifiez vos spams ou courriers indésirables</li>
                <li>• Assurez-vous d'avoir saisi le bon email</li>
                <li>• Contactez notre support si le problème persiste</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}