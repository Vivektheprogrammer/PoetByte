import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPoemDocument extends Document {
  title?: string;
  content: string;
  author: string;
  type: 'poem' | 'quote';
  createdAt: Date;
  likes?: number;
}

const PoemSchema = new Schema<IPoemDocument>({
  title: { type: String, required: false },
  content: { type: String, required: true },
  author: { type: String, default: 'Anonymous' },
  type: { type: String, enum: ['poem', 'quote'], default: 'poem' },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 }
});

// Check if the model exists before creating a new one
const Poem: Model<IPoemDocument> = mongoose.models.Poem as Model<IPoemDocument> || 
  mongoose.model<IPoemDocument>('Poem', PoemSchema);

export default Poem;