import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

// POST - Recibir mensaje de contacto
export async function POST(request: Request) {
    try {
        const { nombre, email, telefono, asunto, numeroPedido, mensaje } = await request.json();

        // Validación básica
        if (!nombre || !email || !asunto || !mensaje) {
            return NextResponse.json(
                { error: 'Nombre, email, asunto y mensaje son obligatorios' },
                { status: 400 }
            );
        }

        // Guardar en BD
        try {
            await supabase
                .from('mensajes_contacto')
                .insert({
                    nombre,
                    email,
                    telefono: telefono || null,
                    asunto,
                    numero_pedido: numeroPedido || null,
                    mensaje,
                });
        } catch (dbError) {
            // Si la tabla no existe, solo logueamos el mensaje
            console.log('Mensaje de contacto recibido (tabla no disponible):', {
                nombre, email, telefono, asunto, numeroPedido, mensaje,
                timestamp: new Date().toISOString(),
            });
        }

        return NextResponse.json({ success: true, message: 'Mensaje recibido correctamente' });
    } catch (error) {
        console.error('Error en contacto:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}
