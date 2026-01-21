import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import ScanLog from '@/lib/models/ScanLog';

export async function GET(req: NextRequest) {
  // Basic auth check (hardcoded for MVP)
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return new NextResponse('Unauthorized', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin"' } });
  }
  
  // You might want to validate the token here against env vars
  // For now, assuming the middleware or frontend handles the login and sends a token/basic auth
  // But the PRD says "hardcoded auth". Let's check env vars.
  
  const [scheme, encoded] = authHeader.split(' ');
  if (!encoded || scheme !== 'Basic') {
      return new NextResponse('Unauthorized', { status: 401 });
  }
  
  const buffer = Buffer.from(encoded, 'base64');
  const [user, pass] = buffer.toString().split(':');
  
  if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS) {
      // Allow dev mode bypass if envs are missing, OR fail. 
      // Better to fail safe.
      if (!process.env.ADMIN_USER) {
          console.warn("ADMIN_USER not set in env");
      }
      return new NextResponse('Unauthorized', { status: 401 });
  }

  await dbConnect();

  try {
    const totalUsers = await User.countDocuments({});
    
    // Aggregate counts for meals
    // Using countDocuments with filters is simple and effective for MVP
    const stats = {
      totalUsers,
      lunch1: await User.countDocuments({ 'meals.lunch1.claimed': true }),
      dinner1: await User.countDocuments({ 'meals.dinner1.claimed': true }),
      midnight: await User.countDocuments({ 'meals.midnight.claimed': true }),
      breakfast2: await User.countDocuments({ 'meals.breakfast2.claimed': true }),
      lunch2: await User.countDocuments({ 'meals.lunch2.claimed': true }),
      swag: await User.countDocuments({ 'swag.claimed': true }),
    };

    const recentLogs = await ScanLog.find().sort({ scannedAt: -1 }).limit(20);

    return NextResponse.json({ stats, recentLogs });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ status: 'ERROR', message: 'Internal Server Error' }, { status: 500 });
  }
}
