import { api } from '@/lib/axios';

export const adminService = {
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard');
        return response.data;
    },

    getProducts: async (params: any) => {
        const response = await api.get('/admin/products', { params });
        return response.data;
    },

    getProduct: async (id: number) => {
        const response = await api.get(`/admin/products/${id}`);
        return response.data;
    },

    createProduct: async (data: any) => {
        const response = await api.post('/admin/products', data);
        return response.data;
    },

    updateProduct: async (id: number, data: any) => {
        const response = await api.put(`/admin/products/${id}`, data);
        return response.data;
    },

    deleteProduct: async (id: number) => {
        const response = await api.delete(`/admin/products/${id}`);
        return response.data;
    },

    getOrders: async (params: any) => {
        const response = await api.get('/admin/orders', { params });
        return response.data;
    },

    updateOrderStatus: async (id: number, status: string) => {
        const response = await api.put(`/admin/orders/${id}/status`, { status });
        return response.data;
    },

    getUsers: async (params: any) => {
        const response = await api.get('/admin/users', { params });
        return response.data;
    },

    updateUser: async (id: number, data: any) => {
        const response = await api.put(`/admin/users/${id}`, data);
        return response.data;
    }
};
