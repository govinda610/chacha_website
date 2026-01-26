"use client"

import { useEffect, useState } from "react"
import { ordersService } from "@/services/orders"
import type { Order } from "@/types/order"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        ordersService.getMyOrders()
            .then(setOrders)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-12 bg-muted/50 rounded-xl">
                    <p className="text-muted-foreground mb-4">No orders found</p>
                    <Link href="/products">
                        <Button>Start Shopping</Button>
                    </Link>
                </div>
            ) : (
                <div className="border rounded-xl bg-white overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.order_number || `#${order.id}`}</TableCell>
                                    <TableCell>{format(new Date(order.created_at), "MMM d, yyyy")}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            order.status === "delivered" ? "default" :
                                                order.status === "cancelled" ? "destructive" : "secondary"
                                        }>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>₹{order.total_amount.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/orders/${order.id}`}>
                                            <Button variant="outline" size="sm">View Details</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}
