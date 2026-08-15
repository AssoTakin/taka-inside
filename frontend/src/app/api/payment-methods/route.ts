import { NextResponse } from 'next/server';
import { fetchPaymentMethods } from '../../../lib/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const methods = await fetchPaymentMethods();
    if (!methods) {
      return NextResponse.json({ data: [] });
    }
    return NextResponse.json({ data: methods });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}
