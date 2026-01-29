"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid, ShoppingCart, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
    const pathname = usePathname()

    const navItems = [
        {
            label: "Home",
            href: "/",
            icon: Home
        },
        {
            label: "Categories",
            href: "/categories",
            icon: Grid
        },
        {
            label: "Cart",
            href: "/cart",
            icon: ShoppingCart
        },
        {
            label: "Account",
            href: "/login", // Will switch to /account if logged in
            icon: User
        }
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
