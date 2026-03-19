"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, User, Heart, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Catálogo', href: '/catalogo' },
  { name: 'Sala', href: '/catalogo?category=living' },
  { name: 'Comedor', href: '/catalogo?category=dining' },
  { name: 'Dormitorio', href: '/catalogo?category=bedroom' },
  { name: 'Oficina', href: '/catalogo?category=office' },
  { name: 'Ofertas', href: '/ofertas' },
  { name: 'Nosotros', href: '/nosotros' },
]

export function MobileMenu() {
  const [mounted, setMounted] = useState(false)
  const { user, isAuthenticated } = useAuth()
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="mr-2 lg:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Abrir menú</span>
      </Button>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
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
  )
}
