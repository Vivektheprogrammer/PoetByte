import mongoose from 'mongoose';

// Simple connection cache
let isConnected = false;

// Check for MongoDB URI in a way that works with static generation
const MONGODB_URI = process.env.MONGODB_URI;

// For static generation, we need to handle missing env vars gracefully
async function connectToDatabase(): Promise<typeof mongoose> {
  // If already connected, return mongoose
  if (isConnected) {
    return mongoose;
  }

  // Check if we have a MongoDB URI
  if (!MONGODB_URI) {
    console.warn('MONGODB_URI environment variable is not defined');
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  try {
    const options = {
      connectTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,  // 45 seconds
    };
    
    await mongoose.connect(MONGODB_URI, options);
    isConnected = true;
    console.log('MongoDB connected successfully');
    return mongoose;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default connectToDatabase;