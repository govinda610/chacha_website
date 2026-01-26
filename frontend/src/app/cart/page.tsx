"use client"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

export default function CartPage() {
    const { cart, items, updateQuantity, removeItem, isLoading } = useCart()
    const router = useRouter()

    if (isLoading && !cart) {
        return <div className="container mx-auto py-16 text-center">Loading cart...</div>
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center space-y-6">
                <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center text-muted-foreground">
                    <ShoppingBag className="h-10 w-10" />
                </div>
                <h1 className="text-2xl font-bold">Your cart is empty</h1>
                <p className="text-muted-foreground max-w-sm">
                    Looks like you haven't added anything to your cart yet. Browse our products to find what you need.
                </p>
                <Link href="/products">
                    <Button size="lg" className="rounded-xl px-8">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        )
    }

    // Calculations
    const subtotal = items.reduce((acc, item) => acc + (item.product.selling_price * item.quantity), 0)
    const gst = subtotal * 0.18 // Assuming 18% GST for now (backend might calculate differently)
    const total = subtotal + gst

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                        {items.map((item, index) => (
                            <div key={item.id}>
                                <div className="p-4 flex gap-4 sm:gap-6">
                                    {/* Image */}
                                    <div className="h-24 w-24 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden border">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.product?.images?.[0]?.image_url || "/placeholder.png"}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover mix-blend-multiply"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-semibold text-lg line-clamp-1">{item.product.name}</h3>
                                                <button
                                                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {item.product_variant_id ? "Variant ID: " + item.product_variant_id : "Standard"}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center border rounded-lg h-8">
                                                <button
                                                    className="px-2 h-full hover:bg-muted rounded-l-lg disabled:opacity-50"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={isLoading}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    className="px-2 h-full hover:bg-muted rounded-r-lg disabled:opacity-50"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={isLoading}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">₹{(item.product.selling_price * item.quantity).toLocaleString()}</p>
                                                <p className="text-xs text-muted-foreground">₹{item.product.selling_price} each</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {index < items.length - 1 && <Separator />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white border rounded-xl p-6 shadow-sm sticky top-24 space-y-4">
                        <h2 className="text-lg font-bold">Order Summary</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">GST (18%)</span>
                                <span>₹{gst.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">Total</span>
                            <span className="font-bold text-xl text-primary">₹{total.toLocaleString()}</span>
                        </div>

                        <Button
                            className="w-full h-12 text-lg rounded-xl shadow-lg shadow-primary/20"
                            onClick={() => router.push("/checkout")}
                        >
                            Proceed to Checkout
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                        <div className="text-xs text-center text-muted-foreground pt-2">
                            Secure Checkout powered by Razorpay
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
