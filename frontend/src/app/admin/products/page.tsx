"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Loader2, MoreHorizontal, Search, Plus } from "lucide-react"
import { BulkActions } from "@/components/admin/products/bulk-actions"
import { toast } from "sonner"

interface Product {
    id: number
    name: string
    slug: string
    selling_price: number
    base_price: number
    is_active: boolean
    category_id?: number
    stock_quantity?: number // Might come from variant in future, mocking here or assuming flattened
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Query params
    const page = Number(searchParams.get("page")) || 1
    const limit = 20
    const search = searchParams.get("search") || ""

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            const params = new URLSearchParams({
                skip: ((page - 1) * limit).toString(),
                limit: limit.toString(),
            })
            if (search) params.append("search", search)

            const response = await fetch(`http://localhost:8000/api/v1/admin/products?${params}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                setProducts(data.products)
                setTotal(data.total)
            } else {
                toast.error("Failed to fetch products")
            }
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [page, search])

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set("search", term)
        } else {
            params.delete("search")
        }
        params.set("page", "1") // Reset to page 1
        router.replace(`${pathname}?${params.toString()}`)
    }

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", newPage.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    // Quick Update Handler
    const handleQuickUpdate = async (id: number, field: string, value: string | number) => {
        // Optimistic update
        setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))

        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:8000/api/v1/admin/products/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ [field]: value })
            })

            if (!response.ok) {
                throw new Error("Update failed")
            }
            toast.success("Updated")
        } catch (error) {
            toast.error("Failed to update product")
            fetchProducts() // Revert
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">
                        Manage your product catalog
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <BulkActions />
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-8"
                        defaultValue={search}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch(e.currentTarget.value)
                            }
                        }}
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                                </TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.slug}</TableCell>
                                    <TableCell>
                                        <Input
                                            className="h-8 w-24"
                                            type="number"
                                            defaultValue={product.selling_price}
                                            onBlur={(e) => handleQuickUpdate(product.id, 'selling_price', Number(e.target.value))}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={product.is_active ? "default" : "destructive"}>
                                            {product.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.slug)}>
                                                    Copy SKU
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Edit details</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Archive product</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1 || loading}
                >
                    Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                    Page {page} of {Math.ceil(total / limit)}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= Math.ceil(total / limit) || loading}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
