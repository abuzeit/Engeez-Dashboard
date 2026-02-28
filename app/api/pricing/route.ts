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
                    { name: { contains: search } },
                    { region: { contains: search } },
                ],
            }
            : {}

        const [total, items] = await Promise.all([
            prisma.pricingRule.count({ where }),
            prisma.pricingRule.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { createdAt: "desc" },
            }),
        ])

        return NextResponse.json({
            data: items,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        })
    } catch (error) {
        console.error("Failed to fetch pricing rules:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, type, value, region, status, lastUpdated } = body

        const pricingRule = await prisma.pricingRule.create({
            data: {
                name,
                type,
                value,
                region,
                status,
                lastUpdated,
            },
        })

        return NextResponse.json({ success: true, data: pricingRule })
    } catch (error) {
        console.error("Failed to create pricing rule:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
