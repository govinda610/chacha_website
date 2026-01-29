"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { cartService } from "@/services/cart"
import { productService } from "@/services/products"
import type { Cart, CartItem } from "@/types/cart"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"

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
    const { user } = useAuth()

    const refreshCart = async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null

        if (!token) {
            // Guest mode
            const localItems = JSON.parse(localStorage.getItem("guest_cart") || "[]")
            const subtotal = localItems.reduce((acc: number, item: any) => acc + ((item.price || 0) * (item.quantity || 0)), 0)
            const total_quantity = localItems.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0)

            setCart({
                items: localItems,
                subtotal,
                total_quantity
            })
            return
        }

        try {
            const data = await cartService.getCart()
            setCart(data)
        } catch (error: any) {
            if (error.response?.status !== 401) {
                console.error("Cart fetch failed:", error)
            }
            setCart(null)
        }
    }

    // Sync guest cart to account after login
    const syncCart = async () => {
        const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]")
        if (guestCart.length === 0) return

        setIsLoading(true)
        try {
            for (const item of guestCart) {
                await cartService.addToCart({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    variant_id: item.variant_id
                })
            }
            localStorage.removeItem("guest_cart")
            await refreshCart()
            toast.success("Guest items added to your account!")
        } catch (err) {
            console.error("Cart sync failed:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            syncCart()
        } else {
            refreshCart()
        }
    }, [user])

    const addItem = async (productId: number, quantity: number, variantId?: number) => {
        setIsLoading(true)
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null

        if (!token) {
            try {
                const product = await productService.getProductById(productId)
                const variant = variantId ? product.variants?.find((v: any) => v.id === variantId) : null
                const price = variant ? variant.price : product.selling_price

                const localItems = JSON.parse(localStorage.getItem("guest_cart") || "[]")
                const existingIndex = localItems.findIndex((item: any) =>
                    item.product_id === productId && item.variant_id === variantId
                )

                if (existingIndex > -1) {
                    localItems[existingIndex].quantity += quantity
                } else {
                    localItems.push({
                        id: Math.random(),
                        product_id: productId,
                        variant_id: variantId,
                        quantity,
                        price: price || 0,
                        product,
                        variant
                    })
                }

                localStorage.setItem("guest_cart", JSON.stringify(localItems))
                await refreshCart()
                toast.success("Added to cart")
            } catch (err) {
                console.error(err)
                toast.error("Failed to add to cart")
            } finally {
                setIsLoading(false)
            }
            return
        }

        try {
            await cartService.addToCart({ product_id: productId, quantity, variant_id: variantId })
            await refreshCart()
            toast.success("Added to cart")
        } catch (err: any) {
            console.error(err)
            toast.error("Failed to add to cart")
        } finally {
            setIsLoading(false)
        }
    }

    const updateQuantity = async (itemId: number, quantity: number) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null

        if (!token) {
            if (quantity <= 0) return removeItem(itemId)
            const localItems = JSON.parse(localStorage.getItem("guest_cart") || "[]")
            const item = localItems.find((i: any) => i.id === itemId)
            if (item) {
                item.quantity = quantity
                localStorage.setItem("guest_cart", JSON.stringify(localItems))
                refreshCart()
            }
            return
        }

        if (quantity <= 0) {
            return removeItem(itemId)
        }
        try {
            await cartService.updateItem(itemId, quantity)
            await refreshCart()
        } catch (err) {
            toast.error("Could not update quantity")
        }
    }

    const removeItem = async (itemId: number) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null

        if (!token) {
            const localItems = JSON.parse(localStorage.getItem("guest_cart") || "[]")
            const filtered = localItems.filter((i: any) => i.id !== itemId)
            localStorage.setItem("guest_cart", JSON.stringify(filtered))
            refreshCart()
            toast.success("Item removed")
            return
        }

        try {
            await cartService.removeItem(itemId)
            toast.success("Item removed")
            await refreshCart()
        } catch (err) {
            toast.error("Could not remove item")
        }
    }

    const clearCart = async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
        if (!token) {
            localStorage.removeItem("guest_cart")
            await refreshCart()
            return
        }
        try {
            await cartService.clearCart()
            await refreshCart()
        } catch (err) {
            console.error("Clear cart failed:", err)
        }
    }

    return (
        <CartContext.Provider value={{
            cart,
            items: cart?.items || [],
            itemCount: cart?.items.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0,
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
