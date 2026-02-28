import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json()
        const { ids, data } = body
        const { driver, amount, status, requestDate, bank, accountEnd, payoutType, walletTotalBalance, walletAvailableBalance } = data

        const updated = await prisma.payout.updateMany({
            where: { payoutId: { in: ids } },
            data: {
                ...(data.status ? { status: data.status } : {})
                // Simplified for bulk status updates
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Failed to bulk update payouts:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json()
        const { ids } = body

        const deleted = await prisma.payout.deleteMany({
            where: { payoutId: { in: ids } },
        })

        return NextResponse.json(deleted)
    } catch (error) {
        console.error("Failed to bulk delete payouts:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
