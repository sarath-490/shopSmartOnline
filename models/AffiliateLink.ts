import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAffiliateLink extends Document {
  name: string;
  slug: string;
  originalUrl: string;
  guideReference?: mongoose.Types.ObjectId;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const AffiliateLinkSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    originalUrl: { type: String, required: true },
    guideReference: { type: Schema.Types.ObjectId, ref: 'Guide' },
    clickCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const AffiliateLink: Model<IAffiliateLink> = mongoose.models.AffiliateLink || mongoose.model<IAffiliateLink>('AffiliateLink', AffiliateLinkSchema);

export default AffiliateLink;
