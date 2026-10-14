'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Leaf } from 'lucide-react';
import { useCart } from './CartProvider';
import type { PotColor, StoreProduct } from '../lib/types';
import { PlantArt } from '../src/components/PlantArt';

export function ProductDetailClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [color, setColor] = useState<PotColor | null>(null);
  const { add } = useCart();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/products/${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 404) throw new Error('لم نعثر على هذا المنتج.');
        if (!response.ok) throw new Error('تعذر تحميل المنتج الآن.');
        return (await response.json()) as StoreProduct;
      })
      .then((data) => {
        setProduct(data);
        setColor(data.potColors[0] ?? { name: 'طيني', hex: '#c87d55' });
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === 'AbortError') return;
        setError(cause instanceof Error ? cause.message : 'حدث خطأ غير متوقع.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [slug]);

  if (loading) return <p className="store-message" role="status">جارٍ تحميل المنتج…</p>;
  if (error || !product) return <p className="store-message error-message" role="alert">{error}</p>;

  return (
    <section className="section product-detail" dir="rtl">
      <Link className="back-link" href="/products"><ArrowRight size={16} /> العودة إلى المنتجات</Link>
      <div className="detail-layout">
        <div className="detail-visual">
          {product.category === 'plants' ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="detail-illustration">
              <PlantArt
                potColor={color?.hex ?? '#c87d55'}
                type={product.art ?? 'pot'}
              />
            </div>
          )}
        </div>
        <div className="detail-copy">
          <span className="section-kicker">{product.label}</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          {product.careLevel && (
            <p className="detail-care"><Leaf size={16} /> {product.careLevel}</p>
          )}
          <div className="detail-price">
            <strong>{product.price.toFixed(2)} د.ك</strong>
            {product.originalPrice && (
              <del>{product.originalPrice.toFixed(2)} د.ك</del>
            )}
          </div>
          <p className="installment">
            أو 4 دفعات بقيمة {(product.price / 4).toFixed(2)} د.ك مع ديمة
          </p>
          {product.potColors.length > 0 && (
            <div className="detail-swatches">
              <p>لون الأصيص: {color?.name}</p>
              <div className="swatches">
                {product.potColors.map((swatch) => (
                  <button
                    type="button"
                    key={swatch.hex}
                    className={`swatch${color?.hex === swatch.hex ? ' selected' : ''}`}
                    style={{ backgroundColor: swatch.hex }}
                    aria-label={`لون ${swatch.name}`}
                    aria-pressed={color?.hex === swatch.hex}
                    onMouseEnter={() => setColor(swatch)}
                    onFocus={() => setColor(swatch)}
                    onClick={() => setColor(swatch)}
                  />
                ))}
              </div>
            </div>
          )}
          {product.wateringGuide && (
            <details className="plant-guide" open>
              <summary>دليل الري والعناية</summary>
              <p>{product.wateringGuide}</p>
            </details>
          )}
          <button
            type="button"
            className="button-primary"
            onClick={() => add(product, color ?? { name: 'طيني', hex: '#c87d55' })}
            data-testid="detail-add-to-cart"
          >
            أضف للسلة
          </button>
        </div>
      </div>
    </section>
  );
}
