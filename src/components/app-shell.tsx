'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, CheckCircle2, MapPin, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { MobileNav } from './mobile-nav';
import { BottomSheet } from './bottom-sheet';

const notifications = [
  { title: 'Informação confirmada', text: 'A Padaria Bellini foi confirmada há 18 min.', icon: CheckCircle2 },
  { title: 'Novo ponto próximo', text: 'Um novo Ponto Akolá foi publicado na Asa Sul.', icon: MapPin },
];

export function AppShell({ children, title }: { children: React.ReactNode; title?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [query, setQuery] = useState('');
  function submitSearch(event: React.FormEvent) { event.preventDefault(); const value = query.trim(); router.push(value ? `/mapa?q=${encodeURIComponent(value)}` : '/mapa'); setSearchOpen(false); }
  return (
    <div className="min-h-screen bg-akola-background">
      <header className="sticky top-0 z-40 border-b border-akola-border/80 bg-akola-background/92 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-akola-brand">Akolá</Link>
          <button onClick={() => setSearchOpen(true)} className="mx-6 hidden flex-1 items-center justify-start gap-3 rounded-2xl border border-akola-border bg-white px-4 py-3 text-sm text-akola-muted transition hover:border-[#C8D3CF] md:flex md:max-w-xl"><Search size={18} />Buscar banheiro, água ou lugar</button>
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} aria-label="Pesquisar" className="grid h-10 w-10 place-items-center rounded-xl border border-akola-border bg-white text-akola-muted md:hidden"><Search size={18} /></button>
            <Link href="/contribuir" className="flex h-10 items-center gap-2 rounded-xl bg-akola-brand px-3 text-sm font-semibold text-white sm:px-4"><Plus size={16} /><span className="hidden sm:inline">Adicionar ponto</span></Link>
            <button onClick={() => setNotificationsOpen(true)} aria-label="Notificações" className="relative grid h-10 w-10 place-items-center rounded-xl border border-akola-border bg-white text-akola-muted"><Bell size={18} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-akola-danger ring-2 ring-white" /></button>
          </div>
        </div>
      </header>
      {title && <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8"><h1 className="text-2xl font-semibold">{title}</h1></div>}
      <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 md:pb-10">{children}</main>
      <MobileNav />
      <BottomSheet open={searchOpen} onClose={() => setSearchOpen(false)} title="Buscar no Akolá" description="Encontre um banheiro, água ou um estabelecimento perto de você.">
        <form onSubmit={submitSearch}>
          <label className="flex h-[52px] items-center gap-3 rounded-[14px] border border-akola-border bg-white px-4 focus-within:border-akola-brand"><Search size={18} className="text-akola-muted" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent !text-base outline-none" placeholder="Nome, endereço ou serviço" /></label>
          <div className="mt-3 flex flex-wrap gap-2">{['Banheiro', 'Água', 'Aberto agora'].map((item) => <button key={item} type="button" onClick={() => setQuery(item)} className="rounded-full border border-akola-border px-3 py-2 text-xs font-medium text-akola-muted">{item}</button>)}</div>
          <button className="mt-4 h-[50px] w-full rounded-[14px] bg-akola-brand text-sm font-medium text-white">Pesquisar</button>
          {pathname !== '/mapa' && <button type="button" onClick={() => { router.push('/mapa'); setSearchOpen(false); }} className="mt-3 h-[50px] w-full rounded-[14px] bg-akola-soft text-sm font-medium text-akola-brand">Abrir mapa</button>}
        </form>
      </BottomSheet>
      <BottomSheet open={notificationsOpen} onClose={() => setNotificationsOpen(false)} title="Notificações" description="Atualizações úteis dos seus pontos e contribuições.">
        <div className="space-y-3">{notifications.map(({ title: itemTitle, text, icon: Icon }) => <article key={itemTitle} className="flex gap-3 rounded-[14px] border border-akola-border p-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-akola-soft text-akola-brand"><Icon size={18} /></div><div><h3 className="text-sm font-semibold">{itemTitle}</h3><p className="mt-1 text-xs leading-5 text-akola-muted">{text}</p></div></article>)}</div>
        <button onClick={() => setNotificationsOpen(false)} className="mt-4 h-[50px] w-full rounded-[14px] bg-akola-soft text-sm font-medium text-akola-brand">Marcar como lidas</button>
      </BottomSheet>
    </div>
  );
}
