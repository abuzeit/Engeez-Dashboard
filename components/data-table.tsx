"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    ColumnOrderState,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, Settings2, GripVertical, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Dnd Kit Imports
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    closestCenter,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    horizontalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pageCount: number
    pageIndex: number
    pageSize: number
    onPaginationChange: (page: number, pageSize: number) => void
    onSortingChange: (sort: string, direction: "asc" | "desc") => void
    onSearchChange: (value: string) => void
    loading?: boolean
}

// Draggable Header Component
function DraggableTableHeader({ header }: { header: any }) {
    const isDraggable = header.id !== "select" && header.id !== "actions"

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: header.id,
        disabled: !isDraggable,
    })

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 10 : 0,
        position: "relative",
    }

    const canSort = header.column.getCanSort()
    const isSorted = header.column.getIsSorted()

    return (
        <TableHead
            ref={setNodeRef}
            style={style}
            className={cn(
                "h-10 relative group bg-transparent transition-colors duration-200 px-2",
                isDragging && "bg-muted shadow-lg ring-1 ring-primary/20 z-50 cursor-grabbing",
                canSort && "cursor-pointer hover:bg-muted/30"
            )}
            onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
        >
            <div className="flex items-center gap-1.5 overflow-hidden">
                {isDraggable && (
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-40 transition-opacity p-0.5 rounded hover:bg-muted-foreground/10 flex-shrink-0"
                    >
                        <GripVertical className="h-3.5 w-3.5" />
                    </div>
                )}
                <div className={cn("flex-1 truncate flex items-center gap-2", !isDraggable && header.id !== "select" && "pl-2")}>
                    <span className="truncate">
                        {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    {canSort && (
                        <div className="flex-shrink-0">
                            {isSorted === "asc" ? (
                                <ArrowUp className="h-3.5 w-3.5 text-primary" />
                            ) : isSorted === "desc" ? (
                                <ArrowDown className="h-3.5 w-3.5 text-primary" />
                            ) : (
                                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </TableHead>
    )
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageCount,
    pageIndex,
    pageSize,
    onPaginationChange,
    onSortingChange,
    onSearchChange,
    loading,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(() =>
        columns.map((c) => (c.id || (c as any).accessorKey) as string).filter(Boolean)
    )

    const [activeId, setActiveId] = React.useState<string | null>(null)
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor)
    )

    const table = useReactTable({
        data,
        columns,
        pageCount: pageCount,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnOrder,
            pagination: { pageIndex, pageSize },
        },
        enableSorting: true,
        onColumnOrderChange: setColumnOrder,
        onPaginationChange: (updater) => {
            const next = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater
            onPaginationChange(next.pageIndex + 1, next.pageSize)
        },
        onSortingChange: (updater) => {
            const next = typeof updater === "function" ? updater(sorting) : updater
            setSorting(next)
            if (next.length > 0) {
                onSortingChange(next[0].id, next[0].desc ? "desc" : "asc")
            } else {
                onSortingChange("", "asc")
            }
        },
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    })

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string)
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            const activeId = active.id as string
            const overId = over.id as string

            // Fixed columns cannot be dragged
            if (activeId === "select" || activeId === "actions") return

            setColumnOrder((order) => {
                const oldIndex = order.indexOf(activeId)
                let newIndex = order.indexOf(overId)

                // Ensure reordered column doesn't replace the fixed "select" at index 0
                if (newIndex === 0 && order[0] === "select") {
                    newIndex = 1
                }
                // Ensure reordered column doesn't replace the fixed "actions" at the end
                if (newIndex === order.length - 1 && order[order.length - 1] === "actions") {
                    newIndex = order.length - 2
                }

                return arrayMove(order, oldIndex, newIndex)
            })
        }
        setActiveId(null)
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm flex-1">
                    <Input
                        placeholder="Search all columns..."
                        onChange={(event) => onSearchChange(event.target.value)}
                        className="w-full"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "ml-auto flex h-8 gap-2")}>
                        <Settings2 className="h-4 w-4" />
                        View
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[150px]">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border bg-card overflow-hidden">
                {!isMounted ? (
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="hover:bg-transparent bg-muted/50 border-b pb-0">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="h-10 px-2">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                            Loading data...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                ) : (
                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToHorizontalAxis]}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                    >
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="hover:bg-transparent bg-muted/50 border-b">
                                        <SortableContext
                                            items={columnOrder}
                                            strategy={horizontalListSortingStrategy}
                                        >
                                            {headerGroup.headers.map((header) => (
                                                <DraggableTableHeader key={header.id} header={header} />
                                            ))}
                                        </SortableContext>
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={columns?.length || 0} className="h-24 text-center">
                                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                                Loading data...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : table.getRowModel()?.rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns?.length || 0}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No results found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <DragOverlay>
                            {activeId ? (
                                <div className="bg-background border border-primary/20 shadow-xl rounded-md px-4 py-2 flex items-center gap-2 opacity-90 backdrop-blur-sm ring-2 ring-primary/10">
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">
                                        {(() => {
                                            const column = table.getColumn(activeId);
                                            const header = column?.columnDef.header;
                                            if (typeof header === 'function') {
                                                return "Moving column...";
                                            }
                                            return header as string;
                                        })()}
                                    </span>
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                )}
            </div>
            <div className="flex items-center justify-between">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {totalCount(pageCount, pageSize)} row(s) selected.
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage() || loading}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <div className="flex items-center justify-center text-sm font-medium">
                        Page {pageIndex + 1} of {pageCount || 1}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage() || loading}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

function totalCount(pageCount: number, pageSize: number) {
    return (pageCount || 0) * pageSize;
}
