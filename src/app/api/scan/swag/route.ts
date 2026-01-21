import { NextRequest, NextResponse } from 'next/server';
import { claim } from '@/lib/services/scanService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { qrData, volunteerId } = body;

    if (!qrData || !volunteerId) {
      return NextResponse.json({ status: 'ERROR', message: 'Missing qrData or volunteerId' }, { status: 400 });
    }

    // Parse username from QR (handle JSON or plain text)
    let username = qrData;
    try {
      const parsed = JSON.parse(qrData);
      if (parsed.username) username = parsed.username;
    } catch (e) {
      // plain text, ignore
    }

    const result = await claim(username, 'swag', volunteerId);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Swag scan error:', error);
    return NextResponse.json({ status: 'ERROR', message: 'Internal Server Error' }, { status: 500 });
  }
}
