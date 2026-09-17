'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Check, Clock3, Heart, Map, MapPin, Navigation, Phone, Share2, Star } from 'lucide-react';
import type { Place } from '@/types/place';
import { formatDistance } from '@/lib/format';
import { BottomSheet } from './bottom-sheet';
import { ServiceChip } from './service-chip';
import { TrustBadge } from './trust-badge';
import { useUi } from './ui-provider';
import { api } from '@/lib/api';

const confirmationQuestions = ['O banheiro continua disponível?', 'A água continua disponível?', 'Continua gratuito?', 'As informações estão corretas?'];

export function PlaceDetails({ place, source }: { place: Place; source: string }) {
  const { isFavorite, toggleFavorite, toast, user } = useUi();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const favorite = isFavorite(place.id);
  const back = source === 'favoritos' ? { href: '/favoritos', label: 'Voltar aos favoritos' } : source === 'beneficios' ? { href: '/beneficios', label: 'Voltar aos benefícios' } : source === 'home' ? { href: '/', label: 'Voltar ao início' } : { href: '/mapa', label: 'Voltar ao mapa' };
  const encodedAddress = encodeURIComponent(place.address);

  async function share() {
    const data = { title: place.name, text: `Veja este Ponto Akolá: ${place.name}`, url: window.location.href };
    if (navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(window.location.href); toast('Link copiado'); }
  }

  async function sendConfirmation() { if (!user) { toast('Entre para confirmar informações'); return; } try { await api.post(`/places/${place.id}/confirmations`, { answers }); setConfirmed(true); window.setTimeout(() => { setConfirmOpen(false); setConfirmed(false); setAnswers({}); toast('Confirmação registrada. Obrigado!'); }, 1000); } catch { toast('Não foi possível registrar a confirmação'); } }

  return <div className="mx-auto max-w-4xl">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><Link href={back.href} className="inline-flex items-center gap-2 text-sm font-medium text-akola-muted"><ArrowLeft size={16} />{back.label}</Link>{source === 'favoritos' && <Link href={`/mapa?place=${place.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-akola-brand"><Map size={16} />Ver no mapa</Link>}</div>
    <div className="grid overflow-hidden rounded-[28px] border border-akola-border bg-white lg:grid-cols-[1.1fr_.9fr]">
      <div className="min-h-[300px] bg-gradient-to-br from-[#D9E9E2] via-[#EEF4F1] to-[#D8E4DD] p-6 lg:min-h-[440px]">
        <div className="flex justify-between"><span className="rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-akola-brand">Ponto Akolá</span><div className="flex gap-2"><button onClick={share} aria-label="Compartilhar" className="grid h-10 w-10 place-items-center rounded-full bg-white/90"><Share2 size={17} /></button><button onClick={() => { toggleFavorite(place.id); toast(favorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos'); }} aria-label={favorite ? 'Remover dos favoritos' : 'Favoritar'} className={`grid h-10 w-10 place-items-center rounded-full bg-white/90 ${favorite ? 'text-akola-brand' : ''}`}><Heart size={17} fill={favorite ? 'currentColor' : 'none'} /></button></div></div>
        <div className="mt-32 rounded-2xl bg-white/80 p-4 backdrop-blur lg:mt-56"><p className="text-sm text-akola-muted">Galeria do estabelecimento</p><p className="mt-1 text-xs text-akola-muted">Fotos ilustrativas serão conectadas ao cadastro do ponto.</p></div>
      </div>
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-akola-brand">{place.category}</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">{place.name}</h1></div><span className="flex items-center gap-1 rounded-full bg-[#FFF8E8] px-3 py-2 text-sm font-semibold"><Star size={15} fill="currentColor" className="text-akola-warning" />{place.rating}</span></div>
        <div className="mt-5 flex flex-wrap gap-2">{place.services.map((service) => <ServiceChip key={service} service={service} />)}</div><div className="mt-5"><TrustBadge state={place.trustState} /></div><p className="mt-5 text-sm leading-6 text-akola-muted">{place.description}</p>
        <div className="mt-6 space-y-3 border-y border-akola-border py-5 text-sm"><div className="flex items-start gap-3"><MapPin size={18} className="mt-0.5 text-akola-brand" /><div><p className="font-medium">{place.address}</p><p className="text-akola-muted">{formatDistance(place.distanceMeters)} · {place.walkMinutes} min a pé</p></div></div><div className="flex items-start gap-3"><Clock3 size={18} className="mt-0.5 text-akola-brand" /><div><p className="font-medium">{place.openNow ? 'Aberto agora' : 'Fechado'}</p><p className="text-akola-muted">Seg–Sáb · 07:00–21:00</p></div></div><div className="flex items-start gap-3"><Phone size={18} className="mt-0.5 text-akola-brand" /><div><p className="font-medium">Condição de acesso</p><p className="text-akola-muted">{place.access}</p></div></div></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2"><button onClick={() => { setNavigationOpen(true); if (user) api.post(`/places/${place.id}/route-start`, { source }).catch(() => undefined); }} className="flex items-center justify-center gap-2 rounded-2xl bg-akola-brand px-4 py-3.5 text-sm font-semibold text-white"><Navigation size={17} />Ir até lá</button><button onClick={() => setConfirmOpen(true)} className="rounded-2xl bg-akola-soft px-4 py-3.5 text-sm font-semibold text-akola-brand">Confirmar informações</button></div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2"><Link href={`/avaliacoes/${place.id}?from=${source}`} className="rounded-2xl border border-akola-border px-4 py-3 text-center text-sm font-medium">Ver avaliações</Link><Link href={`/reportar/${place.id}?from=${source}`} className="rounded-2xl border border-akola-border px-4 py-3 text-center text-sm font-medium text-akola-danger">Reportar problema</Link></div>
      </div>
    </div>
    <BottomSheet open={confirmOpen} onClose={() => setConfirmOpen(false)} title={confirmed ? 'Confirmação registrada' : 'Como está este ponto?'} description={confirmed ? 'Sua resposta ajuda a manter o mapa confiável.' : 'Responda em poucos toques. Você pode marcar “Não sei”.'}>
      {confirmed ? <div className="grid place-items-center rounded-[14px] bg-akola-soft p-8 text-akola-brand"><Check size={32} /></div> : <><div className="space-y-3">{confirmationQuestions.map((question) => <div key={question} className="rounded-[14px] border border-akola-border p-3"><p className="text-sm font-medium">{question}</p><div className="mt-3 grid grid-cols-3 gap-2">{['Sim', 'Não', 'Não sei'].map((answer) => <button key={answer} onClick={() => setAnswers((current) => ({ ...current, [question]: answer }))} className={`rounded-full px-2 py-2 text-xs font-medium ${answers[question] === answer ? 'bg-akola-brand text-white' : 'bg-akola-soft text-akola-brand'}`}>{answer}</button>)}</div></div>)}</div><button disabled={!Object.keys(answers).length} onClick={sendConfirmation} className="mt-4 h-[50px] w-full rounded-[14px] bg-akola-brand text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40">Enviar confirmação</button></>}
    </BottomSheet>
    <BottomSheet open={navigationOpen} onClose={() => setNavigationOpen(false)} title="Como quer chegar?" description="A rota será aberta no aplicativo de navegação escolhido.">
      <div className="space-y-3"><a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`} className="flex h-[50px] items-center justify-center rounded-[14px] bg-akola-brand text-sm font-medium text-white">Google Maps</a><a target="_blank" rel="noreferrer" href={`https://waze.com/ul?q=${encodedAddress}&navigate=yes`} className="flex h-[50px] items-center justify-center rounded-[14px] bg-akola-soft text-sm font-medium text-akola-brand">Waze</a><a href={`https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=${encodedAddress}`} className="flex h-[50px] items-center justify-center rounded-[14px] border border-akola-border text-sm font-medium">Uber</a></div>
    </BottomSheet>
  </div>;
}
