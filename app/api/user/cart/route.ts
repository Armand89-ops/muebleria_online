import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET - Obtener carrito del usuario
export async function GET() {
    const authUser = await getCurrentUser();
    if (!authUser) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    try {
        const { data, error } = await supabase
            .from('usuario_carrito')
            .select(`
                id, producto_id, cantidad, color,
                productos ( name, price, "originalPrice", image, category )
            `)
            .eq('usuario_id', authUser.userId);

        if (error) throw error;

        // Flatten the joined product data
        const rows = (data || []).map(item => ({
            id: item.id,
            producto_id: item.producto_id,
            cantidad: item.cantidad,
            color: item.color,
            name: (item.productos as any)?.name,
            price: (item.productos as any)?.price,
            originalPrice: (item.productos as any)?.originalPrice,
            image: (item.productos as any)?.image,
            category: (item.productos as any)?.category,
        }));

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

// POST - Agregar item al carrito
export async function POST(request: Request) {
    const authUser = await getCurrentUser();
    if (!authUser) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    try {
        const { producto_id, cantidad = 1, color } = await request.json();

        // Check if item already exists in cart
        const { data: existing } = await supabase
            .from('usuario_carrito')
            .select('id, cantidad')
            .eq('usuario_id', authUser.userId)
            .eq('producto_id', producto_id)
            .is('color', color || null)
            .single();

        if (existing) {
            // Update quantity
            await supabase
                .from('usuario_carrito')
                .update({ cantidad: existing.cantidad + cantidad })
                .eq('id', existing.id);
        } else {
            // Insert new item
            await supabase
                .from('usuario_carrito')
                .insert({
                    usuario_id: authUser.userId,
                    producto_id,
                    cantidad,
                    color: color || null,
                });
        }

        return NextResponse.json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

// PUT - Actualizar cantidad
export async function PUT(request: Request) {
    const authUser = await getCurrentUser();
    if (!authUser) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    try {
        const { producto_id, cantidad, color } = await request.json();

        let query = supabase
            .from('usuario_carrito')
            .select('id')
            .eq('usuario_id', authUser.userId)
            .eq('producto_id', producto_id);

        if (color) {
            query = query.eq('color', color);
        } else {
            query = query.is('color', null);
        }

        const { data: items } = await query;

        if (items && items.length > 0) {
            const itemId = items[0].id;
            if (cantidad <= 0) {
                await supabase.from('usuario_carrito').delete().eq('id', itemId);
            } else {
                await supabase.from('usuario_carrito').update({ cantidad }).eq('id', itemId);
            }
        }

        return NextResponse.json({ message: 'Carrito actualizado' });
    } catch (error) {
        console.error('Error al actualizar carrito:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

// DELETE - Limpiar carrito o eliminar item
export async function DELETE(request: Request) {
    const authUser = await getCurrentUser();
    if (!authUser) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    try {
        const url = new URL(request.url);
        const productoId = url.searchParams.get('producto_id');

        if (productoId) {
            await supabase
                .from('usuario_carrito')
                .delete()
                .eq('usuario_id', authUser.userId)
                .eq('producto_id', productoId);
        } else {
            await supabase
                .from('usuario_carrito')
                .delete()
                .eq('usuario_id', authUser.userId);
        }

        return NextResponse.json({ message: 'Eliminado del carrito' });
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}
