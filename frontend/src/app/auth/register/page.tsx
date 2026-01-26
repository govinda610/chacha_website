"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { toast } from "sonner"

import { useAuth } from "@/context/auth-context"

const registerSchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    gstNumber: z.string().optional(),
    dentalLicense: z.string().optional(),
    terms: z.boolean().refine(val => val === true, "You must accept the terms"),
})

export default function RegisterPage() {
    const { register, isLoading } = useAuth()

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            password: "",
            gstNumber: "",
            dentalLicense: "",
            terms: false,
        },
    })

    async function onSubmit(values: z.infer<typeof registerSchema>) {
        // Map form values to backend API expectation (snake_case)
        try {
            await register({
                email: values.email,
                password: values.password,
                full_name: values.fullName,
                phone: values.phone,
                gst_number: values.gstNumber || undefined,
                dental_license: values.dentalLicense || undefined
            })
        } catch (err) {
            // Handled in context
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <Card className="w-full max-w-xl shadow-lg border-primary/10 my-8">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold text-primary">Create an account</CardTitle>
                    <CardDescription>
                        Join DentSupply to access exclusive B2B pricing
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="fullName"
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
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="9876543210" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="doctor@clinic.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Create a password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Professional Details (Optional)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="gstNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">GST Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="GSTIN..." {...field} className="h-9" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="dentalLicense"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Dental License</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Reg. No..." {...field} className="h-9" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="terms"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Accept terms and conditions
                                            </FormLabel>
                                            <FormDescription>
                                                You agree to our Terms of Service and Privacy Policy.
                                            </FormDescription>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                                {isLoading ? "Creating..." : "Create Account"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm">
                    <div className="text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
