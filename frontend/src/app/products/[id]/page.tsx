"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ShoppingCart, Check, ChevronRight, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { productService } from "@/services/products"
import type { Product, ProductImage } from "@/types/product"
import { toast } from "sonner"
import { useCart } from "@/context/cart-context"

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.id as string

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState<string>("")
    const [quantity, setQuantity] = useState(1)

    // Hooks must be at top level
    const { addItem } = useCart()

    useEffect(() => {
        async function loadProduct() {
            try {
                const data = await productService.getProduct(slug)
                setProduct(data)
                if (data.images && data.images.length > 0) {
                    setSelectedImage(data.images[0].image_url)
                }
            } catch (err) {
                console.error(err)
                toast.error("Product not found")
                // router.push("/products") // Optional: redirect on error
            } finally {
                setLoading(false)
            }
        }
        if (slug) loadProduct()
    }, [slug, router])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-100 aspect-square rounded-xl"></div>
                    <div className="space-y-4">
                        <div className="h-8 bg-slate-100 w-3/4 rounded"></div>
                        <div className="h-6 bg-slate-100 w-1/4 rounded"></div>
                        <div className="h-32 bg-slate-100 w-full rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!product) return null

    // For products with variants, check if any variant has stock
    const hasVariants = product.has_variants || (product.variants && product.variants.length > 0)
    const totalVariantStock = product.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) ?? 0
    const isOutOfStock = hasVariants ? totalVariantStock <= 0 : false


    const handleAddToCart = async () => {
        await addItem(product.id, quantity)
        // Toast is handled in context
    }

    return (
        <div className="container mx-auto px-4 py-8">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <span className="cursor-pointer hover:text-primary" onClick={() => router.push("/")}>Home</span>
                <ChevronRight className="h-4 w-4" />
                <span className="cursor-pointer hover:text-primary" onClick={() => router.push("/products")}>Products</span>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-foreground">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Gallery */}
                <div className="space-y-4">
                    <div className="border rounded-2xl p-8 bg-white flex items-center justify-center aspect-square overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={selectedImage || "/placeholder.png"}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                        />
                    </div>
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {product.images.map((img: ProductImage) => (
                                <button
                                    key={img.image_url}
                                    onClick={() => setSelectedImage(img.image_url)}
                                    className={`border-2 rounded-lg p-2 bg-white w-20 h-20 shrink-0 flex items-center justify-center transition-all ${selectedImage === img.image_url ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-muted'}`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img.image_url} alt="" className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="space-y-8">
                    <div className="space-y-2">
                        <span className="text-primary font-medium tracking-wide uppercase text-sm">
                            {product.brand?.name} • {product.category?.name}
                        </span>
                        <h1 className="text-3xl lg:text-4xl font-bold leading-tight">{product.name}</h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {product.variants && product.variants.length > 0 && (
                                <span>{product.variants.length} variants available</span>
                            )}
                            {isOutOfStock ? (
                                <Badge variant="destructive">Out of Stock</Badge>
                            ) : (
                                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 flex items-center gap-1">
                                    <Check className="h-3 w-3" /> In Stock
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="flex items-end gap-3 border-b pb-6">
                        <span className="text-4xl font-bold text-primary">₹{product.selling_price.toLocaleString()}</span>
                        {product.base_price > product.selling_price && (
                            <span className="text-lg text-muted-foreground line-through mb-1">₹{product.base_price.toLocaleString()}</span>
                        )}
                    </div>

                    {/* Description Short */}
                    <p className="text-muted-foreground leading-relaxed">
                        {product.description}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <div className="flex items-center border rounded-xl overflow-hidden shadow-sm w-fit">
                            <button
                                className="p-3 hover:bg-muted transition-colors disabled:opacity-50"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={isOutOfStock}
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-12 text-center font-medium">{quantity}</span>
                            <button
                                className="p-3 hover:bg-muted transition-colors disabled:opacity-50"
                                onClick={() => setQuantity(quantity + 1)}
                                disabled={isOutOfStock}
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>

                        <Button
                            size="lg"
                            className="flex-1 rounded-xl h-auto py-3 text-lg font-semibold shadow-lg shadow-primary/20"
                            disabled={isOutOfStock}
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Add to Cart
                        </Button>
                    </div>

                    {/* Product Tabs */}
                    <div className="pt-8">
                        <Tabs defaultValue="specs">
                            <TabsList className="w-full justify-start rounded-xl p-1 bg-muted/50">
                                <TabsTrigger value="specs" className="rounded-lg">Specifications</TabsTrigger>
                                <TabsTrigger value="details" className="rounded-lg">Description</TabsTrigger>
                            </TabsList>
                            <TabsContent value="specs" className="mt-4">
                                <Card>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableBody>
                                                {Object.entries(product.specifications || {}).map(([key, value]) => (
                                                    <TableRow key={key}>
                                                        <TableCell className="font-medium capitalize text-muted-foreground w-1/3">{key.replace(/_/g, " ")}</TableCell>
                                                        <TableCell>{String(value)}</TableCell>
                                                    </TableRow>
                                                ))}
                                                {!product.specifications && (
                                                    <TableRow>
                                                        <TableCell colSpan={2} className="text-center text-muted-foreground">No specifications available</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="details" className="mt-4">
                                <Card>
                                    <CardContent className="p-6 text-muted-foreground leading-relaxed">
                                        {product.description}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}
