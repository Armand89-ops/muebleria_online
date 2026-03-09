"use client"

import React, { Suspense } from "react"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  User, Package, Heart, MapPin, Settings, LogOut,
  ChevronRight, Truck, Check, Clock, X as XIcon, Plus, Loader2, Edit2,
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
import { useAuth } from '@/context/auth-context'

type Tab = 'perfil' | 'pedidos' | 'favoritos' | 'direcciones' | 'configuracion'

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'perfil', label: 'Mi Perfil', icon: User },
  { id: 'pedidos', label: 'Mis Pedidos', icon: Package },
  { id: 'favoritos', label: 'Favoritos', icon: Heart },
  { id: 'direcciones', label: 'Direcciones', icon: MapPin },
  { id: 'configuracion', label: 'Configuración', icon: Settings },
]

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  procesando: { label: 'Procesando', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  enviado: { label: 'Enviado', icon: Truck, color: 'bg-blue-100 text-blue-800' },
  entregado: { label: 'Entregado', icon: Check, color: 'bg-green-100 text-green-800' },
  cancelado: { label: 'Cancelado', icon: XIcon, color: 'bg-red-100 text-red-800' },
}

const emptyAddressForm = {
  etiqueta: 'Casa',
  nombre: '',
  direccion: '',
  ciudad: '',
  estado: '',
  codigo_postal: '',
  es_predeterminada: false,
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <AccountPageContent />
    </Suspense>
  )
}

function AccountPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth()
  const { items: wishlistItems } = useWishlist()

  const initialTab = (searchParams.get('tab') as Tab) || 'perfil'
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)

  // Profile form
  const [profile, setProfile] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')

  // Orders
  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  // Addresses
  const [addresses, setAddresses] = useState<any[]>([])
  const [addressesLoading, setAddressesLoading] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null)
  const [addressForm, setAddressForm] = useState(emptyAddressForm)
  const [addressSaving, setAddressSaving] = useState(false)

  // Settings
  const [notifEmail, setNotifEmail] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Load user profile into form
  useEffect(() => {
    if (user) {
      setProfile({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        telefono: user.telefono || '',
      })
    }
  }, [user])

  // Load notification preference from profile
  useEffect(() => {
    if (isAuthenticated && activeTab === 'configuracion') {
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (data.notif_email !== undefined) setNotifEmail(data.notif_email)
        })
        .catch(() => { })
    }
  }, [activeTab, isAuthenticated])

  // Load orders when tab is active
  useEffect(() => {
    if (activeTab === 'pedidos' && isAuthenticated) {
      setOrdersLoading(true)
      fetch('/api/user/orders')
        .then(res => res.json())
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoading(false))
    }
  }, [activeTab, isAuthenticated])

  // Load addresses when tab is active
  useEffect(() => {
    if (activeTab === 'direcciones' && isAuthenticated) {
      loadAddresses()
    }
  }, [activeTab, isAuthenticated])

  const loadAddresses = () => {
    setAddressesLoading(true)
    fetch('/api/user/addresses')
      .then(res => res.json())
      .then(data => setAddresses(Array.isArray(data) ? data : []))
      .catch(() => setAddresses([]))
      .finally(() => setAddressesLoading(false))
  }

  // URL tab sync
  useEffect(() => {
    const tab = searchParams.get('tab') as Tab
    if (tab && tabs.some(t => t.id === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  if (!authLoading && !isAuthenticated) {
    return null
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <CartSidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(price)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const handleSaveProfile = async () => {
    setProfileSaving(true)
    setProfileMessage('')

    const body: any = {
      nombre: profile.nombre,
      apellido: profile.apellido,
      email: profile.email,
      telefono: profile.telefono,
    }

    if (passwordForm.newPassword) {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setProfileMessage('Las contraseñas no coinciden')
        setProfileSaving(false)
        return
      }
      body.currentPassword = passwordForm.currentPassword
      body.newPassword = passwordForm.newPassword
    }

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.ok) {
        setProfileMessage('Perfil actualizado correctamente')
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setProfileMessage(data.error || 'Error al actualizar')
      }
    } catch {
      setProfileMessage('Error de conexión')
    }
    setProfileSaving(false)
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const handleDeleteAddress = async (id: number) => {
    await fetch(`/api/user/addresses?id=${id}`, { method: 'DELETE' })
    setAddresses(prev => prev.filter(a => a.id !== id))
  }

  const handleEditAddress = (addr: any) => {
    setEditingAddressId(addr.id)
    setAddressForm({
      etiqueta: addr.etiqueta || 'Casa',
      nombre: addr.nombre || '',
      direccion: addr.direccion || '',
      ciudad: addr.ciudad || '',
      estado: addr.estado || '',
      codigo_postal: addr.codigo_postal || '',
      es_predeterminada: addr.es_predeterminada || false,
    })
    setShowAddressForm(true)
  }

  const handleSaveAddress = async () => {
    setAddressSaving(true)
    try {
      if (editingAddressId) {
        await fetch('/api/user/addresses', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingAddressId, ...addressForm }),
        })
      } else {
        await fetch('/api/user/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(addressForm),
        })
      }
      setShowAddressForm(false)
      setEditingAddressId(null)
      setAddressForm(emptyAddressForm)
      loadAddresses()
    } catch {
      /* fail silently */
    }
    setAddressSaving(false)
  }

  const handleCancelAddressForm = () => {
    setShowAddressForm(false)
    setEditingAddressId(null)
    setAddressForm(emptyAddressForm)
  }

  const handleToggleNotif = async (checked: boolean) => {
    setNotifEmail(checked)
    try {
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notif_email: checked }),
      })
    } catch {
      setNotifEmail(!checked) // revert on failure
    }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' })
      if (res.ok) {
        await logout()
        router.push('/')
      }
    } catch {
      /* fail silently */
    }
    setDeleting(false)
    setShowDeleteConfirm(false)
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
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-serif font-bold mb-3">
                    {user?.nombre?.[0]}{user?.apellido?.[0]}
                  </div>
                  <p className="font-medium text-foreground">{user?.nombre} {user?.apellido}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>

                <Separator className="mb-4" />

                <nav className="flex flex-col gap-1">
                  {tabs.map(tab => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left ${activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {tab.label}
                        {tab.id === 'favoritos' && wishlistItems.length > 0 && (
                          <span className={`ml-auto text-xs rounded-full h-5 w-5 flex items-center justify-center ${activeTab === tab.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted-foreground/20'
                            }`}>
                            {wishlistItems.length}
                          </span>
                        )}
                      </button>
                    )
                  })}

                  <Separator className="my-2" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4 flex-shrink-0" />
                    Cerrar Sesión
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Profile Tab */}
              {activeTab === 'perfil' && (
                <div className="bg-card border border-border rounded-lg p-6 lg:p-8">
                  <h2 className="text-xl font-medium text-foreground mb-6">Información Personal</h2>

                  {profileMessage && (
                    <div className={`mb-6 p-3 rounded-md text-sm ${profileMessage.includes('Error') || profileMessage.includes('coinciden')
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-green-100 text-green-800'
                      }`}>
                      {profileMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input id="nombre" value={profile.nombre} onChange={e => setProfile(p => ({ ...p, nombre: e.target.value }))} className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input id="apellido" value={profile.apellido} onChange={e => setProfile(p => ({ ...p, apellido: e.target.value }))} className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input id="email" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input id="telefono" type="tel" value={profile.telefono} onChange={e => setProfile(p => ({ ...p, telefono: e.target.value }))} className="mt-1.5" />
                    </div>
                  </div>

                  <Separator className="my-8" />

                  <h2 className="text-xl font-medium text-foreground mb-6">Cambiar Contraseña</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="currentPassword">Contraseña Actual</Label>
                      <Input id="currentPassword" type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))} className="mt-1.5" />
                    </div>
                    <div />
                    <div>
                      <Label htmlFor="newPassword">Nueva Contraseña</Label>
                      <Input id="newPassword" type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))} className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                      <Input id="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))} className="mt-1.5" />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button onClick={handleSaveProfile} disabled={profileSaving}>
                      {profileSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'pedidos' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-medium text-foreground mb-2">Historial de Pedidos</h2>
                  {ordersLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="bg-card border border-border rounded-lg p-12 text-center">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No tienes pedidos aún</h3>
                      <p className="text-muted-foreground mb-6">Explora nuestro catálogo para encontrar muebles increíbles</p>
                      <Button asChild>
                        <Link href="/catalogo">Ir al Catálogo</Link>
                      </Button>
                    </div>
                  ) : (
                    orders.map(order => {
                      const status = statusConfig[order.estado] || statusConfig.procesando
                      const StatusIcon = status.icon
                      return (
                        <div key={order.id} className="bg-card border border-border rounded-lg p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div>
                              <p className="font-mono text-sm font-medium text-foreground">{order.codigo}</p>
                              <p className="text-sm text-muted-foreground mt-1">{formatDate(order.created_at)}</p>
                            </div>
                            <Badge variant="secondary" className={status.color}>
                              <StatusIcon className="h-3 w-3 mr-1.5" />
                              {status.label}
                            </Badge>
                          </div>

                          <Separator className="mb-4" />

                          <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div className="text-sm">
                              <p className="text-muted-foreground">Dirección de envío</p>
                              <p className="font-medium mt-1">{order.envio_nombre}</p>
                              <p className="text-muted-foreground">{order.envio_direccion}</p>
                              <p className="text-muted-foreground">{order.envio_ciudad}, {order.envio_estado} {order.envio_codigo_postal}</p>
                            </div>
                            <div className="text-sm text-right">
                              <p className="text-muted-foreground">Total del pedido</p>
                              <p className="text-xl font-bold text-foreground mt-1">{formatPrice(order.total)}</p>
                              {order.tracking_number && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Tracking: <span className="font-mono">{order.tracking_number}</span>
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
                      <h3 className="text-lg font-medium mb-2">No tienes favoritos aún</h3>
                      <p className="text-muted-foreground mb-6">Guarda tus productos favoritos para encontrarlos fácilmente</p>
                      <Button asChild>
                        <Link href="/catalogo">Explorar Catálogo</Link>
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
                    {!showAddressForm && (
                      <Button size="sm" onClick={() => { setEditingAddressId(null); setAddressForm(emptyAddressForm); setShowAddressForm(true) }}>
                        <Plus className="h-4 w-4 mr-1.5" />
                        Agregar Dirección
                      </Button>
                    )}
                  </div>

                  {/* Address Form */}
                  {showAddressForm && (
                    <div className="bg-card border border-border rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-medium text-foreground mb-4">
                        {editingAddressId ? 'Editar Dirección' : 'Nueva Dirección'}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="addr-etiqueta">Etiqueta</Label>
                          <select
                            id="addr-etiqueta"
                            value={addressForm.etiqueta}
                            onChange={e => setAddressForm(p => ({ ...p, etiqueta: e.target.value }))}
                            className="mt-1.5 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                          >
                            <option value="Casa">Casa</option>
                            <option value="Oficina">Oficina</option>
                            <option value="Otro">Otro</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="addr-nombre">Nombre completo</Label>
                          <Input id="addr-nombre" value={addressForm.nombre} onChange={e => setAddressForm(p => ({ ...p, nombre: e.target.value }))} className="mt-1.5" placeholder="Nombre del destinatario" />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor="addr-direccion">Dirección</Label>
                          <Input id="addr-direccion" value={addressForm.direccion} onChange={e => setAddressForm(p => ({ ...p, direccion: e.target.value }))} className="mt-1.5" placeholder="Calle, número, colonia" />
                        </div>
                        <div>
                          <Label htmlFor="addr-ciudad">Ciudad</Label>
                          <Input id="addr-ciudad" value={addressForm.ciudad} onChange={e => setAddressForm(p => ({ ...p, ciudad: e.target.value }))} className="mt-1.5" />
                        </div>
                        <div>
                          <Label htmlFor="addr-estado">Estado</Label>
                          <Input id="addr-estado" value={addressForm.estado} onChange={e => setAddressForm(p => ({ ...p, estado: e.target.value }))} className="mt-1.5" />
                        </div>
                        <div>
                          <Label htmlFor="addr-cp">Código Postal</Label>
                          <Input id="addr-cp" value={addressForm.codigo_postal} onChange={e => setAddressForm(p => ({ ...p, codigo_postal: e.target.value }))} className="mt-1.5" />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                          <input
                            type="checkbox"
                            id="addr-default"
                            checked={addressForm.es_predeterminada}
                            onChange={e => setAddressForm(p => ({ ...p, es_predeterminada: e.target.checked }))}
                            className="h-4 w-4 rounded border-border"
                          />
                          <Label htmlFor="addr-default" className="text-sm cursor-pointer">Dirección predeterminada</Label>
                        </div>
                      </div>
                      <div className="mt-6 flex gap-3 justify-end">
                        <Button variant="outline" onClick={handleCancelAddressForm}>Cancelar</Button>
                        <Button onClick={handleSaveAddress} disabled={addressSaving}>
                          {addressSaving ? 'Guardando...' : editingAddressId ? 'Actualizar' : 'Guardar'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {addressesLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : addresses.length === 0 && !showAddressForm ? (
                    <div className="bg-card border border-border rounded-lg p-12 text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No tienes direcciones guardadas</h3>
                      <p className="text-muted-foreground mb-6">Agrega una dirección para facilitar tus compras</p>
                      <Button onClick={() => setShowAddressForm(true)}>
                        <Plus className="h-4 w-4 mr-1.5" />
                        Agregar Dirección
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map(addr => (
                        <div key={addr.id} className={`bg-card border rounded-lg p-6 relative ${addr.es_predeterminada ? 'border-primary' : 'border-border'}`}>
                          {addr.es_predeterminada && (
                            <Badge className="absolute top-4 right-4">Predeterminada</Badge>
                          )}
                          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">{addr.etiqueta}</p>
                          <p className="font-medium text-foreground">{addr.nombre}</p>
                          <p className="text-sm text-muted-foreground mt-1">{addr.direccion}</p>
                          <p className="text-sm text-muted-foreground">{addr.ciudad}, {addr.estado} {addr.codigo_postal}</p>
                          <div className="mt-4 flex gap-3">
                            <button type="button" onClick={() => handleEditAddress(addr)} className="text-sm text-primary hover:underline flex items-center gap-1">
                              <Edit2 className="h-3 w-3" /> Editar
                            </button>
                            {!addr.es_predeterminada && (
                              <button type="button" onClick={() => handleDeleteAddress(addr.id)} className="text-sm text-destructive hover:underline">Eliminar</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'configuracion' && (
                <div className="bg-card border border-border rounded-lg p-6 lg:p-8">
                  <h2 className="text-xl font-medium text-foreground mb-6">Configuración</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Notificaciones por correo</p>
                        <p className="text-sm text-muted-foreground mt-1">Recibe ofertas y novedades en tu correo electrónico</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifEmail}
                          onChange={(e) => handleToggleNotif(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium text-destructive mb-2">Zona de Peligro</h3>
                      <p className="text-sm text-muted-foreground mb-4">Una vez que elimines tu cuenta, no hay vuelta atrás.</p>

                      {showDeleteConfirm ? (
                        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                          <p className="text-sm text-foreground font-medium mb-3">
                            ¿Estás seguro? Se eliminarán permanentemente todos tus datos: pedidos, direcciones, carrito y favoritos.
                          </p>
                          <div className="flex gap-3">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={handleDeleteAccount}
                              disabled={deleting}
                            >
                              {deleting ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowDeleteConfirm(false)}
                              disabled={deleting}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                          Eliminar Cuenta
                        </Button>
                      )}
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
