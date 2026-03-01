import Link from 'next/link'

const footerLinks = {
  productos: [
    { name: 'Sala', href: '/catalogo?category=living' },
    { name: 'Comedor', href: '/catalogo?category=dining' },
    { name: 'Dormitorio', href: '/catalogo?category=bedroom' },
    { name: 'Oficina', href: '/catalogo?category=office' },
  ],
  empresa: [
    { name: 'Sobre Nosotros', href: '/nosotros' },
    { name: 'Contacto', href: '/contacto' },
    { name: 'Preguntas Frecuentes', href: '/faq' },
    { name: 'Ofertas', href: '/ofertas' },
  ],
  ayuda: [
    { name: 'Mi Cuenta', href: '/cuenta' },
    { name: 'Mis Pedidos', href: '/cuenta' },
    { name: 'Envios y Entregas', href: '/faq' },
    { name: 'Devoluciones y Garantia', href: '/faq' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-3xl font-bold mb-4">LUXE</h2>
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-md">
              Transformamos espacios con muebles de diseño exclusivo. 
              Cada pieza es una declaración de estilo y calidad que perdura en el tiempo.
            </p>
            <div className="mt-6">
              <p className="text-sm text-primary-foreground/70">Suscríbete a nuestro newsletter</p>
              <form className="mt-2 flex gap-2">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 px-4 py-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-md text-sm placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-foreground text-primary text-sm font-medium rounded-md hover:bg-primary-foreground/90 transition-colors"
                >
                  Suscribir
                </button>
              </form>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Productos</h3>
            <ul className="space-y-3">
              {footerLinks.productos.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Ayuda</h3>
            <ul className="space-y-3">
              {footerLinks.ayuda.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-primary-foreground/50">
              {new Date().getFullYear()} LUXE Furniture. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <Link href="/privacidad" className="text-xs text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                Privacidad
              </Link>
              <Link href="/terminos" className="text-xs text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                Terminos
              </Link>
              <Link href="/cookies" className="text-xs text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
