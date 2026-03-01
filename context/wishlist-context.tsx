"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Product } from '@/lib/products'

interface WishlistContextType {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  totalItems: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([])

  const addItem = useCallback((product: Product) => {
    setItems(current => {
      if (current.find(item => item.id === product.id)) return current
      return [...current, product]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems(current => current.filter(item => item.id !== productId))
  }, [])

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
