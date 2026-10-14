import mongoose from 'mongoose';
import { connectDB } from '../lib/db';
import { Product } from '../models/Product';

const products = [
  {
    slug: 'monstera',
    name: 'مونستيرا دليسيوسا',
    description: 'أوراقها المميزة تمنح أي زاوية حضوراً طبيعياً لافتاً.',
    price: 12.5,
    originalPrice: 15,
    image: '/waraq-hero.png',
    category: 'plants',
    featured: true,
    label: 'الأكثر حباً',
    careLevel: 'سهلة العناية',
    wateringGuide: 'اسقيها عندما يجف أول 3 سم من التربة، وضعيها قرب ضوء ساطع غير مباشر.',
    art: 'monstera',
    potColors: [
      { name: 'طيني', hex: '#c87d55' },
      { name: 'نعناعي', hex: '#8ea89d' },
      { name: 'عاجي', hex: '#ded7c8' },
    ],
  },
  {
    slug: 'sansevieria',
    name: 'سانسيفيريا',
    description: 'رفيقة متسامحة مع النسيان وتزدهر في الضوء الخافت.',
    price: 9.75,
    image: '/waraq-plants.png',
    category: 'plants',
    featured: true,
    label: 'مثالية للمبتدئين',
    careLevel: 'قليلة العناية',
    wateringGuide: 'اسقيها كل أسبوعين إلى ثلاثة أسابيع، واتركي التربة تجف تماماً بين الريات.',
    art: 'snake',
    potColors: [
      { name: 'طيني', hex: '#c87d55' },
      { name: 'غابة', hex: '#2a3b32' },
      { name: 'عاجي', hex: '#ded7c8' },
    ],
  },
  {
    slug: 'pothos',
    name: 'بوتس ذهبي',
    description: 'نبات متدلٍ بأوراق خضراء جميلة يضيء الرفوف والطاولات.',
    price: 7.5,
    image: '/waraq-plants.png',
    category: 'plants',
    featured: true,
    label: 'محبوبة الرفوف',
    careLevel: 'سهلة العناية',
    wateringGuide: 'اسقيها عند جفاف سطح التربة، وتجنبي ترك الماء في الصحن أسفل الأصيص.',
    art: 'pothos',
    potColors: [
      { name: 'طيني', hex: '#c87d55' },
      { name: 'نعناعي', hex: '#8ea89d' },
      { name: 'غابة', hex: '#2a3b32' },
    ],
  },
  {
    slug: 'pot-noura',
    name: 'أصيص نورة الفخاري',
    description: 'قطعة يدوية بملمس طبيعي تكمل جمال نباتاتك.',
    price: 6.25,
    image: '/waraq-hero.png',
    category: 'pots',
    featured: true,
    label: 'صناعة يدوية',
    art: 'pot',
    potColors: [
      { name: 'طيني', hex: '#c87d55' },
      { name: 'نعناعي', hex: '#8ea89d' },
      { name: 'عاجي', hex: '#ded7c8' },
    ],
  },
  {
    slug: 'pot-safa',
    name: 'أصيص صفا السيراميكي',
    description: 'خطوط هادئة ولمسة ناعمة للمكاتب والزوايا الصغيرة.',
    price: 8.5,
    image: '/waraq-plants.png',
    category: 'pots',
    featured: false,
    label: 'قطعة حرفية',
    art: 'pot',
    potColors: [
      { name: 'نعناعي', hex: '#8ea89d' },
      { name: 'عاجي', hex: '#ded7c8' },
      { name: 'طيني', hex: '#c87d55' },
    ],
  },
  {
    slug: 'soil-kit',
    name: 'مجموعة عناية بالتربة',
    description: 'مزيج تربة خفيف مع أدوات أساسية لبداية خضراء سهلة.',
    price: 5.75,
    image: '/waraq-plants.png',
    category: 'care',
    featured: true,
    label: 'كل ما تحتاجينه',
    art: 'kit',
    potColors: [],
  },
];

try {
  await connectDB();
  for (const product of products) {
    await Product.updateOne(
      { slug: product.slug },
      { $set: product },
      { upsert: true, runValidators: true },
    );
  }
  console.info(`Seeded ${products.length} Waraq products.`);
} catch {
  console.error(
    'Product seeding failed. Confirm the MongoDB connection is working before seeding.',
  );
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
