'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Heart, Leaf, Plus } from 'lucide-react';
import { useCart } from './CartProvider';
import type { PotColor, StoreProduct } from '../lib/types';
import { PlantArt } from '../src/components/PlantArt';

export function ProductCard({ product }: { product: StoreProduct }) {
  const defaultColor = product.potColors[0] ?? { name: 'طيني', hex: '#c87d55' };
  const [color, setColor] = useState<PotColor>(defaultColor);
  const [favorite, setFavorite] = useState(false);
  const { add } = useCart();

  return (
    <article className="product-card" data-testid={`card-product-${product.slug}`}>
      <div className="product-visual">
        <span className="product-badge">{product.label}</span>
        <button
          type="button"
          className={`favorite${favorite ? ' active' : ''}`}
          aria-label={favorite ? `إزالة ${product.name} من المفضلة` : `أضف ${product.name} للمفضلة`}
          aria-pressed={favorite}
          onClick={() => setFavorite((value) => !value)}
        >
          <Heart size={17} fill={favorite ? 'currentColor' : 'none'} />
        </button>
        <Link
          href={`/products/${product.slug}`}
          className="product-art"
          aria-label={`عرض ${product.name}`}
        >
          <PlantArt potColor={color.hex} type={product.art ?? 'monstera'} />
        </Link>
      </div>
      <div className="product-info">
        <div className="product-type">
          {product.category === 'plants'
            ? 'نباتات داخلية'
            : product.category === 'pots'
              ? 'أصص يدوية'
              : 'عناية بالتربة'}
        </div>
        <h3 className="product-title">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="product-description">{product.description}</p>
        <div className="product-meta">
          <span className="care-level">
            {product.careLevel && <><Leaf size={14} /> {product.careLevel}</>}
          </span>
          <span className="price-stack">
            <span className="price">{product.price.toFixed(2)} د.ك</span>
            {product.originalPrice && (
              <span className="original-price">
                {product.originalPrice.toFixed(2)} د.ك
              </span>
            )}
          </span>
        </div>
        <p className="installment">
          أو 4 دفعات بقيمة {(product.price / 4).toFixed(2)} د.ك مع ديمة
        </p>
        {product.wateringGuide && (
          <details className="plant-guide">
            <summary data-testid={`watering-guide-${product.slug}`}>
              دليل الري والعناية
            </summary>
            <p>{product.wateringGuide}</p>
          </details>
        )}
        {product.potColors.length > 0 && (
          <div className="swatches" aria-label="اختر لون الأصيص">
            {product.potColors.map((swatch) => (
              <button
                key={swatch.hex}
                type="button"
                className={`swatch${color.hex === swatch.hex ? ' selected' : ''}`}
                style={{ backgroundColor: swatch.hex }}
                aria-label={`لون ${swatch.name}`}
                aria-pressed={color.hex === swatch.hex}
                onMouseEnter={() => setColor(swatch)}
                onFocus={() => setColor(swatch)}
                onClick={() => setColor(swatch)}
                data-testid={`swatch-${product.slug}-${swatch.name}`}
              />
            ))}
          </div>
        )}
        <button
          type="button"
          className="add-button"
          onClick={() => add(product, color)}
          data-testid={`add-to-cart-${product.slug}`}
        >
          <Plus size={15} /> أضف للسلة
        </button>
      </div>
    </article>
  );
}
