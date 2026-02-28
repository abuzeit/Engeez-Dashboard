import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "5")
    const search = searchParams.get("search") || ""
    const sortColumn = searchParams.get("sort") || "createdAt"
    const sortDirection = (searchParams.get("direction") || "desc") as "asc" | "desc"

    try {
        const where = search
            ? {
                OR: [
                    { orderId: { contains: search } },
                    { customer: { contains: search } },
                    { destination: { contains: search } },
                ],
            }
            : {}

        const [total, items] = await Promise.all([
            prisma.order.count({ where }),
            prisma.order.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: {
                    [sortColumn === "id" ? "orderId" : sortColumn]: sortDirection,
                },
            }),
        ])

        // Map database orderId back to id for the frontend
        const mappedItems = items.map((item) => ({
            ...item,
            id: item.orderId,
        }))

        return NextResponse.json({
            data: mappedItems,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        })
    } catch (error) {
        console.error("Failed to fetch orders:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
