export interface ProductImage {
    id?: number
    image_url?: string
    image_type?: string
    display_order?: number
    main?: string // Add this to match usage, or fix usage
}

// Better approach: Define the images object structure if it's not an array of ProductImage
export interface ProductImages {
    main?: string
    gallery?: string[]
}

export interface ProductVariant {
    id: number
    name: string
    sku: string
    price_adjustment: number // Added
    stock_quantity: number
    specifications?: Record<string, string | number | boolean>
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
    sku?: string
    description?: string
    clinical_benefits?: string
    specifications?: Record<string, string | number | boolean>
    base_price: number
    selling_price: number
    stock_quantity: number // Added
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
