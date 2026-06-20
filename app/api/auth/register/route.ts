import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/db';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { resend } from '@/lib/resend'; // ← Agrega este import
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { nombre, apellido, email, password } = await request.json();

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

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const expiraAt = new Date();
        expiraAt.setHours(expiraAt.getHours() + 24);

        await supabase.from('tokens_auth').insert({
            usuario_id: newUser.id,
            token: verificationToken,
            tipo: 'verificacion',
            expira_at: expiraAt.toISOString()
        });

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const verificationUrl = `${baseUrl}/verificar-email?token=${verificationToken}`;

        // Enviar correo de verificación con Resend
        let emailEnviado = false;
        try {
            const emailResult = await resend.emails.send({
                from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
                to: email,
                subject: '✅ Verifica tu cuenta — Mueblería Online',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: #1a1a1a; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
                            <h1 style="color: #f5f0e8; margin: 0; font-size: 24px;">MADERA VIVA DESING</h1>
                        </div>
                        <div style="background: #fafaf8; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e8e4dc;">
                            <h2 style="color: #1a1a1a; margin-top: 0;">¡Hola ${nombre}! 👋</h2>
                            <p style="color: #555; line-height: 1.6;">Gracias por registrarte en MADERA VIVA DESING. Para activar tu cuenta, por favor verifica tu correo electrónico.</p>
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="${verificationUrl}"
                                   style="background: #1a1a1a; color: white; padding: 14px 32px;
                                          text-decoration: none; border-radius: 6px; display: inline-block;
                                          font-size: 16px; font-weight: bold;">
                                    ✅ Verificar mi cuenta
                                </a>
                            </div>
                            <p style="color: #888; font-size: 13px;">⏰ Este enlace expira en <strong>24 horas</strong>.</p>
                            <p style="color: #888; font-size: 13px;">Si no creaste una cuenta, puedes ignorar este correo.</p>
                            <hr style="border: none; border-top: 1px solid #e8e4dc; margin: 24px 0;" />
                            <p style="color: #bbb; font-size: 12px; text-align: center;">Si el botón no funciona, copia este enlace en tu navegador:<br/>
                                <a href="${verificationUrl}" style="color: #888; word-break: break-all;">${verificationUrl}</a>
                            </p>
                        </div>
                    </div>
                `,
            });
            console.log('✅ Correo de verificación enviado:', emailResult);
            emailEnviado = true;
        } catch (emailError) {
            console.error('❌ Error al enviar correo de verificación:', emailError);
            // No bloqueamos el registro si el correo falla
            // El usuario puede pedir reenvío desde su cuenta
        }

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
            message: emailEnviado
                ? `Cuenta creada. Hemos enviado un correo de verificación a ${email}.`
                : 'Cuenta creada. Hubo un problema al enviar el correo de verificación, pero puedes solicitarlo desde tu cuenta.',
            emailEnviado,
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