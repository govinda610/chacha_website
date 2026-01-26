"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { userService } from "@/services/user"
import type { Address } from "@/types/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { MapPin, Plus, Trash2 } from "lucide-react"

const addressSchema = z.object({
    label: z.string().optional(),
    full_address: z.string().min(5, "Address required"),
    city: z.string().min(2, "City required"),
    state: z.string().min(2, "State required"),
    pincode: z.string().min(6, "Valid pincode required"),
    is_default: z.boolean().default(false),
})

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema) as any,
        defaultValues: {
            label: "Clinic",
            full_address: "",
            city: "",
            state: "",
            pincode: "",
            is_default: false,
        },
    })

    const fetchAddresses = async () => {
        try {
            const data = await userService.getAddresses()
            setAddresses(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAddresses()
    }, [])

    async function onSubmit(values: z.infer<typeof addressSchema>) {
        try {
            await userService.addAddress(values)
            toast.success("Address added")
            setOpen(false)
            form.reset()
            fetchAddresses()
        } catch (error) {
            toast.error("Failed to add address")
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Are you sure?")) return
        try {
            await userService.deleteAddress(id)
            toast.success("Address deleted")
            setAddresses(prev => prev.filter(a => a.id !== id))
        } catch (error) {
            toast.error("Failed to delete address")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Saved Addresses</h2>
                    <p className="text-muted-foreground">Manage your shipping addresses.</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus className="h-4 w-4" /> Add New</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Address</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                                <FormField
                                    control={form.control}
                                    name="label"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Label (e.g., Clinic, Home)</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="full_address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Address</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pincode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Pincode</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="is_default"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Set as default address</FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">Save Address</Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                    <Card key={addr.id} className="relative">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    {addr.label}
                                    {addr.is_default && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>}
                                </CardTitle>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(addr.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-1">
                            <p>{addr.full_address}</p>
                            <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                        </CardContent>
                    </Card>
                ))}
                {addresses.length === 0 && !loading && (
                    <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                        No addresses saved. Add one to checkout faster.
                    </div>
                )}
            </div>
        </div>
    )
}
