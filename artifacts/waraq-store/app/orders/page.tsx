import Link from 'next/link';
import { getCurrentUser } from '../../lib/auth';
import { connectDB } from '../../lib/db';
import { Order } from '../../models/Order';

export const metadata = { title: 'طلباتي | وَرَق' };

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  let user: Awaited<ReturnType<typeof getCurrentUser>>;
  try {
    user = await getCurrentUser();
  } catch {
    return (
      <section className="section orders-page" dir="rtl">
        <h1 className="section-title">طلباتي</h1>
        <p className="store-message error-message" role="alert">
          تعذر الاتصال بالمتجر حالياً. يرجى المحاولة لاحقاً.
        </p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section orders-page" dir="rtl">
        <h1 className="section-title">طلباتي</h1>
        <div className="empty-state">
          <h2>سجّلي الدخول لمتابعة طلباتك</h2>
          <Link href="/login" className="button-primary">دخول</Link>
        </div>
      </section>
    );
  }

  try {
    await connectDB();
    const orders = await Order.find({ user: user.id }).sort({ createdAt: -1 }).lean();
    return (
      <section className="section orders-page" dir="rtl">
        <p className="section-kicker">مرحباً {user.name}</p>
        <h1 className="section-title">طلباتي</h1>
        {orders.length === 0 ? (
          <div className="empty-state">
            <h2>لا توجد طلبات حتى الآن</h2>
            <p>ستظهر طلباتك هنا بعد إتمامها.</p>
            <Link href="/products" className="button-primary">استكشفي المنتجات</Link>
          </div>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
              <article className="order-row" key={order._id.toString()}>
                <span>طلب #{order._id.toString().slice(-6)}</span>
                <span>{new Date(order.createdAt).toLocaleDateString('ar-KW')}</span>
                <strong>{order.total.toFixed(2)} د.ك</strong>
                <span>{order.status === 'paid' ? 'مدفوع' : 'قيد الانتظار'}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    );
  } catch {
    return (
      <section className="section orders-page" dir="rtl">
        <h1 className="section-title">طلباتي</h1>
        <p className="store-message error-message" role="alert">
          تعذر تحميل الطلبات حالياً. يرجى المحاولة لاحقاً.
        </p>
      </section>
    );
  }
}
