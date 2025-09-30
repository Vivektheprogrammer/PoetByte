import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedbackDocument extends Document {
  poemId: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
  phone?: string;
  message: string;
  anonymous: boolean;
  createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
  poemId: { type: Schema.Types.ObjectId, ref: 'Poem', required: true },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  message: { type: String, required: true },
  anonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Feedback || mongoose.model<IFeedbackDocument>('Feedback', FeedbackSchema);