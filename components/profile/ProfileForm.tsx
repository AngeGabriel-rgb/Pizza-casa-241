'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase/client'

export default function ProfileForm({ user, profile }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    full_name: profile?.full_name || '',
    avatar_url: profile?.avatar_url || ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        ...formData,
        updated_at: new Date().toISOString()
      })

      if (error) throw error
      setSuccess('Profil mis à jour avec succès!')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      
      <div>
        <label className="block text-sm font-medium mb-1">Nom complet</label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Nom d'utilisateur</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">URL de l'avatar</label>
        <input
          type="text"
          value={formData.avatar_url}
          onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="bg-[#ac1f1f] text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Enregistrement...' : 'Mettre à jour'}
      </button>
    </form>
  )
}