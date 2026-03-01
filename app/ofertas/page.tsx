"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ChevronRight, Tag, Clock, Percent } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartSidebar } from '@/components/cart-sidebar'
import { ProductCard } from '@/components/product-card'
import { products } from '@/lib/products'

export default function OfertasPage() {
  const [sortBy, setSortBy] = useState<'discount' | 'price-asc' | 'price-desc'>('discount')

  const discountProducts = useMemo(() => {
    const filtered = products.filter(p => p.originalPrice && p.originalPrice > p.price)

    switch (sortBy) {
      case 'price-asc':
        return filtered.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return filtered.sort((a, b) => b.price - a.price)
      case 'discount':
      default:
        return filtered.sort((a, b) => {
          const discA = ((a.originalPrice! - a.price) / a.originalPrice!) * 100
          const discB = ((b.originalPrice! - b.price) / b.originalPrice!) * 100
          return discB - discA
        })
    }
  }, [sortBy])

  const totalSavings = discountProducts.reduce((acc, p) => acc + (p.originalPrice! - p.price), 0)

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(price)

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
              <span className="text-foreground font-medium">Ofertas</span>
            </nav>
          </div>
        </div>

        {/* Hero Banner */}
        <section className="bg-primary text-primary-foreground py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4 bg-accent text-accent-foreground">
              <Tag className="h-3 w-3 mr-1" />
              Ofertas Exclusivas
            </Badge>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
              Grandes Descuentos en Muebles de Diseno
            </h1>
            <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
              Aprovecha nuestras ofertas especiales en piezas seleccionadas. 
              Renueva tu hogar con hasta un 20% de descuento.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>Ofertas por tiempo limitado</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Percent className="h-4 w-4" />
                <span>Ahorra hasta {formatPrice(totalSavings)} en total</span>
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <p className="text-muted-foreground">
              {discountProducts.length} producto{discountProducts.length !== 1 ? 's' : ''} en oferta
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ordenar:</span>
              <div className="flex border border-border rounded-md overflow-hidden">
                {[
                  { value: 'discount' as const, label: 'Mayor descuento' },
                  { value: 'price-asc' as const, label: 'Menor precio' },
                  { value: 'price-desc' as const, label: 'Mayor precio' },
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSortBy(option.value)}
                    className={`px-3 py-1.5 text-sm transition-colors ${
                      sortBy === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {discountProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {discountProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-medium text-foreground mb-2">No hay ofertas disponibles</h2>
              <p className="text-muted-foreground mb-6">Vuelve pronto para descubrir nuevas promociones</p>
              <Button asChild>
                <Link href="/catalogo">Ver Catalogo Completo</Link>
              </Button>
            </div>
          )}

          {/* Promo Banner */}
          <section className="mt-16 bg-secondary rounded-lg p-8 lg:p-12 text-center">
            <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-3 text-balance">
              Suscribete y recibe un 10% en tu primera compra
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Unete a nuestro newsletter para recibir ofertas exclusivas, novedades y un descuento especial de bienvenida.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-2.5 bg-card border border-border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button type="submit">Suscribirme</Button>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
