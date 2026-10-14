import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { Product } from '../../../models/Product';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const allowedCategories = ['plants', 'pots', 'care'];

  if (category && !allowedCategories.includes(category)) {
    return NextResponse.json({ error: 'تصنيف المنتجات غير صالح.' }, { status: 400 });
  }
  if (featured && featured !== 'true' && featured !== 'false') {
    return NextResponse.json({ error: 'قيمة featured غير صالحة.' }, { status: 400 });
  }

  try {
    await connectDB();
    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;

    const products = await Product.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .limit(60)
      .lean();

    return NextResponse.json(
      products.map((product) => ({
        id: product._id.toString(),
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        featured: product.featured,
        label: product.label,
        careLevel: product.careLevel,
        wateringGuide: product.wateringGuide,
        art: product.art,
        potColors: product.potColors,
      })),
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json(
      { error: 'تعذر تحميل المنتجات حالياً. يرجى المحاولة لاحقاً.' },
      { status: 503 },
    );
  }
}
