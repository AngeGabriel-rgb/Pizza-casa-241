"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Eye, MessageSquare, CheckCircle, Filter, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { SupportTicket, TicketStatus, TicketCategory, FaqItem } from "@/types/support"
import { addTicketMessage, updateTicketStatus, createFaqItem, updateFaqItem } from "@/app/api/support/actions"
import { useToast } from "@/hooks/use-toast"

interface SupportClientProps {
  initialTickets: SupportTicket[]
  initialFaqItems: FaqItem[]
}

export default function SupportClient({ initialTickets, initialFaqItems }: SupportClientProps) {
  const { toast } = useToast()
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets)
  const [faqItems, setFaqItems] = useState<FaqItem[]>(initialFaqItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("tickets")
  const [activeTicketsTab, setActiveTicketsTab] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [isTicketDetailsOpen, setIsTicketDetailsOpen] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [isAddFaqOpen, setIsAddFaqOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<TicketStatus | "">("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newFaqData, setNewFaqData] = useState({
    question: "",
    answer: "",
    category: "info" as TicketCategory,
    is_published: false,
  })

  // Filtrer les tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer_email.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTicketsTab === "all") return matchesSearch
    if (activeTicketsTab === "open") return matchesSearch && ticket.status === "open"
    if (activeTicketsTab === "pending") return matchesSearch && ticket.status === "pending"
    if (activeTicketsTab === "closed") return matchesSearch && ticket.status === "closed"

    return matchesSearch
  })

  // Filtrer les FAQ
  const filteredFaq = faqItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Ouvert"
      case "pending":
        return "En attente"
      case "closed":
        return "Fermé"
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Haute"
      case "medium":
        return "Moyenne"
      case "low":
        return "Basse"
      default:
        return priority
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "order":
        return "Commande"
      case "refund":
        return "Remboursement"
      case "info":
        return "Information"
      case "account":
        return "Compte"
      case "delivery":
        return "Livraison"
      case "rewards":
        return "Fidélité"
      default:
        return category
    }
  }

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setNewStatus(ticket.status)
    setIsTicketDetailsOpen(true)
  }

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket) return

    setIsSubmitting(true)

    try {
      await addTicketMessage(selectedTicket.id, replyText, "agent")
      toast({
        title: "Réponse envoyée",
        description: "Votre réponse a été envoyée avec succès.",
      })
      setReplyText("")
      // Recharger la page pour obtenir les données mises à jour
      window.location.reload()
    } catch (error) {
      console.error("Erreur lors de l'envoi de la réponse:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de la réponse.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!selectedTicket || !newStatus) return

    setIsSubmitting(true)

    try {
      await updateTicketStatus(selectedTicket.id, newStatus as TicketStatus)
      toast({
        title: "Statut mis à jour",
        description: `Le ticket est maintenant ${getStatusLabel(newStatus).toLowerCase()}.`,
      })
      // Recharger la page pour obtenir les données mises à jour
      window.location.reload()
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setIsTicketDetailsOpen(false)
    }
  }

  const handleAddFaq = async () => {
    if (!newFaqData.question.trim() || !newFaqData.answer.trim()) return

    setIsSubmitting(true)

    try {
      await createFaqItem(newFaqData)
      toast({
        title: "FAQ ajoutée",
        description: "La FAQ a été ajoutée avec succès.",
      })
      setNewFaqData({
        question: "",
        answer: "",
        category: "info",
        is_published: false,
      })
      // Recharger la page pour obtenir les données mises à jour
      window.location.reload()
    } catch (error) {
      console.error("Erreur lors de l'ajout de la FAQ:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la FAQ.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setIsAddFaqOpen(false)
    }
  }

  const handleToggleFaqPublished = async (faq: FaqItem) => {
    try {
      await updateFaqItem(faq.id, { is_published: !faq.is_published })
      toast({
        title: faq.is_published ? "FAQ dépubliée" : "FAQ publiée",
        description: `La FAQ a été ${faq.is_published ? "dépubliée" : "publiée"} avec succès.`,
      })
      // Recharger la page pour obtenir les données mises à jour
      window.location.reload()
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la FAQ:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la FAQ.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-montserrat">Support Client</h2>
        <div className="flex items-center gap-2">
          {activeTab === "faq" && (
            <Button className="bg-[#FFB000] hover:bg-[#FF914D]" onClick={() => setIsAddFaqOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une FAQ
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={activeTab === "tickets" ? "Rechercher un ticket..." : "Rechercher dans la FAQ..."}
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtres
        </Button>
      </div>

      <Tabs defaultValue="tickets" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <Tabs defaultValue="all" value={activeTicketsTab} onValueChange={setActiveTicketsTab}>
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="open">Ouverts</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="closed">Fermés</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTicketsTab} className="mt-6">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Sujet</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Priorité</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Créé le</TableHead>
                        <TableHead>Dernière mise à jour</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTickets.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                            Aucun ticket trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTickets.map((ticket) => (
                          <TableRow key={ticket.id}>
                            <TableCell className="font-medium">{ticket.id}</TableCell>
                            <TableCell>{ticket.subject}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={ticket.customer_avatar || "/placeholder.svg?height=32&width=32"}
                                    alt={ticket.customer_name}
                                  />
                                  <AvatarFallback>{ticket.customer_name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{ticket.customer_name}</div>
                                  <div className="text-xs text-gray-500">{ticket.customer_email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(ticket.status)}>{getStatusLabel(ticket.status)}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getPriorityColor(ticket.priority)}>
                                {getPriorityLabel(ticket.priority)}
                              </Badge>
                            </TableCell>
                            <TableCell>{getCategoryLabel(ticket.category)}</TableCell>
                            <TableCell>{ticket.created_at}</TableCell>
                            <TableCell>{ticket.updated_at}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleViewTicket(ticket)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Voir les détails
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleViewTicket(ticket)}>
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Répondre
                                  </DropdownMenuItem>
                                  {ticket.status !== "closed" && (
                                    <DropdownMenuItem
                                      onClick={async () => {
                                        try {
                                          await updateTicketStatus(ticket.id, "closed")
                                          toast({
                                            title: "Ticket résolu",
                                            description: "Le ticket a été marqué comme résolu.",
                                          })
                                          window.location.reload()
                                        } catch (error) {
                                          toast({
                                            title: "Erreur",
                                            description: "Une erreur est survenue.",
                                            variant: "destructive",
                                          })
                                        }
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Marquer comme résolu
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Foire aux questions</CardTitle>
              <CardDescription>Gérez les questions fréquemment posées</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFaq.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Aucune FAQ trouvée</div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaq.map((item) => (
                    <AccordionItem key={item.id} value={`item-${item.id}`}>
                      <AccordionTrigger className="font-montserrat">
                        <div className="flex items-center gap-2">
                          {item.question}
                          {!item.is_published && (
                            <Badge variant="outline" className="ml-2">
                              Brouillon
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>{item.answer}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{getCategoryLabel(item.category)}</Badge>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Modifier
                              </Button>
                              {item.is_published ? (
                                <Button variant="outline" size="sm" onClick={() => handleToggleFaqPublished(item)}>
                                  Dépublier
                                </Button>
                              ) : (
                                <Button
                                  className="bg-[#FFB000] hover:bg-[#FF914D]"
                                  size="sm"
                                  onClick={() => handleToggleFaqPublished(item)}
                                >
                                  Publier
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isTicketDetailsOpen} onOpenChange={setIsTicketDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle>Ticket {selectedTicket.id}</DialogTitle>
                <DialogDescription>{selectedTicket.subject}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={selectedTicket.customer_avatar || "/placeholder.svg?height=40&width=40"}
                        alt={selectedTicket.customer_name}
                      />
                      <AvatarFallback>{selectedTicket.customer_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedTicket.customer_name}</div>
                      <div className="text-xs text-gray-500">{selectedTicket.customer_email}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(selectedTicket.status)}>
                      {getStatusLabel(selectedTicket.status)}
                    </Badge>
                    <Badge className={getPriorityColor(selectedTicket.priority)}>
                      {getPriorityLabel(selectedTicket.priority)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Catégorie</h4>
                    <p>{getCategoryLabel(selectedTicket.category)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Créé le</h4>
                    <p>{selectedTicket.created_at}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Dernière mise à jour</h4>
                    <p>{selectedTicket.updated_at}</p>
                  </div>
                </div>

                <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
                  <h4 className="text-sm font-medium mb-4">Conversation</h4>
                  <div className="space-y-4">
                    {selectedTicket.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "agent" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === "agent" ? "bg-[#FFB000] text-white" : "bg-gray-100"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedTicket.status !== "closed" && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Répondre</h4>
                    <Textarea
                      placeholder="Tapez votre réponse ici..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Mettre à jour le statut</h4>
                  <Select value={newStatus} onValueChange={(value) => setNewStatus(value as TicketStatus)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Ouvert</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="closed">Fermé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTicketDetailsOpen(false)}>
                  Fermer
                </Button>
                {selectedTicket.status !== "closed" && (
                  <Button
                    className="bg-[#FFB000] hover:bg-[#FF914D]"
                    onClick={handleSendReply}
                    disabled={isSubmitting || !replyText.trim()}
                  >
                    Envoyer la réponse
                  </Button>
                )}
                <Button
                  className="bg-[#FFB000] hover:bg-[#FF914D]"
                  onClick={handleUpdateStatus}
                  disabled={isSubmitting || newStatus === selectedTicket.status}
                >
                  Mettre à jour le statut
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddFaqOpen} onOpenChange={setIsAddFaqOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle FAQ</DialogTitle>
            <DialogDescription>
              Créez une nouvelle question fréquemment posée pour aider vos utilisateurs.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                placeholder="Saisissez la question"
                value={newFaqData.question}
                onChange={(e) => setNewFaqData({ ...newFaqData, question: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">Réponse</Label>
              <Textarea
                id="answer"
                placeholder="Saisissez la réponse"
                rows={5}
                value={newFaqData.answer}
                onChange={(e) => setNewFaqData({ ...newFaqData, answer: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={newFaqData.category}
                onValueChange={(value) => setNewFaqData({ ...newFaqData, category: value as TicketCategory })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order">Commande</SelectItem>
                  <SelectItem value="delivery">Livraison</SelectItem>
                  <SelectItem value="account">Compte</SelectItem>
                  <SelectItem value="refund">Remboursement</SelectItem>
                  <SelectItem value="rewards">Fidélité</SelectItem>
                  <SelectItem value="info">Information</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="published"
                checked={newFaqData.is_published}
                onCheckedChange={(checked) => setNewFaqData({ ...newFaqData, is_published: !!checked })}
              />
              <Label htmlFor="published">Publier immédiatement</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFaqOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-[#FFB000] hover:bg-[#FF914D]"
              onClick={handleAddFaq}
              disabled={isSubmitting || !newFaqData.question.trim() || !newFaqData.answer.trim()}
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
