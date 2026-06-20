import { resend } from '@/lib/resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { to, subject, html } = await req.json();

    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to,
            subject,
            html,
        });

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}