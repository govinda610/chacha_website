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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, MoreHorizontal, Search, Plus, Trash2 } from "lucide-react"
// import { BulkActions } from "@/components/admin/products/bulk-actions" // Temporarily disabled or verify existence
import { toast } from "sonner"
import { adminService } from "@/services/admin"
import { ProductForm } from "@/components/admin/products/product-form"

interface Product {
    id: number
    name: string
    slug: string
    selling_price: number
    base_price: number
    is_active: boolean
    stock_quantity?: number
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined)

    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const page = Number(searchParams.get("page")) || 1
    const limit = 20
    const search = searchParams.get("search") || ""

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const params = {
                skip: (page - 1) * limit,
                limit: limit,
                search: search || undefined
            }
            const data = await adminService.getProducts(params)
            setProducts(data.products)
            setTotal(data.total)
        } catch (error) {
            console.error("Error fetching products:", error)
            toast.error("Failed to fetch products")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search])

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set("search", term)
        } else {
            params.delete("search")
        }
        params.set("page", "1")
        router.replace(`${pathname}?${params.toString()}`)
    }

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", newPage.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    const handleCreateUpdate = async (data: any) => {
        try {
            if (selectedProduct) {
                await adminService.updateProduct(selectedProduct.id, data)
                toast.success("Product updated")
            } else {
                await adminService.createProduct(data)
                toast.success("Product created")
            }
            setIsDialogOpen(false)
            fetchProducts()
        } catch (error) {
            toast.error("Operation failed")
            console.error(error)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return
        try {
            await adminService.deleteProduct(id)
            toast.success("Product deleted")
            fetchProducts()
        } catch (error) {
            toast.error("Failed to delete product")
        }
    }

    const openEditDialog = async (product: Product) => {
        // Fetch full details including variants
        try {
            const fullProduct = await adminService.getProduct(product.id)
            setSelectedProduct(fullProduct)
            setIsDialogOpen(true)
        } catch (error) {
            toast.error("Failed to load product details")
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
                    {/* <BulkActions /> */}
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) setSelectedProduct(undefined)
                    }}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Product
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{selectedProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                                <DialogDescription>
                                    Fill in the details below.
                                </DialogDescription>
                            </DialogHeader>
                            <ProductForm
                                initialData={selectedProduct}
                                onSubmit={handleCreateUpdate}
                            />
                        </DialogContent>
                    </Dialog>
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
                            <TableHead>Slug</TableHead>
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
                                    <TableCell>₹{product.selling_price}</TableCell>
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
                                                    Copy Slug
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => openEditDialog(product)}>
                                                    Edit details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <div className="flex items-center">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </div>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

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
                    Page {page} of {Math.ceil(total / limit) || 1}
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
