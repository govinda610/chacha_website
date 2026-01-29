"use client"

import { motion } from "framer-motion"
import { ArrowRight, Award, ShieldCheck, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden mesh-gradient pb-20 pt-32 lg:pb-32 lg:pt-40">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Content (Asymmetric 60%) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex-[1.2] space-y-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/10 text-primary text-sm font-space-grotesk font-medium shadow-sm"
                        >
                            <Award className="h-4 w-4" />
                            <span>Official Distributor for Noris Medical</span>
                        </motion.div>

                        <h1 className="text-5xl lg:text-7xl font-serif font-black text-foreground leading-[1.1] tracking-tight">
                            Premium Dental <br />
                            <span className="text-primary italic">Precision</span> & Supplies.
                        </h1>

                        <p className="text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed font-body">
                            Revolutionizing dental procurement in Jaipur. Same-day delivery, authentic implants, and exclusive B2B pricing for modern clinics.
                        </p>

                        <div className="flex flex-wrap gap-6 pt-4">
                            <Link href="/products">
                                <Button size="lg" className="bg-primary text-white hover:bg-primary/90 rounded-2xl h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 group">
                                    Explore Catalog
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>

                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                            <Image
                                                src={`/images/hero-3d.png`}
                                                alt="User"
                                                width={40}
                                                height={40}
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                    <div className="h-10 w-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                                        500+
                                    </div>
                                </div>
                                <div className="text-sm">
                                    <span className="block font-bold text-foreground">500+ Dental Clinics</span>
                                    <span className="text-muted-foreground">Trust our supplies daily</span>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex items-center gap-8 pt-8 border-t border-primary/5">
                            <div className="flex items-center gap-2 text-xs font-space-grotesk text-muted-foreground uppercase tracking-widest">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                100% Authentic
                            </div>
                            <div className="flex items-center gap-2 text-xs font-space-grotesk text-muted-foreground uppercase tracking-widest">
                                <MapPin className="h-4 w-4 text-secondary" />
                                Jaipur Local
                            </div>
                        </div>
                    </motion.div>

                    {/* Right imagery (40%) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1.2, ease: "backOut" }}
                        className="flex-1 relative"
                    >
                        <div className="relative z-20 animate-float">
                            <motion.div
                                whileHover={{ rotateY: 15, rotateX: -5, scale: 1.05 }}
                                className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/30 border border-white/20 aspect-[4/5] lg:aspect-square"
                                style={{ perspective: 1000 }}
                            >
                                <Image
                                    src="/images/hero-3d.png"
                                    alt="Premium Dental Implants"
                                    fill
                                    priority
                                    className="object-cover"
                                />

                                {/* Floating Card inside imagery */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1, duration: 1 }}
                                    className="absolute bottom-6 left-6 right-6 glass p-4 rounded-2xl shadow-lg border-white/40"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <Award className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">Precision Engineered</p>
                                            <p className="text-[10px] text-muted-foreground">Highest Grade Titanium Implants</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Background elements */}
                        <div className="absolute -top-20 -right-20 h-64 w-64 bg-primary/20 rounded-full blur-[100px] -z-10" />
                        <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-secondary/20 rounded-full blur-[100px] -z-10" />
                    </motion.div>

                </div>
            </div>

            {/* Background Decorative */}
            <div className="absolute top-0 right-0 h-screen w-1/3 bg-gradient-to-l from-primary/5 to-transparent skew-x-12 transform origin-top translate-x-20 -z-10" />
        </section>
    )
}
