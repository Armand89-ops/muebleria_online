import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET - Obtener pedidos del usuario
export async function GET() {
    const authUser = await getCurrentUser();
    if (!authUser) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    try {
        // Obtener pedidos
        const { data: orders, error } = await supabase
            .from('pedidos')
            .select('*')
            .eq('usuario_id', authUser.userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Para cada pedido, obtener sus items
        for (const order of (orders || [])) {
            const { data: items } = await supabase
                .from('pedido_items')
                .select('producto_id, nombre_producto, precio, cantidad, color, imagen')
                .eq('pedido_id', order.id);
            order.items = items || [];
        }

        return NextResponse.json(orders || []);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

// POST - Crear nuevo pedido
export async function POST(request: Request) {
    const authUser = await getCurrentUser();
    if (!authUser) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    try {
        const { items, subtotal, shipping, tax, total, shippingAddress } = await request.json();

        // Generar código de pedido
        const codigo = `LUXE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

        // Verificar stock para todos los items primero
        for (const item of items) {
            const qty = item.quantity || item.cantidad || 1;
            const productoId = item.product?.id || item.producto_id;

            if (productoId) {
                const { data: product } = await supabase
                    .from('productos')
                    .select('stock, "inStock"')
                    .eq('id', productoId)
                    .single();

                if (product && product.stock != null && product.stock < qty) {
                    return NextResponse.json(
                        { error: `Stock insuficiente para el producto ${item.product?.name || productoId}` },
                        { status: 400 }
                    );
                }
            }
        }

        // Crear pedido
        const { data: newOrder, error: orderError } = await supabase
            .from('pedidos')
            .insert({
                usuario_id: authUser.userId,
                codigo,
                subtotal,
                envio: shipping,
                impuesto: tax,
                total,
                envio_nombre: shippingAddress.name,
                envio_direccion: shippingAddress.address,
                envio_ciudad: shippingAddress.city,
                envio_estado: shippingAddress.state,
                envio_codigo_postal: shippingAddress.zip,
            })
            .select('id')
            .single();

        if (orderError || !newOrder) {
            console.error('Error creando pedido:', orderError);
            return NextResponse.json({ error: 'Error al crear el pedido' }, { status: 500 });
        }

        const pedidoId = newOrder.id;

        // Insertar items del pedido y reducir stock
        for (const item of items) {
            const qty = item.quantity || item.cantidad || 1;
            const productoId = item.product?.id || item.producto_id;

            await supabase
                .from('pedido_items')
                .insert({
                    pedido_id: pedidoId,
                    producto_id: productoId || null,
                    nombre_producto: item.product?.name || item.nombre_producto,
                    precio: item.product?.price || item.precio,
                    cantidad: qty,
                    color: item.color || null,
                    imagen: item.product?.image || item.imagen || null,
                });

            // Reducir stock y actualizar inStock
            if (productoId) {
                const { data: currentProduct } = await supabase
                    .from('productos')
                    .select('stock')
                    .eq('id', productoId)
                    .single();

                if (currentProduct && currentProduct.stock != null) {
                    const newStock = Math.max(currentProduct.stock - qty, 0);
                    await supabase
                        .from('productos')
                        .update({ stock: newStock, inStock: newStock > 0 })
                        .eq('id', productoId);
                }
            }
        }

        // Limpiar carrito del usuario
        await supabase
            .from('usuario_carrito')
            .delete()
            .eq('usuario_id', authUser.userId);

        return NextResponse.json({
            id: codigo,
            message: 'Pedido creado exitosamente',
        }, { status: 201 });

    } catch (error) {
        console.error('Error al crear pedido:', error);
        return NextResponse.json({ error: 'Error al crear el pedido' }, { status: 500 });
    }
}
