import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        const authUser = await getCurrentUser();

        if (!authUser) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            );
        }

        const { data: user, error } = await supabase
            .from('usuarios')
            .select('id, nombre, apellido, email, telefono, created_at')
            .eq('id', authUser.userId)
            .single();

        if (error || !user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                telefono: user.telefono,
                created_at: user.created_at,
            },
        });

    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return NextResponse.json(
            { error: 'Error del servidor' },
            { status: 500 }
        );
    }
}
