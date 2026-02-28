"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Package,
  Truck,
  Settings,
  Users,
  BarChart3,
  Search,
  Wallet,
  Gavel,
  ArrowUpCircle,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const data = {
  navMain: [
    {
      title: "Dashboard",
      items: [
        {
          title: "Fleet",
          url: "/dashboard/fleet",
          icon: LayoutDashboard,
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          title: "Orders",
          url: "/dashboard/orders",
          icon: Package,
        },
        {
          title: "Vehicles",
          url: "/dashboard/vehicles",
          icon: Truck,
        },
        {
          title: "Drivers",
          url: "/dashboard/drivers",
          icon: Users,
        },
      ],
    },
    {
      title: "Finance & Operations",
      items: [
        {
          title: "Payouts",
          url: "/dashboard/payouts",
          icon: Wallet,
        },
        {
          title: "Top Ups",
          url: "/dashboard/topups",
          icon: ArrowUpCircle,
        },
        {
          title: "Pricing Rules",
          url: "/dashboard/pricing",
          icon: Gavel,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 border-b p-4 flex flex-row items-center gap-2">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Truck className="size-5" />
        </div>
        <div className="flex flex-col gap-0.5 leading-none">
          <span className="font-semibold">Engeez Fleet</span>
          <span className="text-xs text-muted-foreground">v1.2.0</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHeader className="p-4 border-b-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 h-9"
            />
          </div>
        </SidebarHeader>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<a href={item.url} />}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
