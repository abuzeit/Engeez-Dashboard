import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "5")
    const search = searchParams.get("search") || ""
    const sortColumn = searchParams.get("sort") || ""
    const direction = (searchParams.get("direction") || "asc") as "asc" | "desc"

    try {
        const where = search
            ? {
                OR: [
                    { vehicleId: { contains: search } },
                    { driver: { contains: search } },
                    { location: { contains: search } },
                ],
            }
            : {}

        const orderBy: Record<string, "asc" | "desc"> = {}
        if (sortColumn) {
            orderBy[sortColumn] = direction
        }

        const [total, items] = await Promise.all([
            prisma.fleetItem.count({ where }),
            prisma.fleetItem.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: Object.keys(orderBy).length > 0 ? orderBy : { createdAt: "desc" },
            }),
        ])

        const mappedItems = items.map((item) => ({
            ...item,
            id: item.vehicleId,
        }))

        return NextResponse.json({
            data: mappedItems,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        })
    } catch (error) {
        console.error("Failed to fetch fleet:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
