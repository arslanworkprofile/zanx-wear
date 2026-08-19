import { Schema, model, models, Document, Types } from 'mongoose';

export interface ICommunityPost extends Document {
  imageFileId: Types.ObjectId;
  postUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
}

const CommunityPostSchema = new Schema<ICommunityPost>(
  {
    imageFileId: { type: Schema.Types.ObjectId, required: true },
    postUrl: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.CommunityPost || model<ICommunityPost>('CommunityPost', CommunityPostSchema);
