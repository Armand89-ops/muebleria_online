import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST - Restablecer contraseña con token
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token y contraseña requeridos' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Buscar token válido
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens_auth')
      .select('*')
      .eq('token', token)
      .eq('tipo', 'reset_password')
      .eq('usado', false)
      .gt('expira_at', new Date().toISOString())
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Token inválido o expirado. Solicita un nuevo enlace.' },
        { status: 400 }
      )
    }

    // Hash de la nueva contraseña
    const passwordHash = await bcrypt.hash(password, 10)

    // Actualizar contraseña
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ 
        password_hash: passwordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', tokenData.usuario_id)

    if (updateError) {
      console.error('Error actualizando contraseña:', updateError)
      return NextResponse.json(
        { error: 'Error al actualizar contraseña' },
        { status: 500 }
      )
    }

    // Marcar token como usado
    await supabase
      .from('tokens_auth')
      .update({ usado: true })
      .eq('id', tokenData.id)

    // Invalidar todos los tokens de reset de este usuario
    await supabase
      .from('tokens_auth')
      .update({ usado: true })
      .eq('usuario_id', tokenData.usuario_id)
      .eq('tipo', 'reset_password')

    return NextResponse.json({ 
      success: true,
      message: 'Contraseña actualizada correctamente' 
    })
  } catch (error) {
    console.error('Error en reset password:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
