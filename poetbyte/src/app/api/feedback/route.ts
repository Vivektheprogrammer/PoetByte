import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    const { poemId, name, email, phone, message, anonymous } = await request.json();
    
    if (!poemId || !message) {
      return NextResponse.json({ error: 'Poem ID and message are required' }, { status: 400 });
    }
    
    if (!mongoose.Types.ObjectId.isValid(poemId)) {
      return NextResponse.json({ error: 'Invalid poem ID' }, { status: 400 });
    }
    
    await connectToDatabase();
    const feedback = new Feedback({
      poemId,
      name: anonymous ? undefined : name,
      email: anonymous ? undefined : email,
      phone: anonymous ? undefined : phone,
      message,
      anonymous
    });
    
    await feedback.save();
    
    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}