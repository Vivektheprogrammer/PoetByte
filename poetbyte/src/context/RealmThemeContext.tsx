'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type RealmTheme = 'celestial' | 'grimoire' | 'cyber';

interface RealmThemeContextType {
  realm: RealmTheme;
  setRealm: (realm: RealmTheme) => void;
  cycleRealm: () => void;
}

const RealmThemeContext = createContext<RealmThemeContextType | undefined>(undefined);

export function RealmThemeProvider({ children }: { children: React.ReactNode }) {
  const [realm, setRealmState] = useState<RealmTheme>('celestial');

  useEffect(() => {
    const saved = localStorage.getItem('poetbyte-realm') as RealmTheme;
    if (saved && ['celestial', 'grimoire', 'cyber'].includes(saved)) {
      setRealmState(saved);
      document.documentElement.setAttribute('data-realm', saved);
    } else {
      document.documentElement.setAttribute('data-realm', 'celestial');
    }
  }, []);

  const setRealm = (newRealm: RealmTheme) => {
    setRealmState(newRealm);
    localStorage.setItem('poetbyte-realm', newRealm);
    document.documentElement.setAttribute('data-realm', newRealm);
  };

  const cycleRealm = () => {
    const realms: RealmTheme[] = ['celestial', 'grimoire', 'cyber'];
    const nextIdx = (realms.indexOf(realm) + 1) % realms.length;
    setRealm(realms[nextIdx]);
  };

  return (
    <RealmThemeContext.Provider value={{ realm, setRealm, cycleRealm }}>
      {children}
    </RealmThemeContext.Provider>
  );
}

export function useRealmTheme() {
  const context = useContext(RealmThemeContext);
  if (!context) {
    throw new Error('useRealmTheme must be used within a RealmThemeProvider');
  }
  return context;
}
