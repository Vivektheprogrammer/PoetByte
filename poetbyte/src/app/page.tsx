import Link from 'next/link';

// Configure the page to be statically generated but revalidated every 60 seconds
export const revalidate = 60;

async function getPoems() {
  try {
    // Use absolute URL with proper configuration for static generation
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://poetbyte.vercel.app';
    const url = new URL('/api/poems', baseUrl);
    
    const res = await fetch(url.toString(), { 
      next: { revalidate } // Use the revalidate value from above
    });

    if (!res.ok) {
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
            <div
              key={poem._id}
              className="card p-6 hover-lift stagger-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h2 className="text-xl font-semibold mb-1 text-[var(--primary)]">
                {poem.title}
              </h2>
              <div className="mb-2 text-sm">
                <span className="text-[var(--accent)]">By</span>{' '}
                <span className="text-[var(--accent)] font-medium">
                  {poem.author || 'Unknown'}
                </span>
              </div>
              <p className="mb-4 text-gray-600">
                {poem.content.substring(0, 150)}
                {poem.content.length > 150 ? '...' : ''}
              </p>
              <Link
                href={`/poems/${poem._id}`}
                className="inline-block mt-2 text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium transition-all duration-200"
              >
                Read More →
              </Link>
            </div>
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