"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User, Address, UserStatus, UserRole } from "@/types/user"
import { createUser, updateUser } from "@/app/api/users/actions"
import { X, Plus } from "lucide-react"

interface UserFormProps {
  user?: User
  onSuccess?: () => void
  onCancel?: () => void
}

export default function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<User>>(
    user || {
      name: "",
      email: "",
      status: "active" as UserStatus,
      role: "user" as UserRole,
      addresses: [],
    },
  )

  const [addresses, setAddresses] = useState<Address[]>(user?.addresses || [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as UserStatus }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as UserRole }))
  }

  const handleAddressChange = (index: number, field: keyof Address, value: string) => {
    const newAddresses = [...addresses]
    newAddresses[index] = { ...newAddresses[index], [field]: value }
    setAddresses(newAddresses)
  }

  const handleAddAddress = () => {
    setAddresses([...addresses, { name: "", street: "", city: "", postal_code: "" }])
  }

  const handleRemoveAddress = (index: number) => {
    const newAddresses = [...addresses]
    newAddresses.splice(index, 1)
    setAddresses(newAddresses)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const userData = {
        ...formData,
        addresses: addresses,
      }

      if (user?.id) {
        await updateUser(user.id, userData)
      } else {
        await createUser(userData)
      }

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email || ""} onChange={handleChange} required />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="blocked">Bloqué</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Utilisateur</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Adresses</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddAddress}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Ajouter une adresse
            </Button>
          </div>

          <div className="space-y-4">
            {addresses.map((address, index) => (
              <div key={index} className="relative border rounded-md p-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => handleRemoveAddress(index)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`address-name-${index}`}>Nom</Label>
                    <Input
                      id={`address-name-${index}`}
                      value={address.name || ""}
                      onChange={(e) => handleAddressChange(index, "name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`address-street-${index}`}>Rue</Label>
                    <Input
                      id={`address-street-${index}`}
                      value={address.street || ""}
                      onChange={(e) => handleAddressChange(index, "street", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`address-city-${index}`}>Ville</Label>
                    <Input
                      id={`address-city-${index}`}
                      value={address.city || ""}
                      onChange={(e) => handleAddressChange(index, "city", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`address-postal-code-${index}`}>Code postal</Label>
                    <Input
                      id={`address-postal-code-${index}`}
                      value={address.postal_code || ""}
                      onChange={(e) => handleAddressChange(index, "postal_code", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            {addresses.length === 0 && (
              <div className="text-center p-4 border border-dashed rounded-md text-gray-500">
                Aucune adresse ajoutée
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" className="bg-[#FFB000] hover:bg-[#FF914D]" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : user?.id ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  )
}
