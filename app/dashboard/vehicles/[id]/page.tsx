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
import { ArrowLeft, Truck, Gauge, Calendar, ShieldCheck, MapPin, User, Settings2, Info, AlertTriangle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function VehicleDetailsPage() {
    const { id } = useParams()
    const [vehicle, setVehicle] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        fetch("/api/vehicles?pageSize=100")
            .then(res => res.json())
            .then(json => {
                const found = json.data.find((v: any) => v.id === id)
                setVehicle(found)
                setLoading(false)
            })
    }, [id])

    if (loading) return null
    if (!vehicle) return <div className="p-10 text-center">Vehicle not found</div>

    const fuel = parseInt(vehicle.fuelLevel)

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
                                <BreadcrumbLink href="/dashboard/vehicles">Vehicles</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{vehicle.id} Details</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <ThemeToggle />
                </header>

                <main className="flex flex-1 flex-col gap-8 p-6 lg:p-10 max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" render={<Link href="/dashboard/vehicles" />} className="rounded-full" nativeButton={false}>
                            <ArrowLeft className="size-5" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight">{vehicle.model}</h1>
                                <Badge variant={vehicle.status === "Active" ? "default" : "secondary"} className={vehicle.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}>
                                    {vehicle.status}
                                </Badge>
                            </div>
                            <div className="text-muted-foreground text-sm font-medium flex items-center gap-2 mt-1">
                                Vehicle ID: <span className="text-foreground">{vehicle.id}</span>
                                <Separator orientation="vertical" className="h-3" />
                                VIN: <span className="text-foreground">{vehicle.vin}</span>
                            </div>
                        </div>
                        <div className="ml-auto flex gap-3">
                            <Button variant="outline" className="rounded-full border-muted-foreground/20 shadow-sm">Report Issue</Button>
                            <Button className="rounded-full shadow-md bg-primary hover:bg-primary/90">Maintenance Mode</Button>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="md:col-span-2 shadow-sm border-muted-foreground/10 overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <Truck className="size-5" />
                                        </div>
                                        <CardTitle className="text-lg">Technical Specifications</CardTitle>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8 gap-2">
                                        <Settings2 className="size-4" /> Edit Specs
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="grid grid-cols-2 sm:grid-cols-4 border-b">
                                    <div className="p-6 border-r flex flex-col gap-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase">Type</p>
                                        <p className="font-bold text-base">{vehicle.type}</p>
                                    </div>
                                    <div className="p-6 border-r flex flex-col gap-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase">Year</p>
                                        <p className="font-bold text-base">{vehicle.year}</p>
                                    </div>
                                    <div className="p-6 border-r flex flex-col gap-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase">Mileage</p>
                                        <p className="font-bold text-base">{vehicle.mileage}</p>
                                    </div>
                                    <div className="p-6 flex flex-col gap-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase">Capacity</p>
                                        <p className="font-bold text-base">{vehicle.capacity}</p>
                                    </div>
                                </div>
                                <div className="p-8 grid gap-8 md:grid-cols-2">
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm font-medium">
                                                    <Gauge className="size-4 text-primary" /> Fuel Level
                                                </div>
                                                <span className={`text-sm font-bold ${fuel < 20 ? 'text-red-500' : 'text-emerald-600'}`}>{vehicle.fuelLevel}</span>
                                            </div>
                                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border">
                                                <div
                                                    className={`h-full transition-all duration-1000 ${fuel < 20 ? 'bg-red-500' : fuel < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                    style={{ width: vehicle.fuelLevel }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-muted-foreground/10">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                                                    <ShieldCheck className="size-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">Engine System</p>
                                                    <p className="text-xs text-muted-foreground">{vehicle.engineStatus}</p>
                                                </div>
                                            </div>
                                            <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600">
                                                    <Gauge className="size-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">Tire Pressure</p>
                                                    <p className="text-xs text-muted-foreground">{vehicle.tirePressure}</p>
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold text-orange-600">Optimal</p>
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                                                    <Calendar className="size-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">Last Service</p>
                                                    <p className="text-xs text-muted-foreground">{vehicle.lastMaintenance}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="shadow-sm border-muted-foreground/10">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="size-4 text-primary" />
                                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Live Telematics</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-slate-400">Current Base</span>
                                            <span className="text-xs font-bold text-emerald-400">Online</span>
                                        </div>
                                        <p className="text-lg font-bold tracking-tight">{vehicle.currentLocation}</p>
                                        <div className="h-[120px] bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                                            <span className="text-xs text-slate-500 font-medium italic">GIS Map Component</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm border-muted-foreground/10">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                        <User className="size-4 text-primary" />
                                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Assigned Driver</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3 p-3 rounded-xl border border-muted-foreground/10 hover:bg-muted/10 cursor-pointer transition-colors">
                                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {vehicle.currentDriver.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold leading-none">{vehicle.currentDriver}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Senior Operator</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="size-8">
                                            <Info className="size-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {vehicle.status === 'Maintenance' && (
                                <Card className="shadow-sm border-destructive/20 bg-destructive/5 overflow-hidden ring-1 ring-destructive/10">
                                    <CardHeader className="bg-destructive/10 pb-3">
                                        <div className="flex items-center gap-2 text-destructive">
                                            <AlertTriangle className="size-4" />
                                            <CardTitle className="text-sm font-bold uppercase tracking-wider">Active Alert</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <p className="text-sm font-medium text-destructive">Schedule service immediately. Engine pressure sensor failure detected at station hub A.</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
