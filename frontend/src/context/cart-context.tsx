"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { cartService } from "@/services/cart"
import type { Cart, CartItem } from "@/types/cart"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context" // Assuming we have this, or check if user logged in

interface CartContextType {
    cart: Cart | null
    items: CartItem[]
    itemCount: number
    isLoading: boolean
    addItem: (productId: number, quantity: number, variantId?: number) => Promise<void>
    updateQuantity: (itemId: number, quantity: number) => Promise<void>
    removeItem: (itemId: number) => Promise<void>
    clearCart: () => Promise<void>
    refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    // We can use AuthContext to know when to fetch, but for now fetch on mount
    // If api returns 401, cart stays null.

    const refreshCart = async () => {
        try {
            const data = await cartService.getCart()
            setCart(data)
        } catch (error) {
            // Silent error commonly if not logged in
            console.log("Cart fetch failed (likely guest):", error)
            setCart(null)
        }
    }

    useEffect(() => {
        refreshCart()
    }, [])

    const addItem = async (productId: number, quantity: number, variantId?: number) => {
        setIsLoading(true)
        try {
            // Optimistic or wait? Wait is safer for stock checks
            await cartService.addToCart({ product_id: productId, quantity, product_variant_id: variantId })
            await refreshCart()
            toast.success("Added to cart")
        } catch (err: any) {
            console.error(err)
            if (err.response?.status === 401) {
                toast.error("Please login to add items to cart")
                // Optional: router.push("/auth/login")
            } else {
                toast.error("Failed to add to cart")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const updateQuantity = async (itemId: number, quantity: number) => {
        if (quantity <= 0) {
            return removeItem(itemId)
        }
        try {
            await cartService.updateItem(itemId, quantity)
            // Optimistic local update
            setCart(prev => prev ? {
                ...prev,
                items: prev.items.map(item => item.id === itemId ? { ...item, quantity } : item)
            } : null)
            // Then refresh to be sure of total calculations
            await refreshCart()
        } catch (err) {
            toast.error("Could not update quantity")
        }
    }

    const removeItem = async (itemId: number) => {
        try {
            await cartService.removeItem(itemId)
            setCart(prev => prev ? {
                ...prev,
                items: prev.items.filter(item => item.id !== itemId)
            } : null)
            toast.success("Item removed")
            await refreshCart()
        } catch (err) {
            toast.error("Could not remove item")
        }
    }

    const clearCart = async () => {
        setCart(null)
        await cartService.clearCart()
    }

    return (
        <CartContext.Provider value={{
            cart,
            items: cart?.items || [],
            itemCount: cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0,
            isLoading,
            addItem,
            updateQuantity,
            removeItem,
            clearCart,
            refreshCart
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
