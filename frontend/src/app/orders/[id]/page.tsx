"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ordersService } from "@/services/orders"
import type { Order } from "@/types/order"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, Loader2, MapPin, Package } from "lucide-react"
import { format } from "date-fns"

export default function OrderDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = Number(params.id)

    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return
        ordersService.getOrderById(id)
            .then(setOrder)
            .catch((err) => {
                console.error(err)
                // router.push("/orders")
            })
            .finally(() => setLoading(false))
    }, [id, router])

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
    if (!order) return <div className="container py-8">Order not found</div>

    return (
        <div className="container mx-auto px-4 py-8">
            <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent" onClick={() => router.back()}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Orders
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold">Order #{order.id}</h1>
                        <Badge variant={order.status === "delivered" ? "default" : "secondary"} className="text-base px-3">
                            {order.status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Placed on {format(new Date(order.created_at), "Pk")}
                    </p>
                </div>
                {/* <Button variant="outline">Download Invoice</Button> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="border rounded-xl bg-white overflow-hidden">
                        <div className="p-4 bg-muted/30 border-b font-medium flex items-center gap-2">
                            <Package className="h-4 w-4" /> Items ({order.items.length})
                        </div>
                        <div className="divide-y">
                            {order.items.map((item) => (
                                <div key={item.id} className="p-4 flex gap-4">
                                    <div className="h-20 w-20 bg-slate-100 rounded-lg shrink-0 overflow-hidden border">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.product?.images?.[0]?.image_url || "/placeholder.png"}
                                            alt={item.product?.name || "Product"}
                                            className="w-full h-full object-cover mix-blend-multiply"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.product?.name}</h3>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        <p className="font-medium mt-1">₹{item.price.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right font-bold">
                                        ₹{(item.price * item.quantity).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="border rounded-xl bg-white p-6 space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Shipping Details
                        </h3>
                        <Separator />
                        <div className="text-sm space-y-1">
                            {order.shipping_address ? (
                                <>
                                    <p className="font-medium">{order.shipping_address.label || "Address"}</p>
                                    <p>{order.shipping_address.full_address}</p>
                                    <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}</p>
                                </>
                            ) : (
                                <p className="text-muted-foreground">Address info not available</p>
                            )}
                        </div>
                    </div>

                    <div className="border rounded-xl bg-white p-6 space-y-3">
                        <h3 className="font-semibold text-lg">Payment Summary</h3>
                        <Separator />
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>₹{order.total_amount.toLocaleString()}</span>
                            {/* Simplified logic since backend stores final total */}
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Payment Status</span>
                            <span className="capitalize">{order.payment_status}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>₹{order.total_amount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
