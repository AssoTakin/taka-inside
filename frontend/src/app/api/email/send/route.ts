import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Taka Inside <commandes@takainside.bj>';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html, text } = await req.json();

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: 'Champs requis: to, subject, et html ou text' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('[Resend] Error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err: any) {
    console.error('[Email] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
