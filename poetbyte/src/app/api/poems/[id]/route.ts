import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Poem from '@/models/Poem';
import mongoose from 'mongoose';

// Add export for static generation compatibility
export const dynamic = 'force-dynamic';

// Using the exact Next.js 15+ route handler type signature
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = 'then' in context.params ? await context.params : context.params;
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid poem ID' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Handle case where we're in static generation and DB might not be available
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production') {
      try {
        const poem = await Poem.findById(id);
        if (!poem) {
          return NextResponse.json({ error: 'Poem not found' }, { status: 404 });
        }
        return NextResponse.json(poem);
      } catch (dbError) {
        console.warn('DB query failed during static generation, returning empty object', dbError);
        // Return empty object instead of error for static generation
        return NextResponse.json({});
      }
    }
    
    // Normal operation
    const poem = await Poem.findById(id);

    if (!poem) {
      return NextResponse.json({ error: 'Poem not found' }, { status: 404 });
    }

    return NextResponse.json(poem);
  } catch (error) {
    console.error('Error fetching poem:', error);
    
    // During static generation, return empty object instead of error
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production') {
      console.warn('Returning empty object for static generation');
      return NextResponse.json({});
    }
    
    return NextResponse.json({ error: 'Failed to fetch poem' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = 'then' in context.params ? await context.params : context.params;
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid poem ID' }, { status: 400 });
    }

    const { title, content, author } = await request.json();
    if (!title && !content && !author) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    await connectToDatabase();
    const update: Record<string, unknown> = {};
    if (typeof title === 'string') update.title = title;
    if (typeof content === 'string') update.content = content;
    if (typeof author === 'string') update.author = author;

    const poem = await Poem.findByIdAndUpdate(id, update, { new: true });
    if (!poem) {
      return NextResponse.json({ error: 'Poem not found' }, { status: 404 });
    }

    return NextResponse.json(poem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update poem' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = 'then' in context.params ? await context.params : context.params;
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid poem ID' }, { status: 400 });
    }

    await connectToDatabase();
    const poem = await Poem.findByIdAndDelete(id);

    if (!poem) {
      return NextResponse.json({ error: 'Poem not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting poem:', error);
    return NextResponse.json({ error: 'Failed to delete poem' }, { status: 500 });
  }
}
