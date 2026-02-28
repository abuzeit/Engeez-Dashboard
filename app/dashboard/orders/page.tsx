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
import { Plus, ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Package } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { OrderDetailsSheet } from "@/components/orders/order-details-sheet"
import { UpdateOrderDialog } from "@/components/orders/update-order-dialog"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
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
import { ThemeToggle } from "@/components/theme-toggle"

type Order = {
    id: string
    customer: string
    destination: string
    status: string
    priority: string
    serviceType?: string
}

export default function OrdersPage() {
    const [data, setData] = React.useState<Order[]>([])
    const [loading, setLoading] = React.useState(true)
    const [totalPages, setTotalPages] = React.useState(0)
    const [params, setParams] = React.useState({
        page: 1,
        pageSize: 5,
        sort: "id",
        direction: "desc" as "asc" | "desc",
        search: ""
    })
    const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
    const [sheetOpen, setSheetOpen] = React.useState(false)
    const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false)

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order)
        setSheetOpen(true)
    }

    const handleUpdateOrder = (order: Order) => {
        setSelectedOrder(order)
        setUpdateDialogOpen(true)
    }

    const fetchData = React.useCallback(async () => {
        setLoading(true)
        const query = new URLSearchParams({
            page: params.page.toString(),
            pageSize: params.pageSize.toString(),
            sort: params.sort,
            direction: params.direction,
            search: params.search
        }).toString()

        const res = await fetch(`/api/orders?${query}`)
        const json = await res.json()
        setData(json.data)
        setTotalPages(json.totalPages)
        setLoading(false)
    }, [params.page, params.pageSize, params.sort, params.direction, params.search])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    const columns: ColumnDef<Order>[] = [
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
            id: "id",
            accessorKey: "id",
            header: "Order ID",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => handleViewDetails(row.original)}>
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/20 transition-colors">
                        <Package className="size-4" />
                    </div>
                    <div className="font-semibold text-primary">{row.getValue("id")}</div>
                </div>
            ),
        },
        {
            id: "customer",
            accessorKey: "customer",
            header: "Customer",
            cell: ({ row }) => <div className="font-medium">{row.getValue("customer")}</div>,
        },
        {
            id: "destination",
            accessorKey: "destination",
            header: "Destination",
        },
        {
            id: "serviceType",
            accessorKey: "serviceType",
            header: "Service Type",
            cell: ({ row }) => row.getValue("serviceType") || "Standard Delivery",
        },
        {
            id: "status",
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return (
                    <Badge
                        variant="outline"
                        className={
                            status === "Delivered" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                status === "In Transit" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                                    status === "Pickup" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                        "bg-slate-500/10 text-slate-600 border-slate-500/20"
                        }
                    >
                        {status}
                    </Badge>
                )
            },
        },
        {
            id: "priority",
            accessorKey: "priority",
            header: "Priority",
            cell: ({ row }) => {
                const priority = row.getValue("priority") as string
                return (
                    <Badge variant={priority === "High" ? "destructive" : priority === "Medium" ? "default" : "secondary"}>
                        {priority}
                    </Badge>
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const order = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 p-0")}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>
                                    Copy Order ID
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => handleViewDetails(order)}>View details</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateOrder(order)}>Update order</DropdownMenuItem>
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
                                <BreadcrumbPage>Orders</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <ThemeToggle />
                </header>

                <main className="flex flex-1 flex-col gap-6 p-6">
                    <Card className="shadow-sm border-muted-foreground/10 overflow-hidden">
                        <CardHeader className="bg-muted/50 pb-4 flex flex-row items-center justify-between space-y-0">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-semibold">Live Order Tracker</CardTitle>
                                <CardDescription>Manage and monitor all active shipments with server-side processing.</CardDescription>
                            </div>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" /> New Order
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <DataTable
                                tableId="orders_table"
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
                                    setSelectedOrder(row)
                                    setUpdateDialogOpen(true)
                                }}
                                onDelete={async (rows) => {
                                    const ids = rows.map((r: any) => r.id)
                                    await fetch('/api/orders/bulk', {
                                        method: 'DELETE',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ ids })
                                    })
                                    toast.success(`Deleted ${ids.length} orders!`)
                                    fetchData()
                                }}
                                renderMultiUpdateDialog={(rows, onActionComplete) => (
                                    <MultiUpdateDialog
                                        rows={rows}
                                        label="Orders"
                                        endpoint="orders"
                                        statuses={['PENDING', 'PROCESSING', 'DELIVERED']}
                                        onSuccess={() => { fetchData(); onActionComplete(); }}
                                    />
                                )}
                            />
                        </CardContent>
                    </Card>

                    <OrderDetailsSheet
                        order={selectedOrder}
                        open={sheetOpen}
                        onOpenChange={setSheetOpen}
                    />

                    <UpdateOrderDialog
                        order={selectedOrder}
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