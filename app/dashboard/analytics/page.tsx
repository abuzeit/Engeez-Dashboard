"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts'
import { ArrowUpRight, ArrowDownRight, Activity, DollarSign, Package, Users } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AnalyticsPage() {
    const [data, setData] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        fetch("/api/analytics")
            .then(res => res.json())
            .then(json => {
                setData(json)
                setLoading(false)
            })
    }, [])

    if (loading) return null

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background z-10">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb className="flex-1">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Analytics & Insights</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <ThemeToggle />
                </header>

                <main className="flex flex-1 flex-col gap-6 p-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="shadow-sm border-muted-foreground/10 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <DollarSign className="size-12" />
                            </div>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$344,000</div>
                                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                                    <ArrowUpRight className="size-3" /> +20.1% <span className="text-muted-foreground font-normal">from last month</span>
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-muted-foreground/10 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Package className="size-12" />
                            </div>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Deliveries</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+1,624</div>
                                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                                    <ArrowUpRight className="size-3" /> +12.5% <span className="text-muted-foreground font-normal">from last month</span>
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-muted-foreground/10 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Activity className="size-12" />
                            </div>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">On-Time Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">94.2%</div>
                                <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                                    <ArrowDownRight className="size-3" /> -0.8% <span className="text-muted-foreground font-normal">from last week</span>
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-muted-foreground/10 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Users className="size-12" />
                            </div>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Drivers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">482</div>
                                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                                    <ArrowUpRight className="size-3" /> +3 <span className="text-muted-foreground font-normal">this month</span>
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="lg:col-span-4 shadow-sm border-muted-foreground/10">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Monthly Performance</CardTitle>
                                <CardDescription>Revenue and volume growth over the last 6 months</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.monthlyPerformance}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ fill: '#f1f5f9' }}
                                        />
                                        <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-3 shadow-sm border-muted-foreground/10">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Order Status Distribution</CardTitle>
                                <CardDescription>Real-time breakdown of current load statuses</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px] flex flex-col items-center justify-center">
                                <ResponsiveContainer width="100%" height="80%">
                                    <PieChart>
                                        <Pie
                                            data={data.statusDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="count"
                                            nameKey="status"
                                        >
                                            {data.statusDistribution.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="grid grid-cols-2 gap-4 w-full px-4">
                                    {data.statusDistribution.map((entry: any, index: number) => (
                                        <div key={entry.status} className="flex items-center gap-2">
                                            <div className="size-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <span className="text-xs font-medium text-muted-foreground">{entry.status}: <span className="text-foreground">{entry.count}</span></span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="shadow-sm border-muted-foreground/10">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Volume Trends</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.monthlyPerformance}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="deliveries"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ fill: '#10b981', r: 4 }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
