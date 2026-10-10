import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PoemDetailView from '@/components/PoemDetailView';
import connectToDatabase from '@/lib/mongodb';
import Poem from '@/models/Poem';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://poetbyte.vercel.app';

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

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await Promise.resolve(params);
  const poem = await getPoem(id);

  if (!poem) {
    return {
      title: 'Poem Not Found | PoetByte',
    };
  }

  const excerpt = poem.content
    ? poem.content.slice(0, 160).replace(/\n/g, ' ')
    : 'A lyrical verse from PoetByte Anthology by Vivek R.';

  const authorName = poem.author || 'Vivek R';

  return {
    title: `${poem.title} | PoetByte • ${authorName}`,
    description: excerpt,
    keywords: [poem.title, 'PoetByte', authorName, 'poem', 'poetry anthology', poem.category || 'poem'],
    authors: [{ name: authorName, url: 'https://vivekr.vercel.app/' }],
    alternates: {
      canonical: `/poems/${id}`,
    },
    openGraph: {
      type: 'article',
      url: `${BASE_URL}/poems/${id}`,
      title: `${poem.title} • ${authorName}`,
      description: excerpt,
      siteName: 'PoetByte',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${poem.title} • ${authorName}`,
      description: excerpt,
    },
  };
}

async function getRelatedPoems(currentId: string) {
  try {
    await connectToDatabase();
    const poems = await Poem.find({ _id: { $ne: currentId } })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    return JSON.parse(JSON.stringify(poems));
  } catch (error) {
    console.error('Error fetching related poems:', error);
    return [];
  }
}

export default async function PoemPage({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);
  const poem = await getPoem(id);

  if (!poem) {
    notFound();
  }

  const relatedPoems = await getRelatedPoems(id);

  const poemJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    headline: poem.title,
    text: poem.content,
    author: {
      '@type': 'Person',
      name: poem.author || 'Vivek R',
      url: 'https://vivekr.vercel.app/',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PoetByte',
      url: BASE_URL,
    },
    datePublished: poem.createdAt,
    dateModified: poem.updatedAt || poem.createdAt,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(poemJsonLd) }}
      />
      <PoemDetailView poem={poem} relatedPoems={relatedPoems} />
    </>
  );
}