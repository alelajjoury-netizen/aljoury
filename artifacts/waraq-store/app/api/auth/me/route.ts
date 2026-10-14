import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  SESSION_COOKIE,
  verifySessionToken,
} from '../../../../lib/auth';
import { connectDB } from '../../../../lib/db';
import { User } from '../../../../models/User';

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ user: null });

  const session = await verifySessionToken(token);
  if (!session) return NextResponse.json({ user: null });

  try {
    await connectDB();
    const user = await User.findById(session.userId).select('name email').lean();
    if (!user) return NextResponse.json({ user: null });
    return NextResponse.json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch {
    return NextResponse.json(
      { error: 'تعذر التحقق من الحساب حالياً.' },
      { status: 503 },
    );
  }
}
