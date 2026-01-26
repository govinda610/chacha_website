"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/context/auth-context"
import { userService } from "@/services/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"

const profileSchema = z.object({
    full_name: z.string().min(2, "Name is required"),
    phone: z.string().min(10, "Phone number is required"),
    gst_number: z.string().optional(),
    dental_license: z.string().optional(),
})

export default function ProfilePage() {
    const { user, login } = useAuth() // login function is not needed here actually, need a refreshUser function ideally

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: "",
            phone: "",
            gst_number: "",
            dental_license: "",
        },
    })

    useEffect(() => {
        if (user) {
            form.reset({
                full_name: user.full_name || "",
                phone: user.phone || "",
                gst_number: user.gst_number || "",
                dental_license: user.dental_license || "",
            })
        }
    }, [user, form])

    async function onSubmit(values: z.infer<typeof profileSchema>) {
        try {
            await userService.updateProfile(values)
            toast.success("Profile updated successfully")
            // Ideally should refresh auth context user
        } catch (error) {
            console.error(error)
            toast.error("Failed to update profile")
        }
    }

    return (
        <Card className="max-w-xl">
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your contact and professional details.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <FormLabel>Email Address</FormLabel>
                            <Input value={user?.email} disabled className="bg-muted" />
                            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                        </div>

                        <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="gst_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>GST Number</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dental_license"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dental License</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="mt-4">Save Changes</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
