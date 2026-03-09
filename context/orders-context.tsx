"use client"

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { useAuth } from '@/context/auth-context'
import type { CartItem } from '@/context/cart-context'

export interface Order {
  id: string
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: 'procesando' | 'enviado' | 'entregado' | 'cancelado'
  date: string
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zip: string
  }
  trackingNumber?: string
}

interface OrdersContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => string
  getOrder: (id: string) => Order | undefined
  loadOrders: () => Promise<void>
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const { isAuthenticated } = useAuth()
  const prevAuth = useRef(isAuthenticated)

  const loadOrders = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const res = await fetch('/api/user/orders')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          const mapped: Order[] = data.map((o: any) => ({
            id: o.codigo || o.id,
            items: (o.items || []).map((item: any) => ({
              product: {
                id: String(item.producto_id || ''),
                name: item.nombre_producto || '',
                price: item.precio || 0,
                image: item.imagen || '',
                description: '',
                category: '',
                subcategory: '',
                originalPrice: null,
                rating: 0,
                reviews: 0,
                inStock: true,
                featured: false,
                isNew: false,
                colors: [],
                materials: [],
                images: [],
              },
              quantity: item.cantidad || 1,
              color: item.color || undefined,
            })),
            subtotal: o.subtotal,
            shipping: o.envio,
            tax: o.impuesto,
            total: o.total,
            status: o.estado,
            date: o.created_at ? new Date(o.created_at).toISOString().split('T')[0] : '',
            shippingAddress: {
              name: o.envio_nombre || '',
              address: o.envio_direccion || '',
              city: o.envio_ciudad || '',
              state: o.envio_estado || '',
              zip: o.envio_codigo_postal || '',
            },
            trackingNumber: o.tracking_number || undefined,
          }))
          setOrders(mapped)
        }
      }
    } catch {
      /* silently fail */
    }
  }, [isAuthenticated])

  // Load orders when user logs in
  useEffect(() => {
    if (isAuthenticated && !prevAuth.current) {
      loadOrders()
    }

    if (!isAuthenticated && prevAuth.current) {
      setOrders([])
    }

    prevAuth.current = isAuthenticated
  }, [isAuthenticated, loadOrders])

  const addOrder = useCallback((orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const id = `LUXE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    const newOrder: Order = {
      ...orderData,
      id,
      date: new Date().toISOString().split('T')[0],
      status: 'procesando',
    }
    setOrders(current => [newOrder, ...current])
    return id
  }, [])

  const getOrder = useCallback((id: string) => {
    return orders.find(order => order.id === id)
  }, [orders])

  return (
    <OrdersContext.Provider value={{ orders, addOrder, getOrder, loadOrders }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider')
  }
  return context
}
