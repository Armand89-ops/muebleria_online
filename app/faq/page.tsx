import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ClientHeader } from '@/components/client-header'
import { Footer } from '@/components/footer'
import { ClientCartSidebar } from '@/components/client-cart-sidebar'

const faqCategories = [
  {
    title: 'Pedidos y Compras',
    questions: [
      {
        q: 'Como puedo realizar un pedido?',
        a: 'Puedes realizar tu pedido directamente en nuestra tienda en linea. Navega por nuestro catalogo, selecciona los productos que deseas, agregalos al carrito y sigue el proceso de checkout. Aceptamos tarjetas de credito, debito y transferencias bancarias.',
      },
      {
        q: 'Puedo modificar o cancelar un pedido ya realizado?',
        a: 'Si, puedes modificar o cancelar tu pedido dentro de las primeras 24 horas despues de haberlo realizado. Contacta a nuestro equipo de atencion al cliente por correo o telefono para procesar el cambio.',
      },
      {
        q: 'Cuales son los metodos de pago aceptados?',
        a: 'Aceptamos tarjetas Visa, Mastercard y American Express, tanto de credito como debito. Tambien aceptamos transferencias bancarias y pagos a meses sin intereses con tarjetas participantes.',
      },
      {
        q: 'Ofrecen opciones de financiamiento?',
        a: 'Si, ofrecemos hasta 12 meses sin intereses con tarjetas de credito participantes. Tambien contamos con un plan de pago diferido para compras mayores a $10,000 MXN.',
      },
    ],
  },
  {
    title: 'Envios y Entregas',
    questions: [
      {
        q: 'Cual es el costo de envio?',
        a: 'El envio estandar es gratuito en pedidos mayores a $5,000 MXN. Para pedidos menores, el costo se calcula segun la distancia y el peso del paquete. Tambien ofrecemos opciones de envio express.',
      },
      {
        q: 'Cuanto tiempo tarda la entrega?',
        a: 'El envio estandar tarda entre 5 y 7 dias habiles. El envio express toma 2-3 dias habiles. Para muebles de gran tamano o pedidos personalizados, el tiempo puede extenderse a 2-3 semanas.',
      },
      {
        q: 'Hacen entregas a domicilio con instalacion?',
        a: 'Si, nuestro servicio de entrega premium incluye llevar los muebles hasta la habitacion deseada e instalacion completa. Este servicio tiene un costo adicional que varia segun la complejidad del armado.',
      },
      {
        q: 'Realizan envios a toda la Republica Mexicana?',
        a: 'Si, realizamos envios a todas las ciudades principales de Mexico. Para localidades remotas, consulta disponibilidad y tiempos de entrega con nuestro equipo de atencion al cliente.',
      },
    ],
  },
  {
    title: 'Devoluciones y Garantia',
    questions: [
      {
        q: 'Cual es la politica de devoluciones?',
        a: 'Tienes 30 dias a partir de la entrega para devolver cualquier producto en su estado original. Nosotros cubrimos el costo del envio de devolucion y procesamos el reembolso en 5-10 dias habiles.',
      },
      {
        q: 'Que cubre la garantia?',
        a: 'Todos nuestros muebles cuentan con 5 anos de garantia que cubre defectos de fabricacion y materiales. La garantia no cubre danos por uso inadecuado, exposicion a la intemperie o desgaste normal.',
      },
      {
        q: 'Como inicio un proceso de devolucion?',
        a: 'Contacta a nuestro equipo de atencion al cliente con tu numero de pedido. Programaremos la recoleccion del producto y una vez recibido en buen estado, procesaremos tu reembolso al metodo de pago original.',
      },
    ],
  },
  {
    title: 'Productos y Cuidado',
    questions: [
      {
        q: 'Que materiales utilizan en sus muebles?',
        a: 'Trabajamos con maderas selectas como roble, nogal, fresno y haya, ademas de marmol, acero inoxidable y tapizados premium como terciopelo, lino y cuero genuino. Todos nuestros materiales son de alta calidad.',
      },
      {
        q: 'Como debo cuidar mis muebles de madera?',
        a: 'Limpia con un pano suave y seco. Evita la exposicion directa al sol y la humedad excesiva. Aplica aceite para madera cada 6 meses. No coloques objetos calientes directamente sobre la superficie.',
      },
      {
        q: 'Ofrecen servicio de diseno o asesoria?',
        a: 'Si, nuestro equipo de disenadores puede asesorarte de forma gratuita para encontrar las piezas perfectas para tu espacio. Agenda una cita en cualquiera de nuestros showrooms o solicita una consulta virtual.',
      },
      {
        q: 'Puedo personalizar un mueble?',
        a: 'Algunos de nuestros productos permiten personalizacion en colores, telas y dimensiones. Consulta la disponibilidad de personalizacion en la pagina de cada producto o contacta a nuestro equipo.',
      },
    ],
  },
]

export default function FaqPage() {
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
              <span className="text-foreground font-medium">Preguntas Frecuentes</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground text-balance">Preguntas Frecuentes</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Encuentra respuestas a las preguntas mas comunes sobre nuestros productos, envios, pagos y mas.
            </p>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="pb-16 lg:pb-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-10">
              {faqCategories.map(category => (
                <div key={category.title}>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">{category.title}</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.title}-${index}`}>
                        <AccordionTrigger className="text-left text-foreground hover:text-accent">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-16 bg-primary rounded-lg p-8 text-center">
              <h3 className="font-serif text-xl font-bold text-primary-foreground mb-2">
                No encontraste lo que buscabas?
              </h3>
              <p className="text-primary-foreground/70 text-sm mb-6">
                Nuestro equipo esta listo para ayudarte con cualquier duda.
              </p>
              <Button asChild variant="secondary">
                <Link href="/contacto">Contactanos</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
