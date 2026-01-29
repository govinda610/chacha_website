"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, ShieldAlert } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"

interface AdminUser {
    id: number
    email: string
    full_name: string
    phone: string
    role: string
    is_active: boolean
    tier?: string
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const { user: currentUser } = useAuth()
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Pagination & Search
    const page = Number(searchParams.get("page")) || 1
    const limit = 20
    const search = searchParams.get("search") || ""

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            const params = new URLSearchParams({
                skip: ((page - 1) * limit).toString(),
                limit: limit.toString(),
            })
            // Note: Backend list_users doesn't support search yet in admin.py, 
            // but we'll send it anyway for future proofing or client-side filtering if small.
            // Actually, querying all users might be heavy, but let's stick to pagination.

            const response = await fetch(`http://localhost:8000/api/v1/admin/users?${params}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                setUsers(data.users)
                setTotal(data.total)
            } else {
                toast.error("Failed to fetch users")
            }
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    const handleRoleUpdate = async (userId: number, newRole: string) => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:8000/api/v1/admin/users/${userId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ role: newRole })
            })

            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.detail || "Update failed")
            }

            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
            toast.success("User role updated")
        } catch (error: any) {
            toast.error(error.message || "Update failed")
        }
    }

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set("search", term)
        } else {
            params.delete("search")
        }
        params.set("page", "1")
        router.replace(`${pathname}?${params.toString()}`)
    }

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", newPage.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">
                        Manage users and permissions
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        className="pl-8"
                        defaultValue={search}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch(e.currentTarget.value)
                            }
                        }}
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Tier</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="font-medium">{user.full_name || "N/A"}</div>
                                        <div className="text-xs text-muted-foreground">ID: #{user.id}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">{user.email}</div>
                                        <div className="text-xs text-muted-foreground">{user.phone}</div>
                                    </TableCell>
                                    <TableCell>
                                        {currentUser?.role === "admin" && user.id !== currentUser.id ? (
                                            <Select
                                                defaultValue={user.role}
                                                onValueChange={(val) => handleRoleUpdate(user.id, val)}
                                            >
                                                <SelectTrigger className="w-[140px] h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="customer">Customer</SelectItem>
                                                    <SelectItem value="warehouse_manager">Warehouse</SelectItem>
                                                    <SelectItem value="sales_manager">Sales</SelectItem>
                                                    <SelectItem value="support_executive">Support</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Badge variant="outline" className="capitalize">
                                                {user.role === "admin" && <ShieldAlert className="mr-1 h-3 w-3 text-destructive" />}
                                                {user.role}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.is_active ? "success" : "secondary"}>
                                            {user.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline">{user.tier || "Standard"}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1 || loading}
                >
                    Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                    Page {page} of {Math.ceil(total / limit) || 1}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= Math.ceil(total / limit) || loading}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
