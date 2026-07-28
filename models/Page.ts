import { Schema, model, models, Document } from 'mongoose';

export interface IPage extends Document {
  slug: string;
  title: string;
  content: string; // plain text; blank-line-separated paragraphs
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Page || model<IPage>('Page', PageSchema);
