import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ status: 'ERROR', message: 'Username required' }, { status: 400 });
  }

  await dbConnect();

  try {
    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ status: 'NOT_FOUND', message: 'User not found' });
    }
    return NextResponse.json({ status: 'SUCCESS', user });
  } catch (error) {
    return NextResponse.json({ status: 'ERROR', message: 'Internal Server Error' }, { status: 500 });
  }
}
