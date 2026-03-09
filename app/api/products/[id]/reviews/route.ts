import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET - Obtener reseñas de un producto
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // Get reviews with user info
        const { data: reviews, error } = await supabase
            .from('producto_resenas')
            .select(`
                id, calificacion, titulo, comentario, created_at,
                usuarios ( nombre, apellido )
            `)
            .eq('producto_id', id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Flatten the joined user data
        const formattedReviews = (reviews || []).map(r => ({
            id: r.id,
            calificacion: r.calificacion,
            titulo: r.titulo,
            comentario: r.comentario,
            created_at: r.created_at,
            nombre: (r.usuarios as any)?.nombre || '',
            apellido: (r.usuarios as any)?.apellido || '',
        }));

        // Check if current user has already reviewed
        let userReview = null;
        let userHasPurchased = false;
        const authUser = await getCurrentUser();
        if (authUser) {
            const { data: existing } = await supabase
                .from('producto_resenas')
                .select('id')
                .eq('producto_id', id)
                .eq('usuario_id', authUser.userId)
                .single();
            userReview = !!existing;

            // Check if user has purchased this product
            const { data: purchases } = await supabase
                .from('pedido_items')
                .select('id, pedidos!inner(usuario_id)')
                .eq('producto_id', id)
                .eq('pedidos.usuario_id', authUser.userId)
                .limit(1);
            userHasPurchased = (purchases || []).length > 0;
        }

        return NextResponse.json({ reviews: formattedReviews, userHasReviewed: userReview, userHasPurchased });
    } catch (error) {
        console.error('Error al obtener reseñas:', error);
        return NextResponse.json({ reviews: [], userHasReviewed: false });
    }
}

// POST - Crear una reseña
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const authUser = await getCurrentUser();
    if (!authUser) {
        return NextResponse.json({ error: 'Debes iniciar sesión para dejar una reseña' }, { status: 401 });
    }

    try {
        const { calificacion, titulo, comentario } = await request.json();

        if (!calificacion || calificacion < 1 || calificacion > 5) {
            return NextResponse.json({ error: 'La calificación debe ser entre 1 y 5' }, { status: 400 });
        }

        // Verify user has purchased this product
        const { data: purchases } = await supabase
            .from('pedido_items')
            .select('id, pedidos!inner(usuario_id)')
            .eq('producto_id', id)
            .eq('pedidos.usuario_id', authUser.userId)
            .limit(1);

        if (!purchases || purchases.length === 0) {
            return NextResponse.json({ error: 'Debes comprar este producto antes de dejar una reseña' }, { status: 403 });
        }

        // Check if user already reviewed this product
        const { data: existing } = await supabase
            .from('producto_resenas')
            .select('id')
            .eq('producto_id', id)
            .eq('usuario_id', authUser.userId)
            .single();

        if (existing) {
            return NextResponse.json({ error: 'Ya dejaste una reseña para este producto' }, { status: 409 });
        }

        // Insert review
        const { error: insertError } = await supabase
            .from('producto_resenas')
            .insert({
                producto_id: Number(id),
                usuario_id: authUser.userId,
                calificacion,
                titulo: titulo || null,
                comentario: comentario || null,
            });

        if (insertError) throw insertError;

        // Update product average rating and review count
        const { data: stats } = await supabase
            .from('producto_resenas')
            .select('calificacion')
            .eq('producto_id', id);

        if (stats && stats.length > 0) {
            const avgRating = stats.reduce((sum, s) => sum + s.calificacion, 0) / stats.length;
            await supabase
                .from('productos')
                .update({
                    rating: Math.round(avgRating * 10) / 10,
                    reviews: stats.length,
                })
                .eq('id', id);
        }

        return NextResponse.json({ message: 'Reseña creada exitosamente' }, { status: 201 });
    } catch (error) {
        console.error('Error al crear reseña:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}
