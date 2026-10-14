'use client';

import { ProductGrid } from './ProductGrid';
import type { ProductCategory } from '../lib/types';

export function ProductsPageClient({
  initialCategory,
}: {
  initialCategory: ProductCategory | 'all';
}) {
  return <ProductGrid showFilters initialCategory={initialCategory} />;
}
