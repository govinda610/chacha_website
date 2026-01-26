"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { User, MapPin, Package, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { logout } = useAuth()

    const navItems = [
        { href: "/account", label: "Profile", icon: User },
        { href: "/account/addresses", label: "Addresses", icon: MapPin },
        { href: "/orders", label: "My Orders", icon: Package },
    ]

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Account</h1>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 shrink-0 space-y-2">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                pathname === item.href
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}>
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </div>
                        </Link>
                    ))}
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </button>
                </aside>

                {/* Content */}
                <div className="flex-1 min-h-[400px]">
                    {children}
                </div>
            </div>
        </div>
    )
}
