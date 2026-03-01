import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Award, Leaf, Heart, Users } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartSidebar } from '@/components/cart-sidebar'

const values = [
  {
    icon: Award,
    title: 'Calidad Premium',
    description: 'Seleccionamos cuidadosamente los mejores materiales y trabajamos con artesanos expertos para crear piezas que perduran generaciones.',
  },
  {
    icon: Leaf,
    title: 'Sostenibilidad',
    description: 'Utilizamos maderas de bosques certificados y procesos de fabricacion que minimizan el impacto ambiental.',
  },
  {
    icon: Heart,
    title: 'Diseno con Alma',
    description: 'Cada pieza nace de la pasion por crear espacios que inspiran y transmiten calidez en cada detalle.',
  },
  {
    icon: Users,
    title: 'Compromiso al Cliente',
    description: 'Ofrecemos atencion personalizada, garantia de 5 anos y un servicio post-venta que nos distingue.',
  },
]

const stats = [
  { number: '15+', label: 'Anos de experiencia' },
  { number: '50K+', label: 'Clientes satisfechos' },
  { number: '200+', label: 'Disenos exclusivos' },
  { number: '12', label: 'Showrooms en Mexico' },
]

const team = [
  { name: 'Sofia Martinez', role: 'Directora Creativa', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face' },
  { name: 'Carlos Herrera', role: 'Director de Operaciones', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face' },
  { name: 'Ana Rodriguez', role: 'Disenadora Principal', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face' },
  { name: 'Miguel Angel Torres', role: 'Jefe de Produccion', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face' },
]

export default function AboutPage() {
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
              <span className="text-foreground font-medium">Sobre Nosotros</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="relative py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-accent font-medium text-sm uppercase tracking-wider mb-4">Nuestra Historia</p>
                <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
                  Creando hogares con estilo desde 2011
                </h1>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                  LUXE nacio con una vision clara: transformar la forma en que las personas viven 
                  y experimentan sus espacios. Creemos que un buen mueble no solo decora, 
                  sino que cuenta una historia y crea memorias.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Desde nuestro primer taller en la Ciudad de Mexico, hemos crecido hasta 
                  convertirnos en una referencia del diseno de muebles en todo el pais, 
                  manteniendo siempre nuestra esencia artesanal y compromiso con la calidad.
                </p>
              </div>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop"
                  alt="Showroom de LUXE Furniture"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-primary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="font-serif text-4xl lg:text-5xl font-bold text-primary-foreground">{stat.number}</p>
                  <p className="text-sm text-primary-foreground/70 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground text-balance">Nuestros Valores</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Lo que nos impulsa cada dia a crear piezas excepcionales</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map(value => {
                const Icon = value.icon
                return (
                  <div key={value.title} className="text-center">
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-foreground" />
                    </div>
                    <h3 className="font-medium text-foreground text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground text-balance">Nuestro Equipo</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Las personas detras de cada pieza LUXE</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map(member => (
                <div key={member.name} className="text-center">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
