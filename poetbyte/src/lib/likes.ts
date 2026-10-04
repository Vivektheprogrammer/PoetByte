const STORAGE_KEY = 'poetbyte_sealed_poems';

export function getLikedPoems(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isPoemLiked(poemId: string): boolean {
  if (!poemId || typeof window === 'undefined') return false;
  const likedList = getLikedPoems();
  return likedList.includes(poemId.toString());
}

export function setPoemLiked(poemId: string, liked: boolean): void {
  if (!poemId || typeof window === 'undefined') return;
  try {
    const idStr = poemId.toString();
    const current = getLikedPoems();
    let updated: string[];
    if (liked) {
      updated = current.includes(idStr) ? current : [...current, idStr];
    } else {
      updated = current.filter((id) => id !== idStr);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent('poetbyte_like_change', { detail: { poemId: idStr, liked } })
    );
  } catch (e) {
    console.error('Error updating like in localStorage:', e);
  }
}
