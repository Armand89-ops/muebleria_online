"use client"

import { useState, useEffect } from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ChevronRight, ShoppingBag, ArrowRight, Truck, Shield, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ClientHeader } from '@/components/client-header'
import { Footer } from '@/components/footer'
import { ClientCartSidebar } from '@/components/client-cart-sidebar'
import { ProductCard } from '@/components/product-card'
import { useCart } from '@/context/cart-context'
import type { Product } from '@/lib/products'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart()
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const products = Array.isArray(data) ? data : []
        setSuggestedProducts(products.filter((p: Product) => p.featured).slice(0, 4))
      })
      .catch(() => { })
  }, [])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(price)

  const shippingCost = totalPrice >= 5000 ? 0 : 499
  const tax = Math.round(totalPrice * 0.16)
  const total = totalPrice + shippingCost + tax

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <ClientHeader />
        <ClientCartSidebar />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center max-w-md mx-auto px-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="font-serif text-3xl font-bold text-foreground mb-3">Tu carrito esta vacio</h1>
            <p className="text-muted-foreground mb-8">
              Parece que aun no has agregado nada a tu carrito. Explora nuestro catalogo para encontrar muebles que te encanten.
            </p>
            <Button asChild size="lg">
              <Link href="/catalogo">
                Explorar Catalogo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ClientHeader />
      <ClientCartSidebar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-secondary py-3">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Inicio</Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Carrito</span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Carrito de Compras
              <span className="text-lg font-sans font-normal text-muted-foreground ml-3">
                ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
              </span>
            </h1>
            <Button variant="ghost" className="text-destructive hover:text-destructive mt-2 sm:mt-0" onClick={clearCart}>
              <Trash2 className="h-4 w-4 mr-2" />
              Vaciar carrito
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.color}`} className="bg-card border border-border rounded-lg p-4 sm:p-6">
                  <div className="flex gap-4 sm:gap-6">
                    {/* Image */}
                    <Link href={`/producto/${item.product.id}`} className="flex-shrink-0">
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4">
                        <div>
                          <Link href={`/producto/${item.product.id}`} className="font-medium text-foreground hover:text-accent transition-colors line-clamp-1">
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            Color: {item.color}
                          </p>
                          {item.product.originalPrice && (
                            <p className="text-xs text-muted-foreground line-through mt-1">
                              {formatPrice(item.product.originalPrice)}
                            </p>
                          )}
                        </div>
                        <p className="font-semibold text-foreground text-right whitespace-nowrap">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity */}
                        <div className="flex items-center border border-border rounded-md">
                          <button
                            type="button"
                            className="p-2 hover:bg-muted transition-colors"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-4 text-sm font-medium min-w-[2.5rem] text-center">{item.quantity}</span>
                          <button
                            type="button"
                            className="p-2 hover:bg-muted transition-colors"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Coupon */}
              <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
                <p className="text-sm font-medium text-foreground mb-3">Codigo de descuento</p>
                <div className="flex gap-3">
                  <Input placeholder="Ingresa tu codigo" className="flex-1" />
                  <Button variant="outline">Aplicar</Button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h2 className="text-lg font-medium text-foreground mb-4">Resumen del Pedido</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({totalItems} productos)</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envio</span>
                    <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                      {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  {shippingCost > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Envio gratis en compras mayores a $5,000
                    </p>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IVA (16%)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-lg font-semibold mb-6">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout">
                    Proceder al Pago
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button asChild variant="link" className="w-full mt-2">
                  <Link href="/catalogo">Seguir Comprando</Link>
                </Button>

                {/* Trust badges */}
                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4 flex-shrink-0" />
                    <span>Envio gratis en pedidos +$5,000</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 flex-shrink-0" />
                    <span>Pago 100% seguro</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <RotateCcw className="h-4 w-4 flex-shrink-0" />
                    <span>30 dias para devoluciones</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Products */}
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Te podria interesar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
