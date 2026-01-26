import { Product } from "./product"

export interface CartItem {
    id: number // ID of the cart item record itself
    product_id: number
    product: Product
    product_variant_id?: number
    // variant?: ProductVariant // If needed
    quantity: number
}

export interface Cart {
    id: number
    user_id?: number
    items: CartItem[]
    total_amount: number
}

export interface AddToCartRequest {
    product_id: number
    quantity: number
    product_variant_id?: number
}
