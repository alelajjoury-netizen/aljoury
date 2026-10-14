import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '../../../../lib/db';
import { createSessionToken, SESSION_COOKIE, SESSION_SECONDS } from '../../../../lib/auth';
import { User } from '../../../../models/User';

const loginSchema = z.object({
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

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'أدخلي بريداً إلكترونياً وكلمة مرور صالحين.' },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    const user = await User.findOne({ email: parsed.data.email }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' },
        { status: 401 },
      );
    }

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
  } catch {
    return NextResponse.json(
      { error: 'تعذر تسجيل الدخول حالياً. يرجى المحاولة لاحقاً.' },
      { status: 503 },
    );
  }
}
