import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import crypto from 'crypto'

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// POST - Solicitar reset de contraseña
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email requerido' },
        { status: 400 }
      )
    }

    // Buscar usuario
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('id, nombre')
      .eq('email', email.toLowerCase())
      .single()

    if (userError || !usuario) {
      // No revelar si el email existe o no (seguridad)
      return NextResponse.json({ 
        success: true,
        message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña' 
      })
    }

    // Generar token
    const token = generateToken()
    const expiraAt = new Date()
    expiraAt.setHours(expiraAt.getHours() + 1) // Expira en 1 hora

    // Guardar token
    const { error: tokenError } = await supabase
      .from('tokens_auth')
      .insert({
        usuario_id: usuario.id,
        token,
        tipo: 'reset_password',
        expira_at: expiraAt.toISOString()
      })

    if (tokenError) {
      console.error('Error guardando token:', tokenError)
      return NextResponse.json(
        { error: 'Error al generar token' },
        { status: 500 }
      )
    }

    // Construir URL de reset
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/restablecer-contrasena?token=${token}`

    // TODO: Aquí enviarías el email real
    console.log('===========================================')
    console.log('EMAIL DE RESET DE CONTRASEÑA')
    console.log(`Para: ${email}`)
    console.log(`Link: ${resetUrl}`)
    console.log('===========================================')

    return NextResponse.json({ 
      success: true,
      message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña',
      // Solo para desarrollo
      debug: process.env.NODE_ENV === 'development' ? { resetUrl } : undefined
    })
  } catch (error) {
    console.error('Error en forgot password:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
