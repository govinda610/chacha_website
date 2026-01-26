export interface User {
    id: number
    email: string
    full_name: string
    phone_number?: string
    role: "admin" | "customer"
    is_active: boolean
    is_verified: boolean
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    email: string
    password: string
    full_name: string
    phone_number?: string
    dental_license?: string
    gst_number?: string
}

export interface AuthResponse {
    access_token: string
    token_type: string
    user?: User // Optional if backend returns user on login, otherwise fetch separately
}
export interface Address {
    id: number
    label?: string
    full_address: string
    city: string
    state: string
    pincode: string
    is_default: boolean
}
