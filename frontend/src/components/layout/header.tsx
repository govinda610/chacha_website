"use client"

import Link from "next/link"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, ShoppingCart, User, MapPin, Grid, Menu, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Header() {
    const { user, logout } = useAuth()
    const { itemCount } = useCart()
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    const currentCategoryId = searchParams.get("category_id")
    const isAllProductsActive = pathname === "/products" && !currentCategoryId

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const query = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value
        if (query.trim()) {
            router.push(`/products?q=${encodeURIComponent(query)}`)
        }
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300">
            {/* Top Thin Bar */}
            <div className="bg-primary text-white py-1.5 px-4 text-center text-[10px] font-space-grotesk font-black uppercase tracking-[0.2em]">
                Free Shipping on Orders above ₹10,000 for Platinum Clinics
            </div>

            <div className="glass shadow-2xl shadow-primary/5 border-b border-primary/5">
                <div className="container mx-auto py-4 px-4 flex items-center gap-6 lg:gap-10">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 shrink-0 group">
                        <motion.div
                            whileHover={{ rotate: -5, scale: 1.1 }}
                            className="h-10 w-10 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-primary/20 transition-all group-hover:shadow-primary/40"
                        >
                            DS
                        </motion.div>
                        <div className="hidden lg:block leading-none">
                            <span className="text-2xl font-serif font-black text-foreground block tracking-tight">
                                DentSupply
                            </span>
                            <span className="text-[10px] font-space-grotesk font-bold text-primary uppercase tracking-[0.3em]">
                                Premium Oral care
                            </span>
                        </div>
                    </Link>

                    {/* Location - Hidden on mobile */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hidden xl:flex flex-col leading-none text-xs mr-2 border-l border-primary/10 pl-6 cursor-pointer group"
                    >
                        <span className="text-[10px] text-muted-foreground font-space-grotesk font-bold uppercase tracking-wider mb-1">Delivering to</span>
                        <span className="font-black flex items-center gap-1 text-foreground group-hover:text-primary transition-colors">
                            <MapPin className="h-3 w-3 text-secondary" />
                            Jaipur, 302001
                        </span>
                    </motion.div>

                    {/* Search */}
                    <div className="flex-1 relative group max-w-2xl">
                        <form onSubmit={handleSearch} className="relative">
                            <div className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors",
                                isSearchFocused ? "text-primary" : "text-muted-foreground"
                            )}>
                                <Search className="h-full w-full" />
                            </div>
                            <Input
                                name="q"
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                placeholder="Search premium implants, abutments..."
                                className="w-full pl-12 bg-white/50 border-primary/5 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl h-12 text-sm font-body shadow-sm"
                            />
                            <AnimatePresence>
                                {isSearchFocused && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 right-0 mt-3 p-4 bg-white rounded-2xl shadow-2xl border border-primary/5 z-[110]"
                                    >
                                        <p className="text-[10px] font-space-grotesk font-bold text-muted-foreground uppercase tracking-widest mb-3">Trending Searches</p>
                                        <div className="flex flex-wrap gap-2">
                                            {["Tuff Implants", "Multi-Unit Abutment", "Noris Click", "SLA Surface"].map(q => (
                                                <Button key={q} variant="ghost" size="sm" className="rounded-xl text-xs font-bold hover:bg-primary/5 text-foreground/70">
                                                    {q}
                                                </Button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 lg:gap-5">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link href="/orders">
                                    <Button variant="ghost" className="h-12 px-4 gap-3 font-space-grotesk font-bold text-sm hover:bg-primary/5 rounded-2xl transition-all">
                                        <User className="h-5 w-5 text-primary" />
                                        <span className="hidden xl:inline text-foreground">
                                            {user.full_name?.split(' ')[0] || 'Account'}
                                        </span>
                                    </Button>
                                </Link>
                                <div className="h-6 w-[1px] bg-primary/10 hidden xl:block" />
                                <Button variant="ghost" size="icon" onClick={logout} className="h-10 w-10 text-muted-foreground hover:text-secondary rounded-xl">
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                        ) : (
                            <Link href="/login">
                                <Button variant="ghost" className="h-12 px-5 gap-3 font-space-grotesk font-bold text-sm hover:bg-primary/5 rounded-2xl">
                                    <User className="h-5 w-5 text-primary" />
                                    <span className="hidden md:inline">Login</span>
                                </Button>
                            </Link>
                        )}

                        <Link href="/cart">
                            <Button className="h-12 px-5 lg:px-7 rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 flex gap-3 transition-all hover:scale-105 active:scale-95">
                                <div className="relative">
                                    <ShoppingCart className="h-5 w-5" />
                                    <Badge className="absolute -top-2.5 -right-2.5 h-5 min-w-[20px] bg-secondary text-white border-2 border-white flex items-center justify-center text-[10px] font-bold rounded-full p-0">
                                        {itemCount}
                                    </Badge>
                                </div>
                                <span className="hidden md:inline font-space-grotesk font-black uppercase tracking-widest text-[10px]">Cart</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Categories Bar - Refined */}
                <div className="border-t border-primary/5 hidden md:block px-4">
                    <div className="container mx-auto">
                        <div className="flex gap-8 py-3 items-center">
                            <Link href="/products" className="group flex items-center gap-2">
                                <Button variant="ghost" size="sm" className={cn(
                                    "rounded-xl px-4 text-[10px] font-space-grotesk font-black uppercase tracking-widest transition-all",
                                    isAllProductsActive
                                        ? "bg-foreground text-background hover:bg-foreground/90"
                                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                                )}>
                                    <Grid className="h-3.5 w-3.5 mr-2" />
                                    All Products
                                </Button>
                            </Link>

                            <div className="flex gap-6 items-center">
                                {[
                                    { name: "Implants", categoryId: 19 },
                                    { name: "Abutments", categoryId: 1 },
                                    { name: "Prosthetics", categoryId: 24 },
                                    { name: "Instruments", categoryId: 22 },
                                    { name: "Accessories", categoryId: 9 },
                                    { name: "Attachments", categoryId: 15 },
                                ].map((cat) => {
                                    const isActive = currentCategoryId === String(cat.categoryId)
                                    return (
                                        <Link
                                            key={cat.name}
                                            href={`/products?category_id=${cat.categoryId}`}
                                            className={cn(
                                                "group relative py-1 text-[11px] font-space-grotesk font-black uppercase tracking-widest transition-colors flex items-center gap-1.5",
                                                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                                            )}
                                        >
                                            {cat.name}
                                            <ChevronDown className={cn(
                                                "h-3 w-3 transition-colors",
                                                isActive ? "text-primary/70" : "text-muted-foreground/30 group-hover:text-primary/50"
                                            )} />
                                            <span className={cn(
                                                "absolute bottom-0 left-0 h-[2px] bg-secondary transition-all",
                                                isActive ? "w-full" : "w-0 group-hover:w-full"
                                            )} />
                                        </Link>
                                    )
                                })}
                            </div>

                            <div className="ml-auto">
                                <Link href="/offers" className="text-[10px] font-space-grotesk font-black text-secondary uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">
                                    Special Offers %
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
