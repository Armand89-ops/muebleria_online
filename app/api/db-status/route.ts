import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

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
        mysqlVersion: string | null;
        database: string | null;
        productCount: number | null;
        tables: string[];
        error: string | null;
        timestamp: string;
    } = {
        connected: false,
        mysqlVersion: null,
        database: null,
        productCount: null,
        tables: [],
        error: null,
        timestamp: new Date().toISOString(),
    };

    try {
        // Test connection
        const connection = await pool.getConnection();

        // Get MySQL version
        const [versionRows] = await connection.query<RowDataPacket[]>('SELECT VERSION() as version');
        result.mysqlVersion = versionRows[0]?.version || null;

        // Get current database
        const [dbRows] = await connection.query<RowDataPacket[]>('SELECT DATABASE() as db');
        result.database = dbRows[0]?.db || null;

        // Get product count
        const [countRows] = await connection.query<RowDataPacket[]>('SELECT COUNT(*) as total FROM productos');
        result.productCount = countRows[0]?.total || 0;

        // Get tables
        const [tableRows] = await connection.query<RowDataPacket[]>('SHOW TABLES');
        result.tables = tableRows.map((row: RowDataPacket) => Object.values(row)[0] as string);

        result.connected = true;
        connection.release();

        return NextResponse.json(result);
    } catch (error) {
        result.error = error instanceof Error ? error.message : 'Error desconocido';
        return NextResponse.json(result, { status: 500 });
    }
}
