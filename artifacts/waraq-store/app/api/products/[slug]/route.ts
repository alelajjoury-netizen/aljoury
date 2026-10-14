import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db';
import { Product } from '../../../../models/Product';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!/^[a-z0-9-]{1,100}$/.test(slug)) {
    return NextResponse.json({ error: 'المنتج غير موجود.' }, { status: 404 });
  }

  try {
    await connectDB();
    const product = await Product.findOne({ slug }).lean();
    if (!product) {
      return NextResponse.json({ error: 'المنتج غير موجود.' }, { status: 404 });
    }

    return NextResponse.json(
      {
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
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json(
      { error: 'تعذر تحميل المنتج حالياً. يرجى المحاولة لاحقاً.' },
      { status: 503 },
    );
  }
}
