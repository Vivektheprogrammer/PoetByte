import { notFound } from 'next/navigation';
import PoemDetailView from '@/components/PoemDetailView';
import connectToDatabase from '@/lib/mongodb';
import Poem from '@/models/Poem';

export const dynamic = 'force-dynamic';

async function getPoem(id: string) {
  try {
    await connectToDatabase();
    const poem = await Poem.findById(id).lean();
    if (!poem) return null;
    return JSON.parse(JSON.stringify(poem));
  } catch (error) {
    console.error('Error fetching poem:', error);
    return null;
  }
}

export default async function PoemPage({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);
  const poem = await getPoem(id);

  if (!poem) {
    notFound();
  }

  return <PoemDetailView poem={poem} />;
}