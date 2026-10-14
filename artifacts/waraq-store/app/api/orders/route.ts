import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth';
import { connectDB } from '../../../lib/db';
import { Order } from '../../../models/Order';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'سجّلي الدخول لعرض طلباتك.' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    await connectDB();
    const orders = await Order.find({ user: user.id })
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
