import { Product, ProductVariant } from "./product"

export interface CartItem {
    id: number
    product_id: number
    user_id: number
    product: Product
    variant_id?: number
    variant?: ProductVariant
    quantity: number
}

export interface Cart {
    items: CartItem[]
    subtotal: number
    total_quantity: number
}

export interface AddToCartRequest {
    product_id: number
    quantity: number
    variant_id?: number
}
