"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Loader2, Minus, Plus, ShoppingCart, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/context/cart-context"
import { productService } from "@/services/products"
import type { Product, ProductVariant } from "@/types/product"
import { toast } from "sonner"

export default function ProductDetailPage() {
    const params = useParams()
    const slug = params.slug as string
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [activeImage, setActiveImage] = useState<string>("")

    const { addItem } = useCart()

    useEffect(() => {
        async function loadProduct() {
            try {
                const data = await productService.getProduct(slug)
                setProduct(data)
                if (data.images && data.images.main) {
                    setActiveImage(data.images.main)
                }
                if (data.variants && data.variants.length > 0) {
                    setSelectedVariant(data.variants[0])
                }
            } catch (error) {
                console.error("Failed to load product", error)
                toast.error("Failed to load product details")
            } finally {
                setLoading(false)
            }
        }
        loadProduct()
    }, [slug])

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="container py-10 text-center">
                <h1 className="text-2xl font-bold">Product not found</h1>
            </div>
        )
    }

    const handleAddToCart = async () => {
        try {
            await addItem(product.id, quantity)
            toast.success("Added to cart")
        } catch (error) {
            console.error(error)
            toast.error("Failed to add to cart")
        }
    }

    const currentPrice = selectedVariant ? selectedVariant.price_adjustment + product.selling_price : product.selling_price
    const isOutOfStock = product.stock_quantity <= 0

    return (
        <div className="container py-10">
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-square overflow-hidden rounded-lg border bg-white">
                        {activeImage ? (
                            <Image
                                src={activeImage}
                                alt={product.name}
                                fill
                                className="object-contain p-4"
                                priority
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                                No Image
                            </div>
                        )}
                    </div>
                    {product.images && (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {product.images?.main && (
                                <button
                                    className={`relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-md border ${activeImage === product.images?.main ? "ring-2 ring-primary" : ""
                                        }`}
                                    onClick={() => setActiveImage(product.images?.main || "")}
                                >
                                    <Image src={product.images?.main || ""} alt="Main" fill className="object-cover" />
                                </button>
                            )}
                            {/* Add check for other images logic if needed, currently assumes structure */}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <div className="mt-2 flex items-center gap-4">
                            <span className="text-2xl font-bold text-primary">₹{currentPrice.toLocaleString()}</span>
                            {product.base_price > currentPrice && (
                                <span className="text-muted-foreground line-through">₹{product.base_price.toLocaleString()}</span>
                            )}
                            {isOutOfStock ? (
                                <Badge variant="destructive">Out of Stock</Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
                            )}
                        </div>
                    </div>

                    <p className="text-muted-foreground">{product.description}</p>

                    <Separator />

                    {/* Variants */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Options</label>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.map((variant) => (
                                    <Button
                                        key={variant.id}
                                        variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                                        onClick={() => setSelectedVariant(variant)}
                                        className="h-auto py-2"
                                    >
                                        <div className="flex flex-col items-start">
                                            <span className="font-semibold">{variant.name}</span>
                                            {/* <span className="text-xs opacity-70">SKU: {variant.sku}</span> */}
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity & Actions */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Quantity</label>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setQuantity(quantity + 1)}
                                    disabled={isOutOfStock}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <Button className="flex-1" size="lg" onClick={handleAddToCart} disabled={isOutOfStock}>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Add to Cart
                        </Button>
                        <Button variant="outline" size="icon">
                            <Heart className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Details Tabs */}
                    <Tabs defaultValue="specs" className="mt-8">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="specs">Specifications</TabsTrigger>
                            <TabsTrigger value="details">Details</TabsTrigger>
                        </TabsList>
                        <TabsContent value="specs" className="mt-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="font-medium">SKU</TableCell>
                                                <TableCell>{selectedVariant ? selectedVariant.sku : product.sku}</TableCell>
                                            </TableRow>
                                            {/* Render dynamic specs if available in product.specifications */}
                                            {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                                                <TableRow key={key}>
                                                    <TableCell className="font-medium capitalize">{key.replace(/_/g, " ")}</TableCell>
                                                    <TableCell>{String(value)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="details" className="mt-4">
                            <Card>
                                <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                                    {/* Placeholder for elaborate details */}
                                    <p>{product.description}</p>
                                    {product.clinical_benefits && (
                                        <div className="mt-4">
                                            <h4 className="font-semibold text-foreground mb-2">Clinical Benefits</h4>
                                            <ul className="list-disc pl-5 space-y-1">
                                                {/* Assuming clinical_benefits is a string or list. If string, just show it. */}
                                                <li>{product.clinical_benefits}</li>
                                            </ul>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                </div>
            </div>
        </div>
    )
}
