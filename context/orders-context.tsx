"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
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
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

const sampleOrders: Order[] = [
  {
    id: 'LUXE-A8F3K2M1',
    items: [],
    subtotal: 24999,
    shipping: 0,
    tax: 4000,
    total: 28999,
    status: 'entregado',
    date: '2026-01-15',
    shippingAddress: {
      name: 'Juan Perez',
      address: 'Av. Reforma 222, Col. Juarez',
      city: 'Ciudad de Mexico',
      state: 'CDMX',
      zip: '06600',
    },
    trackingNumber: 'MX-TR-293847561',
  },
  {
    id: 'LUXE-B2K9P4N7',
    items: [],
    subtotal: 18999,
    shipping: 499,
    tax: 3040,
    total: 22538,
    status: 'enviado',
    date: '2026-02-03',
    shippingAddress: {
      name: 'Juan Perez',
      address: 'Av. Reforma 222, Col. Juarez',
      city: 'Ciudad de Mexico',
      state: 'CDMX',
      zip: '06600',
    },
    trackingNumber: 'MX-TR-384756192',
  },
  {
    id: 'LUXE-C5M1R8Q3',
    items: [],
    subtotal: 4999,
    shipping: 0,
    tax: 800,
    total: 5799,
    status: 'procesando',
    date: '2026-02-08',
    shippingAddress: {
      name: 'Juan Perez',
      address: 'Av. Reforma 222, Col. Juarez',
      city: 'Ciudad de Mexico',
      state: 'CDMX',
      zip: '06600',
    },
  },
]

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(sampleOrders)

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
    <OrdersContext.Provider value={{ orders, addOrder, getOrder }}>
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
