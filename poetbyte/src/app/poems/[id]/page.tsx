import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import FeedbackForm from '@/components/FeedbackForm';

async function getPoem(id: string) {
  try {
    const hdrs = await headers();
    const host = hdrs.get('host');
    const proto = hdrs.get('x-forwarded-proto') ?? 'http';
    const url = `${proto}://${host}/api/poems/${id}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return null;
    }
    return res.json();
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 animate-slide-in">{poem.title}</h1>
        
        <div className="prose dark:prose-invert mb-8">
          {poem.content.split('\n').map((paragraph: string, index: number) => (
            <p 
              key={index} 
              className="mb-4 animate-fade-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {paragraph}
            </p>
          ))}
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Posted on {new Date(poem.createdAt).toLocaleDateString()}
        </div>
        <div className="text-sm mb-8">By <span className="text-[var(--accent)] font-medium">{poem.author || 'Unknown'}</span></div>
        
        <FeedbackForm poemId={id} />
      </div>
    </div>
  );
}