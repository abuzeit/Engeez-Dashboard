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
import { Plus, ArrowUpDown, MoreHorizontal, User, Eye } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Toaster, toast } from "sonner"
import { UpdateDriverDialog } from "@/components/drivers/update-driver-dialog"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Driver = {
    id: string
    name: string
    status: string
    rating: number
    deliveries: number
    experience: string
    contact: string
    avatar?: string
}

export default function DriversPage() {
    const [data, setData] = React.useState<Driver[]>([])
    const [loading, setLoading] = React.useState(true)
    const [totalPages, setTotalPages] = React.useState(0)
    const [selectedDriver, setSelectedDriver] = React.useState<Driver | null>(null)
    const [driverToUpdate, setDriverToUpdate] = React.useState<Driver | null>(null)
    const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false)
    const [params, setParams] = React.useState({
        page: 1,
        pageSize: 5,
        sort: "name",
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

        const res = await fetch(`/api/drivers?${query}`)
        const json = await res.json()
        setData(json.data)
        setTotalPages(json.totalPages)
        setLoading(false)
    }, [params.page, params.pageSize, params.sort, params.direction, params.search])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    const columns: ColumnDef<Driver>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={(table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() ? "indeterminate" : false)) as any}
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
            accessorKey: "name",
            header: "Driver Name",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <User className="size-4" />
                    </div>
                    <div className="font-semibold">{row.getValue("name")}</div>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return (
                    <Badge
                        variant={status === "Active" ? "default" : "outline"}
                        className={status === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : status === "Suspended" ? "bg-destructive/10 text-destructive border-destructive/20" : ""}
                    >
                        {status}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "rating",
            header: "Rating",
            cell: ({ row }) => <div className="font-medium text-amber-600">★ {row.getValue("rating")}</div>,
        },
        {
            accessorKey: "deliveries",
            header: "Deliveries",
        },
        {
            accessorKey: "experience",
            header: "Experience",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const driver = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 p-0")}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setSelectedDriver(driver)}>
                                    <Eye className="mr-2 h-4 w-4" /> View Quick Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem render={<Link href={`/dashboard/drivers/${driver.id}`} />} nativeButton={false}>
                                    View Full Profile
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(driver.contact)}>
                                    Copy Contact Info
                                </DropdownMenuItem>
                                <DropdownMenuItem>Send Message</DropdownMenuItem>
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
                                <BreadcrumbPage>Driver Management</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <ThemeToggle />
                </header>

                <main className="flex flex-1 flex-col gap-6 p-6">
                    <Card className="shadow-sm border-muted-foreground/10 overflow-hidden">
                        <CardHeader className="bg-muted/50 pb-4 flex flex-row items-center justify-between space-y-0">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-semibold">Registered Drivers</CardTitle>
                                <CardDescription>Monitor performance, ratings, and active status of all fleet drivers.</CardDescription>
                            </div>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" /> New Driver
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <DataTable
                                tableId="drivers_table"
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
                                    setDriverToUpdate(row as Driver)
                                    setUpdateDialogOpen(true)
                                }}
                            />
                        </CardContent>
                    </Card>

                    <Sheet open={!!selectedDriver} onOpenChange={(open) => !open && setSelectedDriver(null)}>
                        <SheetContent className="sm:max-w-xl border-l shadow-2xl p-0 overflow-y-auto">
                            <SheetHeader className="p-6 pb-0">
                                <div className="flex items-center gap-4 mb-2">
                                    <Avatar className="h-16 w-16 border-2 border-primary/20 p-1">
                                        <AvatarImage src={selectedDriver?.avatar} />
                                        <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                                            {selectedDriver?.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <SheetTitle className="text-2xl font-bold">{selectedDriver?.name}</SheetTitle>
                                        <SheetDescription className="font-medium text-emerald-600 flex items-center gap-1">
                                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                            {selectedDriver?.status} Status
                                        </SheetDescription>
                                    </div>
                                </div>
                            </SheetHeader>

                            <div className="p-6 pt-0 space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-muted/30 border border-muted-foreground/10">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Total Deliveries</p>
                                        <p className="text-xl font-bold">{selectedDriver?.deliveries}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted/30 border border-muted-foreground/10">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Driver Rating</p>
                                        <p className="text-xl font-bold text-amber-500">★ {selectedDriver?.rating}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Employee ID</span>
                                            <span className="font-semibold">{selectedDriver?.id}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Experience</span>
                                            <span className="font-semibold">{selectedDriver?.experience}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Contact</span>
                                            <span className="font-semibold">{selectedDriver?.contact}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Base Hub</span>
                                            <span className="font-semibold">Dubai Central</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent Activity</h3>
                                    <div className="space-y-4">
                                        <div className="flex gap-3 text-sm">
                                            <div className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                            <div>
                                                <p className="font-semibold leading-none">Delivered Order ORD-55216</p>
                                                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 text-sm">
                                            <div className="size-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                            <div>
                                                <p className="font-semibold leading-none">Accepted Load LOAD-9982</p>
                                                <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-3">
                                    <Button className="flex-1 rounded-xl shadow-lg shadow-primary/20" render={<Link href={`/dashboard/drivers/${selectedDriver?.id}`} />} nativeButton={false}>
                                        Full Details
                                    </Button>
                                    <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setSelectedDriver(null)}>
                                        Dismiss
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <UpdateDriverDialog
                        driver={driverToUpdate}
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
