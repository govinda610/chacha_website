"use client"

import Link from "next/link"
import { ShoppingCart, Eye } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"

interface ProductCardProps {
    product: Product
    variant?: "default" | "minimal"
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
    const isOutOfStock = product.stock_quantity <= 0
    const isLowStock = product.stock_quantity > 0 && product.stock_quantity < 10

    // Calculate discount if any
    const discount = product.base_price > product.selling_price
        ? Math.round(((product.base_price - product.selling_price) / product.base_price) * 100)
        : 0

    return (
        <Card className={cn("group overflow-hidden transition-all duration-300 hover:shadow-lg border-muted",
            variant === "minimal" ? "shadow-none border-0 bg-transparent" : "bg-white"
        )}>
            <CardContent className="p-0 relative">
                {/* Badges */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                    {discount > 0 && (
                        <Badge className="bg-red-500 hover:bg-red-600 text-white border-0">{discount}% OFF</Badge>
                    )}
                    {isOutOfStock && <Badge variant="destructive">Out of Stock</Badge>}
                    {isLowStock && <Badge variant="secondary" className="bg-orange-100 text-orange-700">Low Stock</Badge>}
                </div>

                {/* Image Area */}
                <div className="aspect-square relative bg-slate-50 overflow-hidden flex items-center justify-center p-4">
                    {product.images && product.images.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={product.images[0].image_url}
                            alt={product.name}
                            className="object-contain w-full h-full mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="text-muted-foreground text-xs text-center">No Image</div>
                    )}

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
                        <Link href={`/products/${product.slug}`}>
                            <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button
                            size="icon"
                            className="rounded-full h-10 w-10 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                            disabled={isOutOfStock}
                        >
                            <ShoppingCart className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>

            <CardFooter className={cn("flex flex-col items-start gap-2 p-4", variant === "minimal" && "px-0")}>
                {product.category && (
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        {product.category.name}
                    </div>
                )}
                <Link href={`/products/${product.slug}`} className="hover:underline">
                    <h3 className="font-medium text-sm leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-1 flex items-baseline gap-2 w-full">
                    <span className="font-bold text-lg text-primary">₹{product.selling_price.toLocaleString()}</span>
                    {discount > 0 && (
                        <span className="text-xs text-muted-foreground line-through">₹{product.base_price.toLocaleString()}</span>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}
