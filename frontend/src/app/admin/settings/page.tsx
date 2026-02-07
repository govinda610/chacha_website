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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import {
    Loader2,
    Save,
    MapPin,
    CreditCard,
    Settings2,
    Plus,
    Trash2
} from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/axios"

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

    // Mock state for Delivery Zones
    const [zones, setZones] = useState([
        { id: 1, state: "Rajasthan", cost: 0, minOrder: 0 },
        { id: 2, state: "Maharashtra", cost: 150, minOrder: 5000 },
        { id: 3, state: "Delhi", cost: 100, minOrder: 3000 },
    ])

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get("/admin/settings")
                setSettings(prev => ({ ...prev, ...response.data }))
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
            await api.put("/admin/settings", { settings })
            toast.success("Settings saved successfully")
        } catch (error) {
            toast.error("Failed to save settings")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage global site configuration and regional rules
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="general" className="flex items-center gap-2">
                        <Settings2 className="h-4 w-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="delivery" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Delivery Zones
                    </TabsTrigger>
                    <TabsTrigger value="credit" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Credit Management
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="max-w-2xl space-y-6">
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
                </TabsContent>

                <TabsContent value="delivery" className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>State-wise Delivery Charges</CardTitle>
                                <CardDescription>Override global shipping fees based on delivery state</CardDescription>
                            </div>
                            <Button size="sm" variant="outline" className="gap-2">
                                <Plus className="h-4 w-4" /> Add Zone
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted border-b">
                                        <tr>
                                            <th className="p-3 text-left">State</th>
                                            <th className="p-3 text-left">Shipping Fee</th>
                                            <th className="p-3 text-left">Min Order for Free</th>
                                            <th className="p-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {zones.map(zone => (
                                            <tr key={zone.id}>
                                                <td className="p-3 font-medium">{zone.state}</td>
                                                <td className="p-3">₹{zone.cost}</td>
                                                <td className="p-3">₹{zone.minOrder}</td>
                                                <td className="p-3 text-right">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="credit" className="space-y-6">
                    <Card className="max-w-2xl">
                        <CardHeader>
                            <CardTitle>Credit & Billing Rules</CardTitle>
                            <CardDescription>Global limits and credit tier defaults</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm border-b pb-2">Default Tier Limits</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Standard Limit (₹)</Label>
                                        <Input defaultValue="0" type="number" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Silver Limit (₹)</Label>
                                        <Input defaultValue="25000" type="number" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Gold Limit (₹)</Label>
                                        <Input defaultValue="100000" type="number" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Platinum Limit (₹)</Label>
                                        <Input defaultValue="500000" type="number" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm border-b pb-2">Approval Settings</h3>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-medium">Automatic Credit Approval</div>
                                        <div className="text-xs text-muted-foreground">Approve credit for verified clinics automatically</div>
                                    </div>
                                    <div className="h-6 w-10 bg-primary rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => toast.success("Credit settings saved")}>
                                <Save className="mr-2 h-4 w-4" />
                                Update Rules
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
