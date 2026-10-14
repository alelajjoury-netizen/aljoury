'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().trim().min(2, 'اكتبي اسمك الكامل.'),
  email: z.string().trim().email('أدخلي بريداً إلكترونياً صحيحاً.'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.'),
});
const loginSchema = signupSchema.pick({ email: true, password: true });

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isSignup = mode === 'signup';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const values = isSignup ? { name, email, password } : { email, password };
    const parsed = (isSignup ? signupSchema : loginSchema).safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'راجعي البيانات المدخلة.');
      return;
    }

    setBusy(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? 'تعذر تسجيل الدخول.');
      router.push('/');
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'حدث خطأ غير متوقع.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-section" dir="rtl">
      <form className="auth-card" onSubmit={submit} noValidate>
        <p className="section-kicker">أهلاً بك في وَرَق</p>
        <h1>{isSignup ? 'أنشئي حسابك' : 'سجّلي الدخول'}</h1>
        <p className="auth-intro">
          {isSignup ? 'احفظي اختياراتك وتابعي طلباتك.' : 'سعداء بعودتك إلى مساحتك الخضراء.'}
        </p>
        {isSignup && (
          <label className="form-field">
            الاسم الكامل
            <input
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
        )}
        <label className="form-field">
          البريد الإلكتروني
          <input
            name="email"
            type="email"
            autoComplete="email"
            dir="ltr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="form-field">
          كلمة المرور
          <input
            name="password"
            type="password"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </label>
        {error && <p className="error-message" role="alert">{error}</p>}
        <button className="button-primary auth-submit" type="submit" disabled={busy}>
          {busy ? 'جارٍ الإرسال…' : isSignup ? 'إنشاء حساب' : 'دخول'}
        </button>
        <p className="auth-switch">
          {isSignup ? 'لديك حساب؟ ' : 'ليس لديك حساب؟ '}
          <Link href={isSignup ? '/login' : '/signup'}>
            {isSignup ? 'سجّلي الدخول' : 'أنشئي حساباً'}
          </Link>
        </p>
      </form>
    </section>
  );
}
