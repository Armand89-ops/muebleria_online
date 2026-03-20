import Link from 'next/link'
import { ChevronRight, Heart, Sparkles } from 'lucide-react'
import { ClientHeader } from '@/components/client-header'
import { Footer } from '@/components/footer'
import { ClientCartSidebar } from '@/components/client-cart-sidebar'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
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
              <span className="text-foreground font-medium">Contacto</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="relative py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-accent font-medium text-sm uppercase tracking-wider mb-4">Conecta con nosotros</p>
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
                ¿Tienes preguntas o sugerencias?
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Nos encantaría escucharte. Estamos aquí para ayudarte a encontrar los muebles perfectos 
                para tu espacio, o simplemente para compartir tus ideas.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Info */}
              <div>
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-8">Contáctanos</h2>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-accent mb-2">Email</p>
                    <a href="mailto:hola@muebleria.com" className="text-foreground hover:text-accent transition-colors">
                      hola@muebleria.com
                    </a>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-accent mb-2">Teléfono</p>
                    <a href="tel:+525512345678" className="text-foreground hover:text-accent transition-colors">
                      +55 1234 5678
                    </a>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-accent mb-2">Ubicación</p>
                    <p className="text-foreground">
                      Ciudad de México, México
                    </p>
                  </div>
                </div>

                <Button asChild className="mt-8">
                  <Link href="/contacto">Envíanos un mensaje</Link>
                </Button>
              </div>

              {/* Values */}
              <div>
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-8">Lo que nos mueve</h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Heart className="h-5 w-5 text-accent" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-2">Pasión por el diseño</h3>
                      <p className="text-sm text-muted-foreground">
                        Cada mueble que compartimos es seleccionado con cuidado pensando en tu bienestar.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-accent" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-2">Calidad real</h3>
                      <p className="text-sm text-muted-foreground">
                        Nos importa que obtengas muebles que duren y hagan tu espacio especial.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-secondary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Explora nuestro catálogo
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Descubre muebles cuidadosamente seleccionados para cada espacio de tu hogar.
            </p>
            <Button asChild size="lg">
              <Link href="/catalogo">Ver catálogo</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
