'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Order = {
  id: string;
  total: number;
  status: 'pending' | 'paid';
  createdAt: string;
};

export function OrdersPageClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    fetch('/api/orders')
      .then(async (response) => {
        if (response.status === 401) {
          setNeedsLogin(true);
          return [];
        }
        if (!response.ok) throw new Error('تعذر تحميل الطلبات.');
        return (await response.json()) as Order[];
      })
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section orders-page" dir="rtl">
      <h1 className="section-title">طلباتي</h1>
      {loading ? (
        <p className="store-message" role="status">جارٍ تحميل طلباتك…</p>
      ) : needsLogin ? (
        <div className="empty-state">
          <h2>سجّلي الدخول لمتابعة طلباتك</h2>
          <Link href="/login" className="button-primary">دخول</Link>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <h2>لا توجد طلبات حتى الآن</h2>
          <p>ستظهر طلباتك هنا بعد إتمامها.</p>
          <Link href="/products" className="button-primary">استكشفي المنتجات</Link>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <article className="order-row" key={order.id}>
              <span>طلب #{order.id.slice(-6)}</span>
              <span>{new Date(order.createdAt).toLocaleDateString('ar-KW')}</span>
              <strong>{order.total.toFixed(2)} د.ك</strong>
              <span>{order.status === 'paid' ? 'مدفوع' : 'قيد الانتظار'}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
