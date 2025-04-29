import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Users, Store, ShoppingBag, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Composant pour les graphiques
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartGrid,
  ChartLine,
  ChartArea,
  ChartAxisOptions,
  ChartXAxis,
  ChartYAxis,
  ChartBar,
} from "@/components/ui/chart"

export default function AdminDashboard() {
  // Données pour les graphiques
  const salesData = [
    { date: "Jan", revenue: 4500 },
    { date: "Fév", revenue: 5200 },
    { date: "Mar", revenue: 4800 },
    { date: "Avr", revenue: 5800 },
    { date: "Mai", revenue: 6000 },
    { date: "Juin", revenue: 7200 },
    { date: "Juil", revenue: 8500 },
  ]

  const pizzeriasData = [
    { name: "Napoli Authentic", orders: 245, revenue: 4850 },
    { name: "Pizza Bella", orders: 187, revenue: 3740 },
    { name: "Roma Pizza", orders: 156, revenue: 3120 },
    { name: "Mamma Mia", orders: 132, revenue: 2640 },
    { name: "Pizz'Art", orders: 98, revenue: 1960 },
  ]

  const recentOrders = [
    {
      id: "CMD-123456",
      customer: "Jean ",
      avatar: "/placeholder.svg?height=32&width=32",
      pizzeria: "Napoli Authentic",
      total: 32.8,
      status: "delivered",
      date: "Il y a 2 heures",
    },
    {
      id: "CMD-123457",
      customer: "Marie ",
      avatar: "/placeholder.svg?height=32&width=32",
      pizzeria: "Pizza Bella",
      total: 25.9,
      status: "preparing",
      date: "Il y a 3 heures",
    },
    {
      id: "CMD-123458",
      customer: "Leroy",
      avatar: "/placeholder.svg?height=32&width=32",
      pizzeria: "Roma Pizza",
      total: 28.7,
      status: "confirmed",
      date: "Il y a 4 heures",
    },
    {
      id: "CMD-123459",
      customer: " Bernard",
      avatar: "/placeholder.svg?height=32&width=32",
      pizzeria: "Mamma Mia",
      total: 19.5,
      status: "delivering",
      date: "Il y a 2 heures",
    },
    {
      id: "CMD-123460",
      customer: "Lucas ",
      avatar: "/placeholder.svg?height=32&width=32",
      pizzeria: "Pizz'Art",
      total: 42.3,
      status: "confirmed",
      date: "Il y a 5 heures",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "preparing":
        return "bg-yellow-100 text-yellow-800"
      case "delivering":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmée"
      case "preparing":
        return "En préparation"
      case "delivering":
        return "En livraison"
      case "delivered":
        return "Livrée"
      default:
        return status
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-montserrat">Tableau de bord</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline">Télécharger</Button>
          <Button className="bg-[#FFB000] hover:bg-[#FF914D]">
            <TrendingUp className="mr-2 h-4 w-4" />
            Rapports
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Statistiques */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0fcfa</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">0%</span> par rapport au mois dernier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                <ShoppingBag className="h-4 w-4 text-[#FFB000]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">0%</span> par rapport au mois dernier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                <Users className="h-4 w-4 text-[#9B1B1B]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">0%</span> par rapport au mois dernier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pizzerias</CardTitle>
                <Store className="h-4 w-4 text-[#FF914D]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">0</span> nouvelles ce mois-ci
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Graphiques */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Chiffre d'affaires</CardTitle>
                <CardDescription>Évolution du chiffre d'affaires sur les 7 derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    data={salesData}
                    xAxis={
                      <ChartAxisOptions
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        tickFormatter={(value) => value}
                      />
                    }
                    yAxis={
                      <ChartAxisOptions
                        dataKey="revenue"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        tickFormatter={(value) => `${value}€`}
                      />
                    }
                  >
                    <ChartGrid vertical={false} />
                    <ChartArea dataKey="revenue" fill="url(#colorRevenue)" stroke="#FFB000" />
                    <ChartLine dataKey="revenue" stroke="#FFB000" strokeWidth={2} />
                    <ChartXAxis dataKey="date" />
                    <ChartYAxis />
                    <ChartTooltip
                      content={<ChartTooltipContent formatter={(value) => [`${value}€`, "Chiffre d'affaires"]} />}
                    />
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFB000" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#FFB000" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance des pizzerias</CardTitle>
                <CardDescription>Nombre de commandes par pizzeria ce mois-ci</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    data={pizzeriasData}
                    xAxis={
                      <ChartAxisOptions
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        tickFormatter={(value) => value}
                      />
                    }
                    yAxis={
                      <ChartAxisOptions
                        dataKey="orders"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        tickFormatter={(value) => `${value} commandes`}
                      />
                    }
                  >
                    <ChartGrid vertical={false} />
                    <ChartBar dataKey="orders" fill="#9B1B1B" radius={[4, 4, 0, 0]} />
                    <ChartXAxis dataKey="name" />
                    <ChartYAxis />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value, name, props) => [value, "Commandes", `Revenu: ${props.payload.revenue}€`]}
                        />
                      }
                    />
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Commandes récentes */}
          <Card>
            <CardHeader>
              <CardTitle>Commandes récentes</CardTitle>
              <CardDescription>Aperçu des 5 dernières commandes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={order.avatar || "/placeholder.svg"} alt={order.customer} />
                        <AvatarFallback>{order.customer.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">{order.id}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{order.pizzeria}</div>
                    <div className="text-sm font-medium">{order.total.toFixed(2)} €</div>
                    <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                    <div className="text-xs text-muted-foreground">{order.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytiques</CardTitle>
              <CardDescription>Données analytiques détaillées</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contenu des analytiques à venir...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapports</CardTitle>
              <CardDescription>Rapports détaillés</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contenu des rapports à venir...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Centre de notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contenu des notifications à venir...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
