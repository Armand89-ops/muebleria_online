import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartSidebar } from '@/components/cart-sidebar'

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartSidebar />

      <main className="flex-1">
        <div className="bg-secondary py-3">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Inicio</Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Politica de Cookies</span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-2">Politica de Cookies</h1>
          <p className="text-sm text-muted-foreground mb-8">Ultima actualizacion: Febrero 2026</p>

          <div className="prose prose-sm max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Que son las Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Las cookies son pequenos archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web. Nos ayudan a recordar tus preferencias, mejorar tu experiencia de navegacion y proporcionarte contenido personalizado.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Tipos de Cookies que Utilizamos</h2>
              
              <div className="space-y-4 mt-4">
                <div className="bg-secondary rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">Cookies Esenciales</h3>
                  <p className="text-sm text-muted-foreground">Necesarias para el funcionamiento basico del sitio web, como el carrito de compras y el inicio de sesion. No pueden ser desactivadas.</p>
                </div>

                <div className="bg-secondary rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">Cookies de Rendimiento</h3>
                  <p className="text-sm text-muted-foreground">Nos permiten analizar como utilizas nuestro sitio web para mejorar su rendimiento y funcionalidad. Recopilan informacion anonima.</p>
                </div>

                <div className="bg-secondary rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">Cookies de Funcionalidad</h3>
                  <p className="text-sm text-muted-foreground">Recuerdan tus preferencias como idioma, region y configuracion de visualizacion para ofrecer una experiencia mas personalizada.</p>
                </div>

                <div className="bg-secondary rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-1">Cookies de Marketing</h3>
                  <p className="text-sm text-muted-foreground">Utilizadas para mostrar anuncios relevantes basados en tus intereses y medir la efectividad de nuestras campanas publicitarias.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Cookies de Terceros</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nuestro sitio puede utilizar cookies de terceros para analisis (Google Analytics), procesamiento de pagos y funciones de redes sociales. Estos terceros tienen sus propias politicas de privacidad que te recomendamos consultar.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Gestion de Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Puedes gestionar y eliminar cookies a traves de la configuracion de tu navegador. Ten en cuenta que desactivar ciertas cookies puede afectar la funcionalidad de nuestro sitio web. A continuacion, los enlaces de ayuda de los navegadores mas populares:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
                <li>Google Chrome: Configuracion &gt; Privacidad y seguridad &gt; Cookies</li>
                <li>Mozilla Firefox: Opciones &gt; Privacidad y seguridad</li>
                <li>Safari: Preferencias &gt; Privacidad</li>
                <li>Microsoft Edge: Configuracion &gt; Cookies y permisos del sitio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Actualizaciones</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos actualizar esta politica de cookies periodicamente. Te notificaremos de cualquier cambio significativo a traves de nuestro sitio web. Te recomendamos revisar esta pagina periodicamente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Contacto</h2>
              <p className="text-muted-foreground leading-relaxed">
                Si tienes preguntas sobre nuestra politica de cookies, puedes contactarnos a traves de nuestro <Link href="/contacto" className="text-accent hover:underline">formulario de contacto</Link>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
