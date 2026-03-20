"use client"

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { useAuth } from '@/context/auth-context'
import type { Product } from '@/lib/products'

interface WishlistContextType {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  totalItems: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export { WishlistContext }

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([])
  const { isAuthenticated } = useAuth()
  const prevAuth = useRef(isAuthenticated)

  // Load wishlist from API when user logs in
  useEffect(() => {
    if (isAuthenticated && !prevAuth.current) {
      fetch('/api/user/wishlist')
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const apiItems: Product[] = data.map((row: any) => ({
              id: String(row.id),
              name: row.name,
              description: row.description || '',
              price: row.price,
              originalPrice: row.originalPrice,
              category: row.category,
              subcategory: row.subcategory || '',
              image: row.image,
              rating: row.rating || 0,
              reviews: row.reviews || 0,
              inStock: row.inStock ?? true,
              featured: row.featured ?? false,
              isNew: row.is_new ?? false,
              colors: [],
              materials: [],
              images: [],
            }))
            setItems(apiItems)
          }
        })
        .catch(() => { /* silently fail */ })
    }

    if (!isAuthenticated && prevAuth.current) {
      setItems([])
    }

    prevAuth.current = isAuthenticated
  }, [isAuthenticated])

  const addItem = useCallback((product: Product) => {
    setItems(current => {
      if (current.find(item => item.id === product.id)) return current
      return [...current, product]
    })

    if (isAuthenticated) {
      fetch('/api/user/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ producto_id: Number(product.id) }),
      }).catch(() => { /* silently fail */ })
    }
  }, [isAuthenticated])

  const removeItem = useCallback((productId: string) => {
    setItems(current => current.filter(item => item.id !== productId))

    if (isAuthenticated) {
      fetch(`/api/user/wishlist?producto_id=${productId}`, { method: 'DELETE' })
        .catch(() => { /* silently fail */ })
    }
  }, [isAuthenticated])

  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item.id === productId)
  }, [items])

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        totalItems: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
