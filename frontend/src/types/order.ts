import { Address } from "./auth"
import { Product } from "./product"

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"
export type PaymentStatus = "pending" | "paid" | "failed"

export interface OrderItem {
    id: number
    product_id: number
    product: Product
    product_variant_id?: number
    quantity: number
    price: number // Price at time of purchase
}

export interface Order {
    id: number
    user_id: number
    status: OrderStatus
    total_amount: number
    shipping_address_id?: number
    shipping_address?: Address
    payment_status: PaymentStatus
    created_at: string
    items: OrderItem[]
}
