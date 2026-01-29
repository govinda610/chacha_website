"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

interface SiteSettings {
    tax_rate: string
    shipping_fee: string
    free_shipping_threshold: string
    support_email: string
    support_phone: string
    [key: string]: string
}

const DEFAULT_SETTINGS: SiteSettings = {
    tax_rate: "18",
    shipping_fee: "100",
    free_shipping_threshold: "5000",
    support_email: "support@dentsupply.com",
    support_phone: "+91 98765 43210"
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem("token")
                const response = await fetch("http://localhost:8000/api/v1/admin/settings", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (response.ok) {
                    const data = await response.json()
                    // Merge with defaults to ensure all fields exist
                    setSettings(prev => ({ ...prev, ...data }))
                }
            } catch (error) {
                console.error("Failed to fetch settings", error)
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:8000/api/v1/admin/settings", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ settings })
            })

            if (!response.ok) {
                throw new Error("Failed to save settings")
            }

            toast.success("Settings saved successfully")
        } catch (error) {
            toast.error("Failed to save settings")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage global site configuration
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Financial Settings</CardTitle>
                    <CardDescription>Configure taxes and shipping costs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                        <Input
                            id="tax_rate"
                            value={settings.tax_rate}
                            onChange={(e) => handleChange("tax_rate", e.target.value)}
                            type="number"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="shipping_fee">Standard Shipping Fee (₹)</Label>
                        <Input
                            id="shipping_fee"
                            value={settings.shipping_fee}
                            onChange={(e) => handleChange("shipping_fee", e.target.value)}
                            type="number"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="free_shipping_threshold">Free Shipping Threshold (₹)</Label>
                        <Input
                            id="free_shipping_threshold"
                            value={settings.free_shipping_threshold}
                            onChange={(e) => handleChange("free_shipping_threshold", e.target.value)}
                            type="number"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Displayed in invoices and footer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="support_email">Support Email</Label>
                        <Input
                            id="support_email"
                            value={settings.support_email}
                            onChange={(e) => handleChange("support_email", e.target.value)}
                            type="email"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="support_phone">Support Phone</Label>
                        <Input
                            id="support_phone"
                            value={settings.support_phone}
                            onChange={(e) => handleChange("support_phone", e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
