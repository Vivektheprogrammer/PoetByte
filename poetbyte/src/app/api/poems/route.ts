import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Poem from '@/models/Poem';

// Add export for static generation compatibility
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Handle case where we're in static generation and DB might not be available
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production') {
      try {
        const poems = await Poem.find({}).sort({ createdAt: -1 });
        return NextResponse.json(poems);
      } catch (dbError) {
        console.warn('DB query failed during static generation, returning empty array', dbError);
        // Return empty array instead of error for static generation
        return NextResponse.json([]);
      }
    }
    
    // Normal operation
    const poems = await Poem.find({}).sort({ createdAt: -1 });
    return NextResponse.json(poems);
  } catch (error) {
    console.error('Error fetching poems:', error);
    
    // During static generation, return empty array instead of error
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production') {
      console.warn('Returning empty array for static generation');
      return NextResponse.json([]);
    }
    
    return NextResponse.json({ error: 'Failed to fetch poems' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, author } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }
    
    await connectToDatabase();
    const poem = new Poem({ 
      title, 
      content, 
      author: author || 'Anonymous' 
    });
    await poem.save();
    
    return NextResponse.json(poem, { status: 201 });
  } catch (error) {
    console.error('Error creating poem:', error);
    return NextResponse.json({ error: 'Failed to create poem' }, { status: 500 });
  }
}