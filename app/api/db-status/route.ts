import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
    // Block access in production
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
            { error: 'No disponible en producción' },
            { status: 403 }
        );
    }

    const result: {
        connected: boolean;
        database: string | null;
        productCount: number | null;
        tables: string[];
        error: string | null;
        timestamp: string;
    } = {
        connected: false,
        database: 'Supabase (PostgreSQL)',
        productCount: null,
        tables: [],
        error: null,
        timestamp: new Date().toISOString(),
    };

    try {
        // Test connection by counting products
        const { count, error } = await supabase
            .from('productos')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;

        result.productCount = count || 0;
        result.connected = true;

        // List known tables
        result.tables = [
            'productos', 'producto_colores', 'producto_imagenes', 'producto_materiales',
            'usuarios', 'usuario_direcciones', 'usuario_carrito',
            'pedidos', 'pedido_items',
            'usuario_favoritos', 'producto_resenas',
            'suscriptores_newsletter', 'mensajes_contacto',
        ];

        return NextResponse.json(result);
    } catch (error) {
        result.error = error instanceof Error ? error.message : 'Error desconocido';
        return NextResponse.json(result, { status: 500 });
    }
}
