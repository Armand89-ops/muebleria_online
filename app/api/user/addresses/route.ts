import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET - Obtener direcciones
export async function GET() {
    const authUser = await getCurrentUser();
    if (!authUser) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    try {
        const { data, error } = await supabase
            .from('usuario_direcciones')
            .select('id, etiqueta, nombre, direccion, ciudad, estado, codigo_postal, es_predeterminada')
            .eq('usuario_id', authUser.userId)
            .order('es_predeterminada', { ascending: false })
            .order('id', { ascending: true });

        if (error) throw error;
        return NextResponse.json(data || []);
    } catch (error) {
        console.error('Error al obtener direcciones:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

// POST - Agregar dirección
export async function POST(request: Request) {
    const authUser = await getCurrentUser();
    if (!authUser) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    try {
        const { etiqueta, nombre, direccion, ciudad, estado, codigo_postal, es_predeterminada } = await request.json();

        // Si es predeterminada, quitar la anterior
        if (es_predeterminada) {
            await supabase
                .from('usuario_direcciones')
                .update({ es_predeterminada: false })
                .eq('usuario_id', authUser.userId);
        }

        const { data, error } = await supabase
            .from('usuario_direcciones')
            .insert({
                usuario_id: authUser.userId,
                etiqueta: etiqueta || 'Casa',
                nombre,
                direccion,
                ciudad,
                estado,
                codigo_postal,
                es_predeterminada: es_predeterminada || false,
            })
            .select('id')
            .single();

        if (error) throw error;

        return NextResponse.json({ id: data?.id, message: 'Dirección agregada' }, { status: 201 });
    } catch (error) {
        console.error('Error al agregar dirección:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

// PUT - Actualizar dirección
export async function PUT(request: Request) {
    const authUser = await getCurrentUser();
    if (!authUser) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    try {
        const { id, etiqueta, nombre, direccion, ciudad, estado, codigo_postal, es_predeterminada } = await request.json();

        if (es_predeterminada) {
            await supabase
                .from('usuario_direcciones')
                .update({ es_predeterminada: false })
                .eq('usuario_id', authUser.userId);
        }

        await supabase
            .from('usuario_direcciones')
            .update({
                etiqueta,
                nombre,
                direccion,
                ciudad,
                estado,
                codigo_postal,
                es_predeterminada: es_predeterminada || false,
            })
            .eq('id', id)
            .eq('usuario_id', authUser.userId);

        return NextResponse.json({ message: 'Dirección actualizada' });
    } catch (error) {
        console.error('Error al actualizar dirección:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

// DELETE - Eliminar dirección
export async function DELETE(request: Request) {
    const authUser = await getCurrentUser();
    if (!authUser) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        await supabase
            .from('usuario_direcciones')
            .delete()
            .eq('id', id)
            .eq('usuario_id', authUser.userId);

        return NextResponse.json({ message: 'Dirección eliminada' });
    } catch (error) {
        console.error('Error al eliminar dirección:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}
