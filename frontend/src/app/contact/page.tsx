"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function ContactPage() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        toast.success("Message sent! We'll get back to you within 2 hours.")
    }

    return (
        <div className="flex flex-col min-h-screen bg-background pt-32 lg:pt-40">
            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

                    {/* Left: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-12"
                    >
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-space-grotesk font-black uppercase tracking-widest"
                            >
                                Get In Touch
                            </motion.div>
                            <h1 className="text-5xl lg:text-7xl font-serif font-black text-foreground tracking-tight leading-none">
                                Let's Start a <br /><span className="text-primary italic">Partnership</span>.
                            </h1>
                            <p className="text-xl text-muted-foreground font-body max-w-md">
                                Whether you're looking for a specific implant or want to set up a professional account, our team is here to help.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {[
                                { icon: Phone, label: "Phone", content: "+91 98765 43210", desc: "Mon-Sat, 9am - 7pm" },
                                { icon: Mail, label: "Email", content: "support@dentsupply.in", desc: "Fast response for clinicians" },
                                { icon: MapPin, label: "Location", content: "MALVIYA NAGAR, JAIPUR", desc: "Authorized Hub - Zone A" }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 items-start group">
                                    <div className="h-14 w-14 rounded-2xl bg-white shadow-xl shadow-primary/5 flex items-center justify-center text-primary border border-primary/5 group-hover:scale-110 transition-all duration-500">
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-space-grotesk font-bold text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                                        <p className="text-xl font-serif font-bold text-foreground">{item.content}</p>
                                        <p className="text-sm text-muted-foreground/60 font-body">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 glass rounded-3xl border-primary/10 shadow-2xl shadow-primary/5 flex items-center gap-6">
                            <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-foreground uppercase tracking-tight">System Status: Optimal</p>
                                <p className="text-xs text-muted-foreground font-body">Average response time: 42 minutes</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass p-10 lg:p-14 rounded-[3rem] shadow-2xl shadow-primary/10 border-white/40"
                    >
                        <div className="mb-10 flex items-center gap-4">
                            <MessageSquare className="h-8 w-8 text-primary" />
                            <h2 className="text-3xl font-serif font-black text-foreground">Send a Message</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-space-grotesk font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                                    <Input placeholder="Dr. Sarah Johnson" className="rounded-2xl h-14 bg-white/50 border-primary/5 focus:bg-white" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-space-grotesk font-bold text-muted-foreground uppercase tracking-widest ml-1">Clinic Name</label>
                                    <Input placeholder="SmileDental Jaipur" className="rounded-2xl h-14 bg-white/50 border-primary/5 focus:bg-white" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-space-grotesk font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                                <Input type="email" placeholder="sarah@clinic.com" className="rounded-2xl h-14 bg-white/50 border-primary/5 focus:bg-white" required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-space-grotesk font-bold text-muted-foreground uppercase tracking-widest ml-1">Your Message</label>
                                <Textarea
                                    placeholder="Tell us what you need..."
                                    className="rounded-3xl min-h-[150px] bg-white/50 border-primary/5 focus:bg-white p-6"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full h-16 rounded-2xl bg-primary text-white font-space-grotesk font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all group">
                                Dispatch Message
                                <Send className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Button>
                        </form>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
