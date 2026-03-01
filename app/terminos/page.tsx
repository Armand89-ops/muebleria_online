import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartSidebar } from '@/components/cart-sidebar'

export default function TerminosPage() {
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
              <span className="text-foreground font-medium">Terminos y Condiciones</span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-2">Terminos y Condiciones</h1>
          <p className="text-sm text-muted-foreground mb-8">Ultima actualizacion: Febrero 2026</p>

          <div className="prose prose-sm max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Aceptacion de los Terminos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Al acceder y utilizar el sitio web de LUXE Furniture, aceptas estar sujeto a estos terminos y condiciones de uso. Si no estas de acuerdo con alguna parte de estos terminos, te solicitamos que no utilices nuestro sitio web.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Productos y Precios</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nos esforzamos por mantener la informacion de nuestros productos precisa y actualizada. Sin embargo, nos reservamos el derecho de corregir cualquier error en precios o descripciones. Los precios mostrados incluyen IVA salvo que se indique lo contrario. Las ofertas y promociones estan sujetas a disponibilidad y pueden cambiar sin previo aviso.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Proceso de Compra</h2>
              <p className="text-muted-foreground leading-relaxed">
                Al realizar un pedido, nos envias una oferta de compra. Te enviaremos una confirmacion de pedido por correo electronico, lo cual constituye la aceptacion del contrato de compra. Nos reservamos el derecho de rechazar o cancelar cualquier pedido por motivos de disponibilidad, errores de precio u otras circunstancias justificadas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Envio y Entrega</h2>
              <p className="text-muted-foreground leading-relaxed">
                Los plazos de entrega son estimaciones y pueden variar segun la ubicacion y disponibilidad del producto. El envio es gratuito para pedidos superiores a $5,000 MXN dentro de la Republica Mexicana. Los muebles grandes requieren entrega especial y pueden tener tiempos de entrega extendidos. Es responsabilidad del cliente verificar las dimensiones del producto y el acceso al domicilio de entrega.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Devoluciones y Cambios</h2>
              <p className="text-muted-foreground leading-relaxed">
                Aceptamos devoluciones dentro de los 30 dias posteriores a la entrega, siempre que el producto se encuentre en su estado original, sin usar y en su empaque original. Los costos de devolucion corren por cuenta del cliente, salvo en casos de productos defectuosos o envio incorrecto. Los reembolsos se procesan dentro de los 10 dias habiles posteriores a la recepcion del producto devuelto.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Garantia</h2>
              <p className="text-muted-foreground leading-relaxed">
                Todos nuestros muebles cuentan con una garantia de 5 anos contra defectos de fabricacion. Esta garantia cubre defectos estructurales y de materiales bajo uso normal. No cubre danos por uso indebido, accidentes, modificaciones no autorizadas o desgaste natural. Para hacer efectiva la garantia, es necesario presentar el comprobante de compra.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Metodos de Pago</h2>
              <p className="text-muted-foreground leading-relaxed">
                Aceptamos tarjetas de credito y debito (Visa, MasterCard, American Express), transferencias bancarias y pagos en meses sin intereses con tarjetas participantes. Todos los pagos se procesan a traves de pasarelas seguras con encriptacion SSL.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Propiedad Intelectual</h2>
              <p className="text-muted-foreground leading-relaxed">
                Todo el contenido de este sitio web, incluyendo textos, imagenes, logos, disenos y software, es propiedad de LUXE Furniture o de sus proveedores de contenido y esta protegido por las leyes de propiedad intelectual aplicables. Queda prohibida la reproduccion total o parcial sin autorizacion previa por escrito.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Limitacion de Responsabilidad</h2>
              <p className="text-muted-foreground leading-relaxed">
                LUXE Furniture no sera responsable por danos indirectos, incidentales o consecuentes que surjan del uso de nuestro sitio web o de la compra de nuestros productos, salvo en los casos previstos por la ley.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Contacto</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para cualquier pregunta sobre estos terminos y condiciones, puedes contactarnos a traves de nuestro <Link href="/contacto" className="text-accent hover:underline">formulario de contacto</Link> o al correo legal@luxefurniture.com.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
