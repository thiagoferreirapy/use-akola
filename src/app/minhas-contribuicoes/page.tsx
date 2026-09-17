'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { useUi } from '@/components/ui-provider';

export default function ContributionsPage() {
  const { user, authLoading } = useUi(); const [items, setItems] = useState<Array<{ id: string; name: string; status: string; createdAt?: string }>>([]);
  useEffect(() => { if (user) api.get('/me/contributions').then((response) => setItems(response.data)).catch(() => undefined); }, [user]);
  return <AppShell title="Minhas contribuições"><Link href="/perfil" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-akola-muted"><ArrowLeft size={16} />Voltar ao perfil</Link>{!authLoading && !user ? <div className="rounded-2xl border border-akola-border bg-white p-8 text-center"><p className="font-semibold">Entre para ver suas contribuições</p><Link href="/login" className="mt-4 inline-flex rounded-xl bg-akola-brand px-4 py-3 text-sm font-semibold text-white">Entrar</Link></div> : items.length ? <div className="grid gap-3 md:grid-cols-2">{items.map((item) => <div key={item.id} className="rounded-2xl border border-akola-border bg-white p-5"><p className={`text-xs font-semibold ${item.status === 'PUBLISHED' ? 'text-akola-brand' : 'text-akola-warning'}`}>{item.status === 'PUBLISHED' ? 'Publicado' : 'Em moderação'}</p><h2 className="mt-2 font-semibold">{item.name}</h2><p className="mt-1 text-sm text-akola-muted">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : 'Atualizado recentemente'}</p></div>)}</div> : <div className="rounded-2xl border border-akola-border bg-white p-8 text-center text-sm text-akola-muted">Você ainda não enviou nenhum ponto.</div>}</AppShell>;
}
