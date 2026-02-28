import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const body = await req.json()
        const { name, type, value, region, status } = body

        const updated = await prisma.pricingRule.update({
            where: { id: id },
            data: {
                name,
                type,
                value,
                region,
                status
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Failed to update pricing:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        const deleted = await prisma.pricingRule.delete({
            where: { id: id },
        })

        return NextResponse.json(deleted)
    } catch (error) {
        console.error("Failed to delete pricing:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
