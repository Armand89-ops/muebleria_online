import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';

// DELETE - Eliminar cuenta de usuario
export async function DELETE() {
    const authUser = await getCurrentUser();
    if (!authUser) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    try {
        // ON DELETE CASCADE se encarga de carrito, direcciones, pedidos, favoritos
        await supabase
            .from('usuarios')
            .delete()
            .eq('id', authUser.userId);

        // Limpiar cookie de sesión
        const cookieStore = await cookies();
        cookieStore.delete('auth_token');

        return NextResponse.json({ message: 'Cuenta eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar cuenta:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}
