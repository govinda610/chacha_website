export interface User {
    id: number
    email: string
    full_name?: string
    phone?: string
    role: "admin" | "customer"
    is_active: boolean
    gst_number?: string
    dental_license?: string
    tier?: string
    credit_limit?: number
    credit_used?: number
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    email: string
    password: string
    full_name: string
    phone: string
    dental_license?: string
    gst_number?: string
}

export interface AuthResponse {
    access_token: string
    refresh_token?: string
    token_type: string
}

export interface Address {
    id: number
    user_id: number
    label?: string
    full_address: string
    city: string
    state: string
    pincode: string
    is_default: boolean
}
