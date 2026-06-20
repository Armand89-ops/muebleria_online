import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/db'
import { resend } from '@/lib/resend'
import crypto from 'crypto'

// GET /api/auth/send-verification
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

    // Enviar correo real con Resend
    try {
      const emailResult = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: email,
        subject: '✅ Verifica tu cuenta — Mueblería Online',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #1a1a1a; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="color: #f5f0e8; margin: 0; font-size: 24px;">Mueblería Online</h1>
            </div>
            <div style="background: #fafaf8; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e8e4dc;">
              <h2 style="color: #1a1a1a; margin-top: 0;">¡Hola ${usuario.nombre}! 👋</h2>
              <p style="color: #555; line-height: 1.6;">Solicitaste verificar tu correo electrónico. Haz clic en el botón para activar tu cuenta.</p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${verificationUrl}"
                   style="background: #1a1a1a; color: white; padding: 14px 32px;
                          text-decoration: none; border-radius: 6px; display: inline-block;
                          font-size: 16px; font-weight: bold;">
                  ✅ Verificar mi cuenta
                </a>
              </div>
              <p style="color: #888; font-size: 13px;">⏰ Este enlace expira en <strong>24 horas</strong>.</p>
              <p style="color: #888; font-size: 13px;">Si no solicitaste esto, puedes ignorar este correo.</p>
              <hr style="border: none; border-top: 1px solid #e8e4dc; margin: 24px 0;" />
              <p style="color: #bbb; font-size: 12px; text-align: center;">Si el botón no funciona, copia este enlace:<br/>
                <a href="${verificationUrl}" style="color: #888; word-break: break-all;">${verificationUrl}</a>
              </p>
            </div>
          </div>
        `,
      })
      console.log('✅ Correo de verificación (reenvío) enviado:', emailResult)
    } catch (emailError) {
      console.error('❌ Error al enviar correo de verificación:', emailError)
      return NextResponse.json(
        { error: 'Error al enviar el correo de verificación. Intenta de nuevo.' },
        { status: 500 }
      )
    }

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
