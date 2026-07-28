import { Schema, model, models, Document, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  parent?: Types.ObjectId | null;
  bannerFileId?: Types.ObjectId;
  order: number;
  isActive: boolean;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    bannerFileId: { type: Schema.Types.ObjectId },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Category || model<ICategory>('Category', CategorySchema);
