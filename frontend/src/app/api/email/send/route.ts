import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const FROM_EMAIL = 'Taka Inside <commandes@takainside.bj>';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY manquante');
  return new Resend(key);
}

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html, text } = await req.json();

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: 'Champs requis: to, subject, et html ou text' },
        { status: 400 }
      );
    }

    const resend = getResend();
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
  } catch (err: unknown) {
    console.error('[Email] Error:', err);
    return NextResponse.json(
      { error: (err instanceof Error ? err.message : 'Erreur serveur') },
      { status: 500 }
    );
  }
}
