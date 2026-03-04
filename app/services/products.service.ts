import { pool } from '@/lib/db';
import { Product } from '@/lib/products';
import { RowDataPacket } from 'mysql2';

interface ProductRow extends RowDataPacket {
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
    inStock: boolean | number;
    featured: boolean | number;
    is_new: boolean | number;
    dim_width: number | null;
    dim_height: number | null;
    dim_depth: number | null;
}

async function getColorsForProduct(productId: number): Promise<string[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT color FROM producto_colores WHERE producto_id = ?',
        [productId]
    );
    return rows.map((r: RowDataPacket) => r.color);
}

async function getMaterialsForProduct(productId: number): Promise<string[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT material FROM producto_materiales WHERE producto_id = ?',
        [productId]
    );
    return rows.map((r: RowDataPacket) => r.material);
}

async function getImagesForProduct(productId: number): Promise<string[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT image_url FROM producto_imagenes WHERE producto_id = ? ORDER BY sort_order ASC',
        [productId]
    );
    return rows.map((r: RowDataPacket) => r.image_url);
}

async function mapRowToProduct(row: ProductRow): Promise<Product> {
    const [colors, materials, extraImages] = await Promise.all([
        getColorsForProduct(row.id),
        getMaterialsForProduct(row.id),
        getImagesForProduct(row.id),
    ]);

    // Combine the main image with extra images
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
    };
}

async function mapRowsToProducts(rows: ProductRow[]): Promise<Product[]> {
    return Promise.all(rows.map(mapRowToProduct));
}

export const ProductsService = {
    async getAll(): Promise<Product[]> {
        const [rows] = await pool.query<ProductRow[]>('SELECT * FROM productos');
        return mapRowsToProducts(rows);
    },

    async getFeatured(): Promise<Product[]> {
        const [rows] = await pool.query<ProductRow[]>('SELECT * FROM productos WHERE featured = 1');
        return mapRowsToProducts(rows);
    },

    async getNew(): Promise<Product[]> {
        const [rows] = await pool.query<ProductRow[]>('SELECT * FROM productos WHERE is_new = 1');
        return mapRowsToProducts(rows);
    },

    async getByCategory(category: string): Promise<Product[]> {
        const [rows] = await pool.query<ProductRow[]>('SELECT * FROM productos WHERE category = ?', [category]);
        return mapRowsToProducts(rows);
    },

    async getById(id: string): Promise<Product | undefined> {
        const [rows] = await pool.query<ProductRow[]>('SELECT * FROM productos WHERE id = ?', [id]);
        if (rows.length === 0) return undefined;
        return mapRowToProduct(rows[0]);
    },

    async search(query: string): Promise<Product[]> {
        const searchTerm = `%${query}%`;
        const [rows] = await pool.query<ProductRow[]>(
            'SELECT * FROM productos WHERE name LIKE ? OR description LIKE ? OR category LIKE ? OR subcategory LIKE ?',
            [searchTerm, searchTerm, searchTerm, searchTerm]
        );
        return mapRowsToProducts(rows);
    }
};