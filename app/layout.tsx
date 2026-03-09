import React from "react"
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { CartProvider } from '@/context/cart-context'
import { WishlistProvider } from '@/context/wishlist-context'
import { OrdersProvider } from '@/context/orders-context'
import { AuthProvider } from '@/context/auth-context'

const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });
const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'LUXE Furniture | Muebles de Diseño Exclusivo',
  description: 'Descubre nuestra colección de muebles de diseño. Sofás, mesas, sillas y más para transformar tu hogar con elegancia.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <OrdersProvider>
                {children}
              </OrdersProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
