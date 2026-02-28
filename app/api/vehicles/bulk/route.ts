import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json()
        const { ids, data } = body
        const { type, model, capacity, fuelLevel, lastMaintenance, status, vin, year, mileage, engineStatus, tirePressure, currentDriver, currentLocation } = data

        const updated = await prisma.vehicle.updateMany({
            where: { vehicleId: { in: ids } },
            data: {
                ...(data.status ? { status: data.status } : {})
                // Simplified for bulk status updates
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Failed to bulk update vehicles:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json()
        const { ids } = body

        const deleted = await prisma.vehicle.deleteMany({
            where: { vehicleId: { in: ids } },
        })

        return NextResponse.json(deleted)
    } catch (error) {
        console.error("Failed to bulk delete vehicles:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
