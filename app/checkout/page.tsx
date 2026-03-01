"use client"

import React from "react"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, CreditCard, Truck, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/header'
import { CartSidebar } from '@/components/cart-sidebar'
import { useCart } from '@/context/cart-context'
import { useOrders } from '@/context/orders-context'

const shippingOptions = [
  { id: 'standard', name: 'Envío Estándar', price: 0, time: '5-7 días hábiles' },
  { id: 'express', name: 'Envío Express', price: 499, time: '2-3 días hábiles' },
  { id: 'next-day', name: 'Entrega al Día Siguiente', price: 999, time: '1 día hábil' },
]

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { addOrder } = useOrders()
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping')
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [orderPlaced, setOrderPlaced] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const selectedShipping = shippingOptions.find((s) => s.id === shippingMethod)
  const shippingCost = selectedShipping?.price || 0
  const subtotal = totalPrice
  const tax = Math.round(subtotal * 0.16)
  const total = subtotal + shippingCost + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const [orderId, setOrderId] = useState('')

  const handlePlaceOrder = () => {
    const id = addOrder({
      items: items.map(item => ({ ...item })),
      subtotal,
      shipping: shippingCost,
      tax,
      total,
      shippingAddress: {
        name: `${formData.firstName} ${formData.lastName}`,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      },
    })
    setOrderId(id)
    setOrderPlaced(true)
    setStep('confirmation')
    clearCart()
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <CartSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16">
            <h1 className="font-serif text-2xl font-bold mb-4">Tu carrito está vacío</h1>
            <p className="text-muted-foreground mb-6">
              Agrega productos a tu carrito para proceder al checkout
            </p>
            <Button asChild>
              <Link href="/catalogo">Explorar Catálogo</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <CartSidebar />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              ¡Pedido Confirmado!
            </h1>
            <p className="text-muted-foreground mb-2">
              Gracias por tu compra. Hemos enviado los detalles de tu pedido a:
            </p>
            <p className="font-medium text-foreground mb-6">{formData.email || 'tu correo electrónico'}</p>
            <div className="bg-muted rounded-lg p-6 mb-8">
              <p className="text-sm text-muted-foreground mb-1">Número de pedido</p>
              <p className="font-mono text-lg font-bold">{orderId}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/">Volver al Inicio</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/catalogo">Seguir Comprando</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <CartSidebar />

      <main className="flex-1">
        {/* Back Link */}
        <div className="bg-secondary py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/catalogo"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Continuar Comprando
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Checkout</h1>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-10">
            <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-foreground' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'shipping' ? 'bg-primary text-primary-foreground' : step === 'payment' ? 'bg-green-500 text-white' : 'bg-muted'
              }`}>
                {step === 'payment' ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <span className="text-sm font-medium hidden sm:inline">Envío</span>
            </div>
            <div className="flex-1 h-px bg-border" />
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-foreground' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                2
              </div>
              <span className="text-sm font-medium hidden sm:inline">Pago</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Form Section */}
            <div className="lg:col-span-2">
              {step === 'shipping' && (
                <div className="space-y-8">
                  {/* Contact */}
                  <div>
                    <h2 className="text-lg font-medium mb-4">Información de Contacto</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="tu@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="+52 55 1234 5678"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h2 className="text-lg font-medium mb-4">Dirección de Envío</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">Nombre</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Apellido</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">Dirección</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="Calle, número, colonia"
                        />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">Ciudad</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">Estado</Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <Label htmlFor="zip">Código Postal</Label>
                          <Input
                            id="zip"
                            name="zip"
                            value={formData.zip}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div>
                    <h2 className="text-lg font-medium mb-4">Método de Envío</h2>
                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                      <div className="space-y-3">
                        {shippingOptions.map((option) => (
                          <div
                            key={option.id}
                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                              shippingMethod === option.id ? 'border-primary bg-primary/5' : 'border-border'
                            }`}
                            onClick={() => setShippingMethod(option.id)}
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value={option.id} id={option.id} />
                              <div>
                                <Label htmlFor={option.id} className="cursor-pointer font-medium">
                                  {option.name}
                                </Label>
                                <p className="text-sm text-muted-foreground">{option.time}</p>
                              </div>
                            </div>
                            <span className="font-medium">
                              {option.price === 0 ? 'Gratis' : formatPrice(option.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <Button size="lg" className="w-full" onClick={() => setStep('payment')}>
                    Continuar al Pago
                  </Button>
                </div>
              )}

              {step === 'payment' && (
                <div className="space-y-8">
                  {/* Payment Method */}
                  <div>
                    <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Información de Pago
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="NOMBRE APELLIDO"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Fecha de Expiración</Label>
                          <Input
                            id="expiry"
                            name="expiry"
                            value={formData.expiry}
                            onChange={handleInputChange}
                            className="mt-1"
                            placeholder="MM/AA"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className="mt-1"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Summary */}
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {formData.firstName} {formData.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formData.address}, {formData.city}, {formData.state} {formData.zip}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedShipping?.name} - {selectedShipping?.time}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="text-sm text-accent hover:underline mt-2"
                    >
                      Editar
                    </button>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" size="lg" onClick={() => setStep('shipping')}>
                      Volver
                    </Button>
                    <Button size="lg" className="flex-1" onClick={handlePlaceOrder}>
                      Confirmar Pedido - {formatPrice(total)}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h2 className="text-lg font-medium mb-4">Resumen del Pedido</h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">{item.color}</p>
                        <p className="text-sm font-medium mt-1">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="mb-4" />

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span>{shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IVA (16%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
