"use client"

import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Truck, CreditCard, Lock } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ordersService } from "@/services/orders"
import { userService } from "@/services/user"
import { api } from "@/lib/axios"
import Script from "next/script"

export default function CheckoutPage() {
    const { cart, items, clearCart } = useCart()
    const { user } = useAuth()
    const router = useRouter()

    const [step, setStep] = useState(1) // 1: Contact/Address, 2: Payment
    const [loading, setLoading] = useState(false)

    // Guest Info
    const [guestInfo, setGuestInfo] = useState({
        name: "",
        email: "",
        phone: ""
    })

    // Address State
    const [address, setAddress] = useState({
        line1: "",
        city: "",
        pincode: "",
        state: ""
    })
    const [savedAddressId, setSavedAddressId] = useState<number | null>(null)
    const [paymentMethod, setPaymentMethod] = useState("razorpay")

    if (!cart || (items.length === 0 && !loading)) {
        return <div className="p-8 text-center bg-muted/5">Your cart is empty</div>
    }

    const subtotal = items.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 0)), 0)
    const shipping = subtotal > 5000 ? 0 : 150
    const gst = (subtotal + shipping) * 0.18
    const total = subtotal + shipping + gst

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!address.line1 || !address.city || !address.pincode || !address.state) {
            toast.error("Please fill all address fields")
            return
        }

        if (!user && (!guestInfo.name || !guestInfo.email || !guestInfo.phone)) {
            toast.error("Please fill all contact fields")
            return
        }

        setLoading(true)
        try {
            const savedAddr = await userService.addAddress({
                full_address: address.line1,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                label: "Checkout Address"
            })
            setSavedAddressId(savedAddr.id)
            setStep(2)
        } catch (error) {
            console.error(error)
            toast.error("Failed to save info")
        } finally {
            setLoading(false)
        }
    }

    const handlePlaceOrder = async () => {
        if (!savedAddressId) {
            toast.error("Address not saved.")
            return
        }

        setLoading(true)
        try {
            // Always prepare items payload from what is visible in the cart
            const itemsPayload = items.map(item => ({
                product_id: item.product_id,
                variant_id: item.variant_id,
                quantity: item.quantity,
                unit_price: item.price || 0
            }))

            const orderPayload: any = {
                address_id: savedAddressId,
                payment_method: paymentMethod,
                items: itemsPayload, // Always send items to ensure backend has latest data
                notes: ""
            }

            if (!user) {
                orderPayload.guest_name = guestInfo.name
                orderPayload.guest_email = guestInfo.email
                orderPayload.guest_phone = guestInfo.phone
            }

            const order = await ordersService.createOrder(orderPayload)

            if (paymentMethod === "razorpay") {
                try {
                    // 1. Create Razorpay order on backend
                    const { data: rzpOrder } = await api.post("/payments/create-order", {
                        order_id: order.id
                    })

                    // 2. Open Razorpay Checkout
                    const options = {
                        key: rzpOrder.razorpay_key,
                        amount: rzpOrder.amount,
                        currency: rzpOrder.currency,
                        name: "Chacha Website",
                        description: `Payment for Order #${order.order_number}`,
                        order_id: rzpOrder.razorpay_order_id,
                        handler: async function (response: any) {
                            try {
                                // 3. Verify on backend
                                await api.post("/payments/verify", {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    order_id: order.id
                                })

                                await clearCart()
                                toast.success("Payment successful! Order confirmed.")
                                router.push(`/orders/${order.id}?status=success`)
                            } catch (err) {
                                console.error(err)
                                toast.error("Payment verification failed. Please contact support.")
                            }
                        },
                        prefill: {
                            name: user?.full_name || guestInfo.name,
                            email: user?.email || guestInfo.email,
                            contact: user?.phone || guestInfo.phone
                        },
                        theme: {
                            color: "#0f172a"
                        },
                        modal: {
                            ondismiss: function () {
                                setLoading(false)
                                toast.error("Payment cancelled.")
                            }
                        }
                    }

                    const rzp = new (window as any).Razorpay(options)
                    rzp.open()
                    return
                } catch (err) {
                    console.error("Razorpay init error:", err)
                    toast.error("Failed to initialize payment. Please try again.")
                    setLoading(false)
                    return
                }
            }

            // COD flow
            await clearCart()
            toast.success("Order Placed Successfully!")
            router.push(`/orders/${order.id}`)
        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.detail || "Failed to place order")
        } finally {
            if (paymentMethod !== "razorpay") {
                setLoading(false)
            }
        }
    }

    return (
        <div className="container mx-auto px-4 py-12 mt-32 lg:mt-40">
            <div className="max-w-7xl mx-auto">
                <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                {!user && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="text-blue-800 font-medium">Checking out as a guest</p>
                            <p className="text-blue-600 text-sm">Already have an account? Log in for a faster experience.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/login?returnUrl=/checkout`)}>Login</Button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Step 1: Shipping & Contact */}
                        <div className={`border rounded-xl p-6 bg-white ${step === 2 ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${step > 1 ? 'bg-green-100 text-green-700' : 'bg-primary text-white'}`}>
                                    {step > 1 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
                                </div>
                                <h2 className="text-xl font-bold">Shipping & Contact Details</h2>
                            </div>

                            {step === 1 && (
                                <form onSubmit={handleAddressSubmit} className="space-y-6 ml-11">
                                    {!user && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-6">
                                            <div className="sm:col-span-2">
                                                <h3 className="text-sm font-semibold mb-3">Contact Information</h3>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Full Name</Label>
                                                <Input
                                                    required
                                                    value={guestInfo.name}
                                                    onChange={e => setGuestInfo({ ...guestInfo, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Email Address</Label>
                                                <Input
                                                    required
                                                    type="email"
                                                    value={guestInfo.email}
                                                    onChange={e => setGuestInfo({ ...guestInfo, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Phone Number</Label>
                                                <Input
                                                    required
                                                    value={guestInfo.phone}
                                                    onChange={e => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Address Line 1</Label>
                                            <Input
                                                required
                                                placeholder="Clinic Address / Flat No"
                                                value={address.line1}
                                                onChange={e => setAddress({ ...address, line1: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>City</Label>
                                                <Input
                                                    required
                                                    value={address.city}
                                                    onChange={e => setAddress({ ...address, city: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>State</Label>
                                                <Input
                                                    required
                                                    value={address.state}
                                                    onChange={e => setAddress({ ...address, state: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Pincode</Label>
                                                <Input
                                                    required
                                                    value={address.pincode}
                                                    onChange={e => setAddress({ ...address, pincode: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                                            {loading ? "Saving..." : "Continue to Payment"}
                                        </Button>
                                    </div>
                                </form>
                            )}
                            {step === 2 && (
                                <div className="ml-11 text-sm text-muted-foreground">
                                    <div className="font-medium text-foreground">{user?.full_name || guestInfo.name}</div>
                                    {address.line1}, {address.city} - {address.pincode}
                                    <Button variant="link" className="p-0 h-auto ml-2 text-primary" onClick={() => setStep(1)}>(Edit)</Button>
                                </div>
                            )}
                        </div>

                        {/* Step 2: Payment */}
                        <div className={`border rounded-xl p-6 bg-white ${step === 1 ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${step === 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                                    2
                                </div>
                                <h2 className="text-xl font-bold">Payment Method</h2>
                            </div>

                            {step === 2 && (
                                <div className="ml-11 space-y-4">
                                    <div className="border rounded-lg p-4 flex items-center gap-4 cursor-pointer ring-2 ring-primary bg-primary/5">
                                        <CreditCard className="h-6 w-6 text-primary" />
                                        <div className="flex-1">
                                            <div className="font-semibold">Razorpay Secure</div>
                                            <div className="text-xs text-muted-foreground">UPI, Cards, Netbanking</div>
                                        </div>
                                        <div className="h-4 w-4 rounded-full border-2 border-primary bg-primary" />
                                    </div>

                                    <div className="border rounded-lg p-4 flex items-center gap-4 opacity-75">
                                        <Truck className="h-6 w-6" />
                                        <div className="flex-1">
                                            <div className="font-semibold">Cash on Delivery</div>
                                            <div className="text-xs text-muted-foreground">Not available for guests</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white border rounded-xl p-6 shadow-sm sticky top-24 space-y-4">
                            <h2 className="text-lg font-bold">Order Summary</h2>
                            <div className="space-y-3">
                                {items.map((item, idx) => (
                                    <div key={item.id || idx} className="flex justify-between text-sm">
                                        <span className="truncate max-w-[150px]">{item.quantity}x {item.product?.name || 'Product'}</span>
                                        <span>₹{((item.price || 0) * (item.quantity || 0)).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <Separator />
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">GST (18%)</span>
                                    <span>₹{gst.toLocaleString()}</span>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">Total</span>
                                <span className="font-bold text-xl text-primary">₹{total.toLocaleString()}</span>
                            </div>
                            <Button
                                className="w-full h-12 text-lg rounded-xl shadow-lg shadow-primary/20"
                                disabled={step !== 2 || loading}
                                onClick={handlePlaceOrder}
                            >
                                {loading ? "Processing..." : `Pay ₹${total.toLocaleString()}`}
                            </Button>
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                                <Lock className="h-3 w-3" /> Secure SSL Connection
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
