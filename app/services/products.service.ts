import { pool } from '@/lib/db';
import { Product } from '@/lib/products';

export const ProductsService = {
    async getAll(): Promise<Product[]> {
        const [rows] = await pool.query('SELECT * FROM productos');
        return rows as Product[];
    },

    async getFeatured(): Promise<Product[]> {
        const [rows] = await pool.query('SELECT * FROM productos WHERE featured = 1 LIMIT 4');
        return rows as Product[];
    },

    async getById(id: string): Promise<Product | undefined> {
        const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
        const results = rows as Product[];
        return results[0];
    }
};