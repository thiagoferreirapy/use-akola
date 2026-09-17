import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';
import { AppShell } from '@/components/app-shell';

const reviews = [
  ['Marina','Informação correta e banheiro bem limpo.','5'],
  ['Rafael','Entrei sem precisar consumir. Atendimento tranquilo.','5'],
  ['João','Tudo certo, mas o banheiro acessível estava ocupado.','4'],
];

export default async function ReviewsPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ from?: string }> }) {
  const { id } = await params; const { from = 'mapa' } = await searchParams;
  return <AppShell><div className="mx-auto max-w-2xl"><Link href={`/locais/${id}?from=${from}`} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-akola-muted"><ArrowLeft size={16} />Voltar ao ponto</Link><h1 className="mb-5 text-2xl font-semibold">Avaliações</h1><div className="space-y-3">{reviews.map(([name,text,score]) => <article key={name} className="rounded-2xl border border-akola-border bg-white p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">{name}</h2><span className="flex items-center gap-1 text-sm font-semibold"><Star size={14} fill="currentColor" className="text-akola-warning" />{score}</span></div><p className="mt-2 text-sm leading-6 text-akola-muted">{text}</p><div className="mt-3 flex flex-wrap gap-2 text-xs text-akola-muted"><span className="rounded-full bg-akola-soft px-2.5 py-1.5">Informação correta</span><span className="rounded-full bg-akola-soft px-2.5 py-1.5">Acolhimento bom</span></div></article>)}</div></div></AppShell>;
}
