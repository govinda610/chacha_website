"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, MapPin, Grid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"

export function Header() {
    const { user, logout } = useAuth()
    const { itemCount } = useCart()
    const router = useRouter()
    return (
        <header className="flex flex-col w-full sticky top-0 z-[50] bg-background/80 backdrop-blur-md shadow-sm border-b">
            <div className="container mx-auto py-3 px-4 flex items-center gap-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 mr-4 hover:opacity-90 transition-opacity">
                    <div className="h-9 w-9 bg-gradient-to-br from-primary to-blue-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
                        DS
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 hidden md:block">
                        DentSupply
                    </span>
                </Link>

                {/* Location (Quick Commerce Style) - Hidden on mobile */}
                <div className="hidden lg:flex flex-col leading-none text-sm mr-4 min-w-[120px]">
                    <span className="text-xs text-muted-foreground font-medium">Delivering to</span>
                    <span className="font-bold flex items-center gap-1 text-primary cursor-pointer hover:underline truncate">
                        <MapPin className="h-3 w-3" />
                        Jaipur, 302001
                    </span>
                </div>

                {/* Search */}
                <div className="flex-1 relative group max-w-2xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search for 'Implants'..."
                            className="w-full pl-10 bg-muted/50 border-transparent focus:bg-background focus:border-primary/20 transition-all rounded-xl h-11"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {user ? (
                        <div className="hidden md:flex items-center gap-2">
                            <Link href="/orders">
                                <Button variant="ghost" className="gap-2 font-medium hover:bg-muted/50">
                                    <User className="h-5 w-5" />
                                    <span className="truncate max-w-[100px]">{user.full_name.split(' ')[0]}</span>
                                </Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-destructive">
                                Log out
                            </Button>
                        </div>
                    ) : (
                        <Link href="/auth/login">
                            <Button variant="ghost" className="hidden md:flex gap-2 font-medium hover:bg-muted/50">
                                <User className="h-5 w-5" />
                                <span>Login</span>
                            </Button>
                        </Link>
                    )}

                    <Link href="/cart">
                        <Button className="h-11 px-4 lg:px-6 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 flex gap-2 transition-transform active:scale-95">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="hidden md:inline">Cart</span>
                            <Badge variant="secondary" className="ml-1 bg-white/20 text-white hover:bg-white/30 border-0">
                                {itemCount}
                            </Badge>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Nav - Desktop Only */}
            <div className="border-t bg-background/50 hidden md:block">
                <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
                    <div className="flex gap-2 py-2">
                        <Link href="/products">
                            <Button variant="ghost" size="sm" className="rounded-full px-4 text-xs font-medium bg-foreground text-background hover:bg-foreground/90">
                                All Products
                            </Button>
                        </Link>
                        {["Implants", "Prosthetics", "Instruments", "Regenerative", "Equipment", "Supplies"].map((cat) => (
                            <Button
                                key={cat}
                                variant="ghost"
                                size="sm"
                                className="rounded-full px-4 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    )
}
