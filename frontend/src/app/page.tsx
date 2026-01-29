"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Truck, ShieldCheck, Clock, Award, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/products/product-card"
import { Hero } from "@/components/home/hero"
import { productService } from "@/services/products"
import { motion } from "framer-motion"
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
    <div className="flex flex-col min-h-screen bg-background">

      {/* Hero Section */}
      <Hero />

      {/* Trust Indicators - Refined */}
      <section className="relative z-20 -mt-10 lg:-mt-16 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 lg:p-6 glass rounded-3xl shadow-2xl shadow-primary/5"
          >
            {[
              { icon: Truck, title: "Express Delivery", desc: "Same-day in Jaipur", color: "text-primary" },
              { icon: ShieldCheck, title: "100% Authentic", desc: "Authorized Distributor", color: "text-secondary" },
              { icon: Clock, title: "24/7 Ordering", desc: "Digital Procurement", color: "text-teal-600" },
              { icon: Star, title: "Premium Grade", desc: "Certification Verified", color: "text-accent" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-colors group">
                <div className={`h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center ${feature.color} shrink-0 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm lg:text-base font-serif">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground font-body">{feature.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products - Refined */}
      <section className="py-24 bg-surface/50">
        <div className="container mx-auto px-4 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold font-space-grotesk uppercase tracking-tight">
                <Zap className="h-3 w-3" />
                Latest In Stock
              </div>
              <h2 className="text-3xl lg:text-5xl font-serif font-black text-foreground">Featured Arrivals.</h2>
            </div>
            <Link href="/products" className="group text-primary font-bold font-space-grotesk flex items-center gap-2 hover:translate-x-1 transition-transform">
              Explore Full Collection <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform text-secondary" />
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
