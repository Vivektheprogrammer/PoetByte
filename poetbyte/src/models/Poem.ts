import mongoose, { Schema, Document } from 'mongoose';

export interface IPoemDocument extends Document {
  title: string;
  content: string;
  author?: string;
  createdAt: Date;
}

const PoemSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Poem || mongoose.model<IPoemDocument>('Poem', PoemSchema);