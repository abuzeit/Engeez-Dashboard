import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const body = await req.json()
        const { type, model, capacity, fuelLevel, lastMaintenance, status, vin, year, mileage, engineStatus, tirePressure, currentDriver, currentLocation } = body

        const updated = await prisma.vehicle.update({
            where: { vehicleId: id },
            data: {
                type,
                model,
                capacity,
                fuelLevel,
                lastMaintenance,
                status,
                vin,
                year,
                mileage,
                engineStatus,
                tirePressure,
                currentDriver,
                currentLocation
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Failed to update vehicles:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        const deleted = await prisma.vehicle.delete({
            where: { vehicleId: id },
        })

        return NextResponse.json(deleted)
    } catch (error) {
        console.error("Failed to delete vehicles:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
