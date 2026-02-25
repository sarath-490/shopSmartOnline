import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClickTracking extends Document {
  affiliateLink: mongoose.Types.ObjectId;
  guide?: mongoose.Types.ObjectId;
  timestamp: Date;
  device?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
}

const ClickTrackingSchema: Schema = new Schema(
  {
    affiliateLink: { type: Schema.Types.ObjectId, ref: 'AffiliateLink', required: true, index: true },
    guide: { type: Schema.Types.ObjectId, ref: 'Guide' },
    timestamp: { type: Date, default: Date.now, index: true },
    device: { type: String },
    referrer: { type: String },
    userAgent: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

const ClickTracking: Model<IClickTracking> = mongoose.models.ClickTracking || mongoose.model<IClickTracking>('ClickTracking', ClickTrackingSchema);

export default ClickTracking;
