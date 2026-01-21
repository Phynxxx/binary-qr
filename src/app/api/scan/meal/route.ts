import { NextRequest, NextResponse } from 'next/server';
import { claim } from '@/lib/services/scanService';
import Config from '@/lib/models/Config';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { qrData, volunteerId, phase } = body;

    if (!qrData || !volunteerId) {
      return NextResponse.json({ status: 'ERROR', message: 'Missing qrData or volunteerId' }, { status: 400 });
    }

    let targetPhase = phase;
    
    // Resolve phase if auto
    if (!phase || phase === 'auto') {
      await dbConnect();
      const config = await Config.findOne({ key: 'global_config' });
      targetPhase = config?.activePhase || 'none';
      
      if (targetPhase === 'none') {
        return NextResponse.json({ status: 'ERROR', message: 'No active phase configured' }, { status: 400 });
      }
      if (targetPhase === 'swag') {
         return NextResponse.json({ status: 'ERROR', message: 'Active phase is SWAG, please use swag scanner' }, { status: 400 });
      }
    }

    // Parse username from QR (handle JSON or plain text)
    let username = qrData;
    try {
      const parsed = JSON.parse(qrData);
      if (parsed.username) username = parsed.username;
    } catch (e) {
      // plain text, ignore
    }

    const result = await claim(username, targetPhase, volunteerId);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Scan error:', error);
    return NextResponse.json({ status: 'ERROR', message: 'Internal Server Error' }, { status: 500 });
  }
}
