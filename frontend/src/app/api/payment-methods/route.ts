import { NextResponse } from 'next/server';
import { fetchStrapiList } from '../../../lib/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch with cache-busting to bypass serverCache
    const methods = await fetchStrapiList('payment-methods?populate=*&sort=displayOrder&filters[isActive][$eq]=true&ts=' + Date.now());
    if (!methods) {
      return NextResponse.json({ data: [] });
    }
    return NextResponse.json({ data: methods }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}
