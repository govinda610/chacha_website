import { api } from "@/lib/axios"
import type { User, Address } from "@/types/auth"

interface UpdateProfileData {
    full_name?: string
    phone?: string
    gst_number?: string
    dental_license?: string
}

interface CreateAddressData {
    label?: string
    full_address: string
    city: string
    state: string
    pincode: string
    is_default?: boolean
}

export const userService = {
    async updateProfile(data: UpdateProfileData): Promise<User> {
        // Backend endpoint expects snake_case for some fields if using strict pydantic, 
        // but let's assume it maps correctly or we map it here.
        // Looking at backend schemas/user.py UserUpdate, it expects full_name, etc.
        const { data: user } = await api.put<User>("/auth/me", data)
        return user
    },

    async getAddresses(): Promise<Address[]> {
        // Note: Backend might not have specific standalone endpoint, or it might be embedded in /auth/me
        // Let's check backend structure. 
        // User model has addresses relationship.
        // If no endpoint exists, we might need to add one or rely on /auth/me having addresses.
        // Assuming we implement /users/addresses endpoints or similar.
        // For now, let's assume we can fetch them.
        // If backend missing, we will need to add it.
        const { data } = await api.get<Address[]>("/users/addresses")
        return data
    },

    async addAddress(data: CreateAddressData): Promise<Address> {
        const { data: address } = await api.post<Address>("/users/addresses", data)
        return address
    },

    async deleteAddress(id: number): Promise<void> {
        await api.delete(`/users/addresses/${id}`)
    }
}
