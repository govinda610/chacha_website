import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { HeaderClassic } from "@/components/showcase/header-classic"
import { HeaderModern } from "@/components/showcase/header-modern"
import { ProductCard } from "@/components/showcase/product-card"

export default function ShowcasePage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="container mx-auto py-10 px-4 space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                        DentSupply UI Design System
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        A comprehensive showcase of our dental-themed component library, color choices, and layout options using Shadcn UI.
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                        <Badge variant="outline" className="px-3 py-1 text-sm border-primary text-primary">Dental Theme</Badge>
                        <Badge variant="outline" className="px-3 py-1 text-sm border-secondary text-secondary-foreground text-secondary">Inter Font</Badge>
                        <Badge variant="outline" className="px-3 py-1 text-sm">Shadcn Components</Badge>
                    </div>
                </div>

                <Tabs defaultValue="layouts" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8 h-12">
                        <TabsTrigger value="layouts">Layout Options</TabsTrigger>
                        <TabsTrigger value="components">Components</TabsTrigger>
                        <TabsTrigger value="colors">Colors & Typo</TabsTrigger>
                    </TabsList>

                    {/* LAYOUTS TAB */}
                    <TabsContent value="layouts" className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Option B (SELECTED) */}
                        <section className="space-y-4 ring-2 ring-primary ring-offset-4 ring-offset-slate-50 rounded-xl">
                            <div className="flex items-center justify-between bg-primary/5 p-4 rounded-t-xl border-b border-primary/10">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-2xl font-bold text-foreground">Option B: Modern Quick-Commerce</h2>
                                        <Badge className="bg-primary text-primary-foreground hover:bg-primary">SELECTED</Badge>
                                    </div>
                                    <p className="text-muted-foreground">App-like feel, search-centric, sticky header, minimal.</p>
                                </div>
                                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-0">High Engagement</Badge>
                            </div>
                            <div className="border border-t-0 rounded-b-xl overflow-hidden shadow-xl bg-white relative">
                                <div className="absolute inset-0 bg-slate-50 z-0"></div>
                                <div className="relative z-10">
                                    <HeaderModern />
                                    <div className="h-64 flex items-center justify-center text-muted-foreground/50">
                                        (Content scrolls behind sticky header)
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Option A */}
                        <section className="space-y-4 opacity-60 hover:opacity-100 transition-opacity">
                            <div className="flex items-center justify-between px-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">Option A: Classic Medical</h2>
                                    <p className="text-muted-foreground">Traditional, trust-focused layout with top bar contact info.</p>
                                </div>
                                <Badge variant="outline">Alternative</Badge>
                            </div>
                            <div className="border rounded-xl overflow-hidden shadow-sm bg-white grayscale hover:grayscale-0 transition-all">
                                <HeaderClassic />
                                <div className="h-32 bg-slate-100 flex items-center justify-center text-muted-foreground">
                                    Content Area
                                </div>
                            </div>
                        </section>
                    </TabsContent>


                    {/* COMPONENTS TAB */}
                    <TabsContent value="components" className="space-y-12">
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold">Product Cards</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <ProductCard variant="default" title="Tuff TT Implant, ø4.2mm, L10.0mm" price={4500} oldPrice={5200} image="" />
                                <ProductCard variant="default" title="Surgical Kit (Complete)" price={25000} image="" inStock={false} />
                                <ProductCard variant="minimal" title="Healing Abutment" price={850} image="" />
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold">Buttons & Badges</h2>
                            <div className="flex flex-wrap gap-4 p-6 border rounded-xl bg-white">
                                <Button>Primary Action</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="destructive">Destructive</Button>
                                <Button variant="ghost">Ghost</Button>
                                <Button variant="link">Link</Button>
                                <Button disabled>Disabled</Button>
                            </div>
                            <div className="flex gap-4">
                                <Badge variant="default">Default</Badge>
                                <Badge variant="secondary">Secondary</Badge>
                                <Badge variant="outline">Outline</Badge>
                                <Badge variant="destructive">Destructive</Badge>
                            </div>
                        </section>
                    </TabsContent>

                    {/* COLORS TAB */}
                    <TabsContent value="colors" className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Dental Theme Palette</h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {/* Primary Blue Scale - Hardcoded classes for Tailwind detection */}
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-blue-50)]" /><div className="text-xs font-mono text-center">50</div></div>
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-blue-100)]" /><div className="text-xs font-mono text-center">100</div></div>
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-blue-200)]" /><div className="text-xs font-mono text-center">200</div></div>
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-blue-300)]" /><div className="text-xs font-mono text-center">300</div></div>
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-blue-400)]" /><div className="text-xs font-mono text-center">400</div></div>
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-blue-500)]" /><div className="text-xs font-mono text-center">500</div></div>
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-blue-600)] ring-2 ring-foreground" /><div className="text-xs font-mono text-center font-bold">600 (Primary)</div></div>
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-blue-700)]" /><div className="text-xs font-mono text-center">700</div></div>
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-blue-800)]" /><div className="text-xs font-mono text-center">800</div></div>
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-blue-900)]" /><div className="text-xs font-mono text-center">900</div></div>
                            </div>
                            <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
                                {/* Secondary Green Scale */}
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-green-50)]" /><div className="text-xs font-mono text-center">50</div></div>
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-green-100)]" /><div className="text-xs font-mono text-center">100</div></div>
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-green-200)]" /><div className="text-xs font-mono text-center">200</div></div>
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-green-300)]" /><div className="text-xs font-mono text-center">300</div></div>
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-green-400)]" /><div className="text-xs font-mono text-center">400</div></div>
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-green-500)] ring-2 ring-foreground" /><div className="text-xs font-mono text-center font-bold">500 (Secondary)</div></div>
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-green-600)]" /><div className="text-xs font-mono text-center">600</div></div>
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-green-700)]" /><div className="text-xs font-mono text-center">700</div></div>
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-green-800)]" /><div className="text-xs font-mono text-center">800</div></div>
                                <div className="space-y-1"><div className="h-16 w-full rounded-lg shadow-sm bg-[var(--color-dental-green-900)]" /><div className="text-xs font-mono text-center">900</div></div>
                            </div>
                        </section>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
