import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const body = await req.json()
        const { status, location, latitude, longitude, driver, load } = body

        const updated = await prisma.fleetItem.update({
            where: { vehicleId: id },
            data: {
                status,
                location,
                latitude,
                longitude,
                driver,
                load
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Failed to update fleet:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        const deleted = await prisma.fleetItem.delete({
            where: { vehicleId: id },
        })

        return NextResponse.json(deleted)
    } catch (error) {
        console.error("Failed to delete fleet:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
