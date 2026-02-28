import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await req.json()
        const { customer, destination, status, priority, serviceType } = body

        const updatedOrder = await prisma.order.update({
            where: { orderId: id },
            data: {
                customer,
                destination,
                status,
                priority,
                serviceType,
            },
        })

        return NextResponse.json(updatedOrder)
    } catch (error) {
        console.error("Failed to update order:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
