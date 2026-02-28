import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
    try {
        const [stats, monthlyPerformance, statusDistribution] = await Promise.all([
            prisma.stat.findMany(),
            prisma.monthlyPerformance.findMany(),
            prisma.statusDistribution.findMany(),
        ])

        return NextResponse.json({
            stats,
            monthlyPerformance,
            statusDistribution,
        })
    } catch (error) {
        console.error("Failed to fetch analytics:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
