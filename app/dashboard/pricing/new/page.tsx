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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { ArrowLeft, Save, Sparkles, ShieldCheck } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewPricingRulePage() {
    const router = useRouter()
    const [submitting, setSubmitting] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        // Mock submission
        await new Promise(resolve => setTimeout(resolve, 1000))
        router.push("/dashboard/pricing")
    }

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
                                <BreadcrumbLink href="/dashboard/pricing">Pricing</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>New Rule</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <ThemeToggle />
                </header>

                <main className="flex flex-1 flex-col gap-8 p-6 lg:p-10 max-w-4xl mx-auto w-full">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" render={<Link href="/dashboard/pricing" />} className="rounded-full" nativeButton={false}>
                                <ArrowLeft className="size-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Create Pricing Rule</h1>
                                <p className="text-sm text-muted-foreground">Define new logic for automated fare calculations.</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid gap-8">
                        <Card className="shadow-sm border-muted-foreground/10">
                            <CardHeader className="bg-muted/30 border-b">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Sparkles className="size-4 text-orange-500" /> General Information
                                </CardTitle>
                                <CardDescription>Basic details about the pricing rule and its activation scope.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Rule Name</Label>
                                        <Input id="name" placeholder="e.g., Summer Weekend Prime" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Rule Type</Label>
                                        <Select required>
                                            <SelectTrigger id="type">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fixed">Fixed Surcharge</SelectItem>
                                                <SelectItem value="percentage">Percentage Multiplier</SelectItem>
                                                <SelectItem value="per_mile">Per Mile Additive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="value">Rule Value</Label>
                                        <Input id="value" placeholder="e.g., 5.00 or 15%" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="region">Target Region</Label>
                                        <Select defaultValue="global">
                                            <SelectTrigger id="region">
                                                <SelectValue placeholder="Select region" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="global">Global (All Regions)</SelectItem>
                                                <SelectItem value="downtown">Downtown Metro</SelectItem>
                                                <SelectItem value="suburbs">Suburban Areas</SelectItem>
                                                <SelectItem value="commercial">Industrial Hubs</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Rule Description (Internal)</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Explain the logic and purpose of this rule for auditing..."
                                        className="min-h-[100px]"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-muted-foreground/10">
                            <CardHeader className="bg-muted/30 border-b">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ShieldCheck className="size-4 text-emerald-500" /> Validation & Constraints
                                </CardTitle>
                                <CardDescription>Conditions that must be met for this rule to trigger.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-4">
                                <div className="p-4 rounded-xl border-2 border-dashed border-muted flex flex-col items-center justify-center gap-2 text-center py-10">
                                    <p className="text-sm font-medium text-muted-foreground underline underline-offset-4 cursor-pointer">
                                        + Add custom condition logic
                                    </p>
                                    <p className="text-xs text-muted-foreground px-10">
                                        You can trigger rules based on Weather (API), Traffic Density, or Fleet Capacity.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-center justify-end gap-3 pb-10">
                            <Button variant="ghost" type="button" render={<Link href="/dashboard/pricing" />} nativeButton={false}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting} className="min-w-[150px] shadow-lg bg-primary hover:bg-primary/90">
                                {submitting ? "Saving..." : "Save Pricing Rule"}
                                <Save className="ml-2 size-4 text-primary-foreground/50" />
                            </Button>
                        </div>
                    </form>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
