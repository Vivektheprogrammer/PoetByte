import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const poemId = searchParams.get('poemId');
    
    await connectToDatabase();
    
    let query: Record<string, any> = {};
    if (poemId && mongoose.Types.ObjectId.isValid(poemId)) {
      query = { poemId: new mongoose.Types.ObjectId(poemId) };
    }
    
    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .populate('poemId', 'title');
    
    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json({ error: 'Failed to fetch feedbacks' }, { status: 500 });
  }
}