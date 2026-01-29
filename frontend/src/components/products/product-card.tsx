"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Eye, Star } from "lucide-react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, getMainImage } from "@/lib/utils"
import type { Product } from "@/types/product"
import { useCart } from "@/context/cart-context"

interface ProductCardProps {
    product: Product
    variant?: "default" | "minimal"
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
    const { addItem, isLoading } = useCart()

    // 3D Tilt Logic
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const mouseXSpring = useSpring(x)
    const mouseYSpring = useSpring(y)
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5
        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    const discount = product.base_price > product.selling_price
        ? Math.round(((product.base_price - product.selling_price) / product.base_price) * 100)
        : 0

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        await addItem(product.id, 1)
    }

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="perspective-1000"
        >
            <Card className={cn(
                "group relative overflow-hidden transition-all duration-500 border-primary/5 hover:border-primary/20 rounded-3xl",
                variant === "minimal" ? "shadow-none border-0 bg-transparent" : "bg-white shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10"
            )}>
                <CardContent className="p-0 relative overflow-hidden">
                    {/* Enhanced Badges */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                        {discount > 0 && (
                            <Badge className="bg-secondary hover:bg-secondary/90 text-white border-0 font-space-grotesk font-bold px-3 py-1 rounded-lg shadow-lg shadow-secondary/20">
                                {discount}% OFF
                            </Badge>
                        )}
                        {product.has_variants && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary font-space-grotesk font-bold border-0 px-3 py-1 rounded-lg">
                                Customizable
                            </Badge>
                        )}
                    </div>

                    <Link href={`/products/${product.slug}`} className="block">
                        <div className="aspect-square relative flex items-center justify-center p-8 bg-surface-hover/50 group-hover:bg-primary/5 transition-colors duration-500">
                            {product.images?.[0] ? (
                                <div className="relative w-full h-full transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-3 shadow-2xl shadow-transparent group-hover:shadow-primary/5">
                                    <Image
                                        src={getMainImage(product.images)}
                                        alt={product.name}
                                        fill
                                        className="object-contain mix-blend-multiply transition-all duration-700"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 opacity-20">
                                    <Star className="h-12 w-12 text-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                                </div>
                            )}

                            {/* Quick View Button revealed on hover */}
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="flex gap-2"
                                >
                                    <Button size="icon" variant="outline" className="rounded-2xl h-12 w-12 shadow-2xl hover:scale-110 active:scale-95 transition-all bg-white text-primary border-0">
                                        <Eye className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        className="rounded-2xl h-12 w-12 shadow-2xl bg-primary text-white hover:bg-primary/90 hover:scale-110 active:scale-95 transition-all"
                                        disabled={isLoading}
                                        onClick={handleAddToCart}
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                    </Button>
                                </motion.div>
                                <div className="absolute bottom-4">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em] font-space-grotesk">Quick View</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </CardContent>

                <CardFooter className={cn("flex flex-col items-start gap-3 p-6 pt-5", variant === "minimal" && "px-0")}>
                    <div className="flex items-center justify-between w-full">
                        {product.category && (
                            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-space-grotesk font-bold">
                                {product.category.name}
                            </span>
                        )}
                        <div className="flex items-center gap-1 text-accent">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-[10px] font-bold text-foreground">4.8</span>
                        </div>
                    </div>

                    <Link href={`/products/${product.slug}`} className="group/title">
                        <h3 className="font-serif font-bold text-lg leading-tight line-clamp-2 min-h-[3rem] text-foreground hover:text-primary transition-colors duration-300">
                            {product.name}
                        </h3>
                    </Link>

                    <div className="flex items-end justify-between w-full mt-2">
                        <div className="flex flex-col">
                            <div className="flex items-baseline gap-2">
                                <span className="font-space-grotesk font-black text-xl text-primary">₹{product.selling_price.toLocaleString()}</span>
                                {discount > 0 && (
                                    <span className="text-sm text-muted-foreground/50 line-through">₹{product.base_price.toLocaleString()}</span>
                                )}
                            </div>
                            <p className="text-[10px] text-muted-foreground font-body">+ GST & Shipping</p>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary hover:bg-primary/5 font-space-grotesk font-bold text-[10px] uppercase tracking-wider"
                            onClick={handleAddToCart}
                            disabled={isLoading}
                        >
                            Add to Cart
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
