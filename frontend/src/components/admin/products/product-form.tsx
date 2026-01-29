"use client"

import { useState, useMemo } from "react"
import { useForm, useFieldArray, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

const variantSchema = z.object({
    sku: z.string().min(1, "SKU is required"),
    name: z.string().min(1, "Name is required"),
    price: z.coerce.number().min(0),
    stock_quantity: z.coerce.number().int().min(0),
    lot_number: z.string(),
    expiry_date: z.string(),
})

const imageSchema = z.object({
    image_url: z.string().url("Invalid URL"),
    display_order: z.coerce.number()
})

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string(),
    base_price: z.coerce.number().min(0),
    selling_price: z.coerce.number().min(0),
    is_active: z.boolean(),
    category_id: z.string(),
    brand_id: z.string(),
    variants: z.array(variantSchema),
    images: z.array(imageSchema),
})

type ProductFormValues = {
    name: string
    slug: string
    description: string
    base_price: number
    selling_price: number
    is_active: boolean
    category_id: string
    brand_id: string
    variants: {
        sku: string
        name: string
        price: number
        stock_quantity: number
        lot_number: string
        expiry_date: string
    }[]
    images: {
        image_url: string
        display_order: number
    }[]
}

interface ProductFormProps {
    initialData?: any
    onSubmit: (data: ProductFormValues) => Promise<void>
}

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
    const [loading, setLoading] = useState(false)

    const defaultValues: ProductFormValues = useMemo(() => {
        return {
            name: initialData?.name || "",
            slug: initialData?.slug || "",
            description: initialData?.description || "",
            base_price: Number(initialData?.base_price) || 0,
            selling_price: Number(initialData?.selling_price) || 0,
            is_active: initialData?.is_active ?? true,
            category_id: initialData?.category_id ? String(initialData?.category_id) : "",
            brand_id: initialData?.brand_id ? String(initialData?.brand_id) : "",
            variants: initialData?.variants?.map((v: any) => ({
                sku: v.sku || "",
                name: v.name || "",
                price: Number(v.price) || 0,
                stock_quantity: Number(v.stock_quantity) || 0,
                lot_number: v.lot_number || "",
                expiry_date: v.expiry_date || ""
            })) || [],
            images: initialData?.images?.map((img: any) => ({
                image_url: img.image_url || "",
                display_order: img.display_order || 0
            })) || []
        }
    }, [initialData])

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
        defaultValues
    })

    const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
        control: form.control,
        name: "variants"
    })

    const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
        control: form.control,
        name: "images"
    })

    const onFormSubmit = async (data: ProductFormValues) => {
        setLoading(true)
        try {
            await onSubmit(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }


    const handleNameChange = (name: string) => {
        if (!initialData) {
            const slug = name.toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
            form.setValue("slug", slug, { shouldValidate: true })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                    <Input {...field} onChange={(e) => {
                                        field.onChange(e)
                                        handleNameChange(e.target.value)
                                    }} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="category_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category ID</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="brand_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brand ID</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                        control={form.control}
                        name="base_price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Base Price (₹)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="selling_price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Selling Price (₹)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="is_active"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-xs">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Active</FormLabel>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Variants</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendVariant({ sku: "", name: "", price: 0, stock_quantity: 0, lot_number: "", expiry_date: "" })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Variant
                        </Button>
                    </div>
                    {variantFields.map((field, index) => (
                        <Card key={field.id}>
                            <CardContent className="p-4 grid gap-4 md:grid-cols-6 items-end">
                                <FormField
                                    control={form.control}
                                    name={`variants.${index}.sku`}
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-1">
                                            <FormLabel>SKU</FormLabel>
                                            <Input {...field} placeholder="SKU-123" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`variants.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Variant Name</FormLabel>
                                            <Input {...field} placeholder="Size / Color" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`variants.${index}.price`}
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-1">
                                            <FormLabel>Price</FormLabel>
                                            <Input type="number" {...field} />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`variants.${index}.stock_quantity`}
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-1">
                                            <FormLabel>Stock</FormLabel>
                                            <Input type="number" {...field} />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`variants.${index}.lot_number`}
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-1">
                                            <FormLabel>Lot #</FormLabel>
                                            <Input {...field} value={field.value || ""} />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`variants.${index}.expiry_date`}
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-1">
                                            <FormLabel>Expiry</FormLabel>
                                            <Input type="date" {...field} value={field.value || ""} />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive"
                                    onClick={() => removeVariant(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Images</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendImage({ image_url: "", display_order: imageFields.length })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Link
                        </Button>
                    </div>
                    {imageFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-end">
                            <FormField
                                control={form.control}
                                name={`images.${index}.image_url`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input {...field} placeholder="https://..." />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => removeImage(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Product
                </Button>
            </form>
        </Form>
    )
}
