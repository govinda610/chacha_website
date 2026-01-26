"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth"
import type { User, LoginCredentials, RegisterData } from "@/types/auth"
import { toast } from "sonner"

interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (credentials: LoginCredentials) => Promise<void>
    register: (data: RegisterData) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // Initialize auth state
    useEffect(() => {
        async function initAuth() {
            const token = localStorage.getItem("token")
            if (token) {
                try {
                    const userData = await authService.getMe()
                    setUser(userData)
                } catch (error) {
                    console.error("Failed to fetch user", error)
                    localStorage.removeItem("token")
                }
            }
            setIsLoading(false)
        }
        initAuth()
    }, [])

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true)
        try {
            const response = await authService.login(credentials)
            localStorage.setItem("token", response.access_token)

            // Fetch user details immediately after login
            const userData = await authService.getMe()
            setUser(userData)

            toast.success("Welcome back!")
            router.push("/")
        } catch (error: any) {
            console.error("Login error", error)
            const message = error.response?.data?.detail || "Invalid credentials"
            toast.error(message)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (data: RegisterData) => {
        setIsLoading(true)
        try {
            await authService.register(data)
            toast.success("Account created! Please login.")
            router.push("/auth/login")
        } catch (error: any) {
            console.error("Registration error", error)
            // Handle Pydantic validation errors (422) which return array of error objects
            const detail = error.response?.data?.detail
            let message = "Registration failed"
            if (typeof detail === "string") {
                message = detail
            } else if (Array.isArray(detail)) {
                // Pydantic returns [{loc, msg, type}, ...]
                message = detail.map((e: any) => e.msg).join(", ")
            }
            toast.error(message)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
        router.push("/auth/login")
        toast.info("Logged out successfully")
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
