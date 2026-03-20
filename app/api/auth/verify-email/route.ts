import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Verificar email con token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 400 }
      )
    }

    // Buscar token válido
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens_auth')
      .select('*')
      .eq('token', token)
      .eq('tipo', 'verificacion')
      .eq('usado', false)
      .gt('expira_at', new Date().toISOString())
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      )
    }

    // Marcar email como verificado
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ email_verificado: true })
      .eq('id', tokenData.usuario_id)

    if (updateError) {
      return NextResponse.json(
        { error: 'Error al verificar email' },
        { status: 500 }
      )
    }

    // Marcar token como usado
    await supabase
      .from('tokens_auth')
      .update({ usado: true })
      .eq('id', tokenData.id)

    return NextResponse.json({ 
      success: true,
      message: 'Email verificado correctamente' 
    })
  } catch (error) {
    console.error('Error verificando email:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
