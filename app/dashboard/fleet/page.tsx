"use client"

import { MultiUpdateDialog } from "@/components/multi-update-dialog"
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
import { TrendingUp, TrendingDown, Minus, MoreHorizontal, Eye, Map, Table } from "lucide-react"
import Link from "next/link"
import { DataTable } from "@/components/data-table"
import { Toaster, toast } from "sonner"
import { UpdateFleetDialog } from "@/components/fleet/update-fleet-dialog"
import { FleetMapView } from "@/components/fleet-map-view"
import { ThemeToggle } from "@/components/theme-toggle"
import { ColumnDef } from "@tanstack/react-table"
import { Button, buttonVariants } from "@/components/ui/button"
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

type FleetVehicle = {
    id: string
    status: string
    location: string
    latitude: number
    longitude: number
    driver: string
    load: string
}

export default function FleetDashboard() {
    const [stats, setStats] = React.useState<any[]>([])
    const [viewMode, setViewModeState] = React.useState<"table" | "map">("table")
    const [data, setData] = React.useState<FleetVehicle[]>([])
    const [allData, setAllData] = React.useState<FleetVehicle[]>([]) // Used for the map
    const [loading, setLoading] = React.useState(true)
    const [selectedFleet, setSelectedFleet] = React.useState<FleetVehicle | null>(null)
    const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false)
    const [totalPages, setTotalPages] = React.useState(0)
    const [params, setParams] = React.useState({
        page: 1,
        pageSize: 5,
        sort: "",
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

        const res = await fetch(`/api/fleet?${query}`)
        const json = await res.json()
        setData(json.data)
        setTotalPages(json.totalPages)
        setLoading(false)
    }, [params.page, params.pageSize, params.sort, params.direction, params.search])

    const fetchAllData = React.useCallback(async () => {
        try {
            const res = await fetch(`/api/fleet/all`)
            const json = await res.json()
            setAllData(json.data || [])
        } catch (error) {
            console.error("Failed to fetch all fleet data:", error)
        }
    }, [])

    React.useEffect(() => {
        fetchData()
        fetchAllData()
    }, [fetchData, fetchAllData])

    React.useEffect(() => {
        const savedView = localStorage.getItem("ensi_fleet_view") as "table" | "map"
        if (savedView) setViewModeState(savedView)

        fetch("/data.json")
            .then((res) => res.json())
            .then((json) => setStats(json.stats))
    }, [])

    const setViewMode = (mode: "table" | "map") => {
        setViewModeState(mode)
        localStorage.setItem("ensi_fleet_view", mode)
    }

    const columns: ColumnDef<FleetVehicle>[] = [
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
            header: "Vehicle ID",
            cell: ({ row }) => (
                <Link
                    href={`/dashboard/vehicles/${row.getValue("id")}`}
                    className="font-medium hover:underline underline-offset-4 text-primary"
                >
                    {row.getValue("id")}
                </Link>
            ),
        },
        {
            accessorKey: "driver",
            header: "Driver",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string

                const getStatusColor = (status: string) => {
                    switch (status) {
                        case "Moving": return "#10b981" // Emerald
                        case "Idle": return "#eab308" // Yellow
                        case "Loading": return "#3b82f6" // Blue
                        case "Maintenance": return "#ef4444" // Red
                        default: return "#6b7280" // Gray
                    }
                }

                return (
                    <span
                        className="text-xs px-2 py-0.5 rounded-full text-white shadow-sm"
                        style={{ backgroundColor: getStatusColor(status) }}
                    >
                        {status}
                    </span>
                )
            },
        },
        {
            accessorKey: "location",
            header: "Location",
        },
        {
            accessorKey: "latitude",
            header: "Latitude",
            cell: ({ row }) => {
                const val = row.getValue("latitude") as number | undefined
                return <span className="font-mono text-xs">{val != null ? val.toFixed(4) : "—"}</span>
            },
        },
        {
            accessorKey: "longitude",
            header: "Longitude",
            cell: ({ row }) => {
                const val = row.getValue("longitude") as number | undefined
                return <span className="font-mono text-xs">{val != null ? val.toFixed(4) : "—"}</span>
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const vehicle = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 p-0")}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem render={<Link href={`/dashboard/vehicles/${vehicle.id}`} />} nativeButton={false}>
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(vehicle.id)}>
                                    Copy Vehicle ID
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>Track live</DropdownMenuItem>
                                <DropdownMenuItem>View maintenance logs</DropdownMenuItem>
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
                                <BreadcrumbPage>Fleet</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <ThemeToggle />
                </header>

                <main className="flex flex-1 flex-col gap-6 p-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat: any, i: number) => (
                            <Card key={i} className="shadow-sm border-muted-foreground/10">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                                    {stat.trend === "up" && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                                    {stat.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                                    {stat.trend === "neutral" && <Minus className="h-4 w-4 text-muted-foreground" />}
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className={`text-xs mt-1 ${stat.trend === 'up' ? 'text-emerald-500' : stat.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
                                        {stat.change} from last month
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="shadow-sm border-muted-foreground/10 flex-col flex h-full min-h-[700px]">
                        <CardHeader className="bg-muted/50 pb-4 flex flex-row items-start justify-between">
                            <div>
                                <CardTitle className="text-base">Live Fleet Status</CardTitle>
                                <CardDescription>Real-time location and status of active vehicles</CardDescription>
                            </div>
                            <div className="flex border rounded-md overflow-hidden bg-background">
                                <Button
                                    variant={viewMode === "table" ? "secondary" : "ghost"}
                                    size="sm"
                                    className="rounded-none px-3"
                                    onClick={() => setViewMode("table")}
                                >
                                    <Table className="h-4 w-4 mr-2" /> Table
                                </Button>
                                <Button
                                    variant={viewMode === "map" ? "secondary" : "ghost"}
                                    size="sm"
                                    className="rounded-none px-3"
                                    onClick={() => setViewMode("map")}
                                >
                                    <Map className="h-4 w-4 mr-2" /> Map
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0 flex-1 relative mt-4">
                            {viewMode === "table" ? (
                                <DataTable
                                    tableId="fleet_table"
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
                                        setSelectedFleet(row as FleetVehicle)
                                        setUpdateDialogOpen(true)
                                    }}
                                    onDelete={async (rows) => {
                                        const ids = rows.map((r: any) => r.vehicleId || r.id)
                                        await fetch('/api/fleet/bulk', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) })
                                        toast.success(`Bulk operation complete!`)
                                        fetchData()
                                    }}
                                />
                            ) : (
                                <FleetMapView data={allData} />
                            )}
                        </CardContent>
                    </Card>

                    <UpdateFleetDialog
                        fleet={selectedFleet}
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