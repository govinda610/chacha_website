import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

import type { Viewport } from "next";

export const metadata: Metadata = {
  title: "DentSupply - India's Trusted Dental Marketplace",
  description: "Premium dental implants, instruments, and supplies.",
};

export const viewport: Viewport = {
  themeColor: "#3B82F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`} suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1 bg-muted/5">
              {children}
            </main>
            <Footer />
            <MobileNav />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
