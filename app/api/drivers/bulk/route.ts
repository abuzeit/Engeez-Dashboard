import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json()
        const { ids, data } = body
        const { name, status, rating, deliveries, experience, contact, avatar } = data

        const updated = await prisma.driver.updateMany({
            where: { driverId: { in: ids } },
            data: {
                ...(data.status ? { status: data.status } : {})
                // Simplified for bulk status updates
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Failed to bulk update drivers:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json()
        const { ids } = body

        const deleted = await prisma.driver.deleteMany({
            where: { driverId: { in: ids } },
        })

        return NextResponse.json(deleted)
    } catch (error) {
        console.error("Failed to bulk delete drivers:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
