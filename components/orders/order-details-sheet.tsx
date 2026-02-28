"use client"

import * as React from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Calendar,
    Clock,
    User,
    Package,
    Weight,
    MapPin,
    MessageSquare,
    Phone,
    Printer,
    RefreshCw,
    X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderDetailsSheetProps {
    order: {
        id: string
        customer: string
        destination: string
        status: string
        priority: string
        serviceType?: string
        createdAt?: string
        pickup?: string
        packageType?: string
        packageWeight?: string
        currentLocation?: string
        estimatedArrival?: string
    } | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OrderDetailsSheet({ order, open, onOpenChange }: OrderDetailsSheetProps) {
    if (!order) return null

    // Mock data for missing fields
    const details = {
        serviceType: order.serviceType || "Standard Delivery",
        createdAt: order.createdAt || "Oct 24, 2023 • 10:45 AM",
        pickup: order.pickup || "Warehouse A, Riyadh",
        packageType: order.packageType || "Palette",
        packageWeight: order.packageWeight || "450 kg",
        currentLocation: order.currentLocation || "Highway 40, Near Jeddah",
        estimatedArrival: order.estimatedArrival || "2:30 PM",
        driver: {
            name: "Ahmed Al-Sayed",
            id: "DRV-892314",
            avatar: "", // Add a mock avatar if needed
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Delivered": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            case "In Transit": return "bg-blue-500/10 text-blue-600 border-blue-500/20"
            case "Pickup": return "bg-amber-500/10 text-amber-600 border-amber-500/20"
            default: return "bg-slate-500/10 text-slate-600 border-slate-500/20"
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto p-0 border-l-0">
                <div className="flex flex-col h-full">
                    {/* Header Section */}
                    <div className="p-6 bg-slate-50/50 dark:bg-slate-900/20 border-b">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold tracking-tight">Order {order.id}</h2>
                                <Badge variant="outline" className={cn("font-semibold uppercase text-[10px]", getStatusColor(order.status))}>
                                    {order.status}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                            <Calendar className="h-4 w-4" />
                            <span>Created on {details.createdAt}</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {/* General Information */}
                        <section className="p-6 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">General Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Customer</label>
                                    <p className="font-semibold text-sm">{order.customer}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Service Type</label>
                                    <p className="font-semibold text-sm">{details.serviceType}</p>
                                </div>
                            </div>
                        </section>

                        <Separator className="mx-6 w-auto opacity-50" />

                        {/* Route Information */}
                        <section className="p-6 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Route Information</h3>
                            <div className="relative pl-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
                                {/* Pickup */}
                                <div className="relative">
                                    <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                            Pickup Location
                                        </label>
                                        <p className="font-semibold text-sm">{details.pickup}</p>
                                        <p className="text-xs text-muted-foreground">Completed • 08:30 AM</p>
                                    </div>
                                </div>

                                {/* Current */}
                                <div className="relative">
                                    <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full border-2 border-blue-500 bg-blue-500 animate-pulse" />
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1">
                                            Current Location
                                        </label>
                                        <p className="font-semibold text-sm">{details.currentLocation}</p>
                                        <p className="text-xs text-blue-600/80 font-medium">Estimated Arrival: {details.estimatedArrival}</p>
                                    </div>
                                </div>

                                {/* Destination */}
                                <div className="relative">
                                    <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full border-2 border-slate-300 bg-background" />
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Destination</label>
                                        <p className="font-semibold text-sm">{order.destination}</p>
                                        <p className="text-xs text-muted-foreground">Pending Arrival</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <Separator className="mx-6 w-auto opacity-50" />

                        {/* Consignment Details */}
                        <section className="p-6 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Consignment Details</h3>
                            <div className="grid grid-cols-3 gap-4 bg-muted/30 p-4 rounded-xl border border-muted-foreground/5">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Package className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-bold uppercase">Package</span>
                                    </div>
                                    <p className="font-bold text-sm">{details.packageType}</p>
                                </div>
                                <div className="space-y-1 text-center">
                                    <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                                        <Weight className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-bold uppercase">Weight</span>
                                    </div>
                                    <p className="font-bold text-sm">{details.packageWeight}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <div className="flex items-center justify-end gap-1.5 text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-bold uppercase">Priority</span>
                                    </div>
                                    <Badge variant={order.priority === "High" ? "destructive" : order.priority === "Medium" ? "default" : "secondary"} className="text-[9px] h-5 py-0 px-1.5">
                                        {order.priority.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                        </section>

                        <Separator className="mx-6 w-auto opacity-50" />

                        {/* Assigned Driver */}
                        <section className="p-6 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Assigned Driver</h3>
                            <div className="p-4 rounded-2xl border bg-card/40 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border shadow-sm">
                                        <AvatarImage src={details.driver.avatar} />
                                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">AS</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-0.5">
                                        <p className="font-bold text-sm leading-none">{details.driver.name}</p>
                                        <p className="text-[11px] text-muted-foreground font-medium">Driver ID: {details.driver.id}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-muted-foreground/20">
                                        <MessageSquare className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" className="h-8 text-[11px] border-emerald-500/20 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 font-bold px-3 transition-colors">
                                        <Phone className="mr-1.5 h-3.5 w-3.5" />
                                        Contact
                                    </Button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Footer Action Bar */}
                    <SheetFooter className="p-6 flex-row gap-4 border-t bg-background sticky bottom-0">
                        <Button variant="outline" className="flex-1 font-bold h-11 border-muted-foreground/20 hover:bg-muted/50 transition-colors">
                            <Printer className="mr-2 h-4 w-4" />
                            Print Manifest
                        </Button>
                        <Button className="flex-1 font-bold h-11 bg-primary hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Update Status
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    )
}
