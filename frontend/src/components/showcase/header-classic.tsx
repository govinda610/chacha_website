import Link from "next/link"
import { Search, ShoppingCart, User, Phone, Mail, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function HeaderClassic() {
    return (
        <div className="flex flex-col w-full border-b">
            {/* Top Bar - Contact Info */}
            <div className="bg-secondary text-secondary-foreground py-1 px-4 text-xs font-medium">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> +91-9876543210
                        </span>
                        <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> support@dentsupply.com
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:underline">Help Center</Link>
                        <Link href="#" className="hover:underline">Track Order</Link>
                    </div>
                </div>
            </div>

            {/* Main Bar */}
            <div className="bg-background py-4 px-4 border-b">
                <div className="container mx-auto flex items-center justify-between gap-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-xl">
                            DS
                        </div>
                        <span className="text-2xl font-bold text-primary tracking-tight">DentSupply</span>
                    </div>

                    {/* Search */}
                    <div className="flex-1 max-w-2xl hidden md:flex">
                        <div className="relative w-full">
                            <Input
                                placeholder="Search for implants, abutments, instruments..."
                                className="w-full pr-10 border-primary/20 focus-visible:ring-primary"
                            />
                            <Button size="icon" className="absolute right-0 top-0 h-full rounded-l-none">
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Search className="h-5 w-5" />
                        </Button>

                        <div className="flex flex-col items-center">
                            <Button variant="ghost" className="hidden md:flex flex-col h-auto p-1 gap-0.5 text-xs text-muted-foreground hover:text-primary">
                                <User className="h-5 w-5" />
                                <span>Account</span>
                            </Button>
                        </div>

                        <div className="relative">
                            <Button variant="outline" size="icon" className="border-primary/20 text-primary">
                                <ShoppingCart className="h-5 w-5" />
                            </Button>
                            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-secondary text-secondary-foreground text-[10px]">
                                3
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <div className="bg-primary text-primary-foreground py-0 px-4 hidden md:block">
                <div className="container mx-auto">
                    <nav className="flex items-center gap-8 text-sm font-medium">
                        <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80 hover:text-white rounded-none border-b-2 border-transparent hover:border-white h-12 flex gap-2">
                            <Menu className="h-4 w-4" /> All Categories
                        </Button>
                        <Link href="#" className="hover:opacity-80 py-3">Implants</Link>
                        <Link href="#" className="hover:opacity-80 py-3">Prosthetics</Link>
                        <Link href="#" className="hover:opacity-80 py-3">Instruments</Link>
                        <Link href="#" className="hover:opacity-80 py-3">Biomaterials</Link>
                        <Link href="#" className="hover:opacity-80 py-3">Accessories</Link>
                        <span className="flex-1"></span>
                        <Link href="#" className="hover:opacity-80 py-3 text-secondary font-bold">Special Offers</Link>
                    </nav>
                </div>
            </div>
        </div>
    )
}
