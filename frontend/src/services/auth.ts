import { api } from "@/lib/axios"
import type { LoginCredentials, RegisterData, AuthResponse, User } from "@/types/auth"

export const authService = {
    async register(data: RegisterData): Promise<AuthResponse> {
        // Map frontend field names to backend schema
        const payload = {
            email: data.email,
            password: data.password,
            full_name: data.full_name,
            phone: data.phone,
            gst_number: data.gst_number,
            dental_license: data.dental_license
        }
        const { data: response } = await api.post<AuthResponse>("/auth/register", payload)
        return response
    },

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        // OAuth2PasswordRequestForm expects application/x-www-form-urlencoded
        const params = new URLSearchParams()
        params.append("username", credentials.email)
        params.append("password", credentials.password)

        const { data: response } = await api.post<AuthResponse>("/auth/login", params, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })
        return response
    },

    async getMe(): Promise<User> {
        const { data } = await api.get<User>("/auth/me")
        return data
    },

    async updateProfile(data: Partial<User>): Promise<User> {
        const { data: response } = await api.put<User>("/auth/me", data)
        return response
    },
}
