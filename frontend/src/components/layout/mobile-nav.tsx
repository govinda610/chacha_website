"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, ShoppingCart, User, Grid } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/cart-context"

export function MobileNav() {
    const pathname = usePathname()
    const { itemCount } = useCart()

    const navItems = [
        { label: "Home", href: "/", icon: Home },
        { label: "Products", href: "/products", icon: Grid },
        { label: "Search", href: "/products?focus=search", icon: Search },
        { label: "Cart", href: "/cart", icon: ShoppingCart, count: itemCount },
        { label: "Account", href: "/login", icon: User }
    ]

    return (
        <div className="fixed bottom-6 left-6 right-6 z-[100] md:hidden">
            <div className="glass shadow-2xl shadow-primary/20 rounded-[2rem] border border-white/40 px-3 py-2">
                <div className="flex justify-around items-center">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative flex flex-col items-center justify-center py-2 px-1 w-full"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="mobile-nav-active"
                                        className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                <div className="relative">
                                    <item.icon className={cn(
                                        "h-6 w-6 transition-all duration-300",
                                        isActive ? "text-primary scale-110" : "text-muted-foreground"
                                    )} />
                                    {item.count !== undefined && item.count > 0 && (
                                        <span className="absolute -top-2 -right-2 h-4 min-w-[16px] bg-secondary text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white">
                                            {item.count}
                                        </span>
                                    )}
                                </div>

                                <span className={cn(
                                    "text-[8px] font-space-grotesk font-black uppercase tracking-widest mt-1 transition-colors",
                                    isActive ? "text-primary" : "text-muted-foreground/60"
                                )}>
                                    {item.label}
                                </span>

                                {isActive && (
                                    <motion.div
                                        layoutId="dot"
                                        className="h-1 w-1 bg-primary rounded-full mt-0.5"
                                    />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
