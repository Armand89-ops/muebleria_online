import { NextResponse } from 'next/server';
import { ProductsService } from '@/app/services/products.service';

export async function GET() {
    try {
        const products = await ProductsService.getAll();
        return NextResponse.json(products, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
            },
        });
    } catch (error) {
        console.error("Error en API:", error);
        return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
    }
}