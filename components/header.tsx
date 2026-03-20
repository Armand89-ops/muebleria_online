"use client"

import React, { useState, useEffect } from "react"
import Link from 'next/link'
import { Search, ShoppingBag, Menu, X, User, Heart, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/context/cart-context'
import { useWishlist } from '@/context/wishlist-context'
import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Catálogo', href: '/catalogo' },
  { name: 'Sala', href: '/catalogo?category=living' },
  { name: 'Comedor', href: '/catalogo?category=dining' },
  { name: 'Dormitorio', href: '/catalogo?category=bedroom' },
  { name: 'Oficina', href: '/catalogo?category=office' },
  { name: 'Ofertas', href: '/ofertas' },
]

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { totalItems, openCart } = useCart()
  const { totalItems: wishlistTotal } = useWishlist()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/catalogo?search=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu */}
          {mounted ? (
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <SheetDescription className="sr-only">Menú de navegación del sitio</SheetDescription>
              <nav className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium text-foreground hover:text-accent transition-colors py-2"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="border-t border-border pt-4 mt-2">
                  {isAuthenticated ? (
                    <>
                      <Link href="/cuenta" className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-accent transition-colors py-2">
                        <User className="h-5 w-5" /> {user?.nombre || 'Mi Cuenta'}
                      </Link>
                      <Link href="/cuenta?tab=favoritos" className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-accent transition-colors py-2">
                        <Heart className="h-5 w-5" /> Favoritos
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-accent transition-colors py-2">
                        <LogIn className="h-5 w-5" /> Iniciar Sesión
                      </Link>
                      <Link href="/registro" className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-accent transition-colors py-2">
                        <User className="h-5 w-5" /> Crear Cuenta
                      </Link>
                    </>
                  )}
                  <Link href="/contacto" className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-accent transition-colors py-2">
                    Contacto
                  </Link>
                  <Link href="/faq" className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-accent transition-colors py-2">
                    Ayuda
                  </Link>
                </div>
              </nav>
            </SheetContent>
            </Sheet>
          ) : (
            <Button variant="ghost" size="icon" className="mr-2 lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          )}

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
              LUXE
            </h1>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex lg:gap-8 lg:ml-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-40 sm:w-64 h-9"
                  autoFocus
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Buscar</span>
              </Button>
            )}

            {/* Wishlist */}
            <Link href="/cuenta?tab=favoritos" className="hidden sm:flex">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistTotal > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center font-medium">
                    {wishlistTotal}
                  </span>
                )}
                <span className="sr-only">Favoritos</span>
              </Button>
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <Link href="/cuenta" className="hidden sm:flex">
                <Button variant="ghost" size="icon" className="relative">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {user?.nombre?.[0]}{user?.apellido?.[0]}
                  </div>
                  <span className="sr-only">Mi cuenta</span>
                </Button>
              </Link>
            ) : (
              <Link href="/login" className="hidden sm:flex">
                <Button variant="ghost" size="sm" className="gap-1.5 text-sm">
                  <LogIn className="h-4 w-4" />
                  Ingresar
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Carrito</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
