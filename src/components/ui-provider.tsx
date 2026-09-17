'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { api } from '@/lib/api';

export type CurrentUser = { id: string; name: string; email: string; role: string; reputationScore: number };

type UiContextValue = {
  favorites: Set<string>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  toast: (message: string) => void;
  user: CurrentUser | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['padaria-bellini', 'cafe-ernesto']));
  const [message, setMessage] = useState('');
  const toastTimer = useRef<number | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem('akola:favorites');
    if (saved) setFavorites(new Set(JSON.parse(saved) as string[]));
    const token = window.localStorage.getItem('akola:token');
    if (!token) { setAuthLoading(false); return; }
    api.get<CurrentUser>('/me').then((response) => setUser(response.data)).catch(() => window.localStorage.removeItem('akola:token')).finally(() => setAuthLoading(false));
  }, []);

  const toast = useCallback((text: string) => {
    setMessage(text);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setMessage(''), 3200);
  }, []);

  useEffect(() => { if (user) api.get<Array<{ id: string }>>('/favorites').then((response) => { const ids = new Set(response.data.map((place) => place.id)); setFavorites(ids); window.localStorage.setItem('akola:favorites', JSON.stringify([...ids])); }).catch(() => undefined); }, [user]);

  const toggleFavorite = useCallback((id: string) => {
    const removing = favorites.has(id);
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      window.localStorage.setItem('akola:favorites', JSON.stringify([...next]));
      return next;
    });
    if (user) (removing ? api.delete(`/favorites/${id}`) : api.post(`/favorites/${id}`)).catch(() => toast('Não foi possível sincronizar o favorito'));
  }, [favorites, user, toast]);

  const saveSession = useCallback((payload: { user: CurrentUser; accessToken: string; refreshToken?: string }) => { window.localStorage.setItem('akola:token', payload.accessToken); if (payload.refreshToken) window.localStorage.setItem('akola:refresh', payload.refreshToken); setUser(payload.user); }, []);
  const login = useCallback(async (email: string, password: string) => { const response = await api.post('/auth/login', { email, password }); saveSession(response.data); }, [saveSession]);
  const register = useCallback(async (name: string, email: string, password: string) => { const response = await api.post('/auth/register', { name, email, password }); saveSession(response.data); }, [saveSession]);
  const logout = useCallback(() => { window.localStorage.removeItem('akola:token'); window.localStorage.removeItem('akola:refresh'); setUser(null); }, []);

  const value = useMemo(() => ({ favorites, isFavorite: (id: string) => favorites.has(id), toggleFavorite, toast, user, authLoading, login, register, logout }), [favorites, toggleFavorite, toast, user, authLoading, login, register, logout]);

  return (
    <UiContext.Provider value={value}>
      {children}
      {message && <div role="status" aria-live="polite" className="fixed right-4 top-4 z-[1000] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-2xl border border-akola-border bg-white p-4 text-sm text-akola-text shadow-[0_16px_48px_rgba(23,33,31,.18)] md:right-6 md:top-6"><CheckCircle2 className="mt-0.5 shrink-0 text-akola-brand" size={20} /><span className="min-w-0 flex-1 font-medium leading-5">{message}</span><button onClick={() => setMessage('')} aria-label="Fechar notificação" className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-akola-muted hover:bg-akola-soft"><X size={16} /></button></div>}
    </UiContext.Provider>
  );
}

export function useUi() {
  const value = useContext(UiContext);
  if (!value) throw new Error('useUi must be used within UiProvider');
  return value;
}
