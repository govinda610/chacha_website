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

    async createOrder(addressId: number, paymentMethod: string = "cod"): Promise<Order> {
        const { data } = await api.post<Order>("/orders/", {
            address_id: addressId,
            payment_method: paymentMethod
        })
        return data
    },

    async cancelOrder(id: number): Promise<void> {
        await api.post(`/orders/${id}/cancel`)
    }
}
