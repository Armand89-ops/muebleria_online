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
        }
    }

    return NextResponse.json({ received: true })
}