import { useState } from 'react';
import { Heart, Leaf, Plus } from 'lucide-react';
import { PlantArt } from './PlantArt';

export type Product = {
  id: string;
  name: string;
  category: 'plants' | 'pots' | 'care';
  label: string;
  description: string;
  price: number;
  originalPrice?: number;
  care?: string;
  art: 'monstera' | 'snake' | 'pothos' | 'pot' | 'kit';
  colors?: { name: string; hex: string }[];
};

type Props = { product: Product; onAdd: (product: Product, color: string) => void; onFavorite: (name: string) => void };

export function ProductCard({ product, onAdd, onFavorite }: Props) {
  const [color, setColor] = useState(product.colors?.[0]?.hex ?? '#c87d55');
  const [favorite, setFavorite] = useState(false);
  return <article className="product-card" data-testid={`card-product-${product.id}`}>
    <div className="product-visual">
      <span className="product-badge">{product.label}</span>
      <button type="button" className={`favorite${favorite ? ' active' : ''}`} aria-label={favorite ? `إزالة ${product.name} من المفضلة` : `أضف ${product.name} للمفضلة`} aria-pressed={favorite} onClick={() => { setFavorite(!favorite); onFavorite(product.name); }} data-testid={`favorite-${product.id}`}><Heart size={17} fill={favorite ? 'currentColor' : 'none'} /></button>
      <div className="product-art"><PlantArt potColor={color} type={product.art} /></div>
    </div>
    <div className="product-info">
      <div className="product-type">{product.category === 'plants' ? 'نباتات داخلية' : product.category === 'pots' ? 'أصص يدوية' : 'عناية بالتربة'}</div>
      <h3 className="product-title">{product.name}</h3>
      <p className="product-description">{product.description}</p>
      <div className="product-meta">
        <span className="care-level">{product.care && <><Leaf size={14} /> {product.care}</>}</span>
        <span className="price-stack">
          <span className="price">{product.price.toFixed(2)} د.ك</span>
          {product.originalPrice && <span className="original-price">{product.originalPrice.toFixed(2)} د.ك</span>}
        </span>
      </div>
      <p className="installment">أو 4 دفعات بقيمة {(product.price / 4).toFixed(2)} د.ك مع ديمة</p>
      <div className="card-bottom">
        <div className="swatches" aria-label="اختر لون الأصيص">
          {product.colors?.map((swatch) => <button key={swatch.hex} type="button" className={`swatch${color === swatch.hex ? ' selected' : ''}`} style={{ backgroundColor: swatch.hex }} aria-label={`لون ${swatch.name}`} aria-pressed={color === swatch.hex} onMouseEnter={() => setColor(swatch.hex)} onFocus={() => setColor(swatch.hex)} onClick={() => setColor(swatch.hex)} data-testid={`swatch-${product.id}-${swatch.name}`} />)}
        </div>
        <button type="button" className="add-button" onClick={() => onAdd(product, color)} data-testid={`add-to-cart-${product.id}`}><Plus size={15} /> أضف للسلة</button>
      </div>
    </div>
  </article>;
}
