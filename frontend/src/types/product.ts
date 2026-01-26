export interface ProductImage {
    image_url: string
    image_type: string
    display_order: number
}

export interface ProductVariant {
    id: number
    name: string
    sku: string
    price: number
    stock_quantity: number
    specifications?: Record<string, any>
}

export interface Category {
    id: number
    name: string
    slug: string
    parent_id?: number | null
    display_order?: number
    children?: Category[]
}

export interface Brand {
    id: number
    name: string
    slug: string
    logo_url?: string
    is_active?: boolean
}

export interface Product {
    id: number
    name: string
    slug: string
    description?: string
    specifications?: Record<string, any>
    base_price: number
    selling_price: number
    has_variants?: boolean
    is_active: boolean
    brand_id?: number
    category_id?: number

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
