import Link from 'next/link';
import ContentTabs from '@/components/ContentTabs';
import PoemDeepLink from '@/components/PoemDeepLink';
import Hero3DScene from '@/components/Hero3DScene';
import connectToDatabase from '@/lib/mongodb';
import Poem from '@/models/Poem';
import { FaBookOpen, FaFeatherPointed } from 'react-icons/fa6';

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
    <div className="space-y-12 md:space-y-16 pb-12">
      {/* Vintage Quill & Inkpot Hero Scene */}
      <Hero3DScene />

      {/* Main Sanctuary Catalog */}
      <div className="container mx-auto px-4 max-w-7xl">
        {Array.isArray(poems) && poems.length > 0 ? (
          <ContentTabs initialPoems={poems} />
        ) : (
          <div className="text-center py-20 parchment-panel rounded-3xl p-8 max-w-md mx-auto border border-[#dfa84a]/30 space-y-6 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#991b1b] to-[#dfa84a] flex items-center justify-center text-[#fef3c7] text-2xl shadow-lg border border-[#f9e29d]/40">
              <FaFeatherPointed />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold text-[#f9e29d]">The Parchment Lies Blank</h3>
              <p className="text-[#b8a690] text-sm font-serif italic">
                No verses have been transcribed into this anthology yet. Visit the Scribe Admin to inscribe the first poem or quote!
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-serif font-bold text-[#1a1007] bg-gradient-to-r from-[#f9e29d] via-[#dfa84a] to-[#c9933b] shadow-lg active:scale-95 transition-all border border-[#fff2b2]"
            >
              <FaBookOpen />
              <span>Inscribe First Folio</span>
            </Link>
          </div>
        )}
      </div>

      <PoemDeepLink />
    </div>
  );
}