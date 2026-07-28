import { Schema, model, models, Document, Types } from 'mongoose';

export interface IProductImage {
  fileId: Types.ObjectId; // GridFS file id (bucket: 'productImages')
  thumbFileId?: Types.ObjectId; // auto-generated thumbnail, GridFS file id
  alt: string;
  isPrimary: boolean;
}

export interface IProductVariant {
  size: string;
  color: string;
  colorHex?: string;
  stock: number;
  sku: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  brand?: string;
  category: Types.ObjectId;
  subcategory?: Types.ObjectId;
  gender: 'men' | 'women' | 'unisex';
  price: number;
  discountPrice?: number;
  images: IProductImage[];
  variants: IProductVariant[];
  tags: string[];
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  ratingAverage: number;
  ratingCount: number;
  seo: {
    title?: string;
    metaDescription?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    fileId: { type: Schema.Types.ObjectId, required: true },
    thumbFileId: { type: Schema.Types.ObjectId },
    alt: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    size: { type: String, required: true },
    color: { type: String, required: true },
    colorHex: { type: String },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, required: true, unique: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    brand: { type: String, default: 'ZANX WEAR' },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: Schema.Types.ObjectId, ref: 'Category' },
    gender: { type: String, enum: ['men', 'women', 'unisex'], default: 'unisex' },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    images: { type: [ProductImageSchema], default: [] },
    variants: { type: [ProductVariantSchema], default: [] },
    tags: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    seo: {
      title: { type: String },
      metaDescription: { type: String },
    },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', tags: 'text', description: 'text' });
ProductSchema.index({ category: 1, gender: 1 });
ProductSchema.index({ isFeatured: 1, isTrending: 1, isNewArrival: 1, isBestSeller: 1 });

// Virtual: total stock across variants
ProductSchema.virtual('totalStock').get(function (this: IProduct) {
  return this.variants.reduce((sum, v) => sum + v.stock, 0);
});

export default models.Product || model<IProduct>('Product', ProductSchema);
