import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const body = await req.json()
        const { name, status, rating, deliveries, experience, contact, avatar } = body

        const updated = await prisma.driver.update({
            where: { driverId: id },
            data: {
                name,
                status,
                rating,
                deliveries,
                experience,
                contact,
                avatar
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Failed to update drivers:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        const deleted = await prisma.driver.delete({
            where: { driverId: id },
        })

        return NextResponse.json(deleted)
    } catch (error) {
        console.error("Failed to delete drivers:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
