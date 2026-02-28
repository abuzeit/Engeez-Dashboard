"use client"

import { MultiUpdateDialog } from "@/components/multi-update-dialog"
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
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, ArrowUpDown, MoreHorizontal, Settings2, Calculator } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { DataTable } from "@/components/data-table"
import { Toaster, toast } from "sonner"
import { UpdatePricingDialog } from "@/components/pricing/update-pricing-dialog"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type PricingRule = {
    id: string
    name: string
    type: string
    value: string
    region: string
    status: string
    lastUpdated: string
}

export default function PricingPage() {
    const [data, setData] = React.useState<PricingRule[]>([])
    const [loading, setLoading] = React.useState(true)
    const [selectedPricing, setSelectedPricing] = React.useState<PricingRule | null>(null)
    const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false)
    const [totalPages, setTotalPages] = React.useState(0)
    const [params, setParams] = React.useState({
        page: 1,
        pageSize: 10,
        sort: "id",
        direction: "asc" as "asc" | "desc",
        search: ""
    })

    const fetchData = React.useCallback(async () => {
        setLoading(true)
        const query = new URLSearchParams({
            page: params.page.toString(),
            pageSize: params.pageSize.toString(),
            sort: params.sort,
            direction: params.direction,
            search: params.search
        }).toString()

        const res = await fetch(`/api/pricing?${query}`)
        const json = await res.json()
        setData(json.data)
        setTotalPages(json.totalPages)
        setLoading(false)
    }, [params.page, params.pageSize, params.sort, params.direction, params.search])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    const columns: ColumnDef<PricingRule>[] = [
        {
            accessorKey: "name",
            header: "Rule Name",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 font-bold">
                        <Settings2 className="size-4" />
                    </div>
                    <div className="font-semibold">{row.getValue("name")}</div>
                </div>
            ),
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => <Badge variant="secondary">{row.getValue("type")}</Badge>
        },
        {
            accessorKey: "value",
            header: "Value",
            cell: ({ row }) => <div className="font-bold text-primary">{row.getValue("value")}</div>
        },
        {
            accessorKey: "region",
            header: "Region",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return (
                    <Badge
                        variant={status === "Active" ? "default" : "outline"}
                        className={status === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : ""}
                    >
                        {status}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "lastUpdated",
            header: "Last Sync",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const rule = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 p-0")}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit Configuration</DropdownMenuItem>
                                <DropdownMenuItem>Duplicate Rule</DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="text-destructive">Archive Rule</DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

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
                                <BreadcrumbPage>Pricing Rules</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <ThemeToggle />
                </header>

                <main className="flex flex-1 flex-col gap-6 p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight">Dynamic Pricing Engine</h1>
                            <p className="text-sm text-muted-foreground">
                                Configure how fares are calculated based on time, distance, and region-specific surcharges.
                            </p>
                        </div>
                        <Button className="gap-2 rounded-full shadow-lg" render={<Link href="/dashboard/pricing/new" />} nativeButton={false}>
                            <Plus className="h-4 w-4" /> Add New Rule
                        </Button>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600">
                            <Calculator className="size-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Calculation Strategy: Weighted Regional Priority</p>
                            <p className="text-xs text-muted-foreground text-balance">Multiple rules applied simultaneously are resolved using the highest priority value for surcharges and additives.</p>
                        </div>
                    </div>

                    <Card className="shadow-sm border-muted-foreground/10 overflow-hidden">
                        <CardHeader className="bg-muted/50 pb-4 border-b">
                            <CardTitle className="text-base font-semibold">Rule Definitions</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <DataTable
                                tableId="pricing_table"
                                columns={columns}
                                data={data}
                                pageCount={totalPages}
                                pageIndex={params.page - 1}
                                pageSize={params.pageSize}
                                loading={loading}
                                onPaginationChange={(page, pageSize) => setParams(p => ({ ...p, page, pageSize }))}
                                onSortingChange={(sort, direction) => setParams(p => ({ ...p, sort, direction }))}
                                onSearchChange={(search) => setParams(p => ({ ...p, search, page: 1 }))}
                                onUpdate={(row) => {
                                    setSelectedPricing(row as PricingRule)
                                    setUpdateDialogOpen(true)
                                }}
                                onDelete={async (rows) => {
                                    const ids = rows.map((r: any) => r.id)
                                    await fetch('/api/pricing/bulk', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) })
                                    toast.success(`Operation complete`)
                                    fetchData()
                                }}
                            
                                renderMultiUpdateDialog={(rows, onActionComplete) => (
                                    <MultiUpdateDialog
                                        rows={rows}
                                        label="Pricing Rules"
                                        endpoint="pricing"
                                        statuses={['Active', 'Inactive']}
                                        onSuccess={() => { fetchData(); onActionComplete(); }}
                                    />
                                )}
                            />
                        </CardContent>
                    </Card>

                    <UpdatePricingDialog
                        pricing={selectedPricing}
                        open={updateDialogOpen}
                        onOpenChange={setUpdateDialogOpen}
                        onSuccess={fetchData}
                    />

                    <Toaster position="bottom-right" closeButton richColors />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}