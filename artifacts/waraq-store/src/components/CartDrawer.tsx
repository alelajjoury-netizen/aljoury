import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import type { Product } from './ProductCard';

export type CartLine = { product: Product; color: string; quantity: number };
type Props = { open: boolean; lines: CartLine[]; onClose: () => void; onQuantity: (id: string, delta: number) => void; onRemove: (id: string) => void };

export function CartDrawer({ open, lines, onClose, onQuantity, onRemove }: Props) {
  if (!open) return null;
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  return <>
    <button className="drawer-overlay" aria-label="إغلاق السلة" onClick={onClose} data-testid="close-cart-overlay" />
    <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="سلة التسوق" dir="rtl">
      <div className="drawer-head"><h2>سلتي <span className="muted">({count})</span></h2><button type="button" className="icon-button" aria-label="إغلاق السلة" onClick={onClose} data-testid="close-cart"><X size={21} /></button></div>
      <div className="drawer-body">
        {!lines.length ? <div className="cart-empty"><ShoppingBag size={35} strokeWidth={1.4} /><h3>سلّتك بانتظار نبتتك</h3><p>اختاري شيئاً أخضر يضيف حياة لمساحتك.</p></div> : lines.map((line) => {
          const key = `${line.product.id}:${line.color}`;
          return <div className="cart-line" key={key}>
          <div className="cart-thumb"><ShoppingBag size={25} /></div>
          <div><h3>{line.product.name}</h3><p>{line.product.price.toFixed(2)} د.ك · <span className="cart-color" style={{ backgroundColor: line.color }} /> لون الأصيص</p>
            <div className="quantity-control">
              <button aria-label={`زيادة كمية ${line.product.name}`} onClick={() => onQuantity(key, 1)} data-testid={`quantity-plus-${key}`}><Plus size={13} /></button>
              <span>{line.quantity}</span>
              <button aria-label={`تقليل كمية ${line.product.name}`} onClick={() => onQuantity(key, -1)} data-testid={`quantity-minus-${key}`}><Minus size={13} /></button>
            </div>
          </div>
          <button type="button" className="remove-item" aria-label={`حذف ${line.product.name}`} onClick={() => onRemove(key)} data-testid={`remove-${key}`}><Trash2 size={17} /></button>
        </div>;
        })}
      </div>
      {lines.length > 0 && <div className="drawer-foot"><div className="subtotal"><span>المجموع</span><span>{subtotal.toFixed(2)} د.ك</span></div><p className="shipping-note">الشحن يُحتسب عند إتمام الطلب</p><button type="button" className="button-primary" onClick={onClose} data-testid="continue-shopping">تابعي التسوق</button></div>}
    </aside>
  </>;
}
