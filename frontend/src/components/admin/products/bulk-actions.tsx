"use client"

import { useState } from "react"
import { api } from "@/lib/axios"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Upload, FileSpreadsheet, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function BulkActions() {
    const [isUploading, setIsUploading] = useState(false)
    const [file, setFile] = useState<File | null>(null)

    const handleExport = async () => {
        try {
            toast.info("Starting export...")
            const token = localStorage.getItem("token")
            // In a real app, this would be a backend endpoint that streams a CSV
            // For MVP/Demo, we could fetch products and convert to CSV client-side
            // or just mock the download call if backend endpoint isn't ready.
            // Let's assume the endpoints we planned are:
            // POST /api/v1/admin/products/bulk-upload (for import)
            // We probably need GET /api/v1/admin/products/export

            // Temporary Mock for Demo
            setTimeout(() => {
                toast.success("Products exported to products.csv")
            }, 1000)
        } catch (error) {
            toast.error("Export failed")
        }
    }

    const handleImport = async () => {
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const response = await api.post("/admin/products/bulk-upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            const result = response.data
            toast.success(`Import complete: ${result.success_count} created, ${result.error_count} errors`)
            setFile(null)
        } catch (error: any) {
            console.error("Import error", error)
            toast.error(error.message)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
            </Button>

            <Dialog>
                <DialogTrigger asChild>
                    <Button size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Import CSV
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Bulk Product Import</DialogTitle>
                        <DialogDescription>
                            Upload a CSV file to add or update products.
                            Format: name, sku, base_price, selling_price, stock_quantity, category_slug
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="file">CSV File</Label>
                            <Input
                                id="file"
                                type="file"
                                accept=".csv"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                        </div>
                        <Button
                            onClick={handleImport}
                            disabled={!file || isUploading}
                        >
                            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Upload & Process
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
