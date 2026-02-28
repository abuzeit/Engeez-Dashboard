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
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, DollarSign, Wallet, Clock, CheckCircle2, Timer, TrendingUp } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { ThemeToggle } from "@/components/theme-toggle"
import { Toaster, toast } from "sonner"
import { UpdatePayoutDialog } from "@/components/payouts/update-payout-dialog"
import { ColumnDef } from "@tanstack/react-table"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Payout = {
    id: string
    driver: string
    amount: string
    status: string
    requestDate: string
    bank: string
    accountEnd: string
    payoutType: string
    walletTotalBalance: string
    walletAvailableBalance: string
}

export default function TopUpsPage() {
    const [data, setData] = React.useState<Payout[]>([])
    const [loading, setLoading] = React.useState(true)
    const [selectedPayout, setSelectedPayout] = React.useState<Payout | null>(null)
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

        const res = await fetch(`/api/topups?${query}`)
        const json = await res.json()
        setData(json.data)
        setTotalPages(json.totalPages)
        setLoading(false)
    }, [params.page, params.pageSize, params.sort, params.direction, params.search])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    const columns: ColumnDef<Payout>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={(table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")) as any}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: "Request ID",
            cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("id")}</div>
        },
        {
            accessorKey: "driver",
            header: "Driver",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                        {row.original.driver.charAt(0)}
                    </div>
                    <div className="font-semibold">{row.getValue("driver")}</div>
                </div>
            ),
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) => {
                const payoutType = row.original.payoutType
                const amount = row.getValue("amount") as string
                return (
                    <div className="flex flex-col gap-1">
                        <div className={cn("font-bold text-sm", payoutType === "Top Up" ? "text-blue-600" : "text-emerald-600")}>
                            {payoutType === "Top Up" ? "+" : ""}{amount}
                        </div>
                        <Badge variant="outline" className={cn("w-fit text-[10px] px-1.5 py-0 h-4 font-medium", payoutType === "Top Up" ? "border-blue-500/20 text-blue-600 bg-blue-500/10" : "border-emerald-500/20 text-emerald-600 bg-emerald-500/10")}>
                            {payoutType}
                        </Badge>
                    </div>
                )
            }
        },
        {
            id: "walletBalance",
            header: "Wallet Balance",
            cell: ({ row }) => {
                const total = row.original.walletTotalBalance
                const available = row.original.walletAvailableBalance
                return (
                    <div className="flex flex-col gap-1 text-[11px] whitespace-nowrap">
                        <div className="flex justify-between gap-3 font-semibold text-foreground">
                            <span className="text-muted-foreground font-normal">Available:</span>
                            <span>{available}</span>
                        </div>
                        <div className="flex justify-between gap-3 text-muted-foreground">
                            <span className="font-normal">Total:</span>
                            <span>{total}</span>
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                const variants: Record<string, string> = {
                    Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
                    Approved: "bg-blue-500/10 text-blue-600 border-blue-500/20",
                    Processing: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
                    Completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                    Cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
                }
                return (
                    <Badge variant="outline" className={variants[status] || ""}>
                        {status}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "bank",
            header: "Bank Account",
            cell: ({ row }) => (
                <div className="text-xs">
                    <div className="font-medium">{row.original.bank}</div>
                    <div className="text-muted-foreground">{row.original.accountEnd}</div>
                </div>
            )
        },
        {
            accessorKey: "requestDate",
            header: "Date",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const payout = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 p-0")}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>{payout.payoutType === "Top Up" ? "Approve Top Up" : "Approve Payout"}</DropdownMenuItem>
                                <DropdownMenuItem>Reject Request</DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>View Driver Profile</DropdownMenuItem>
                                <DropdownMenuItem>Download Receipt</DropdownMenuItem>
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
                                <BreadcrumbLink href="/dashboard">
                                    Dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Top Ups</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <ThemeToggle />
                </header>

                <main className="flex flex-1 flex-col gap-6 p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight">Top Up Requests</h1>
                            <p className="text-sm text-muted-foreground text-balance max-w-lg">
                                Review and manage driver wallet top-up requests. Verify associated funds before approval.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2">
                                <DollarSign className="h-4 w-4" /> Export Report
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="shadow-sm border-muted-foreground/10 bg-card overflow-hidden relative group hover:border-primary/20 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Clock className="size-12" />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <Wallet className="h-4 w-4 text-primary" /> Total Pending
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$3,170.50</div>
                                <p className="text-xs text-muted-foreground mt-1">From 8 requests this week</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-muted-foreground/10 bg-card overflow-hidden relative group hover:border-primary/20 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <CheckCircle2 className="size-12" />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-blue-500" /> Processed Today
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$12,400.00</div>
                                <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
                                    <ArrowUpDown className="h-3 w-3" /> 15 Successful payouts
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-muted-foreground/10 bg-card overflow-hidden relative group hover:border-primary/20 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Timer className="size-12" />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <Timer className="h-4 w-4 text-amber-500" /> Average Processing Time
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1.4 Days</div>
                                <p className="text-xs text-muted-foreground mt-1">Within SLA targets</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="shadow-sm border-muted-foreground/10 overflow-hidden mt-2">
                        <CardHeader className="bg-muted/50 pb-4 border-b">
                            <CardTitle className="text-base font-semibold">Request Queue</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <DataTable
                                tableId="topups_table"
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
                                    setSelectedPayout(row as Payout)
                                    setUpdateDialogOpen(true)
                                }}
                                onDelete={async (rows) => {
                                    const ids = rows.map((r: any) => r.id)
                                    await fetch('/api/topups/bulk', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) })
                                    toast.success(`Deleted ${ids.length} records!`)
                                    fetchData()
                                }}
                                renderMultiUpdateDialog={(rows, onActionComplete) => (
                                    <MultiUpdateDialog
                                        rows={rows}
                                        label="Top Ups"
                                        endpoint="topups"
                                        statuses={['Approved', 'Pending', 'Processing', 'Rejected']}
                                        onSuccess={() => { fetchData(); onActionComplete(); }}
                                    />
                                )}
                            />
                        </CardContent>
                    </Card>

                    <UpdatePayoutDialog
                        payout={selectedPayout}
                        open={updateDialogOpen}
                        onOpenChange={setUpdateDialogOpen}
                        onSuccess={fetchData}
                        typeLabel="Top Up"
                    />

                    <Toaster position="bottom-right" closeButton richColors />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}