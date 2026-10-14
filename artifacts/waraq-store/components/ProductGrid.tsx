'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ProductCategory, StoreProduct } from '../lib/types';
import { ProductCard } from './ProductCard';

type Props = {
  featuredOnly?: boolean;
  showFilters?: boolean;
  initialCategory?: ProductCategory | 'all';
};

export function ProductGrid({
  featuredOnly = false,
  showFilters = false,
  initialCategory = 'all',
}: Props) {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState<ProductCategory | 'all'>(initialCategory);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/products', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('تعذر تحميل المنتجات الآن.');
        return (await response.json()) as StoreProduct[];
      })
      .then(setProducts)
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === 'AbortError') return;
        setError(cause instanceof Error ? cause.message : 'حدث خطأ غير متوقع.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      if (featuredOnly && !product.featured) return false;
      return category === 'all' || product.category === category;
    });
  }, [products, featuredOnly, category]);

  return (
    <>
      {showFilters && (
        <div className="category-tabs" role="group" aria-label="تصفية المنتجات">
          {[
            { id: 'all', label: 'كل المنتجات' },
            { id: 'plants', label: 'نباتات داخلية' },
            { id: 'pots', label: 'أصص يدوية' },
            { id: 'care', label: 'عناية بالتربة' },
          ].map((item) => (
            <button
              type="button"
              key={item.id}
              className={`category-tab${category === item.id ? ' active' : ''}`}
              aria-pressed={category === item.id}
              onClick={() => setCategory(item.id as ProductCategory | 'all')}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
      {loading ? (
        <p className="store-message" role="status">جارٍ تحميل المنتجات…</p>
      ) : error ? (
        <p className="store-message error-message" role="alert">{error}</p>
      ) : visibleProducts.length === 0 ? (
        <p className="store-message">لا توجد منتجات في هذه المجموعة حالياً.</p>
      ) : (
        <div className="product-grid" aria-live="polite">
          {visibleProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
