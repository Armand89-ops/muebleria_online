import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')!

    let event
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch {
        return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        const usuarioId = session.metadata?.usuario_id

        // Crear pedido en Supabase
        const codigo = `LUXE-${Date.now()}`
        const { data: pedido } = await supabaseAdmin
            .from('pedidos')
            .insert({
                usuario_id: Number(usuarioId),
                codigo,
                subtotal: session.amount_total! / 100,
                envio: 0,
                impuesto: 0,
                total: session.amount_total! / 100,
                estado: 'procesando',
            })
            .select('id')
            .single()

        // Registrar transacción
        if (pedido) {
            await supabaseAdmin.from('transacciones').insert({
                pedido_id: pedido.id,
                usuario_id: Number(usuarioId),
                monto: session.amount_total! / 100,
                metodo_pago: 'tarjeta',
                estado: 'completado',
                referencia_externa: session.id,
            })

            // Obtener los productos que se compraron desde Stripe
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { expand: ['data.price.product'] })
            
            for (const item of lineItems.data) {
                const product = item.price?.product as any;
                const productoId = product?.metadata?.producto_id;
                const cantidad = item.quantity || 1;

                // Insertar el detalle del pedido
                await supabaseAdmin
                    .from('pedido_items')
                    .insert({
                        pedido_id: pedido.id,
                        producto_id: productoId ? Number(productoId) : null,
                        nombre_producto: product?.name || 'Producto',
                        precio: (item.price?.unit_amount || 0) / 100,
                        cantidad: cantidad,
                        imagen: product?.images?.[0] || null,
                    })

                // Reducir stock si tenemos el ID del producto
                if (productoId) {
                    const { data: currentProduct } = await supabaseAdmin
                        .from('productos')
                        .select('stock')
                        .eq('id', Number(productoId))
                        .single()

                    if (currentProduct && currentProduct.stock != null) {
                        const newStock = Math.max(currentProduct.stock - cantidad, 0)
                        await supabaseAdmin
                            .from('productos')
                            .update({ stock: newStock, inStock: newStock > 0 })
                            .eq('id', Number(productoId))
                    }
                }
            }

            // Si hay un usuario registrado, limpiar su carrito
            if (usuarioId && !isNaN(Number(usuarioId))) {
                await supabaseAdmin
                    .from('usuario_carrito')
                    .delete()
                    .eq('usuario_id', Number(usuarioId))
            }

            // Obtener email del usuario (lo necesitamos para enviar el recibo)
            const { data: usuario } = await supabaseAdmin
                .from('usuarios')
                .select('email, nombre')
                .eq('id', Number(usuarioId))
                .single()

            if (usuario && usuario.email) {
                try {
                    const { resend } = await import('@/lib/resend')
                    await resend.emails.send({
                        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
                        to: usuario.email,
                        subject: `📦 Confirmación de pedido ${codigo} — Mueblería Online`,
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                                <div style="background: #1a1a1a; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
                                    <h1 style="color: #f5f0e8; margin: 0; font-size: 24px;">MADERA VIVA DESING</h1>
                                </div>
                                <div style="background: #fafaf8; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e8e4dc;">
                                    <h2 style="color: #1a1a1a; margin-top: 0;">¡Gracias por tu compra, ${usuario.nombre}!</h2>
                                    <p style="color: #555; line-height: 1.6;">Tu pedido <strong>${codigo}</strong> ha sido confirmado y está siendo procesado.</p>
                                    <div style="background: #fff; padding: 16px; border: 1px solid #eee; border-radius: 4px; margin: 24px 0;">
                                        <p style="margin: 0; color: #555;"><strong>Total pagado:</strong> $${(session.amount_total! / 100).toFixed(2)}</p>
                                        <p style="margin: 8px 0 0 0; color: #555;"><strong>Método de pago:</strong> Tarjeta de crédito/débito</p>
                                    </div>
                                    <div style="text-align: center; margin: 32px 0;">
                                        <a href="\${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cuenta"
                                           style="background: #1a1a1a; color: white; padding: 14px 32px;
                                                  text-decoration: none; border-radius: 6px; display: inline-block;
                                                  font-size: 16px; font-weight: bold;">
                                            Ver detalles de mi pedido
                                        </a>
                                    </div>
                                    <p style="color: #888; font-size: 13px;">Te enviaremos otro correo cuando tu pedido sea enviado.</p>
                                </div>
                            </div>
                        `,
                    })
                    console.log('✅ Correo de confirmación de pedido enviado')
                } catch (emailError) {
                    console.error('❌ Error enviando correo de confirmación de pedido:', emailError)
                }
            }
        }
    }

    return NextResponse.json({ received: true })
}