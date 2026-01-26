import { api } from "@/lib/axios"
import type { Cart, AddToCartRequest, CartItem } from "@/types/cart"

export const cartService = {
    async getCart(): Promise<Cart> {
        const { data } = await api.get<Cart>("/cart/")
        return data
    },

    async addToCart(payload: AddToCartRequest): Promise<CartItem> {
        const { data } = await api.post<CartItem>("/cart/", payload)
        return data
    },

    async updateItem(itemId: number, quantity: number): Promise<CartItem> {
        const { data } = await api.put<CartItem>(`/cart/${itemId}`, { quantity })
        return data
    },

    async removeItem(itemId: number): Promise<void> {
        await api.delete(`/cart/${itemId}`)
    },

    async clearCart(): Promise<void> {
        await api.delete("/cart/clear")
    }
}
