import type React from "react"
import type { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-personality",
})

export const metadata: Metadata = {
  title: "FOURSIGHT",
  description: "A prototype personality journey and archetype cards.",
  icons: {
    icon: [],
    apple: [],
    shortcut: [],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${fraunces.variable}`}>
        <Providers>
          {children}
        </Providers>
        <Toaster 
          richColors 
          closeButton 
          position="top-center" 
          expand={true} 
          duration={4000}
        />
      </body>
    </html>
  )
}

