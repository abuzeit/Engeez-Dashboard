import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json()
        const { ids, data } = body
        const { customer, destination, status, priority, serviceType } = data

        const updated = await prisma.order.updateMany({
            where: { orderId: { in: ids } },
            data: {
                ...(data.status ? { status: data.status } : {})
                // Simplified for bulk status updates
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Failed to bulk update orders:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json()
        const { ids } = body

        const deleted = await prisma.order.deleteMany({
            where: { orderId: { in: ids } },
        })

        return NextResponse.json(deleted)
    } catch (error) {
        console.error("Failed to bulk delete orders:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
