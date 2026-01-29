"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Award, ShieldCheck, Heart, ArrowRight } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background pt-32">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-space-grotesk font-black uppercase tracking-widest border border-primary/10"
                >
                    Our Story
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl lg:text-7xl font-serif font-black text-foreground tracking-tight"
                >
                    The Human Side <br /> of <span className="text-secondary">Precision</span>.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl mx-auto text-lg lg:text-xl text-muted-foreground font-body leading-relaxed"
                >
                    DentSupply was born in Jaipur with a simple mission: to bridge the gap between world-class dental technology and the clinicians who use it every day.
                </motion.p>
            </section>

            {/* Narrative Section */}
            <section className="py-24 bg-surface/50 translate-z-0">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <Image
                                src="/images/clinic-modern.png"
                                alt="Modern Clinic"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                            <div className="absolute bottom-10 left-10 text-white">
                                <p className="text-4xl font-serif font-black">2024</p>
                                <p className="text-sm font-space-grotesk font-bold uppercase tracking-widest opacity-80">Founded in Jaipur</p>
                            </div>
                        </motion.div>

                        <div className="space-y-12">
                            <div className="space-y-6">
                                <h2 className="text-3xl lg:text-4xl font-serif font-black text-foreground">Why We Exist.</h2>
                                <div className="h-1.5 w-20 bg-secondary rounded-full" />
                                <p className="text-muted-foreground font-body leading-relaxed text-lg">
                                    In an industry dominated by massive, disconnected distributors, we chose to be different. We are local. We are experts. And we believe that every implant we deliver represents a patient whose life is about to change.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {[
                                    { icon: Award, title: "Authorized", desc: "Official Noris Medical Partner" },
                                    { icon: Heart, title: "Clinician-First", desc: "Designed for your workflow" },
                                    { icon: ShieldCheck, title: "Authentic", desc: "100% genuine products" },
                                    { icon: ArrowRight, title: "Swift", desc: "Same-day Jaipur delivery" }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-3 p-6 glass rounded-2xl hover:border-primary/20 transition-all group">
                                        <item.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                                        <h3 className="font-serif font-bold text-foreground text-lg">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground font-body">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 overflow-hidden relative">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl font-serif font-black text-foreground">Our Core Values.</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">These principles guide every decision we make and every product we ship.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Transparency", desc: "Clear pricing, authentic origins, and honest advice for every clinician." },
                            { title: "Precision", desc: "We understand that in dentistry, a fraction of a millimeter is everything." },
                            { title: "Partnership", desc: "We don't just sell products; we support your clinical success." }
                        ].map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-10 glass rounded-3xl space-y-6 text-center shadow-xl shadow-primary/5"
                            >
                                <div className="h-16 w-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center text-primary font-black text-2xl font-serif">
                                    {i + 1}
                                </div>
                                <h3 className="text-2xl font-serif font-black">{value.title}</h3>
                                <p className="text-muted-foreground font-body leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] -z-10" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
            </section>
        </div>
    )
}
