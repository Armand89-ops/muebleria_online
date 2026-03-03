// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { ProductsService } from '@/services/products.service';

export async function GET() {
    try {
        const data = await ProductsService.getAll(); // <--- Usas tu servicio
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Fallo al cargar productos' }, { status: 500 });
    }
}