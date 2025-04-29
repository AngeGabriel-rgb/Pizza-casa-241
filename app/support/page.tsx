"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SendHorizonal } from "lucide-react"

// Données fictives pour la FAQ
const faqItems = [
  {
    question: "Comment puis-je modifier ma commande ?",
    answer:
      "Vous pouvez modifier votre commande tant qu'elle n'a pas été confirmée par la pizzeria. Pour ce faire, accédez à la page de votre commande et cliquez sur 'Modifier'. Si la commande a déjà été confirmée, veuillez contacter directement la pizzeria.",
  },
  {
    question: "Quels sont les délais de livraison ?",
    answer:
      "Les délais de livraison varient en fonction de la distance entre vous et la pizzeria, ainsi que du volume de commandes. En général, comptez entre 30 et 45 minutes. Un temps estimé vous est indiqué lors de la validation de votre commande.",
  },
  {
    question: "Comment puis-je annuler ma commande ?",
    answer:
      "Vous pouvez annuler votre commande tant qu'elle n'a pas été confirmée par la pizzeria. Rendez-vous sur la page de suivi de commande et cliquez sur 'Annuler'. Si la commande a déjà été confirmée, veuillez contacter directement la pizzeria ou notre service client.",
  },
  {
    question: "Comment puis-je ajouter une adresse de livraison ?",
    answer:
      "Pour ajouter une adresse de livraison, connectez-vous à votre compte, accédez à la section 'Mon compte' puis 'Mes adresses'. Cliquez sur 'Ajouter une adresse' et remplissez le formulaire avec les informations demandées.",
  },
  {
    question: "Comment contacter une pizzeria ?",
    answer:
      "Vous pouvez contacter directement une pizzeria en accédant à sa page sur notre plateforme. Vous y trouverez ses coordonnées (téléphone, adresse). Vous pouvez également envoyer un message via notre système de chat intégré.",
  },
  {
    question: "Comment puis-je signaler un problème avec ma commande ?",
    answer:
      "Si vous rencontrez un problème avec votre commande, vous pouvez le signaler via la page de suivi de commande en cliquant sur 'Signaler un problème'. Vous pouvez également contacter notre service client via la page Support ou par téléphone.",
  },
  {
    question: "Comment fonctionne le système de fidélité ?",
    answer:
      "Pour chaque commande passée sur Pizza Casa, vous cumulez des points de fidélité. Ces points peuvent être échangés contre des réductions, des produits gratuits ou d'autres avantages. Consultez votre solde de points dans la section 'Mon compte'.",
  },
  {
    question: "Puis-je payer en espèces à la livraison ?",
    answer:
      "Le paiement en espèces à la livraison est disponible pour certaines pizzerias partenaires. Cette option vous sera proposée lors du processus de paiement si elle est disponible pour votre commande.",
  },
]

// Messages fictifs pour le chat
const initialMessages = [
  {
    id: 1,
    sender: "bot",
    message: "Bonjour ! Je suis l'assistant virtuel de Pizza Casa. Comment puis-je vous aider aujourd'hui ?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
]

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("faq")
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    // Ajouter le message de l'utilisateur
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      message: newMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, userMessage])
    setNewMessage("")

    // Simuler une réponse automatique après un court délai
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        sender: "bot",
        message:
          "Merci pour votre message. Un conseiller va vous répondre dans les plus brefs délais. En attendant, avez-vous consulté notre FAQ ? Vous y trouverez peut-être déjà la réponse à votre question.",
        timestamp: new Date().toISOString(),
      }

      setMessages((prevMessages) => [...prevMessages, botMessage])
    }, 1000)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 font-montserrat">Support Client</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Nous contacter</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Foire aux questions</CardTitle>
              <CardDescription>Trouvez rapidement des réponses aux questions les plus fréquentes</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="font-montserrat">{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-8 text-center">
                <p className="mb-4">Vous n'avez pas trouvé la réponse à votre question ?</p>
                <Button onClick={() => setActiveTab("contact")} className="bg-[#FFB000] hover:bg-[#FF914D]">
                  Contactez-nous
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Formulaire de contact</CardTitle>
                <CardDescription>
                  Envoyez-nous un message et nous vous répondrons dans les plus brefs délais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">
                        Prénom
                      </label>
                      <Input id="firstName" placeholder="Jean" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Nom
                      </label>
                      <Input id="lastName" placeholder="Dupont" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="exemple@email.com" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Sujet
                    </label>
                    <Input id="subject" placeholder="Problème avec ma commande" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea id="message" placeholder="Décrivez votre problème en détail..." rows={5} />
                  </div>

                  <Button type="submit" className="w-full bg-[#FFB000] hover:bg-[#FF914D]">
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chat en direct</CardTitle>
                <CardDescription>Discutez avec notre équipe de support en temps réel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col h-[400px]">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`flex ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-2 max-w-[80%]`}
                        >
                          {msg.sender === "bot" && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Support" />
                              <AvatarFallback>SC</AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              msg.sender === "user" ? "bg-[#FFB000] text-white" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={handleSendMessage}
                      className="bg-[#FFB000] hover:bg-[#FF914D]"
                    >
                      <SendHorizonal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
