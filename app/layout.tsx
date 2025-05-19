import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { AlertsProvider } from "@/contexts/alerts-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CryptoTracker",
  description: "A simple cryptocurrency tracking application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AlertsProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
              <footer className="border-t py-4">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                  Data provided by CoinCap API
                </div>
              </footer>
            </div>
          </AlertsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
