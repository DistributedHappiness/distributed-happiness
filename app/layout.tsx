import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import BottomNavbar from "@/components/BottomNavbar";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL || "https://distributehappiness.com"),
  title: {
    default: "Distribute Happiness — Custom Gifts & Bulk Corporate Merchandise",
    template: "%s | Distribute Happiness",
  },
  description:
    "Meticulously personalized gifts with real-time preview & corporate bulk merchandise. Custom ceramic mugs, engraved plaques, embroidered apparel, and executive gift hampers.",
  keywords: [
    "custom gifts",
    "personalized gifts India",
    "corporate gifting",
    "bulk corporate gifts",
    "custom mugs",
    "engraved keychains",
    "custom apparel",
    "Distribute Happiness",
  ],
  authors: [{ name: "Distribute Happiness" }],
  creator: "Distribute Happiness",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://distributehappiness.com",
    siteName: "Distribute Happiness",
    title: "Distribute Happiness — Custom Gifts & Corporate Bulk Merchandise",
    description: "Meticulously personalized gifts with real-time preview & corporate wholesale merchandise. Fast dispatch across India.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Distribute Happiness — Custom Gifts & Corporate Bulk Merchandise",
    description: "Meticulously personalized gifts with real-time preview & corporate wholesale merchandise.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased selection:bg-blue-500 selection:text-white relative bg-[#F5F5F7] dark:bg-[#000000] transition-colors duration-300">
        
        {/* Subtle Ambient Apple Glows */}
        <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/10 to-purple-400/5 dark:from-blue-600/10 dark:to-purple-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-amber-400/5 to-rose-400/5 dark:from-blue-500/5 dark:to-cyan-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
 
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1 w-full pb-20 lg:pb-0">{children}</main>
              <Footer />
              <BottomNavbar />
              <CartDrawer />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
