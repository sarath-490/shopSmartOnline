import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGuide extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage?: string;
  category: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  author: mongoose.Types.ObjectId;
  status: 'draft' | 'published';
  featured: boolean;
  publishDate?: Date;
  quickRecommendation?: {
    productName: string;
    affiliateLink?: string;
    reason: string;
    image?: string;
  };
  ratingScore?: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const GuideSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    summary: { type: String, required: true },
    content: { type: String, required: true }, // Rich text HTML
    featuredImage: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    featured: { type: Boolean, default: false },
    publishDate: { type: Date },
    quickRecommendation: {
      productName: { type: String },
      affiliateLink: { type: String },
      reason: { type: String },
      image: { type: String },
    },
    ratingScore: { type: Number, min: 0, max: 10 },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      focusKeyword: { type: String },
    },
  },
  { timestamps: true }
);

// Index for search
GuideSchema.index({ title: 'text', summary: 'text', content: 'text' });

const Guide: Model<IGuide> = mongoose.models.Guide || mongoose.model<IGuide>('Guide', GuideSchema);

export default Guide;
