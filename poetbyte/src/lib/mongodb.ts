import mongoose from 'mongoose';

// Simple connection cache
let isConnected = false;

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

async function connectToDatabase(): Promise<typeof mongoose> {
  // If already connected, return mongoose
  if (isConnected) {
    return mongoose;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected successfully');
    return mongoose;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default connectToDatabase;