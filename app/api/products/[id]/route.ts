import { NextResponse, NextRequest } from 'next/server';
import { ProductsService } from '@/app/services/products.service';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await ProductsService.getById(id);

        if (!product) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        // Also fetch related products (same category)
        const allProducts = await ProductsService.getByCategory(product.category);
        const related = allProducts
            .filter(p => p.id !== product.id)
            .slice(0, 4);

        return NextResponse.json({
            product,
            related,
        });
    } catch (error) {
        console.error("Error en API producto:", error);
        return NextResponse.json(
            { error: 'Error al obtener el producto' },
            { status: 500 }
        );
    }
}
