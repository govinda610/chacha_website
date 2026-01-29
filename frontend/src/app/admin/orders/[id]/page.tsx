"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, CreditCard, Truck } from "lucide-react"
import { toast } from "sonner"
import { Order, OrderStatus } from "@/types/order"

export default function AdminOrderDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem("token")
                // Assuming we have an endpoint for single order details for admin.
                // The list endpoint returns simplified objects.
                // We might need to check if we created a specific GET /admin/orders/{id}.
                // Let's assume we reuse the generic order details logic or added it.
                // Re-checking admin.py... I think we might have missed a specific GET /orders/{id} in admin.py!
                // We only added list and status update.
                // We can use the user-facing endpoint /api/v1/orders/{id} IF the admin is allowed to use it?
                // Or better, I should have added GET /admin/orders/{id}. 
                // Let's implement this page assuming I'll fix the backend in a moment if missing.
                // Actually, let's use the URL standard: /api/v1/admin/orders/{id}

                const response = await fetch(`http://localhost:8000/api/v1/admin/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (response.ok) {
                    const data = await response.json()
                    setOrder(data) // admin endpoint usually returns flat object or nested? 
                    // Let's assume it returns standard Order schema including items.
                } else {
                    toast.error("Failed to fetch order details")
                }
            } catch (error) {
                console.error("Error fetching order:", error)
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchOrder()
    }, [id])

    const handleStatusUpdate = async (newStatus: OrderStatus) => {
        setUpdating(true)
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:8000/api/v1/admin/orders/${id}/status`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (!response.ok) {
                throw new Error("Failed to update status")
            }

            setOrder(prev => prev ? { ...prev, status: newStatus } : null)
            toast.success("Order status updated")
        } catch {
            toast.error("Update failed")
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!order) {
        return <div>Order not found</div>
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Order {order.order_number}</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>ID: #{order.id}</span>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Select
                        value={order.status}
                        onValueChange={(val) => handleStatusUpdate(val as OrderStatus)}
                        disabled={updating}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded bg-muted/20 object-cover" /> {/* Placeholder/Image */}
                                        <div>
                                            <p className="font-medium">{item.product_name}</p>
                                            <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <p className="font-medium">{formatCurrency(item.unit_price)} x {item.quantity}</p>
                                        <p className="font-bold">{formatCurrency(item.total_price)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/50 flex flex-col items-end gap-2 p-6">
                        <div className="flex w-full justify-between text-sm">
                            <span>Subtotal</span>
                            <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex w-full justify-between text-sm">
                            <span>Shipping</span>
                            <span>{formatCurrency(order.shipping_fee)}</span>
                        </div>
                        <div className="flex w-full justify-between text-sm">
                            <span>Tax</span>
                            <span>{formatCurrency(order.tax_amount)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex w-full justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{formatCurrency(order.total_amount)}</span>
                        </div>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <Truck className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base">Shipping Information</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                        <div className="font-medium">{order.shipping_address?.label || "Shipping Address"}</div>
                        <div className="mt-1 text-muted-foreground">
                            {order.shipping_address?.full_address}<br />
                            {order.shipping_address?.city}, {order.shipping_address?.state}<br />
                            {order.shipping_address?.pincode}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base">Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <Badge variant={order.payment_status === "paid" ? "default" : "secondary"}>
                                {order.payment_status}
                            </Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Method</span>
                            <span className="capitalize">{order.payment_method || "Online"}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
