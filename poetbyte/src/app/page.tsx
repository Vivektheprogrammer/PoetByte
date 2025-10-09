import Link from 'next/link';
import PoemCard from '@/components/PoemCard';

// Ensure fresh data; likes should reflect quickly
export const dynamic = 'force-dynamic';

async function getPoems() {
  try {
    // Use absolute URL with proper configuration for static generation
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://poetbyte.vercel.app';
    const url = new URL('/api/poems', baseUrl);
    
    const res = await fetch(url.toString(), {
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error('Failed to fetch poems with status:', res.status);
      throw new Error('Failed to fetch poems');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching poems:', error);
    return [];
  }
}

export default async function Home() {
  const poems: any[] = await getPoems();

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <h1 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
        Welcome to PoetByte
      </h1>

      {Array.isArray(poems) && poems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {poems.map((poem: any, index: number) => (
            <PoemCard 
              key={poem._id} 
              poem={poem} 
              index={index} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 animate-fade-in max-w-md mx-auto">
          <div className="card p-8">
            <p className="text-2xl font-semibold mb-4 text-[var(--primary)]">
              No poems available yet.
            </p>
            <p className="mb-8 opacity-80">
              Visit the admin dashboard to add your first poem!
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
    </div>
  );
}