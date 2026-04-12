import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email y contraseña son requeridos' },
                { status: 400 }
            );
        }

        // Buscar usuario
        const { data: user, error } = await supabaseAdmin
            .from('usuarios')
            .select('id, nombre, apellido, email, password_hash, telefono')
            .eq('email', email)
            .single();

        if (error || !user) {
            return NextResponse.json(
                { error: 'Credenciales incorrectas' },
                { status: 401 }
            );
        }

        // Verificar contraseña
        const isValid = await verifyPassword(password, user.password_hash);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Credenciales incorrectas' },
                { status: 401 }
            );
        }

        // Generar token y cookie
        const token = generateToken({ userId: user.id, email: user.email });
        await setAuthCookie(token);

        return NextResponse.json({
            user: {
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                telefono: user.telefono,
            },
        });

    } catch (error) {
        console.error('Error en login:', error);
        return NextResponse.json(
            { error: 'Error al iniciar sesión' },
            { status: 500 }
        );
    }
}
