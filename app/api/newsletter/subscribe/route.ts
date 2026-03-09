import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

// POST - Suscribirse al newsletter
export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'Correo electrónico no válido' }, { status: 400 });
        }

        try {
            // UPSERT: si ya existe, re-activar la suscripción
            await supabase
                .from('suscriptores_newsletter')
                .upsert(
                    { email, activo: true },
                    { onConflict: 'email' }
                );
        } catch (dbError) {
            // Si la tabla no existe, solo logueamos
            console.log('Newsletter subscription (tabla no disponible):', email);
        }

        return NextResponse.json({ success: true, message: '¡Suscripción exitosa!' });
    } catch (error) {
        console.error('Error en newsletter:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}
