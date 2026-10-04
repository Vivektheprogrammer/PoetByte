import { MetadataRoute } from 'next';
import connectToDatabase from '@/lib/mongodb';
import Poem from '@/models/Poem';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://poetbyte.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    await connectToDatabase();
    const poems = await Poem.find({}, '_id createdAt').lean();

    dynamicRoutes = poems.map((poem) => ({
      url: `${BASE_URL}/poems/${poem._id.toString()}`,
      lastModified: poem.createdAt ? new Date(poem.createdAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generating dynamic sitemap routes:', error);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
