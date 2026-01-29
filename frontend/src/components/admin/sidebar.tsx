"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"

enum UserRole {
    ADMIN = "admin",
    CUSTOMER = "customer",
    WAREHOUSE_MANAGER = "warehouse_manager",
    SALES_MANAGER = "sales_manager",
    SUPPORT_EXECUTIVE = "support_executive"
}

export function AdminSidebar() {
    const pathname = usePathname()
    const { user, logout } = useAuth()
    const role = user?.role as UserRole

    const canManageProducts = [UserRole.ADMIN, UserRole.SALES_MANAGER].includes(role)
    const canManageOrders = [UserRole.ADMIN, UserRole.SALES_MANAGER, UserRole.WAREHOUSE_MANAGER, UserRole.SUPPORT_EXECUTIVE].includes(role)
    const canManageUsers = [UserRole.ADMIN, UserRole.SUPPORT_EXECUTIVE].includes(role)
    const canManageSettings = [UserRole.ADMIN].includes(role)

    const links = [
        {
            href: "/admin",
            label: "Dashboard",
            icon: LayoutDashboard,
            visible: true
        },
        {
            href: "/admin/products",
            label: "Products",
            icon: Package,
            visible: canManageProducts
        },
        {
            href: "/admin/orders",
            label: "Orders",
            icon: ShoppingCart,
            visible: canManageOrders
        },
        {
            href: "/admin/users",
            label: "Users",
            icon: Users,
            visible: canManageUsers
        },
        {
            href: "/admin/settings",
            label: "Settings",
            icon: Settings,
            visible: canManageSettings
        }
    ]

    return (
        <div className="flex h-full w-64 flex-col border-r bg-muted/40">
            <div className="flex h-14 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <span className="text-xl text-primary">DentSupply Admin</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {links.map((link) => (
                        link.visible && (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                    pathname === link.href
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        )
                    ))}
                </nav>
            </div>
            <div className="border-t p-4">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
