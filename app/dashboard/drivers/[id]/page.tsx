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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Star, ShieldCheck, Clock, Truck } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function DriverProfilePage() {
    const { id } = useParams()
    const [driver, setDriver] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        // In a real app, you'd fetch by ID. Here we filter from the list.
        fetch("/api/drivers?pageSize=100")
            .then(res => res.json())
            .then(json => {
                const found = json.data.find((d: any) => d.id === id)
                setDriver(found)
                setLoading(false)
            })
    }, [id])

    if (loading) return null
    if (!driver) return <div>Driver not found</div>

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
                                <BreadcrumbLink href="/dashboard/drivers">Drivers</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{driver.name}'s Profile</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <ThemeToggle />
                </header>

                <main className="flex flex-1 flex-col gap-8 p-6 lg:p-10 max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" render={<Link href="/dashboard/drivers" />} className="rounded-full" nativeButton={false}>
                            <ArrowLeft className="size-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{driver.name}</h1>
                            <div className="text-muted-foreground font-medium flex items-center gap-2">
                                Employee ID: <span className="text-foreground">{driver.id}</span>
                                <Separator orientation="vertical" className="h-3" />
                                <span className="flex items-center gap-1"><Star className="size-3 text-amber-500 fill-amber-500" /> {driver.rating} Rating</span>
                            </div>
                        </div>
                        <div className="ml-auto flex gap-3">
                            <Button variant="outline" className="rounded-full shadow-sm">Message</Button>
                            <Button className="rounded-full shadow-md">Assign Load</Button>
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="md:col-span-1 space-y-6">
                            <Card className="shadow-sm border-muted-foreground/10 overflow-hidden">
                                <div className="h-24 bg-primary/5 border-b flex items-center justify-center">
                                    <div className="flex aspect-square size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                                        <span className="text-2xl font-bold">{driver.name.charAt(0)}</span>
                                    </div>
                                </div>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                                            <Phone className="size-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{driver.contact}</p>
                                            <p className="text-xs text-muted-foreground">Mobile Phone</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                                            <Mail className="size-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{driver.name.toLowerCase().replace(' ', '.')}@engeez.ae</p>
                                            <p className="text-xs text-muted-foreground">Work Email</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                                            <MapPin className="size-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Dubai, UAE</p>
                                            <p className="text-xs text-muted-foreground">Base Location</p>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                                            <Calendar className="size-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{driver.experience} Experience</p>
                                            <p className="text-xs text-muted-foreground">Joined June 2021</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm border-muted-foreground/10">
                                <CardHeader>
                                    <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Verification</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Driving License</span>
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Verified</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Health Check</span>
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Safety Training</span>
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Q4 Completed</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="md:col-span-2 space-y-6">
                            <div className="grid gap-4 md:grid-cols-3">
                                <Card className="shadow-sm border-muted-foreground/10 bg-primary/5">
                                    <CardContent className="pt-6 flex items-center gap-4">
                                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <Truck className="size-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold">{driver.deliveries}</div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase">Total Shipments</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="shadow-sm border-muted-foreground/10 bg-orange-500/5">
                                    <CardContent className="pt-6 flex items-center gap-4">
                                        <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                            <Clock className="size-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold">98.5%</div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase">Punctuality</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="shadow-sm border-muted-foreground/10 bg-emerald-500/5">
                                    <CardContent className="pt-6 flex items-center gap-4">
                                        <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                            <ShieldCheck className="size-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold">0</div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase">Safety Incidents</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="shadow-sm border-muted-foreground/10">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                                        <CardDescription>Latest logs and completed routes</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm">View History</Button>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-0">
                                    <div className="flex gap-4">
                                        <div className="size-2 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                        <div>
                                            <p className="text-sm font-semibold">Completed Route ORD-55216</p>
                                            <p className="text-xs text-muted-foreground">Dubai Central to Doha Hub • Today, 10:24 AM</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="size-2 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                        <div>
                                            <p className="text-sm font-semibold">Customer Star Rating Received (5/5)</p>
                                            <p className="text-xs text-muted-foreground">"Ahmed was very professional and on time." • Yesterday</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="size-2 rounded-full bg-blue-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                                        <div>
                                            <p className="text-sm font-semibold">Vehicle Inspection Completed</p>
                                            <p className="text-xs text-muted-foreground">Truck V-1024 • 2 days ago</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm border-muted-foreground/10">
                                <CardHeader>
                                    <CardTitle className="text-base font-semibold">Performance Analytics</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground text-sm font-medium italic">
                                    Comparative performance charts would be rendered here.
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
