'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartLine, PotColor, StoreProduct } from '../lib/types';

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  isOpen: boolean;
  add: (product: StoreProduct, color: PotColor) => void;
  changeQuantity: (slug: string, colorHex: string, delta: number) => void;
  remove: (slug: string, colorHex: string) => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'waraq-cart-v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setLines(parsed as CartLine[]);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const add = useCallback((product: StoreProduct, color: PotColor) => {
    setLines((current) => {
      const existing = current.find(
        (line) => line.product.slug === product.slug && line.color.hex === color.hex,
      );
      if (existing) {
        return current.map((line) =>
          line.product.slug === product.slug && line.color.hex === color.hex
            ? { ...line, quantity: line.quantity + 1, product }
            : line,
        );
      }
      return [...current, { product, color, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const changeQuantity = useCallback((slug: string, colorHex: string, delta: number) => {
    setLines((current) =>
      current
        .map((line) =>
          line.product.slug === slug && line.color.hex === colorHex
            ? { ...line, quantity: line.quantity + delta }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const remove = useCallback((slug: string, colorHex: string) => {
    setLines((current) =>
      current.filter(
        (line) => line.product.slug !== slug || line.color.hex !== colorHex,
      ),
    );
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      total: lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
      isOpen,
      add,
      changeQuantity,
      remove,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }),
    [lines, isOpen, add, changeQuantity, remove],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used within CartProvider');
  return value;
}

function CartDrawer() {
  const { lines, count, total, isOpen, closeCart, changeQuantity, remove } = useCart();
  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        className="drawer-overlay"
        aria-label="إغلاق السلة"
        onClick={closeCart}
        data-testid="cart-overlay"
      />
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="سلتي"
        dir="rtl"
      >
        <div className="drawer-head">
          <h2>سلتي <span className="muted">({count})</span></h2>
          <button
            type="button"
            className="icon-button"
            aria-label="إغلاق السلة"
            onClick={closeCart}
            data-testid="close-cart"
          >
            ×
          </button>
        </div>
        <div className="drawer-body">
          {lines.length === 0 ? (
            <div className="cart-empty">
              <h3>سلّتك بانتظار نبتتك</h3>
              <p>اختاري شيئاً أخضر يضيف حياة لمساحتك.</p>
            </div>
          ) : (
            lines.map((line) => (
              <div
                className="cart-line"
                key={`${line.product.slug}:${line.color.hex}`}
              >
                <img
                  className="cart-thumb-image"
                  src={line.product.image}
                  alt=""
                />
                <div>
                  <h3>{line.product.name}</h3>
                  <p>
                    {line.product.price.toFixed(2)} د.ك · {line.color.name}
                  </p>
                  <div className="quantity-control">
                    <button
                      type="button"
                      aria-label={`زيادة كمية ${line.product.name}`}
                      onClick={() =>
                        changeQuantity(line.product.slug, line.color.hex, 1)
                      }
                    >
                      +
                    </button>
                    <span>{line.quantity}</span>
                    <button
                      type="button"
                      aria-label={`تقليل كمية ${line.product.name}`}
                      onClick={() =>
                        changeQuantity(line.product.slug, line.color.hex, -1)
                      }
                    >
                      −
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="remove-item"
                  aria-label={`حذف ${line.product.name}`}
                  onClick={() => remove(line.product.slug, line.color.hex)}
                >
                  حذف
                </button>
              </div>
            ))
          )}
        </div>
        {lines.length > 0 && (
          <div className="drawer-foot">
            <div className="subtotal">
              <span>المجموع</span>
              <span>{total.toFixed(2)} د.ك</span>
            </div>
            <p className="shipping-note">الشحن يُحتسب عند إتمام الطلب</p>
            <a className="button-primary cart-review-button" href="/cart" onClick={closeCart}>
              مراجعة السلة
            </a>
          </div>
        )}
      </aside>
    </>
  );
}
