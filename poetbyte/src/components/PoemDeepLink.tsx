'use client';

import { useEffect, useMemo, useState } from 'react';
import PoemModal from './PoemModal';

interface Poem {
  _id: string;
  title: string;
  content: string;
  author?: string;
  createdAt: string;
}

export default function PoemDeepLink() {
  const [poem, setPoem] = useState<Poem | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const poemId = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('poem');
  }, []);

  useEffect(() => {
    if (!poemId) return;
    const controller = new AbortController();
    const run = async () => {
      try {
        const base = (process as any).env?.NEXT_PUBLIC_BASE_URL || '';
        const url = base ? `${base}/api/poems/${poemId}` : `/api/poems/${poemId}`;
        const res = await fetch(url, { cache: 'no-store', signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        setPoem(data);
        setIsOpen(true);
      } catch (_) {
        // ignore
      }
    };
    run();
    return () => controller.abort();
  }, [poemId]);

  const handleClose = () => {
    setIsOpen(false);
    // Clean the query param without full reload
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('poem');
      window.history.replaceState({}, '', url.toString());
    }
  };

  if (!poem) return null;
  return (
    <PoemModal poem={poem} isOpen={isOpen} onClose={handleClose} />
  );
}


