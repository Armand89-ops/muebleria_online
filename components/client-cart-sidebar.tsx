"use client"

import dynamic from 'next/dynamic'

const CartSidebar = dynamic(
  () => import('@/components/cart-sidebar').then((mod) => mod.CartSidebar),
  {
    ssr: false,
    loading: () => null,
  }
)

export function ClientCartSidebar() {
  return <CartSidebar />
}
