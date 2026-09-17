'use client';

import Link from 'next/link';
import { ArrowLeft, Check, QrCode } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useUi } from './ui-provider';

export function OfferDetails({ offer, place }: { offer: { id: string; title: string; price: string; validUntil: string }; place: { id: string; name: string } }) {
  const [active, setActive] = useState(false);
  const { user, toast } = useUi();
  async function activate() { if (!user) { toast('Entre para ativar o benefício'); window.location.href = '/login'; return; } try { await api.post(`/offers/${offer.id}/redeem`, { placeId: place.id }); setActive(true); } catch { toast('Não foi possível ativar o benefício'); } }
  return <div className="mx-auto max-w-2xl"><Link href="/beneficios" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-akola-muted"><ArrowLeft size={16} />Voltar aos benefícios</Link><div className="overflow-hidden rounded-[28px] border border-akola-border bg-white"><div className="bg-akola-brand p-8 text-white"><p className="text-xs font-semibold uppercase tracking-[.14em] text-white/65">Benefício Akolá</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">{offer.title}</h1><p className="mt-3 text-2xl font-semibold">{offer.price}</p><p className="mt-2 text-sm text-white/70">{place.name} · {offer.validUntil}</p></div><div className="p-7"><h2 className="font-semibold">{active ? 'Benefício ativado' : 'Como usar'}</h2><p className="mt-2 text-sm leading-6 text-akola-muted">{active ? 'Apresente este QR no estabelecimento. O código expira em 15 minutos.' : 'Chegue ao estabelecimento, ative este benefício e apresente o QR para validar sua visita e liberar a oferta.'}</p><div className={`mt-6 grid min-h-56 place-items-center rounded-[20px] border border-dashed border-akola-border ${active ? 'bg-akola-soft' : 'bg-akola-background'}`}><div className="text-center">{active ? <><QrCode size={86} className="mx-auto text-akola-brand" /><p className="mt-3 text-xs font-semibold text-akola-brand">AKOLA-4821 · válido por 15 min</p></> : <><Check size={52} className="mx-auto text-akola-muted" /><p className="mt-3 text-xs text-akola-muted">Ative quando chegar ao local</p></>}</div></div><button onClick={activate} disabled={active} className="mt-6 w-full rounded-2xl bg-akola-brand px-4 py-3.5 text-sm font-semibold text-white disabled:opacity-60">{active ? 'Benefício ativo' : 'Ativar benefício'}</button></div></div></div>;
}
