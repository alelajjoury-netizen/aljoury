import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '../../../lib/auth';
import { connectDB } from '../../../lib/db';
import { Order } from '../../../models/Order';

export const dynamic = 'force-dynamic';

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: 'سجّلي الدخول لعرض طلباتك.' }, { status: 401 });
  }

  try {
    await connectDB();
    const orders = await Order.find({ user: session.userId })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(
      orders.map((order) => ({
        id: order._id.toString(),
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      })),
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json(
      { error: 'تعذر تحميل الطلبات حالياً.' },
      { status: 503 },
    );
  }
}
