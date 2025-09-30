import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Poem from '@/models/Poem';

export async function GET() {
  try {
    await connectToDatabase();
    const poems = await Poem.find({}).sort({ createdAt: -1 });
    return NextResponse.json(poems);
  } catch (error) {
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
    const poem = new Poem({ title, content, author });
    await poem.save();
    
    return NextResponse.json(poem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create poem' }, { status: 500 });
  }
}