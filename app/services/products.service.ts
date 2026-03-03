// services/products.service.ts
import { pool } from '@/lib/db';

export const ProductsService = {
    // Función para obtener todos los muebles
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM productos');
        return rows;
    },

    // Función para obtener uno solo (como getProductById)
    async getById(id: string) {
        const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
        return rows[0];
    }
};