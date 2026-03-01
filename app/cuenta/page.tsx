"use client"

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  User, Package, Heart, MapPin, Settings, LogOut,
  ChevronRight, Truck, Check, Clock, X as XIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartSidebar } from '@/components/cart-sidebar'
import { ProductCard } from '@/components/product-card'
import { useWishlist } from '@/context/wishlist-context'
import { useOrders } from '@/context/orders-context'

type Tab = 'perfil' | 'pedidos' | 'favoritos' | 'direcciones' | 'configuracion'

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'perfil', label: 'Mi Perfil', icon: User },
  { id: 'pedidos', label: 'Mis Pedidos', icon: Package },
  { id: 'favoritos', label: 'Favoritos', icon: Heart },
  { id: 'direcciones', label: 'Direcciones', icon: MapPin },
  { id: 'configuracion', label: 'Configuracion', icon: Settings },
]

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  procesando: { label: 'Procesando', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  enviado: { label: 'Enviado', icon: Truck, color: 'bg-blue-100 text-blue-800' },
  entregado: { label: 'Entregado', icon: Check, color: 'bg-green-100 text-green-800' },
  cancelado: { label: 'Cancelado', icon: XIcon, color: 'bg-red-100 text-red-800' },
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>('perfil')
  const { items: wishlistItems } = useWishlist()
  const { orders } = useOrders()

  const [profile, setProfile] = useState({
    firstName: 'Juan',
    lastName: 'Perez',
    email: 'juan.perez@email.com',
    phone: '+52 55 1234 5678',
  })

  const [addresses] = useState([
    {
      id: '1',
      label: 'Casa',
      name: 'Juan Perez',
      address: 'Av. Reforma 222, Col. Juarez',
      city: 'Ciudad de Mexico',
      state: 'CDMX',
      zip: '06600',
      isDefault: true,
    },
    {
      id: '2',
      label: 'Oficina',
      name: 'Juan Perez',
      address: 'Av. Insurgentes Sur 1602, Col. Credito Constructor',
      city: 'Ciudad de Mexico',
      state: 'CDMX',
      zip: '03940',
      isDefault: false,
    },
  ])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(price)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartSidebar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-secondary py-3">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Inicio</Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Mi Cuenta</span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Mi Cuenta</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-card border border-border rounded-lg p-6">
                {/* User avatar */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-serif font-bold mb-3">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </div>
                  <p className="font-medium text-foreground">{profile.firstName} {profile.lastName}</p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>

                <Separator className="mb-4" />

                {/* Nav tabs */}
                <nav className="flex flex-col gap-1">
                  {tabs.map(tab => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left ${
                          activeTab === tab.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {tab.label}
                        {tab.id === 'favoritos' && wishlistItems.length > 0 && (
                          <span className={`ml-auto text-xs rounded-full h-5 w-5 flex items-center justify-center ${
                            activeTab === tab.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted-foreground/20'
                          }`}>
                            {wishlistItems.length}
                          </span>
                        )}
                        {tab.id === 'pedidos' && orders.length > 0 && (
                          <span className={`ml-auto text-xs rounded-full h-5 w-5 flex items-center justify-center ${
                            activeTab === tab.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted-foreground/20'
                          }`}>
                            {orders.length}
                          </span>
                        )}
                      </button>
                    )
                  })}

                  <Separator className="my-2" />

                  <button
                    type="button"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4 flex-shrink-0" />
                    Cerrar Sesion
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Profile Tab */}
              {activeTab === 'perfil' && (
                <div className="bg-card border border-border rounded-lg p-6 lg:p-8">
                  <h2 className="text-xl font-medium text-foreground mb-6">Informacion Personal</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Correo Electronico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phone}
                        onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <Separator className="my-8" />

                  <h2 className="text-xl font-medium text-foreground mb-6">Cambiar Contrasena</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="currentPassword">Contrasena Actual</Label>
                      <Input id="currentPassword" type="password" className="mt-1.5" />
                    </div>
                    <div />
                    <div>
                      <Label htmlFor="newPassword">Nueva Contrasena</Label>
                      <Input id="newPassword" type="password" className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirmar Contrasena</Label>
                      <Input id="confirmPassword" type="password" className="mt-1.5" />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button>Guardar Cambios</Button>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'pedidos' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium text-foreground mb-2">Historial de Pedidos</h2>
                  {orders.length === 0 ? (
                    <div className="bg-card border border-border rounded-lg p-12 text-center">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No tienes pedidos aun</h3>
                      <p className="text-muted-foreground mb-6">Explora nuestro catalogo para encontrar muebles increibles</p>
                      <Button asChild>
                        <Link href="/catalogo">Ir al Catalogo</Link>
                      </Button>
                    </div>
                  ) : (
                    orders.map(order => {
                      const status = statusConfig[order.status]
                      const StatusIcon = status.icon
                      return (
                        <div key={order.id} className="bg-card border border-border rounded-lg p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div>
                              <p className="font-mono text-sm font-medium text-foreground">{order.id}</p>
                              <p className="text-sm text-muted-foreground mt-1">{formatDate(order.date)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary" className={status.color}>
                                <StatusIcon className="h-3 w-3 mr-1.5" />
                                {status.label}
                              </Badge>
                            </div>
                          </div>

                          <Separator className="mb-4" />

                          <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div className="text-sm">
                              <p className="text-muted-foreground">Direccion de envio</p>
                              <p className="font-medium mt-1">{order.shippingAddress.name}</p>
                              <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                              <p className="text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                            </div>
                            <div className="text-sm text-right">
                              <p className="text-muted-foreground">Total del pedido</p>
                              <p className="text-xl font-bold text-foreground mt-1">{formatPrice(order.total)}</p>
                              {order.trackingNumber && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Tracking: <span className="font-mono">{order.trackingNumber}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'favoritos' && (
                <div>
                  <h2 className="text-xl font-medium text-foreground mb-6">Mis Favoritos</h2>
                  {wishlistItems.length === 0 ? (
                    <div className="bg-card border border-border rounded-lg p-12 text-center">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No tienes favoritos aun</h3>
                      <p className="text-muted-foreground mb-6">Guarda tus productos favoritos para encontrarlos facilmente</p>
                      <Button asChild>
                        <Link href="/catalogo">Explorar Catalogo</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistItems.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'direcciones' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium text-foreground">Mis Direcciones</h2>
                    <Button variant="outline">Agregar Direccion</Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                      <div key={addr.id} className={`bg-card border rounded-lg p-6 relative ${addr.isDefault ? 'border-primary' : 'border-border'}`}>
                        {addr.isDefault && (
                          <Badge className="absolute top-4 right-4">Predeterminada</Badge>
                        )}
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">{addr.label}</p>
                        <p className="font-medium text-foreground">{addr.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">{addr.address}</p>
                        <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zip}</p>
                        <div className="mt-4 flex gap-3">
                          <button type="button" className="text-sm text-accent hover:underline">Editar</button>
                          {!addr.isDefault && (
                            <button type="button" className="text-sm text-destructive hover:underline">Eliminar</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'configuracion' && (
                <div className="bg-card border border-border rounded-lg p-6 lg:p-8">
                  <h2 className="text-xl font-medium text-foreground mb-6">Configuracion</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Notificaciones por correo</p>
                        <p className="text-sm text-muted-foreground mt-1">Recibe ofertas y novedades en tu correo electronico</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Notificaciones de pedidos</p>
                        <p className="text-sm text-muted-foreground mt-1">Actualizaciones sobre el estado de tus pedidos</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Recordatorios de carrito</p>
                        <p className="text-sm text-muted-foreground mt-1">Recibe recordatorios de productos en tu carrito</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium text-foreground mb-2">Idioma</h3>
                      <select className="w-full sm:w-64 px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm">
                        <option value="es">Espanol (Mexico)</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium text-foreground mb-2">Moneda</h3>
                      <select className="w-full sm:w-64 px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm">
                        <option value="MXN">MXN - Peso Mexicano</option>
                        <option value="USD">USD - Dolar Estadounidense</option>
                      </select>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium text-destructive mb-2">Zona de Peligro</h3>
                      <p className="text-sm text-muted-foreground mb-4">Una vez que elimines tu cuenta, no hay vuelta atras.</p>
                      <Button variant="destructive">Eliminar Cuenta</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
