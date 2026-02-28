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
import { TrendingUp, TrendingDown, Minus, MoreHorizontal, Eye } from "lucide-react"
import Link from "next/link"
import { DataTable } from "@/components/data-table"
import { ThemeToggle } from "@/components/theme-toggle"
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

type FleetVehicle = {
    id: string
    status: string
    location: string
    driver: string
    load: string
}

export default function FleetDashboard() {
    const [stats, setStats] = React.useState<any[]>([])
    const [data, setData] = React.useState<FleetVehicle[]>([])
    const [loading, setLoading] = React.useState(true)
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

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    React.useEffect(() => {
        fetch("/data.json")
            .then((res) => res.json())
            .then((json) => setStats(json.stats))
    }, [])

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
                return (
                    <Badge
                        variant={status === "Moving" ? "default" : status === "Idle" ? "secondary" : "outline"}
                        className={status === "Moving" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20" : ""}
                    >
                        {status}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "location",
            header: "Location",
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

                    <Card className="shadow-sm border-muted-foreground/10">
                        <CardHeader className="bg-muted/50 pb-4">
                            <CardTitle className="text-base">Live Fleet Status</CardTitle>
                            <CardDescription>Real-time location and status of active vehicles (Server-side Pagination)</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <DataTable
                                columns={columns}
                                data={data}
                                pageCount={totalPages}
                                pageIndex={params.page - 1}
                                pageSize={params.pageSize}
                                loading={loading}
                                onPaginationChange={(page, pageSize) => setParams(p => ({ ...p, page, pageSize }))}
                                onSortingChange={(sort, direction) => setParams(p => ({ ...p, sort, direction }))}
                                onSearchChange={(search) => setParams(p => ({ ...p, search, page: 1 }))}
                            />
                        </CardContent>
                    </Card>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
