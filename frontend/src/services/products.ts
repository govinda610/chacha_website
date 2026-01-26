import { api } from "@/lib/axios"
import type { Product, ProductListResponse, Category } from "@/types/product"

export interface ProductParams {
    page?: number
    limit?: number
    category_id?: number
    brand_id?: number
    min_price?: number
    max_price?: number
    search?: string
    sort?: string
}

export const productService = {
    async getProducts(params: ProductParams = {}): Promise<ProductListResponse> {
        const query = new URLSearchParams()
        if (params.page) query.append("skip", ((params.page - 1) * (params.limit || 12)).toString())
        if (params.limit) query.append("limit", params.limit.toString())
        if (params.category_id) query.append("category_id", params.category_id.toString())
        if (params.search) query.append("q", params.search)

        // Backend returns List[Product], so we map it to our interface
        // Note: Backend currently doesn't return total count, so pagination will be limited
        const { data } = await api.get<Product[]>(`/products/?${query.toString()}`)

        return {
            items: data,
            total: data.length, // Placeholder until backend supports total count
            page: params.page || 1,
            size: params.limit || 12,
            pages: 1
        }
    },

    async getProduct(slug: string): Promise<Product> {
        const { data } = await api.get<Product>(`/products/${slug}`)
        return data
    },

    async getCategories(): Promise<Category[]> {
        const { data } = await api.get<Category[]>("/categories/")
        return data
    },

    async getFeaturedProducts(): Promise<Product[]> {
        const { data } = await api.get<Product[]>("/products/?limit=8")
        return data
    }
}
