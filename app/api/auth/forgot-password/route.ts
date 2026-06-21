import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db'
import { resend } from '@/lib/resend'
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
    const { data: usuario, error: userError } = await supabaseAdmin
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
    const { error: tokenError } = await supabaseAdmin
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

    // Enviar correo de reset con Resend
    let emailEnviado = false
    try {
      const emailResult = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: email,
        subject: '🔒 Restablecer tu contraseña — Mueblería Online',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #1a1a1a; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
                  <h1 style="color: #f5f0e8; margin: 0; font-size: 24px;">MADERA VIVA DESING</h1>
              </div>
              <div style="background: #fafaf8; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e8e4dc;">
                  <h2 style="color: #1a1a1a; margin-top: 0;">Restablecer contraseña</h2>
                  <p style="color: #555; line-height: 1.6;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si no fuiste tú, puedes ignorar este correo.</p>
                  <div style="text-align: center; margin: 32px 0;">
                      <a href="${resetUrl}"
                         style="background: #1a1a1a; color: white; padding: 14px 32px;
                                text-decoration: none; border-radius: 6px; display: inline-block;
                                font-size: 16px; font-weight: bold;">
                          Restablecer contraseña
                      </a>
                  </div>
                  <p style="color: #888; font-size: 13px;">⏰ Este enlace expira en <strong>1 hora</strong>.</p>
                  <hr style="border: none; border-top: 1px solid #e8e4dc; margin: 24px 0;" />
                  <p style="color: #bbb; font-size: 12px; text-align: center;">Si el botón no funciona, copia este enlace en tu navegador:<br/>
                      <a href="${resetUrl}" style="color: #888; word-break: break-all;">${resetUrl}</a>
                  </p>
              </div>
          </div>
        `,
      })
      console.log('✅ Correo de reset enviado:', emailResult)
      emailEnviado = true
    } catch (emailError) {
      console.error('❌ Error al enviar correo de reset:', emailError)
    }

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
