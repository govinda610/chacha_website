import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const adminApi = axios.create({
    baseURL: API_URL,
});

adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const adminService = {
    getDashboardStats: async () => {
        const response = await adminApi.get('/admin/dashboard');
        return response.data;
    },

    getProducts: async (params: any) => {
        const response = await adminApi.get('/admin/products', { params });
        return response.data;
    },

    getProduct: async (id: number) => {
        const response = await adminApi.get(`/admin/products/${id}`);
        return response.data;
    },

    createProduct: async (data: any) => {
        const response = await adminApi.post('/admin/products', data);
        return response.data;
    },

    updateProduct: async (id: number, data: any) => {
        const response = await adminApi.put(`/admin/products/${id}`, data);
        return response.data;
    },

    deleteProduct: async (id: number) => {
        const response = await adminApi.delete(`/admin/products/${id}`);
        return response.data;
    },

    getOrders: async (params: any) => {
        const response = await adminApi.get('/admin/orders', { params });
        return response.data;
    },

    updateOrderStatus: async (id: number, status: string) => {
        const response = await adminApi.put(`/admin/orders/${id}/status`, { status });
        return response.data;
    },

    getUsers: async (params: any) => {
        const response = await adminApi.get('/admin/users', { params });
        return response.data;
    },

    updateUser: async (id: number, data: any) => {
        const response = await adminApi.put(`/admin/users/${id}`, data);
        return response.data;
    }
};
