"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, User as UserIcon, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import { authService } from "@/services/auth"
import { toast } from "sonner"

const profileSchema = z.object({
    full_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
    gst_number: z.string().optional(),
    dental_license: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfilePage() {
    const { user, logout, isLoading: isAuthLoading } = useAuth()
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: "",
            phone: "",
            gst_number: "",
            dental_license: "",
        },
    })

    // Update form values when user data is loaded
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

    // Redirect if not logged in
    useEffect(() => {
        if (!isAuthLoading && !user) {
            router.push("/login?returnUrl=/profile")
        }
    }, [user, isAuthLoading, router])

    async function onSubmit(data: ProfileFormValues) {
        setIsSaving(true)
        try {
            await authService.updateProfile(data)
            toast.success("Profile updated successfully")
            // Ideally refresh user in context, but for now relies on page reload or re-fetch if implemented
            // A full refresh of the page ensures context gets latest data on mount
            window.location.reload()
        } catch (error) {
            console.error(error)
            toast.error("Failed to update profile")
        } finally {
            setIsSaving(false)
        }
    }

    if (isAuthLoading || !user) {
        return (
            <div className="container flex h-screen w-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="container flex flex-col items-center py-10 space-y-8">
            <div className="flex w-full max-w-2xl flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                    <AvatarImage src="" />
                    <AvatarFallback>
                        <UserIcon className="h-12 w-12" />
                    </AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <h1 className="text-2xl font-bold">{user.full_name}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
            </div>

            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>
                        Manage your personal information and business details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="full_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Dr. John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-2">
                                    <FormLabel>Email</FormLabel>
                                    <Input value={user.email} disabled />
                                    <FormDescription>Email cannot be changed</FormDescription>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="9876543210" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="dental_license"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dental License</FormLabel>
                                            <FormControl>
                                                <Input placeholder="License #" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="gst_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>GST Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="GSTIN" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button type="button" variant="destructive" onClick={logout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </Button>
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Save Changes
                                </Button>
                            </div>

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
