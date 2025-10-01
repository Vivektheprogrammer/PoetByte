import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPoemDocument extends Document {
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

const PoemSchema = new Schema<IPoemDocument>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'Anonymous' },
  createdAt: { type: Date, default: Date.now }
});

// Check if the model exists before creating a new one
const Poem: Model<IPoemDocument> = mongoose.models.Poem as Model<IPoemDocument> || 
  mongoose.model<IPoemDocument>('Poem', PoemSchema);

export default Poem;