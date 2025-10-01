import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFeedbackDocument extends Document {
  poemId: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
  phone?: string;
  message: string;
  anonymous: boolean;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedbackDocument>({
  poemId: { type: Schema.Types.ObjectId, ref: 'Poem', required: true },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  message: { type: String, required: true },
  anonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Check if the model exists before creating a new one
const Feedback: Model<IFeedbackDocument> = mongoose.models.Feedback as Model<IFeedbackDocument> || 
  mongoose.model<IFeedbackDocument>('Feedback', FeedbackSchema);

export default Feedback;