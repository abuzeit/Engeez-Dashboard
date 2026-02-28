import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "5")
    const search = searchParams.get("search") || ""

    try {
        const where = search
            ? {
                OR: [
                    { driver: { contains: search } },
                    { payoutId: { contains: search } },
                ],
            }
            : {}

        const [total, items] = await Promise.all([
            prisma.payout.count({ where }),
            prisma.payout.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { createdAt: "desc" },
            }),
        ])

        const mappedItems = items.map((item) => ({
            ...item,
            id: item.payoutId,
        }))

        return NextResponse.json({
            data: mappedItems,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        })
    } catch (error) {
        console.error("Failed to fetch payouts:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
