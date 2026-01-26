import Link from "next/link"
import { Search, ShoppingCart, User, MapPin, Grid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function HeaderModern() {
    return (
        <div className="flex flex-col w-full sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-sm">
            <div className="container mx-auto py-3 px-4 flex items-center gap-4">
                {/* Logo */}
                <div className="flex items-center gap-2 mr-4">
                    <div className="h-9 w-9 bg-gradient-to-br from-primary to-blue-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
                        DS
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 hidden md:block">
                        DentSupply
                    </span>
                </div>

                {/* Location (Quick Commerce Style) */}
                <div className="hidden lg:flex flex-col leading-none text-sm mr-4">
                    <span className="text-xs text-muted-foreground font-medium">Delivering to</span>
                    <span className="font-bold flex items-center gap-1 text-primary cursor-pointer hover:underline">
                        <MapPin className="h-3 w-3" />
                        Jaipur, 302001
                    </span>
                </div>

                {/* Search */}
                <div className="flex-1 relative group">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search for 'Tuff Implants'..."
                            className="w-full pl-10 bg-muted/50 border-transparent focus:bg-background focus:border-primary/20 transition-all rounded-xl h-11"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="hidden md:flex gap-2 font-medium">
                        <User className="h-5 w-5" />
                        <span>Login</span>
                    </Button>

                    <Button className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 flex gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="hidden md:inline">Cart</span>
                        <Badge variant="secondary" className="ml-1 bg-white/20 text-white hover:bg-white/30 border-0">
                            ₹8,550
                        </Badge>
                    </Button>
                </div>
            </div>

            {/* Quick Nav */}
            <div className="border-t bg-background/50 hidden md:block">
                <div className="container mx-auto px-4 overflow-x-auto">
                    <div className="flex gap-2 py-2">
                        {["All", "Implants", "Prosthetics", "Instruments", "Regenerative", "Equipment", "Supplies"].map((cat, i) => (
                            <Button
                                key={cat}
                                variant={i === 0 ? "default" : "ghost"}
                                size="sm"
                                className={`rounded-full px-4 text-xs ${i === 0 ? "bg-foreground text-background hover:bg-foreground/90" : "text-muted-foreground"}`}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
