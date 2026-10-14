import { ProductsPageClient } from '../../components/ProductsPageClient';
import type { ProductCategory } from '../../lib/types';

type SearchParams = Promise<{ category?: string }>;

export const metadata = {
  title: 'النباتات والأصص | وَرَق',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category: requested } = await searchParams;
  const initialCategory: ProductCategory | 'all' =
    requested === 'plants' || requested === 'pots' || requested === 'care'
      ? requested
      : 'all';

  return (
    <section className="section products-page" dir="rtl">
      <div className="section-head">
        <div>
          <p className="section-kicker">اختيارات وَرَق</p>
          <h1 className="section-title">كل ما يحتاجه بيتك ليزهر</h1>
        </div>
        <p className="section-copy">
          نباتات ظل سهلة العناية، أصص يدوية، ومجموعات مختارة للعناية بالتربة.
        </p>
      </div>
      <ProductsPageClient initialCategory={initialCategory} />
    </section>
  );
}
