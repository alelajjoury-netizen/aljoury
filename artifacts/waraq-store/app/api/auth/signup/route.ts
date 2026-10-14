import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '../../../../lib/db';
import { createSessionToken, SESSION_COOKIE, SESSION_SECONDS } from '../../../../lib/auth';
import { User } from '../../../../models/User';

const signupSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'أرسلي بيانات صالحة.' }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'تحققي من الاسم والبريد الإلكتروني وكلمة المرور.' },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await User.create({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
    });
    const token = await createSessionToken(user._id.toString());
    const response = NextResponse.json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_SECONDS,
    });
    return response;
  } catch (error) {
    const record = error && typeof error === 'object'
      ? (error as Record<string, unknown>)
      : null;
    if (record?.code === 11000) {
      return NextResponse.json(
        { error: 'هذا البريد الإلكتروني مسجل بالفعل.' },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: 'تعذر إنشاء الحساب حالياً. يرجى المحاولة لاحقاً.' },
      { status: 503 },
    );
  }
}
