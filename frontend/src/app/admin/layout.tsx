"use client"

import { RoleGuard } from "@/components/admin/role-guard"
import { AdminSidebar } from "@/components/admin/sidebar" // Plan calls this 'sidebar', confirming path
// Sidebar handles navigation. 
// Plan mentions specific header but Sidebar has basic header or we can add one.

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <RoleGuard>
            <div className="flex h-screen w-full bg-muted/40">
                <AdminSidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                    <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </RoleGuard>
    )
}
