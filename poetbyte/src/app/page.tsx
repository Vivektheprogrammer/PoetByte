import Link from 'next/link';
import ContentTabs from '@/components/ContentTabs';
import PoemDeepLink from '@/components/PoemDeepLink';
import connectToDatabase from '@/lib/mongodb';
import Poem from '@/models/Poem';

export const dynamic = 'force-dynamic';

async function getPoems() {
  try {
    await connectToDatabase();
    const poems = await Poem.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(poems));
  } catch (error) {
    console.error('Error fetching poems:', error);
    return [];
  }
}

export default async function Home() {
  const poems = await getPoems();

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <h1 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
        Welcome to PoetByte
      </h1>

      {Array.isArray(poems) && poems.length > 0 ? (
        <ContentTabs initialPoems={poems} />
      ) : (
        <div className="text-center py-16 animate-fade-in max-w-md mx-auto">
          <div className="card p-8">
            <p className="text-2xl font-semibold mb-4 text-[var(--primary)]">
              No content available yet.
            </p>
            <p className="mb-8 opacity-80">
              Visit the admin dashboard to add your first poem or quote!
            </p>
            <Link
              href="/admin"
              className="btn btn-primary inline-block animate-pulse"
            >
              Go to Admin
            </Link>
          </div>
        </div>
      )}
      <PoemDeepLink />
    </div>
  );
}