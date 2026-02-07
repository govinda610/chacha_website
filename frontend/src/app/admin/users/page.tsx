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
import {
    Loader2,
    Search,
    ShieldAlert,
    Edit,
    CheckCircle2,
    XCircle
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { adminService } from "@/services/admin"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

interface AdminUser {
    id: number
    email: string
    full_name: string
    phone: string
    role: string
    is_active: boolean
    tier?: string
    credit_limit?: number
    credit_used?: number
    is_verified?: boolean
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
            const params = {
                skip: (page - 1) * limit,
                limit: limit,
                search: search || undefined
            }

            const data = await adminService.getUsers(params)
            setUsers(data.users)
            setTotal(data.total)
        } catch (error) {
            console.error("Error fetching users:", error)
            toast.error("Failed to fetch users")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search])

    const handleUpdate = async (userId: number, data: Partial<AdminUser>) => {
        try {
            await adminService.updateUser(userId, data)
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u))
            toast.success("User updated")
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Update failed")
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
                            <TableHead className="text-right">Tier & Credit</TableHead>
                            <TableHead className="text-right">Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
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
                                                onValueChange={(val) => handleUpdate(user.id, { role: val })}
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
                                        <div className="flex flex-col gap-1">
                                            <Badge variant={user.is_active ? "default" : "secondary"}>
                                                {user.is_active ? "Active" : "Inactive"}
                                            </Badge>
                                            {user.is_verified ? (
                                                <Badge variant="outline" className="text-primary border-primary">
                                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                                    Verified
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-muted-foreground">
                                                    <XCircle className="mr-1 h-3 w-3" />
                                                    Unverified
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex flex-col items-end">
                                            <Badge variant="outline" className="mb-1">{user.tier || "Standard"}</Badge>
                                            <span className="text-xs text-muted-foreground">Limit: ₹{user.credit_limit || 0}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit User: {user.full_name}</DialogTitle>
                                                    <DialogDescription>Update user tier, credit, and verification status.</DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="tier" className="text-right">Tier</Label>
                                                        <Select
                                                            defaultValue={user.tier || "Standard"}
                                                            onValueChange={(val) => handleUpdate(user.id, { tier: val })}
                                                        >
                                                            <SelectTrigger className="col-span-3">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Standard">Standard</SelectItem>
                                                                <SelectItem value="Silver">Silver</SelectItem>
                                                                <SelectItem value="Gold">Gold</SelectItem>
                                                                <SelectItem value="Platinum">Platinum</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="limit" className="text-right">Credit Limit</Label>
                                                        <Input
                                                            id="limit"
                                                            type="number"
                                                            defaultValue={user.credit_limit || 0}
                                                            className="col-span-3"
                                                            onBlur={(e) => handleUpdate(user.id, { credit_limit: parseFloat(e.target.value) })}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">Verification</Label>
                                                        <div className="col-span-3 flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant={user.is_verified ? "default" : "outline"}
                                                                onClick={() => handleUpdate(user.id, { is_verified: true })}
                                                            >
                                                                Verify
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant={!user.is_verified ? "destructive" : "outline"}
                                                                onClick={() => handleUpdate(user.id, { is_verified: false })}
                                                            >
                                                                Unverify
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

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
