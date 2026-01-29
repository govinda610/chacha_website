"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

enum UserRole {
    ADMIN = "admin",
    CUSTOMER = "customer",
    WAREHOUSE_MANAGER = "warehouse_manager",
    SALES_MANAGER = "sales_manager",
    SUPPORT_EXECUTIVE = "support_executive"
}

interface RoleGuardProps {
    children: React.ReactNode
    allowedRoles?: UserRole[]
}

export function RoleGuard({ children, allowedRoles = [UserRole.ADMIN] }: RoleGuardProps) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/login")
            } else if (allowedRoles && !allowedRoles.includes(user.role as UserRole)) {
                router.push("/") // Or unauthorized page
            }
        }
    }, [user, isLoading, router, allowedRoles])

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!user || (allowedRoles && !allowedRoles.includes(user.role as UserRole))) {
        return null
    }

    return <>{children}</>
}
