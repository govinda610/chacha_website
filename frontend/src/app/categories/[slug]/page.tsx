"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { productService } from "@/services/products"
import type { Category, Product } from "@/types/product"
import { ProductCard } from "@/components/products/product-card"
import { Button } from "@/components/ui/button"
import { SearchIcon, ChevronLeft } from "lucide-react"

export default function CategoryPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string

    const [category, setCategory] = useState<Category | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            try {
                // 1. Resolve Category from Slug
                // Note: Ideally backend should support getCategoryBySlug, but fetching all is caching-friendly for small trees
                const allCategories = await productService.getCategories()

                // Helper to find category recursively
                const findCategory = (cats: Category[], targetSlug: string): Category | undefined => {
                    for (const cat of cats) {
                        if (cat.slug === targetSlug) return cat
                        // Backend response for getCategories might be flat or nested depending on implementation
                        // Assuming flat based on previous outputs, but if nested check children
                        if (cat.children) { // If type has children
                            const found = findCategory(cat.children, targetSlug)
                            if (found) return found
                        }
                    }
                    return undefined
                }

                const foundCategory = findCategory(allCategories, slug)

                if (!foundCategory) {
                    // Handle 404
                    console.error("Category not found")
                    return
                }

                setCategory(foundCategory)

                // 2. Fetch Products for this Category
                const productData = await productService.getProducts({
                    category_id: foundCategory.id,
                    limit: 50 // Match general listing page limit
                })
                setProducts(productData.items)

            } catch (err) {
                console.error("Failed to load category data", err)
            } finally {
                setLoading(false)
            }
        }

        if (slug) loadData()
    }, [slug])

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <Button variant="ghost" className="pl-0 gap-2 mb-4 hover:bg-transparent hover:text-primary" onClick={() => router.back()}>
                    <ChevronLeft className="h-4 w-4" /> Back
                </Button>

                {loading ? (
                    <div className="h-10 w-1/3 bg-slate-100 rounded animate-pulse" />
                ) : category ? (
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">{category.name}</h1>
                        <p className="text-muted-foreground">Browse all products in {category.name}</p>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-bold">Category Not Found</h1>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-[300px] bg-slate-50 rounded-xl animate-pulse" />)}
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-slate-50 rounded-xl border border-dashed">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-muted-foreground shadow-sm">
                        <SearchIcon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold">No products found in this category</h3>
                    <p className="text-muted-foreground w-full max-w-sm">
                        We couldn't find any products listed under {category?.name}.
                    </p>
                    <Button variant="outline" onClick={() => router.push("/products")}>
                        Browse All Products
                    </Button>
                </div>
            )}
        </div>
    )
}
