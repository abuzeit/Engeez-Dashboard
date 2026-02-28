import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const body = await req.json()
        const { driver, amount, status, requestDate, bank, accountEnd, payoutType, walletTotalBalance, walletAvailableBalance } = body

        const updated = await prisma.payout.update({
            where: { payoutId: id },
            data: {
                driver,
                amount,
                status,
                requestDate,
                bank,
                accountEnd,
                payoutType,
                walletTotalBalance,
                walletAvailableBalance
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Failed to update topups:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        const deleted = await prisma.payout.delete({
            where: { payoutId: id },
        })

        return NextResponse.json(deleted)
    } catch (error) {
        console.error("Failed to delete topups:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
