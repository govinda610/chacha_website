"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Truck, ShieldCheck, Clock, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/products/product-card"
import { productService } from "@/services/products"
import type { Product, Category } from "@/types/product"
import { toast } from "sonner"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [featured, cats] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getCategories()
        ])
        setProducts(featured)
        setCategories(cats)
      } catch (err) {
        console.error("Failed to load home data", err)
        toast.error("Could not load products. Please check connection.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-primary to-blue-500 text-white overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl space-y-6 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
              <Award className="h-4 w-4 text-yellow-300" />
              <span>Official Distributor for Noris Medical</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-none">
              Premium Dental Implants & Supplies
            </h1>
            <p className="text-lg lg:text-xl text-blue-100 max-w-xl leading-relaxed">
              Same-day delivery for Jaipur clinics. Authentic products, simplified procurement, and exclusive B2B pricing.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/products">
                <Button size="lg" className="bg-white text-primary hover:bg-blue-50 font-bold rounded-xl h-12">
                  Shop Catalog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white/30 hover:bg-white/10 font-medium rounded-xl h-12">
                  Create Professional Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Express Delivery", desc: "Same-day in Jaipur" },
              { icon: ShieldCheck, title: "100% Authentic", desc: "Authorized Distributor" },
              { icon: Clock, title: "24/7 Ordering", desc: "Digital Procurement" },
              { icon: Award, title: "Premium Support", desc: "Expert Assistance" }
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors">
                <div className="h-10 w-10 bg-white rounded-full shadow-sm flex items-center justify-center text-primary shrink-0">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-slate-50/50">
        <div className="container mx-auto px-4 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">New Arrivals</h2>
            <Link href="/products" className="text-primary font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white h-[350px] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
              {products.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  No products found. Please ensure backend is seeded.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 space-y-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground text-center">Shop by Category</h2>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.slice(0, 6).map(cat => (
                <Link key={cat.id} href={`/products?category_id=${cat.id}`} className="group">
                  <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-transparent hover:border-primary/20 hover:bg-blue-50/50 transition-all text-center h-full aspect-square">
                    <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      {/* Placeholder Icon based on name logic or generic */}
                      <GridIcon />
                    </div>
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function GridIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
  )
}
