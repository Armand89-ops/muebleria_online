"use client"

import Image from 'next/image'
import Link from 'next/link'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

export function CartSidebar() {
  const { items, removeItem, updateQuantity, totalPrice, isOpen, closeCart } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-serif text-xl">Tu Carrito</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="font-serif text-lg font-medium mb-2">Tu carrito está vacío</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Descubre nuestra colección y encuentra los muebles perfectos para tu hogar.
            </p>
            <Button asChild onClick={closeCart}>
              <Link href="/catalogo">Explorar Catálogo</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.product.id} className="py-4 flex gap-4">
                    {/* Image */}
                    <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-sm line-clamp-1">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.color}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        {/* Quantity */}
                        <div className="flex items-center border border-border rounded-md">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-muted transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 text-sm font-medium">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-muted transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="font-medium text-sm">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-semibold">{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Envío e impuestos calculados en el checkout.
              </p>
              <div className="space-y-2">
                <Button asChild className="w-full" size="lg" onClick={closeCart}>
                  <Link href="/checkout">Proceder al Pago</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent" onClick={closeCart}>
                  <Link href="/carrito">Ver Carrito Completo</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
