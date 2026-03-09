import { supabase } from '@/lib/db';
import { Product } from '@/lib/products';

interface ProductRow {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice: number | null;
    category: string;
    subcategory: string;
    image: string;
    rating: number;
    reviews: number;
    inStock: boolean;
    featured: boolean;
    is_new: boolean;
    dim_width: number | null;
    dim_height: number | null;
    dim_depth: number | null;
    stock: number | null;
}

async function getColorsForProduct(productId: number): Promise<string[]> {
    const { data } = await supabase
        .from('producto_colores')
        .select('color')
        .eq('producto_id', productId);
    return (data || []).map(r => r.color);
}

async function getMaterialsForProduct(productId: number): Promise<string[]> {
    const { data } = await supabase
        .from('producto_materiales')
        .select('material')
        .eq('producto_id', productId);
    return (data || []).map(r => r.material);
}

async function getImagesForProduct(productId: number): Promise<string[]> {
    const { data } = await supabase
        .from('producto_imagenes')
        .select('image_url')
        .eq('producto_id', productId)
        .order('sort_order', { ascending: true });
    return (data || []).map(r => r.image_url);
}

async function mapRowToProduct(row: ProductRow): Promise<Product> {
    const [colors, materials, extraImages] = await Promise.all([
        getColorsForProduct(row.id),
        getMaterialsForProduct(row.id),
        getImagesForProduct(row.id),
    ]);

    const allImages = row.image ? [row.image, ...extraImages] : extraImages;

    return {
        id: String(row.id),
        name: row.name,
        description: row.description || '',
        price: Number(row.price),
        originalPrice: row.originalPrice ? Number(row.originalPrice) : undefined,
        category: row.category || '',
        subcategory: row.subcategory || '',
        image: row.image || '/placeholder.svg',
        images: allImages.length > 0 ? allImages : undefined,
        rating: Number(row.rating) || 0,
        reviews: row.reviews || 0,
        inStock: Boolean(row.inStock),
        featured: Boolean(row.featured),
        new: Boolean(row.is_new),
        is_new: Boolean(row.is_new),
        colors: colors.length > 0 ? colors : [],
        materials: materials.length > 0 ? materials : [],
        dimensions: (row.dim_width != null && row.dim_height != null && row.dim_depth != null)
            ? { width: Number(row.dim_width), height: Number(row.dim_height), depth: Number(row.dim_depth) }
            : null,
        stock: row.stock != null ? Number(row.stock) : undefined,
    };
}

async function mapRowsToProducts(rows: ProductRow[]): Promise<Product[]> {
    return Promise.all(rows.map(mapRowToProduct));
}

export const ProductsService = {
    async getAll(): Promise<Product[]> {
        const { data, error } = await supabase.from('productos').select('*');
        if (error) throw error;
        return mapRowsToProducts(data || []);
    },

    async getFeatured(): Promise<Product[]> {
        const { data, error } = await supabase.from('productos').select('*').eq('featured', true);
        if (error) throw error;
        return mapRowsToProducts(data || []);
    },

    async getNew(): Promise<Product[]> {
        const { data, error } = await supabase.from('productos').select('*').eq('is_new', true);
        if (error) throw error;
        return mapRowsToProducts(data || []);
    },

    async getByCategory(category: string): Promise<Product[]> {
        const { data, error } = await supabase.from('productos').select('*').eq('category', category);
        if (error) throw error;
        return mapRowsToProducts(data || []);
    },

    async getById(id: string): Promise<Product | undefined> {
        const { data, error } = await supabase.from('productos').select('*').eq('id', id).single();
        if (error || !data) return undefined;
        return mapRowToProduct(data);
    },

    async search(query: string): Promise<Product[]> {
        const { data, error } = await supabase
            .from('productos')
            .select('*')
            .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%,subcategory.ilike.%${query}%`);
        if (error) throw error;
        return mapRowsToProducts(data || []);
    }
};