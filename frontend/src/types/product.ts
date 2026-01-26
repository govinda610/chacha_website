export interface ProductImage {
    id: number
    product_id: number
    image_url: string
    image_type: "main" | "thumbnail" | "gallery"
    display_order: number
}

export interface ProductVariant {
    id: number
    product_id: number
    name: string
    sku: string
    price_adjustment: number
    stock_quantity: number
}

export interface Category {
    id: number
    name: string
    slug: string
    parent_id?: number
    image_url?: string
    children?: Category[]
}

export interface Brand {
    id: number
    name: string
    slug: string
    logo_url?: string
}

export interface Product {
    id: number
    name: string
    slug: string
    sku: string
    description: string
    specifications: Record<string, any>
    base_price: number
    selling_price: number
    stock_quantity: number
    is_active: boolean
    brand_id: number
    category_id: number

    // Relations
    brand?: Brand
    category?: Category
    images?: ProductImage[]
    variants?: ProductVariant[]
}

export interface ProductListResponse {
    items: Product[]
    total: number
    page: number
    size: number
    pages: number
}
