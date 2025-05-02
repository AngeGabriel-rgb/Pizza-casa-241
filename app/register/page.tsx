import AuthForm from '@/components/auth/AuthForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Inscription</h1>
          <p className="mt-2 text-gray-600">Créez votre compte</p>
        </div>
        <AuthForm type="register" />
      </div>
    </div>
  )
}