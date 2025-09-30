import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Poem from '@/models/Poem';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid poem ID' }, { status: 400 });
    }
    
    await connectToDatabase();
    const poem = await Poem.findById(id);
    
    if (!poem) {
      return NextResponse.json({ error: 'Poem not found' }, { status: 404 });
    }
    
    return NextResponse.json(poem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch poem' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
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
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
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
    return NextResponse.json({ error: 'Failed to delete poem' }, { status: 500 });
  }
}