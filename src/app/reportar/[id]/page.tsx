'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { useParams, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useUi } from '@/components/ui-provider';

export default function ReportPage() {
  const params = useParams<{ id: string }>(); const searchParams = useSearchParams(); const from = searchParams.get('from') ?? 'mapa'; const { user, toast } = useUi();
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (!user) { toast('Entre para enviar uma denúncia'); window.location.href = '/login'; return; } const form = event.currentTarget; const values = new FormData(form); try { await api.post(`/places/${params.id}/reports`, { type: values.get('report'), description: values.get('description') }); form.reset(); toast('Denúncia enviada. Nossa equipe irá analisar.'); } catch { toast('Não foi possível enviar a denúncia'); } }
  return <AppShell><div className="mx-auto max-w-xl"><Link href={`/locais/${params.id}?from=${from}`} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-akola-muted"><ArrowLeft size={16} />Voltar ao ponto</Link><p className="text-sm font-semibold text-akola-danger">Reportar informação</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">O que aconteceu?</h1><p className="mt-2 text-sm leading-6 text-akola-muted">Sua denúncia ajuda a remover informações incorretas e proteger a confiança do mapa.</p><form onSubmit={submit} className="mt-6 rounded-[24px] border border-akola-border bg-white p-6"><div className="space-y-2">{['O estabelecimento recusou o acesso','Banheiro indisponível','Água indisponível','Horário incorreto','Local não existe mais','Outro problema'].map((item) => <label key={item} className="flex items-center gap-3 rounded-xl border border-akola-border px-4 py-3 text-sm"><input required type="radio" name="report" value={item} className="accent-akola-brand" />{item}</label>)}</div><textarea name="description" className="mt-4 min-h-28 w-full rounded-[14px] border border-akola-border px-4 py-3 outline-none focus:border-akola-brand" placeholder="Conte mais detalhes, se quiser." /><button className="mt-4 w-full rounded-2xl bg-akola-danger px-4 py-3.5 text-sm font-semibold text-white">Enviar denúncia</button></form></div></AppShell>;
}
