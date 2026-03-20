import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Poem from '@/models/Poem';

// Add export for static generation compatibility
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const poems = await Poem.find({}).sort({ createdAt: -1 });
    return NextResponse.json(poems);
  } catch (error) {
    console.error('Error fetching poems:', error);
    return NextResponse.json({ error: 'Failed to fetch poems' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, author, type } = await request.json();
    
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    
    if (type !== 'quote' && !title) {
      return NextResponse.json({ error: 'Title is required for poems' }, { status: 400 });
    }
    
    const validType = type === 'quote' ? 'quote' : 'poem';
    
    await connectToDatabase();
    
    const poemData: any = { 
      content, 
      author: author || 'Anonymous',
      type: validType
    };
    
    if (validType === 'poem' && title) {
      poemData.title = title;
    }
    
    const poem = new Poem(poemData);
    await poem.save();
    
    return NextResponse.json(poem, { status: 201 });
  } catch (error) {
    console.error('Error creating poem:', error);
    return NextResponse.json({ error: 'Failed to create poem' }, { status: 500 });
  }
}