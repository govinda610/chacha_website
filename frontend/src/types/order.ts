import { Address } from "./auth"
import { Product } from "./product"

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"
export type PaymentStatus = "pending" | "paid" | "failed"

export interface OrderItem {
    id: number
    order_id: number
    product_id: number
    variant_id?: number
    product?: Product
    product_name: string
    sku: string
    quantity: number
    unit_price: number
    total_price: number
}

export interface Order {
    id: number
    order_number: string
    user_id: number
    address_id: number
    status: OrderStatus
    payment_status: PaymentStatus
    payment_method?: string
    subtotal: number
    shipping_fee: number
    tax_amount: number
    total_amount: number
    notes?: string
    created_at: string
    items: OrderItem[]
    shipping_address?: {
        label?: string
        full_address: string
        city: string
        state: string
        pincode: string
    }
}
