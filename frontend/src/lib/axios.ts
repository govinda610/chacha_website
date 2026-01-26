import axios from "axios"

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
})

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token")
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login if 401 Unauthorized (optional: clear token)
            if (typeof window !== "undefined") {
                // Don't auto-redirect immediately as it might disrupt user flow (e.g. typing)
                // Just ensure the error propagates so components can handle it.
                // checking logic...
                const token = localStorage.getItem("token")
                if (token) {
                    // If we had a token and got 401, it's expired. Clear it.
                    localStorage.removeItem("token")
                    // window.location.href = "/auth/login" // Let the component handle redirect if needed
                }
            }
        }
        return Promise.reject(error)
    }
)
