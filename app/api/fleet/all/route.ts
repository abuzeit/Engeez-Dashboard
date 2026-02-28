import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const items = await prisma.fleetItem.findMany({
            orderBy: { createdAt: "desc" },
        })

        const mappedItems = items.map((item) => ({
            ...item,
            id: item.vehicleId,
        }))

        return NextResponse.json({
            data: mappedItems,
        })
    } catch (error) {
        console.error("Failed to fetch all fleet items:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
