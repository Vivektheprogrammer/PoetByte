import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Poem from '@/models/Poem';

export async function POST(request: NextRequest) {
  try {
    const { poemId, action } = await request.json();
    
    if (!poemId) {
      return NextResponse.json({ error: 'Poem ID is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Find the poem
    const poem = await Poem.findById(poemId);
    
    if (!poem) {
      return NextResponse.json({ error: 'Poem not found' }, { status: 404 });
    }
    
    // Update like count based on action
    if (action === 'like') {
      // Increment likes (or initialize if doesn't exist)
      poem.likes = (poem.likes || 0) + 1;
    } else if (action === 'unlike') {
      // Decrement likes, but don't go below 0
      poem.likes = Math.max((poem.likes || 0) - 1, 0);
    }
    
    await poem.save();
    
    // Don't return the like count to frontend
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error handling like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}