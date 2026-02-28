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
import { Plus, ArrowUpDown, MoreHorizontal, Truck, Eye } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
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

type Vehicle = {
    id: string
    type: string
    capacity: string
    fuelLevel: string
    lastMaintenance: string
    status: string
}

export default function VehiclesPage() {
    const [data, setData] = React.useState<Vehicle[]>([])
    const [loading, setLoading] = React.useState(true)
    const [totalPages, setTotalPages] = React.useState(0)
    const [params, setParams] = React.useState({
        page: 1,
        pageSize: 5,
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

        const res = await fetch(`/api/vehicles?${query}`)
        const json = await res.json()
        setData(json.data)
        setTotalPages(json.totalPages)
        setLoading(false)
    }, [params.page, params.pageSize, params.sort, params.direction, params.search])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    const columns: ColumnDef<Vehicle>[] = [
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
                    className="flex items-center gap-2 group hover:underline underline-offset-4"
                >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 group-hover:bg-orange-500/20 transition-colors">
                        <Truck className="size-4" />
                    </div>
                    <div className="font-semibold">{row.getValue("id")}</div>
                </Link>
            ),
        },
        {
            accessorKey: "type",
            header: "Type",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return (
                    <Badge
                        variant={status === "Active" ? "default" : "outline"}
                        className={status === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : status === "Maintenance" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : ""}
                    >
                        {status}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "capacity",
            header: "Capacity",
        },
        {
            accessorKey: "fuelLevel",
            header: "Fuel",
            cell: ({ row }) => {
                const fuel = parseInt(row.getValue("fuelLevel") as string)
                return (
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-16 rounded-full bg-slate-200 overflow-hidden">
                            <div
                                className={`h-full ${fuel < 25 ? 'bg-red-500' : fuel < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                style={{ width: `${fuel}%` }}
                            />
                        </div>
                        <span className="text-xs font-medium">{fuel}%</span>
                    </div>
                )
            }
        },
        {
            accessorKey: "lastMaintenance",
            header: "Last Sync",
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
                                    Copy VIN / ID
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>Schedule Maintenance</DropdownMenuItem>
                                <DropdownMenuItem>Assign Driver</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Decommission</DropdownMenuItem>
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
                                <BreadcrumbPage>Fleet Inventory</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <ThemeToggle />
                </header>

                <main className="flex flex-1 flex-col gap-6 p-6">
                    <Card className="shadow-sm border-muted-foreground/10 overflow-hidden">
                        <CardHeader className="bg-muted/50 pb-4 flex flex-row items-center justify-between space-y-0">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-semibold">Vehicle List</CardTitle>
                                <CardDescription>Comprehensive overview of all trucks, trailers, and vans in your fleet.</CardDescription>
                            </div>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" /> New Vehicle
                            </Button>
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
