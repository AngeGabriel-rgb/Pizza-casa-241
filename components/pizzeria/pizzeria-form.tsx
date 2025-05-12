"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { Pizzeria, PizzeriaStatus } from "@/types/pizzeria"
import { createPizzeria, updatePizzeria } from "@/app/api/pizzeria/actions"

interface PizzeriaFormProps {
  pizzeria?: Pizzeria
  onSuccess?: () => void
  onCancel?: () => void
}

export default function PizzeriaForm({ pizzeria, onSuccess, onCancel }: PizzeriaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<Pizzeria>>(
    pizzeria || {
      name: "",
      image: "/placeholder.svg?height=200&width=300",
      rating: 0,
      address: "",
      phone: "",
      opening_hours: "",
      tags: [],
      status: "active" as PizzeriaStatus,
      orders_count: 0,
      revenue: 0,
      description: "",
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as PizzeriaStatus }))
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value
    // Convertir la chaîne en tableau
    const tagsArray = tagsString.split(",").map((tag) => tag.trim())
    setFormData((prev) => ({ ...prev, tags: tagsArray }))
  }

  const handleActiveChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, status: checked ? "active" : "inactive" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (pizzeria?.id) {
        await updatePizzeria(pizzeria.id, formData)
      } else {
        await createPizzeria(formData)
      }

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Convertir le tableau de tags en chaîne pour l'affichage dans le formulaire
  const tagsString = Array.isArray(formData.tags) ? formData.tags.join(", ") : formData.tags

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la pizzeria</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Nom de la pizzeria"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="+33 1 23 45 67 89"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            placeholder="Adresse complète"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="opening_hours">Heures d'ouverture</Label>
            <Input
              id="opening_hours"
              name="opening_hours"
              value={formData.opening_hours || ""}
              onChange={handleChange}
              placeholder="11:00 - 23:00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
            <Input
              id="tags"
              name="tags"
              value={tagsString || ""}
              onChange={handleTagsChange}
              placeholder="Italienne, Traditionnelle"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="Description de la pizzeria"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image (URL)</Label>
          <Input
            id="image"
            name="image"
            value={formData.image || ""}
            onChange={handleChange}
            placeholder="URL de l'image"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="active" checked={formData.status === "active"} onCheckedChange={handleActiveChange} />
          <Label htmlFor="active">Activer immédiatement</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" className="bg-[#FFB000] hover:bg-[#FF914D]" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : pizzeria?.id ? "Mettre à jour" : "Ajouter"}
        </Button>
      </div>
    </form>
  )
}
