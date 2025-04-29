"use client"

import { Checkbox } from "@/components/ui/checkbox"

import { Label } from "@/components/ui/label"

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

// Données fictives pour les tickets de support
const supportTickets = [
  {
    id: "TKT-123456",
    subject: "Problème avec ma commande",
    customer: {
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "open",
    priority: "high",
    category: "order",
    createdAt: "15/04/2023 19:30",
    lastUpdated: "15/04/2023 20:15",
    messages: [
      {
        id: 1,
        sender: "customer",
        content:
          "Bonjour, je n'ai pas reçu ma commande CMD-123456 qui devait être livrée il y a 1 heure. Pouvez-vous m'aider ?",
        timestamp: "15/04/2023 19:30",
      },
      {
        id: 2,
        sender: "agent",
        content:
          "Bonjour M. Dupont, je suis désolé pour ce désagrément. Je vérifie immédiatement le statut de votre commande.",
        timestamp: "15/04/2023 19:45",
      },
      {
        id: 3,
        sender: "agent",
        content:
          "J'ai contacté la pizzeria et ils m'informent que le livreur est en route. Il devrait arriver dans les 10 prochaines minutes. Pouvez-vous me confirmer quand vous recevez votre commande ?",
        timestamp: "15/04/2023 20:00",
      },
      {
        id: 4,
        sender: "customer",
        content: "Je viens de recevoir ma commande, mais la pizza est froide et l'une des boissons manque.",
        timestamp: "15/04/2023 20:15",
      },
    ],
  },
  {
    id: "TKT-123457",
    subject: "Demande de remboursement",
    customer: {
      name: "Marie Martin",
      email: "marie.martin@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "pending",
    priority: "medium",
    category: "refund",
    createdAt: "14/04/2023 14:20",
    lastUpdated: "14/04/2023 16:45",
    messages: [
      {
        id: 1,
        sender: "customer",
        content:
          "Bonjour, je souhaite demander un remboursement pour ma commande CMD-123457. La qualité n'était pas au rendez-vous.",
        timestamp: "14/04/2023 14:20",
      },
      {
        id: 2,
        sender: "agent",
        content:
          "Bonjour Mme Martin, je suis désolé pour cette mauvaise expérience. Pourriez-vous me donner plus de détails sur les problèmes rencontrés ?",
        timestamp: "14/04/2023 14:35",
      },
      {
        id: 3,
        sender: "customer",
        content: "Les pizzas étaient brûlées et les ingrédients ne correspondaient pas à la description.",
        timestamp: "14/04/2023 14:50",
      },
      {
        id: 4,
        sender: "agent",
        content:
          "Merci pour ces précisions. Je vais transmettre votre demande au service concerné pour validation du remboursement. Vous recevrez une réponse dans les 24h.",
        timestamp: "14/04/2023 15:05",
      },
    ],
  },
  {
    id: "TKT-123458",
    subject: "Question sur les allergènes",
    customer: {
      name: "Thomas Leroy",
      email: "thomas.leroy@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "closed",
    priority: "low",
    category: "info",
    createdAt: "13/04/2023 10:15",
    lastUpdated: "13/04/2023 11:30",
    messages: [
      {
        id: 1,
        sender: "customer",
        content:
          "Bonjour, je suis allergique aux fruits à coque. Pouvez-vous me confirmer que la Pizza Quattro Formaggi ne contient pas de fruits à coque ?",
        timestamp: "13/04/2023 10:15",
      },
      {
        id: 2,
        sender: "agent",
        content:
          "Bonjour M. Leroy, je vous remercie pour votre message. Je vais vérifier la composition de cette pizza et reviens vers vous rapidement.",
        timestamp: "13/04/2023 10:30",
      },
      {
        id: 3,
        sender: "agent",
        content:
          "Après vérification, je peux vous confirmer que la Pizza Quattro Formaggi ne contient pas de fruits à coque. Cependant, elle est préparée dans un environnement où des fruits à coque peuvent être manipulés. Souhaitez-vous que je vous communique la liste complète des allergènes ?",
        timestamp: "13/04/2023 11:00",
      },
      {
        id: 4,
        sender: "customer",
        content: "Merci pour votre réponse rapide. Ces informations me suffisent.",
        timestamp: "13/04/2023 11:15",
      },
      {
        id: 5,
        sender: "agent",
        content: "Je vous en prie. N'hésitez pas à nous contacter si vous avez d'autres questions. Bonne journée !",
        timestamp: "13/04/2023 11:30",
      },
    ],
  },
]

// Données fictives pour la FAQ
const faqItems = [
  {
    id: 1,
    question: "Comment puis-je modifier ma commande ?",
    answer:
      "Vous pouvez modifier votre commande tant qu'elle n'a pas été confirmée par la pizzeria. Pour ce faire, accédez à la page de votre commande et cliquez sur 'Modifier'. Si la commande a déjà été confirmée, veuillez contacter directement la pizzeria.",
    category: "orders",
    isPublished: true,
  },
  {
    id: 2,
    question: "Quels sont les délais de livraison ?",
    answer:
      "Les délais de livraison varient en fonction de la distance entre vous et la pizzeria, ainsi que du volume de commandes. En général, comptez entre 30 et 45 minutes. Un temps estimé vous est indiqué lors de la validation de votre commande.",
    category: "delivery",
    isPublished: true,
  },
  {
    id: 3,
    question: "Comment puis-je annuler ma commande ?",
    answer:
      "Vous pouvez annuler votre commande tant qu'elle n'a pas été confirmée par la pizzeria. Rendez-vous sur la page de suivi de commande et cliquez sur 'Annuler'. Si la commande a déjà été confirmée, veuillez contacter directement la pizzeria ou notre service client.",
    category: "orders",
    isPublished: true,
  },
  {
    id: 4,
    question: "Comment puis-je ajouter une adresse de livraison ?",
    answer:
      "Pour ajouter une adresse de livraison, connectez-vous à votre compte, accédez à la section 'Mon compte' puis 'Mes adresses'. Cliquez sur 'Ajouter une adresse' et remplissez le formulaire avec les informations demandées.",
    category: "account",
    isPublished: true,
  },
  {
    id: 5,
    question: "Comment fonctionne le système de fidélité ?",
    answer:
      "Pour chaque commande passée sur Pizza Casa, vous cumulez des points de fidélité. Ces points peuvent être échangés contre des réductions, des produits gratuits ou d'autres avantages. Consultez votre solde de points dans la section 'Mon compte'.",
    category: "rewards",
    isPublished: false,
  },
]

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("tickets")
  const [activeTicketsTab, setActiveTicketsTab] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [isTicketDetailsOpen, setIsTicketDetailsOpen] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [isAddFaqOpen, setIsAddFaqOpen] = useState(false)

  // Filtrer les tickets
  const filteredTickets = supportTickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.email.toLowerCase().includes(searchTerm.toLowerCase())

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

  const handleViewTicket = (id: string) => {
    setSelectedTicket(id)
    setIsTicketDetailsOpen(true)
  }

  const getSelectedTicket = () => {
    return supportTickets.find((ticket) => ticket.id === selectedTicket)
  }

  const handleSendReply = () => {
    if (!replyText.trim()) return
    // Logique pour envoyer la réponse
    setReplyText("")
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
                      {filteredTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>{ticket.subject}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={ticket.customer.avatar || "/placeholder.svg"}
                                  alt={ticket.customer.name}
                                />
                                <AvatarFallback>{ticket.customer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{ticket.customer.name}</div>
                                <div className="text-xs text-gray-500">{ticket.customer.email}</div>
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
                          <TableCell>{ticket.createdAt}</TableCell>
                          <TableCell>{ticket.lastUpdated}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleViewTicket(ticket.id)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Voir les détails
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Répondre
                                </DropdownMenuItem>
                                {ticket.status !== "closed" && (
                                  <DropdownMenuItem>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Marquer comme résolu
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
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
              <Accordion type="single" collapsible className="w-full">
                {filteredFaq.map((item) => (
                  <AccordionItem key={item.id} value={`item-${item.id}`}>
                    <AccordionTrigger className="font-montserrat">
                      <div className="flex items-center gap-2">
                        {item.question}
                        {!item.isPublished && (
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
                            {item.isPublished ? (
                              <Button variant="outline" size="sm">
                                Dépublier
                              </Button>
                            ) : (
                              <Button className="bg-[#FFB000] hover:bg-[#FF914D]" size="sm">
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isTicketDetailsOpen} onOpenChange={setIsTicketDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle>Ticket {selectedTicket}</DialogTitle>
                <DialogDescription>{getSelectedTicket()?.subject}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {getSelectedTicket() && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={getSelectedTicket()?.customer.avatar || "/placeholder.svg"}
                            alt={getSelectedTicket()?.customer.name}
                          />
                          <AvatarFallback>{getSelectedTicket()?.customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{getSelectedTicket()?.customer.name}</div>
                          <div className="text-xs text-gray-500">{getSelectedTicket()?.customer.email}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(getSelectedTicket()?.status || "")}>
                          {getStatusLabel(getSelectedTicket()?.status || "")}
                        </Badge>
                        <Badge className={getPriorityColor(getSelectedTicket()?.priority || "")}>
                          {getPriorityLabel(getSelectedTicket()?.priority || "")}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium">Catégorie</h4>
                        <p>{getCategoryLabel(getSelectedTicket()?.category || "")}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Créé le</h4>
                        <p>{getSelectedTicket()?.createdAt}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Dernière mise à jour</h4>
                        <p>{getSelectedTicket()?.lastUpdated}</p>
                      </div>
                    </div>

                    <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
                      <h4 className="text-sm font-medium mb-4">Conversation</h4>
                      <div className="space-y-4">
                        {getSelectedTicket()?.messages.map((message) => (
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

                    {getSelectedTicket()?.status !== "closed" && (
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
                      <Select defaultValue={getSelectedTicket()?.status}>
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
                  </>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTicketDetailsOpen(false)}>
                  Fermer
                </Button>
                {getSelectedTicket()?.status !== "closed" && (
                  <Button
                    className="bg-[#FFB000] hover:bg-[#FF914D]"
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                  >
                    Envoyer la réponse
                  </Button>
                )}
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
              <Input id="question" placeholder="Saisissez la question" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">Réponse</Label>
              <Textarea id="answer" placeholder="Saisissez la réponse" rows={5} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order">Commande</SelectItem>
                  <SelectItem value="delivery">Livraison</SelectItem>
                  <SelectItem value="account">Compte</SelectItem>
                  <SelectItem value="refund">Remboursement</SelectItem>
                  <SelectItem value="rewards">Fidélité</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="published" />
              <Label htmlFor="published">Publier immédiatement</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFaqOpen(false)}>
              Annuler
            </Button>
            <Button className="bg-[#FFB000] hover:bg-[#FF914D]">Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
