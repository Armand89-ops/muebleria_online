import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { nombre, apellido, email, password } = await request.json();

        // Validaciones
        if (!nombre || !apellido || !email || !password) {
            return NextResponse.json(
                { error: 'Todos los campos son requeridos' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'La contraseña debe tener al menos 6 caracteres' },
                { status: 400 }
            );
        }

        // Verificar si el email ya existe
        const { data: existing } = await supabase
            .from('usuarios')
            .select('id')
            .eq('email', email)
            .single();

        if (existing) {
            return NextResponse.json(
                { error: 'Ya existe una cuenta con este correo electrónico' },
                { status: 409 }
            );
        }

        // Crear usuario
        const password_hash = await hashPassword(password);
        const { data: newUser, error } = await supabase
            .from('usuarios')
            .insert({ nombre, apellido, email, password_hash, email_verificado: false })
            .select('id')
            .single();

        if (error || !newUser) {
            console.error('Error insertando usuario:', error);
            return NextResponse.json(
                { error: 'Error al crear la cuenta' },
                { status: 500 }
            );
        }

        // Generar token de verificación de email
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const expiraAt = new Date();
        expiraAt.setHours(expiraAt.getHours() + 24); // 24 horas

        await supabase.from('tokens_auth').insert({
            usuario_id: newUser.id,
            token: verificationToken,
            tipo: 'verificacion',
            expira_at: expiraAt.toISOString()
        });

        // Construir URL de verificación
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const verificationUrl = `${baseUrl}/verificar-email?token=${verificationToken}`;

        // Log para desarrollo (en producción enviarías el email)
        console.log('===========================================');
        console.log('EMAIL DE VERIFICACIÓN');
        console.log(`Para: ${email}`);
        console.log(`Link: ${verificationUrl}`);
        console.log('===========================================');

        // Generar token y cookie
        const token = generateToken({ userId: newUser.id, email });
        await setAuthCookie(token);

        return NextResponse.json({
            user: {
                id: newUser.id,
                nombre,
                apellido,
                email,
                email_verificado: false
            },
            message: 'Cuenta creada. Por favor verifica tu email.',
            verificationUrl: process.env.NODE_ENV === 'development' ? verificationUrl : undefined
        }, { status: 201 });

    } catch (error) {
        console.error('Error en registro:', error);
        return NextResponse.json(
            { error: 'Error al crear la cuenta' },
            { status: 500 }
        );
    }
}
