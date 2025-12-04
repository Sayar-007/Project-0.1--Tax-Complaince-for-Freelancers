import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Check DB on every request

export async function GET() {
  try {
    // 1. Check Environment Variables presence
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error("Health Check: DATABASE_URL is missing");
      return NextResponse.json({ status: 'error', message: 'DATABASE_URL is missing in env' }, { status: 500 });
    }

    // 2. Test Database Connection
    const startTime = Date.now();
    // Simple query to check connection
    await prisma.$queryRaw`SELECT 1`; 
    const duration = Date.now() - startTime;

    return NextResponse.json({ 
      status: 'healthy', 
      database: 'connected', 
      latency: `${duration}ms`,
      timestamp: new Date().toISOString() 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Health Check Failed:", error);
    return NextResponse.json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message 
    }, { status: 500 });
  }
}
