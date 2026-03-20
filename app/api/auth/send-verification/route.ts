import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Función para generar token seguro
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// POST - Enviar email de verificación
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
      .select('id, nombre, email_verificado')
      .eq('email', email.toLowerCase())
      .single()

    if (userError || !usuario) {
      // No revelar si el email existe o no
      return NextResponse.json({ 
        success: true,
        message: 'Si el email existe, recibirás un correo de verificación' 
      })
    }

    if (usuario.email_verificado) {
      return NextResponse.json({ 
        success: true,
        message: 'El email ya está verificado' 
      })
    }

    // Generar token
    const token = generateToken()
    const expiraAt = new Date()
    expiraAt.setHours(expiraAt.getHours() + 24) // Expira en 24 horas

    // Guardar token
    const { error: tokenError } = await supabase
      .from('tokens_auth')
      .insert({
        usuario_id: usuario.id,
        token,
        tipo: 'verificacion',
        expira_at: expiraAt.toISOString()
      })

    if (tokenError) {
      console.error('Error guardando token:', tokenError)
      return NextResponse.json(
        { error: 'Error al generar token' },
        { status: 500 }
      )
    }

    // Construir URL de verificación
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const verificationUrl = `${baseUrl}/verificar-email?token=${token}`

    // TODO: Aquí enviarías el email real
    // Por ahora, mostrar el link en la consola para testing
    console.log('===========================================')
    console.log('EMAIL DE VERIFICACIÓN')
    console.log(`Para: ${email}`)
    console.log(`Link: ${verificationUrl}`)
    console.log('===========================================')

    // Si tienes Resend configurado, descomenta esto:
    /*
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'tu-tienda@tudominio.com',
      to: email,
      subject: 'Confirma tu email - Mueblería Online',
      html: `
        <h1>Hola ${usuario.nombre}!</h1>
        <p>Gracias por registrarte. Por favor confirma tu email haciendo clic en el siguiente enlace:</p>
        <a href="${verificationUrl}">Confirmar mi email</a>
        <p>Este enlace expira en 24 horas.</p>
      `
    })
    */

    return NextResponse.json({ 
      success: true,
      message: 'Email de verificación enviado',
      // Solo para desarrollo - quitar en producción
      debug: process.env.NODE_ENV === 'development' ? { verificationUrl } : undefined
    })
  } catch (error) {
    console.error('Error enviando verificación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
