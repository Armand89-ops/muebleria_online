"use client"

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { useAuth } from '@/context/auth-context'
import type { Product } from '@/lib/products'

export interface CartItem {
  product: Product
  quantity: number
  color?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, color?: string) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export { CartContext }

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const prevAuth = useRef(isAuthenticated)

  // Load cart from API when user logs in
  useEffect(() => {
    if (isAuthenticated && !prevAuth.current) {
      // Just logged in — load cart from DB
      fetch('/api/user/cart')
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const apiItems: CartItem[] = data.map((row: any) => ({
              product: {
                id: String(row.producto_id),
                name: row.name,
                price: row.price,
                originalPrice: row.originalPrice,
                image: row.image,
                category: row.category,
                description: '',
                subcategory: '',
                rating: 0,
                reviews: 0,
                inStock: true,
                featured: false,
                is_new: false,
                colors: [],
                materials: [],
                images: [],
              },
              quantity: row.cantidad,
              color: row.color || undefined,
            }))
            setItems(apiItems)
          }
        })
        .catch(() => { /* silently fail */ })
    }

    if (!isAuthenticated && prevAuth.current) {
      // Just logged out — clear local cart
      setItems([])
    }

    prevAuth.current = isAuthenticated
  }, [isAuthenticated])

  const addItem = useCallback((product: Product, quantity = 1, color?: string) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.product.id === product.id)

      if (existingItem) {
        return currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...currentItems, { product, quantity, color: color || product.colors?.[0] }]
    })
    setIsOpen(true)

    if (isAuthenticated) {
      fetch('/api/user/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ producto_id: Number(product.id), cantidad: quantity, color: color || product.colors?.[0] || null }),
      }).catch(() => { /* silently fail */ })
    }
  }, [isAuthenticated])

  const removeItem = useCallback((productId: string) => {
    setItems(currentItems => currentItems.filter(item => item.product.id !== productId))

    if (isAuthenticated) {
      fetch(`/api/user/cart?producto_id=${productId}`, { method: 'DELETE' })
        .catch(() => { /* silently fail */ })
    }
  }, [isAuthenticated])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId)
      return
    }
    setItems(currentItems => {
      const item = currentItems.find(i => i.product.id === productId)
      return currentItems.map(i =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    })

    if (isAuthenticated) {
      const item = items.find(i => i.product.id === productId)
      fetch('/api/user/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ producto_id: Number(productId), cantidad: quantity, color: item?.color || null }),
      }).catch(() => { /* silently fail */ })
    }
  }, [removeItem, isAuthenticated, items])

  const clearCart = useCallback(() => {
    setItems([])

    if (isAuthenticated) {
      fetch('/api/user/cart', { method: 'DELETE' })
        .catch(() => { /* silently fail */ })
    }
  }, [isAuthenticated])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
