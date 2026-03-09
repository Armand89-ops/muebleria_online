import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth';

// GET - Obtener perfil
export async function GET() {
    const authUser = await getCurrentUser();
    if (!authUser) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    try {
        const { data: user, error } = await supabase
            .from('usuarios')
            .select('id, nombre, apellido, email, telefono, notif_email, created_at')
            .eq('id', authUser.userId)
            .single();

        if (error || !user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // Handle case where notif_email might be null
        if (user.notif_email === null || user.notif_email === undefined) {
            user.notif_email = true;
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

// PUT - Actualizar perfil
export async function PUT(request: Request) {
    const authUser = await getCurrentUser();
    if (!authUser) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    try {
        const { nombre, apellido, email, telefono, currentPassword, newPassword, notif_email } = await request.json();

        // Si se quiere cambiar contraseña
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ error: 'La contraseña actual es requerida' }, { status: 400 });
            }

            const { data: userRow } = await supabase
                .from('usuarios')
                .select('password_hash')
                .eq('id', authUser.userId)
                .single();

            if (!userRow) {
                return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
            }

            const isValid = await verifyPassword(currentPassword, userRow.password_hash);
            if (!isValid) {
                return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 400 });
            }

            const newHash = await hashPassword(newPassword);
            await supabase
                .from('usuarios')
                .update({ password_hash: newHash })
                .eq('id', authUser.userId);
        }

        // Actualizar datos del perfil
        const updateData: Record<string, any> = {};
        if (nombre !== undefined) updateData.nombre = nombre;
        if (apellido !== undefined) updateData.apellido = apellido;
        if (email !== undefined) updateData.email = email;
        if (telefono !== undefined) updateData.telefono = telefono;
        if (notif_email !== undefined) updateData.notif_email = notif_email;

        if (Object.keys(updateData).length > 0) {
            await supabase
                .from('usuarios')
                .update(updateData)
                .eq('id', authUser.userId);
        }

        return NextResponse.json({ message: 'Perfil actualizado' });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}
