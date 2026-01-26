import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-muted/30 border-t pt-16 pb-8 md:pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                DS
                            </div>
                            <span className="text-xl font-bold text-primary">DentSupply</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            India's most trusted marketplace for dental supplies, instruments, and equipment. Quality assured, fast delivery.
                        </p>
                        <div className="flex gap-4 text-muted-foreground">
                            <Facebook className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
                            <Instagram className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
                            <Twitter className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
                            <Linkedin className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-foreground">Shop</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/products?category=implants" className="hover:text-primary hover:underline">Dental Implants</Link></li>
                            <li><Link href="/products?category=prosthetics" className="hover:text-primary hover:underline">Prosthetics</Link></li>
                            <li><Link href="/products?category=instruments" className="hover:text-primary hover:underline">Instruments</Link></li>
                            <li><Link href="/products?category=consumables" className="hover:text-primary hover:underline">Consumables</Link></li>
                            <li><Link href="/products?category=equipment" className="hover:text-primary hover:underline">Equipment</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-foreground">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary hover:underline">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-primary hover:underline">Contact</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary hover:underline">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary hover:underline">Terms of Service</Link></li>
                            <li><Link href="/shipping" className="hover:text-primary hover:underline">Shipping Info</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-foreground">Contact Us</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <span>Mittal Dental Clinic, Jaipur, Rajasthan 302001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <span>support@dentsupply.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="mb-8" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© 2024 DentSupply. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <span>Secure Payments:</span>
                        <div className="flex gap-2 font-bold opacity-70">
                            <span>VISA</span>
                            <span>MasterCard</span>
                            <span>UPI</span>
                        </div>
                    </div>
                </div>

                {/* Spacer for Mobile Nav */}
                <div className="h-16 md:hidden"></div>
            </div>
        </footer>
    )
}
