import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { items } = await request.json();

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ error: 'Mala petición' }, { status: 400 });
        }

        for (const item of items) {
            const qty = item.quantity || item.cantidad || 1;
            const productoId = item.product?.id || item.producto_id;

            if (productoId) {
                const { data: currentProduct } = await supabaseAdmin
                    .from('productos')
                    .select('stock')
                    .eq('id', productoId)
                    .single();

                if (currentProduct && currentProduct.stock != null) {
                    const newStock = Math.max(currentProduct.stock - qty, 0);
                    await supabaseAdmin
                        .from('productos')
                        .update({ stock: newStock, inStock: newStock > 0 })
                        .eq('id', productoId);
                }
            }
        }

        return NextResponse.json({ message: 'Stock actualizado' });
    } catch (error) {
        console.error('Error reduciendo stock:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
