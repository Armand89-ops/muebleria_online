import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClientHeader } from '@/components/client-header'
import { Footer } from '@/components/footer'
import { ClientCartSidebar } from '@/components/client-cart-sidebar'
import { ProductCard } from '@/components/product-card'
import { categories, products as fallbackProducts } from '@/lib/products'
import { ProductsService } from './services/products.service'

export default async function HomePage() {
  let featuredProducts;
  let newProducts;

  try {
    featuredProducts = await ProductsService.getFeatured();
    newProducts = await ProductsService.getAll();
  } catch (error) {
    console.error('Error al conectar con la BD, usando datos de respaldo:', error);
    featuredProducts = fallbackProducts.filter(p => p.featured);
    newProducts = fallbackProducts.filter(p => p.new);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ClientHeader />
      <ClientCartSidebar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&h=1080&fit=crop"
              alt="Interior elegante con muebles de diseño"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-foreground/40" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-2xl">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
                Diseño que transforma espacios
              </h1>
              <p className="mt-6 text-lg text-white/90 leading-relaxed max-w-xl">
                Descubre nuestra colección exclusiva de muebles artesanales.
                Cada pieza cuenta una historia de elegancia y confort.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90">
                  <Link href="/catalogo">
                    Explorar Colección
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 bg-transparent">
                  <Link href="#categorias">Ver Categorías</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 bg-card border-y border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Pago Seguro', desc: 'Transacciones encriptadas' },
                { title: 'Atención 24/7', desc: 'Soporte personalizado' },
                { title: 'Devoluciones', desc: '30 días para devolver' },
              ].map((feature) => (
                <div key={feature.title} className="text-center">
                  <h3 className="font-medium text-card-foreground">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="categorias" className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                Explora por Categoría
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Encuentra los muebles perfectos para cada espacio de tu hogar
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => {
                const images = [
                  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=800&fit=crop',
                  'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=800&fit=crop',
                  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=800&fit=crop',
                  'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=800&fit=crop',
                ]
                return (
                  <Link
                    key={category.id}
                    href={`/catalogo?category=${category.id}`}
                    className="group relative aspect-[3/4] rounded-lg overflow-hidden"
                  >
                    <Image
                      src={images[index] || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-serif text-2xl font-bold text-white">
                        {category.name}
                      </h3>
                      <p className="mt-2 text-sm text-white/80">
                        {category.subcategories.length} subcategorías
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
              <div>
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                  Productos Destacados
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Nuestras piezas más populares, elegidas por nuestros clientes
                </p>
              </div>
              <Button asChild variant="link" className="mt-4 sm:mt-0">
                <Link href="/catalogo">
                  Ver todo
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        {newProducts.length > 0 && (
          <section className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
                <div>
                  <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                    Nuevos Ingresos
                  </h2>
                  <p className="mt-4 text-muted-foreground">
                    Las últimas incorporaciones a nuestra colección
                  </p>
                </div>
                <Button asChild variant="link" className="mt-4 sm:mt-0">
                  <Link href="/catalogo?new=true">
                    Ver todo
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-balance">
              Diseñamos el hogar de tus sueños
            </h2>
            <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
              Nuestro equipo de diseñadores está listo para ayudarte a crear
              espacios únicos que reflejen tu personalidad y estilo de vida.
            </p>
            <Button asChild size="lg" className="mt-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link href="/catalogo">
                Comenzar Ahora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
