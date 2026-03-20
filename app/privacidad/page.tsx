import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ClientHeader } from '@/components/client-header'
import { Footer } from '@/components/footer'
import { ClientCartSidebar } from '@/components/client-cart-sidebar'

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ClientHeader />
      <ClientCartSidebar />

      <main className="flex-1">
        <div className="bg-secondary py-3">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Inicio</Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Politica de Privacidad</span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-2">Politica de Privacidad</h1>
          <p className="text-sm text-muted-foreground mb-8">Ultima actualizacion: Febrero 2026</p>

          <div className="prose prose-sm max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Informacion que Recopilamos</h2>
              <p className="text-muted-foreground leading-relaxed">
                En LUXE Furniture recopilamos informacion personal que nos proporcionas directamente al realizar compras, crear una cuenta o contactarnos. Esta informacion puede incluir tu nombre, direccion de correo electronico, direccion postal, numero de telefono e informacion de pago.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Tambien recopilamos informacion automaticamente cuando navegas en nuestro sitio, incluyendo tu direccion IP, tipo de navegador, paginas visitadas y tiempo de permanencia.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Uso de la Informacion</h2>
              <p className="text-muted-foreground leading-relaxed">Utilizamos tu informacion personal para:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
                <li>Procesar y gestionar tus pedidos</li>
                <li>Enviar confirmaciones de pedido y actualizaciones de envio</li>
                <li>Responder a tus consultas y solicitudes de soporte</li>
                <li>Personalizar tu experiencia de compra</li>
                <li>Enviarte comunicaciones de marketing (con tu consentimiento)</li>
                <li>Mejorar nuestro sitio web y servicios</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Proteccion de Datos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Implementamos medidas de seguridad tecnicas y organizativas apropiadas para proteger tu informacion personal contra acceso no autorizado, alteracion, divulgacion o destruccion. Toda la informacion de pago se procesa a traves de pasarelas de pago seguras con encriptacion SSL.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Compartir Informacion</h2>
              <p className="text-muted-foreground leading-relaxed">
                No vendemos ni alquilamos tu informacion personal a terceros. Podemos compartir tu informacion con proveedores de servicios de confianza que nos asisten en la operacion de nuestro negocio, como empresas de envio, procesadores de pago y servicios de atencion al cliente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Tus Derechos</h2>
              <p className="text-muted-foreground leading-relaxed">Tienes derecho a:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
                <li>Acceder a tu informacion personal</li>
                <li>Rectificar datos inexactos</li>
                <li>Solicitar la eliminacion de tus datos</li>
                <li>Oponerte al procesamiento de tus datos</li>
                <li>Retirar tu consentimiento en cualquier momento</li>
                <li>Presentar una queja ante la autoridad de proteccion de datos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Retencion de Datos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Conservamos tu informacion personal durante el tiempo necesario para cumplir con los propositos descritos en esta politica, a menos que la ley exija un periodo de retencion mas largo. Los datos de transacciones se conservan por un minimo de 5 anos para cumplir con obligaciones fiscales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Contacto</h2>
              <p className="text-muted-foreground leading-relaxed">
                Si tienes preguntas sobre esta politica de privacidad o deseas ejercer tus derechos, puedes contactarnos a traves de nuestro <Link href="/contacto" className="text-accent hover:underline">formulario de contacto</Link> o enviando un correo a privacidad@luxefurniture.com.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
