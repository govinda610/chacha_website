"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Filter, Search as SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/products/product-card"
import { productService, ProductParams } from "@/services/products"
import type { Product, Category } from "@/types/product"
import { useDebounce } from "@/hooks/use-debounce"

import { Suspense } from "react"

function ProductsContent() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)

    // Filter States
    const initialSearch = searchParams.get("q") || ""
    const [search, setSearch] = useState(initialSearch)
    const [priceRange, setPriceRange] = useState([0, 50000])
    const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category_id") || "all")
    const [sort, setSort] = useState("newest")

    const debouncedSearch = useDebounce(search, 500)

    // Page state for pagination
    const [page, setPage] = useState(1)
    const LIMIT = 50

    // Fetch Categories on Mount
    useEffect(() => {
        productService.getCategories().then(setCategories).catch(console.error)
    }, [])

    // Fetch Products when filters change
    useEffect(() => {
        async function loadProducts() {
            setLoading(true)
            try {
                const params: ProductParams = {
                    limit: LIMIT,
                    page: page,
                    search: debouncedSearch,
                    sort: sort,
                    min_price: priceRange[0],
                    max_price: priceRange[1] < 50000 ? priceRange[1] : undefined,
                }

                if (selectedCategory && selectedCategory !== "all") {
                    params.category_id = parseInt(selectedCategory)
                }

                const data = await productService.getProducts(params)
                setProducts(data.items)
                setTotal(data.total) // Note: this is actually length of current page
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        loadProducts()
    }, [debouncedSearch, selectedCategory, sort, priceRange, page])

    // Update URL Query (Optional, good for sharing)
    useEffect(() => {
        const params = new URLSearchParams()
        if (debouncedSearch) params.set("q", debouncedSearch)
        if (selectedCategory !== "all") params.set("category_id", selectedCategory)
        if (page > 1) params.set("page", page.toString())
        router.replace(`/products?${params.toString()}`, { scroll: false })
    }, [debouncedSearch, selectedCategory, page, router])


    const FilterContent = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                    <Button
                        variant={selectedCategory === "all" ? "secondary" : "ghost"}
                        className="w-full justify-start h-auto min-h-[2rem] text-sm text-left font-medium whitespace-normal py-2 px-4"
                        onClick={() => {
                            setSelectedCategory("all")
                            setPage(1)
                        }}
                    >
                        All Products
                    </Button>
                    {categories.map(cat => (
                        <Button
                            key={cat.id}
                            variant={selectedCategory === String(cat.id) ? "secondary" : "ghost"}
                            className="w-full justify-start h-auto min-h-[2rem] text-sm pl-4 text-left font-medium whitespace-normal py-2"
                            onClick={() => {
                                setSelectedCategory(String(cat.id))
                                setPage(1)
                            }}
                        >
                            {cat.name}
                        </Button>
                    ))}
                </div>
            </div>
            <Separator />
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Price Range</h3>
                    <span className="text-xs text-muted-foreground">₹{priceRange[0]} - ₹{priceRange[1]}+</span>
                </div>
                <Slider
                    defaultValue={[0, 50000]}
                    max={50000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="py-4"
                />
            </div>
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Mobile Filter Sheet */}
                <div className="md:hidden flex items-center gap-2 mb-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Filter className="h-4 w-4" /> Filters
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle>Filters</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6">
                                <FilterContent />
                            </div>
                        </SheetContent>
                    </Sheet>
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            className="pl-8 h-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Desktop Sidebar */}
                <div className="hidden md:block w-64 shrink-0 space-y-8">
                    <div className="sticky top-24 space-y-6">
                        <div>
                            <h2 className="text-lg font-bold">Filters</h2>
                        </div>
                        <FilterContent />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-6">

                    {/* Header / Controls */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold">
                            {selectedCategory !== "all"
                                ? categories.find(c => String(c.id) === selectedCategory)?.name || "Category"
                                : "All Products"
                            }
                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                                {products.length > 0 ? `Showing ${products.length} items` : "No items"}
                            </span>
                        </h1>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            {/* Desktop Search */}
                            <div className="relative hidden md:block w-64">
                                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    className="pl-8 h-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <Select value={sort} onValueChange={setSort}>
                                <SelectTrigger className="w-[140px] h-9">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="bg-slate-50 h-[300px] rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center justify-between pt-8 border-t">
                                <Button
                                    variant="outline"
                                    disabled={page <= 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-muted-foreground">Page {page}</span>
                                <Button
                                    variant="outline"
                                    disabled={products.length < LIMIT}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-muted-foreground">
                                <SearchIcon className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-semibold">No products found</h3>
                            <p className="text-muted-foreground max-w-sm">
                                Try adjusting your filters or search terms.
                            </p>
                            <Button variant="outline" onClick={() => {
                                setSearch("")
                                setSelectedCategory("all")
                                setPriceRange([0, 50000])
                                setPage(1)
                            }}>
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-8 animate-pulse"><div className="h-8 bg-slate-100 w-1/4 rounded mb-8"></div><div className="grid grid-cols-4 gap-6"><div className="col-span-1 h-96 bg-slate-100 rounded-xl"></div><div className="col-span-3 h-96 bg-slate-100 rounded-xl"></div></div></div>}>
            <ProductsContent />
        </Suspense>
    )
}
