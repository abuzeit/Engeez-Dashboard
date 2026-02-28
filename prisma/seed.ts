import { PrismaClient } from "@prisma/client"
import * as fs from "fs"
import * as path from "path"

const prisma = new PrismaClient()

async function main() {
    const dataPath = path.join(process.cwd(), "public/data.json")
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"))

    console.log("Seeding database...")

    for (const order of data.orders) {
        await prisma.order.upsert({
            where: { orderId: order.id },
            update: {},
            create: {
                orderId: order.id,
                customer: order.customer,
                destination: order.destination,
                status: order.status,
                priority: order.priority,
                serviceType: "Standard Delivery",
            },
        })
    }

    for (const driver of data.drivers) {
        await prisma.driver.upsert({
            where: { driverId: driver.id },
            update: {},
            create: {
                driverId: driver.id,
                name: driver.name,
                status: driver.status,
                rating: driver.rating,
                deliveries: driver.deliveries,
                experience: driver.experience,
                contact: driver.contact,
                avatar: driver.avatar,
            },
        })
    }

    for (const vehicle of data.vehicles) {
        await prisma.vehicle.upsert({
            where: { vehicleId: vehicle.id },
            update: {},
            create: {
                vehicleId: vehicle.id,
                type: vehicle.type,
                model: vehicle.model,
                capacity: vehicle.capacity,
                fuelLevel: vehicle.fuelLevel,
                lastMaintenance: vehicle.lastMaintenance,
                status: vehicle.status,
                vin: vehicle.vin,
                year: vehicle.year,
                mileage: vehicle.mileage,
                engineStatus: vehicle.engineStatus,
                tirePressure: vehicle.tirePressure,
                currentDriver: vehicle.currentDriver,
                currentLocation: vehicle.currentLocation,
            },
        })
    }

    for (const fleet of data.live_fleet) {
        await prisma.fleetItem.upsert({
            where: { vehicleId: fleet.id },
            update: {
                latitude: fleet.latitude ?? 0,
                longitude: fleet.longitude ?? 0,
            },
            create: {
                vehicleId: fleet.id,
                status: fleet.status,
                location: fleet.location,
                latitude: fleet.latitude ?? 0,
                longitude: fleet.longitude ?? 0,
                driver: fleet.driver,
                load: fleet.load,
            },
        })
    }

    await prisma.stat.deleteMany({})
    for (const stat of data.stats) {
        await prisma.stat.create({
            data: {
                label: stat.label,
                value: stat.value,
                change: stat.change,
                trend: stat.trend,
            },
        })
    }

    for (const monthly of data.analytics.monthlyPerformance) {
        await prisma.monthlyPerformance.upsert({
            where: { month: monthly.month },
            update: {},
            create: {
                month: monthly.month,
                revenue: monthly.revenue,
                deliveries: monthly.deliveries,
            },
        })
    }

    for (const status of data.analytics.statusDistribution) {
        await prisma.statusDistribution.upsert({
            where: { status: status.status },
            update: {},
            create: {
                status: status.status,
                count: status.count,
            },
        })
    }

    const pricingRules = [
        {
            name: "Peak Hour Surcharge",
            type: "Fixed Fee",
            value: "$5.00",
            region: "Downtown",
            status: "Active",
            lastUpdated: "2024-02-10"
        },
        {
            name: "Weekend Multiplier",
            type: "Percentage",
            value: "15%",
            region: "Global",
            status: "Active",
            lastUpdated: "2024-02-12"
        },
        {
            name: "Late Night Delivery",
            type: "Fixed Fee",
            value: "$3.00",
            region: "Suburbs",
            status: "Scheduled",
            lastUpdated: "2024-02-15"
        },
        {
            name: "Distance Over 20mi",
            type: "Per Mile",
            value: "$0.50",
            region: "Global",
            status: "Active",
            lastUpdated: "2024-01-20"
        },
        {
            name: "Bulk Load Discount",
            type: "Discount (%)",
            value: "-10%",
            region: "Commercial",
            status: "Inactive",
            lastUpdated: "2024-01-05"
        }
    ]

    await prisma.pricingRule.deleteMany({})
    for (const rule of pricingRules) {
        await prisma.pricingRule.create({
            data: rule,
        })
    }

    const payouts = [
        {
            payoutId: "PO-1001",
            driver: "Alex Johnson",
            amount: "$1,250.00",
            status: "Pending",
            requestDate: "2024-02-20",
            bank: "Chase Bank",
            accountEnd: "...4589",
            payoutType: "Withdrawal",
            walletTotalBalance: "$1,350.00",
            walletAvailableBalance: "$1,250.00"
        },
        {
            payoutId: "PO-1002",
            driver: "Maria Garcia",
            amount: "$200.00",
            status: "Pending",
            requestDate: "2024-02-19",
            bank: "Bank of America",
            accountEnd: "...1234",
            payoutType: "Top Up",
            walletTotalBalance: "-$150.00",
            walletAvailableBalance: "$0.00"
        },
        {
            payoutId: "PO-1003",
            driver: "John Smith",
            amount: "$2,100.00",
            status: "Processing",
            requestDate: "2024-02-18",
            bank: "Wells Fargo",
            accountEnd: "...7890",
            payoutType: "Withdrawal",
            walletTotalBalance: "$2,100.00",
            walletAvailableBalance: "$2,100.00"
        },
        {
            payoutId: "PO-1004",
            driver: "Sarah Williams",
            amount: "$1,500.00",
            status: "Completed",
            requestDate: "2024-02-17",
            bank: "PNC Bank",
            accountEnd: "...3456",
            payoutType: "Withdrawal",
            walletTotalBalance: "$1,600.00",
            walletAvailableBalance: "$1,500.00"
        },
        {
            payoutId: "PO-1005",
            driver: "Robert Brown",
            amount: "$50.00",
            status: "Cancelled",
            requestDate: "2024-02-15",
            bank: "Capital One",
            accountEnd: "...9012",
            payoutType: "Top Up",
            walletTotalBalance: "-$50.00",
            walletAvailableBalance: "$0.00"
        },
        {
            payoutId: "PO-1006",
            driver: "Emily Chen",
            amount: "$350.00",
            status: "Pending",
            requestDate: "2024-02-21",
            bank: "Citi Bank",
            accountEnd: "...3312",
            payoutType: "Top Up",
            walletTotalBalance: "-$300.00",
            walletAvailableBalance: "$0.00"
        },
        {
            payoutId: "PO-1007",
            driver: "Michael Davis",
            amount: "$800.00",
            status: "Completed",
            requestDate: "2024-02-19",
            bank: "Chase Bank",
            accountEnd: "...6634",
            payoutType: "Withdrawal",
            walletTotalBalance: "$800.00",
            walletAvailableBalance: "$800.00"
        },
        {
            payoutId: "PO-1008",
            driver: "Linda Evans",
            amount: "$400.00",
            status: "Processing",
            requestDate: "2024-02-20",
            bank: "US Bank",
            accountEnd: "...0021",
            payoutType: "Top Up",
            walletTotalBalance: "-$100.00",
            walletAvailableBalance: "$0.00"
        },
        {
            payoutId: "PO-1009",
            driver: "David Fox",
            amount: "$3,200.00",
            status: "Completed",
            requestDate: "2024-02-14",
            bank: "HSBC",
            accountEnd: "...4451",
            payoutType: "Withdrawal",
            walletTotalBalance: "$3,500.00",
            walletAvailableBalance: "$3,200.00"
        },
        {
            payoutId: "PO-1010",
            driver: "Anna Green",
            amount: "$150.00",
            status: "Pending",
            requestDate: "2024-02-21",
            bank: "Bank of America",
            accountEnd: "...8871",
            payoutType: "Top Up",
            walletTotalBalance: "-$150.00",
            walletAvailableBalance: "$0.00"
        },
        {
            payoutId: "PO-1011",
            driver: "Carlos Silva",
            amount: "$900.00",
            status: "Processing",
            requestDate: "2024-02-21",
            bank: "Wells Fargo",
            accountEnd: "...4512",
            payoutType: "Withdrawal",
            walletTotalBalance: "$1,200.00",
            walletAvailableBalance: "$900.00"
        },
        {
            payoutId: "PO-1012",
            driver: "Lisa Wong",
            amount: "$75.00",
            status: "Cancelled",
            requestDate: "2024-02-16",
            bank: "Discover",
            accountEnd: "...9081",
            payoutType: "Top Up",
            walletTotalBalance: "-$75.00",
            walletAvailableBalance: "$0.00"
        },
        {
            payoutId: "PO-1013",
            driver: "Oliver Twist",
            amount: "$3,000.00",
            status: "Completed",
            requestDate: "2024-02-15",
            bank: "Barclays",
            accountEnd: "...1239",
            payoutType: "Withdrawal",
            walletTotalBalance: "$4,000.00",
            walletAvailableBalance: "$3,000.00"
        },
        {
            payoutId: "PO-1014",
            driver: "Sophie Turner",
            amount: "$120.00",
            status: "Completed",
            requestDate: "2024-02-14",
            bank: "Lloyds",
            accountEnd: "...8890",
            payoutType: "Top Up",
            walletTotalBalance: "$50.00",
            walletAvailableBalance: "$50.00"
        },
        {
            payoutId: "PO-1015",
            driver: "Jake Peralta",
            amount: "$1,850.00",
            status: "Pending",
            requestDate: "2024-02-22",
            bank: "Chase Bank",
            accountEnd: "...2811",
            payoutType: "Withdrawal",
            walletTotalBalance: "$1,850.00",
            walletAvailableBalance: "$1,850.00"
        },
        {
            payoutId: "PO-1016",
            driver: "Amy Santiago",
            amount: "$450.00",
            status: "Pending",
            requestDate: "2024-02-22",
            bank: "Citi Bank",
            accountEnd: "...5822",
            payoutType: "Top Up",
            walletTotalBalance: "-$450.00",
            walletAvailableBalance: "$0.00"
        }
    ]

    for (const payout of payouts) {
        await prisma.payout.upsert({
            where: { payoutId: payout.payoutId },
            update: payout,
            create: payout,
        })
    }

    console.log("Database seeded successfully!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
