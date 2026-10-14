'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export function CartPageClient() {
  const { lines, total, changeQuantity, remove } = useCart();

  if (lines.length === 0) {
    return (
      <section className="section cart-page" dir="rtl">
        <h1 className="section-title">سلتي</h1>
        <div className="empty-state">
          <h2>سلّتك بانتظار نبتتك</h2>
          <p>اختاري شيئاً أخضر يضيف حياة لمساحتك.</p>
          <Link href="/products" className="button-primary">استكشفي المنتجات</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section cart-page" dir="rtl">
      <h1 className="section-title">سلتي</h1>
      <div className="cart-page-layout">
        <div className="cart-page-lines">
          {lines.map((line) => (
            <article
              className="cart-page-line"
              key={`${line.product.slug}:${line.color.hex}`}
            >
              <img src={line.product.image} alt={line.product.name} />
              <div>
                <h2>{line.product.name}</h2>
                <p>{line.color.name} · {line.product.price.toFixed(2)} د.ك</p>
                <div className="quantity-control">
                  <button
                    type="button"
                    aria-label={`زيادة كمية ${line.product.name}`}
                    onClick={() => changeQuantity(line.product.slug, line.color.hex, 1)}
                  >+</button>
                  <span>{line.quantity}</span>
                  <button
                    type="button"
                    aria-label={`تقليل كمية ${line.product.name}`}
                    onClick={() => changeQuantity(line.product.slug, line.color.hex, -1)}
                  >−</button>
                </div>
              </div>
              <button
                type="button"
                className="remove-item"
                onClick={() => remove(line.product.slug, line.color.hex)}
              >حذف</button>
            </article>
          ))}
        </div>
        <aside className="order-summary">
          <h2>ملخص الطلب</h2>
          <p><span>المجموع</span><strong>{total.toFixed(2)} د.ك</strong></p>
          <p className="shipping-note">الشحن يُحتسب عند إتمام الطلب.</p>
          <button type="button" className="button-primary" disabled>
            إتمام الطلب قريباً
          </button>
          <Link href="/products" className="button-secondary">متابعة التسوق</Link>
        </aside>
      </div>
    </section>
  );
}
