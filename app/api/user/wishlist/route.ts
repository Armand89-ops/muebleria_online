import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET - Obtener favoritos
export async function GET() {
    const authUser = await getCurrentUser();
    if (!authUser) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    try {
        const { data, error } = await supabase
            .from('usuario_favoritos')
            .select(`
                productos (
                    id, name, description, price, "originalPrice",
                    category, subcategory, image, rating, reviews,
                    "inStock", featured, is_new
                )
            `)
            .eq('usuario_id', authUser.userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Flatten the joined data
        const rows = (data || []).map(item => (item.productos as any));
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

// POST - Agregar a favoritos
export async function POST(request: Request) {
    const authUser = await getCurrentUser();
    if (!authUser) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    try {
        const { producto_id } = await request.json();

        await supabase
            .from('usuario_favoritos')
            .upsert(
                { usuario_id: authUser.userId, producto_id },
                { onConflict: 'usuario_id,producto_id' }
            );

        return NextResponse.json({ message: 'Agregado a favoritos' }, { status: 201 });
    } catch (error) {
        console.error('Error al agregar a favoritos:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

// DELETE - Eliminar de favoritos
export async function DELETE(request: Request) {
    const authUser = await getCurrentUser();
    if (!authUser) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    try {
        const url = new URL(request.url);
        const productoId = url.searchParams.get('producto_id');

        await supabase
            .from('usuario_favoritos')
            .delete()
            .eq('usuario_id', authUser.userId)
            .eq('producto_id', productoId);

        return NextResponse.json({ message: 'Eliminado de favoritos' });
    } catch (error) {
        console.error('Error al eliminar de favoritos:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}
