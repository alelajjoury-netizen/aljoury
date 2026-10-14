import { model, models, Schema } from 'mongoose';

const potColorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    hex: { type: String, required: true, match: /^#[0-9a-fA-F]{6}$/ },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    image: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ['plants', 'pots', 'care'] },
    featured: { type: Boolean, default: false },
    label: { type: String, default: 'اختيار وَرَق', trim: true },
    careLevel: { type: String, trim: true },
    wateringGuide: { type: String, trim: true, maxlength: 1000 },
    art: { type: String, enum: ['monstera', 'snake', 'pothos', 'pot', 'kit'] },
    potColors: { type: [potColorSchema], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

productSchema.index({ category: 1, featured: -1, createdAt: -1 });

export const Product = models.Product ?? model('Product', productSchema);
