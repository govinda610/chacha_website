import { api } from "@/lib/axios"
import type { Order } from "@/types/order"

export const ordersService = {
    async getMyOrders(): Promise<Order[]> {
        const { data } = await api.get<Order[]>("/orders/")
        return data
    },

    async getOrderById(id: number): Promise<Order> {
        const { data } = await api.get<Order>(`/orders/${id}`)
        return data
    },

    async createOrder(payload: any): Promise<Order> {
        // If payload is already an object with the right structure, use it
        // Otherwise wrap it (for backward compatibility if needed)
        const body = (payload && typeof payload === 'object' && payload.address_id)
            ? payload
            : {
                address_id: payload, // assume first arg was addressId
                payment_method: "cod"
            }
        const { data } = await api.post<Order>("/orders/", body)
        return data
    },

    async cancelOrder(id: number): Promise<void> {
        await api.post(`/orders/${id}/cancel`)
    }
}
