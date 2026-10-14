'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, ShoppingBag } from 'lucide-react';
import { useCart } from './CartProvider';

type CurrentUser = { name: string } | null;

export function Navbar() {
  const { count, openCart } = useCart();
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    setLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) return;
      setUser(null);
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <>
      <div className="announcement">توصيل مجاني للطلبات فوق 20 د.ك داخل الكويت</div>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="وَرَق، الصفحة الرئيسية">
            <span className="brand-mark">وَرَق <Leaf size={17} strokeWidth={1.5} /></span>
            <span className="brand-tag">أخضر يجدد بيتك</span>
          </Link>
          <nav className="main-nav" aria-label="التنقل الرئيسي">
            <Link href="/">الرئيسية</Link>
            <Link href="/products">النباتات والأصص</Link>
            <Link href="/orders">طلباتي</Link>
          </nav>
          <div className="header-actions">
            {user ? (
              <>
                <span className="nav-user" data-testid="text-current-user">{user.name}</span>
                <button
                  type="button"
                  className="nav-logout"
                  onClick={() => void logout()}
                  disabled={loggingOut}
                  data-testid="logout"
                >
                  {loggingOut ? 'جارٍ الخروج…' : 'خروج'}
                </button>
              </>
            ) : (
              <Link href="/login" className="nav-login">دخول</Link>
            )}
            <Link href="/signup" className="nav-signup">إنشاء حساب</Link>
            <button
              type="button"
              className="icon-button"
              aria-label={`فتح سلتي، ${count} منتجات`}
              onClick={openCart}
              data-testid="open-cart"
            >
              <ShoppingBag size={20} />
              {count > 0 && <span className="cart-count" aria-live="polite">{count}</span>}
            </button>
          </div>
        </div>
      </header>
      <nav className="bottom-nav" aria-label="التنقل السفلي">
        <Link href="/">الرئيسية</Link>
        <Link href="/products">تسوقي</Link>
        <Link href="/orders">طلباتي</Link>
        <Link href={user ? '/orders' : '/login'}>{user ? 'حسابي' : 'دخول'}</Link>
        <button type="button" onClick={openCart} data-testid="bottom-cart">
          <ShoppingBag size={18} />
          {count > 0 && <span className="bottom-count" aria-live="polite">{count}</span>}
          <span>سلتي</span>
        </button>
      </nav>
    </>
  );
}
