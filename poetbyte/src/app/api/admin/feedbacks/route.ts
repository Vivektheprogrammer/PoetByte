import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Feedback from '@/models/Feedback';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const poemId = searchParams.get('poemId');
    
    await connectToDatabase();
    
    let query = {};
    if (poemId) {
      query = { poemId };
    }
    
    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .populate('poemId', 'title');
    
    return NextResponse.json(feedbacks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch feedbacks' }, { status: 500 });
  }
}