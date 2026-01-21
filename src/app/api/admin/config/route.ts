import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Config from '@/lib/models/Config';

// Helper for auth
function checkAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return false;
  const [scheme, encoded] = authHeader.split(' ');
  if (!encoded || scheme !== 'Basic') return false;
  const buffer = Buffer.from(encoded, 'base64');
  const [user, pass] = buffer.toString().split(':');
  return user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS;
}

export async function GET(req: NextRequest) {
  await dbConnect();
  let config = await Config.findOne({ key: 'global_config' });
  if (!config) {
    config = await Config.create({ key: 'global_config' });
  }
  return NextResponse.json(config);
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const { activePhase, mealWindows } = body;
    
    await dbConnect();
    const update: any = {};
    if (activePhase !== undefined) update.activePhase = activePhase;
    if (mealWindows !== undefined) update.mealWindows = mealWindows;

    const config = await Config.findOneAndUpdate(
      { key: 'global_config' },
      update,
      { new: true, upsert: true }
    );
    
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ status: 'ERROR', message: 'Internal Server Error' }, { status: 500 });
  }
}
