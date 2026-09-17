'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import type { Place } from '@/types/place';
import { formatDistance } from '@/lib/format';
import { ServiceChip } from './service-chip';
import { TrustBadge } from './trust-badge';
import { useUi } from './ui-provider';

export function PlaceCard({ place, compact = false, source = 'home' }: { place: Place; compact?: boolean; source?: string }) {
  const { isFavorite, toggleFavorite, toast } = useUi();
  const favorite = isFavorite(place.id);
  return (
    <Link href={`/locais/${place.id}?from=${source}`} className="group block rounded-2xl border border-akola-border bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-akola-text">{place.name}</h3>
          <p className="mt-1 text-[13px] text-akola-muted">{formatDistance(place.distanceMeters)} · {place.openNow ? 'Aberto agora' : 'Fechado'}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-[13px] font-medium text-akola-brand">{place.walkMinutes} min a pé</span>
          {!compact && <button type="button" aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggleFavorite(place.id); toast(favorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos'); }} className={`grid h-9 w-9 place-items-center rounded-full transition hover:bg-akola-soft ${favorite ? 'text-akola-brand' : 'text-akola-muted'}`}><Heart size={18} fill={favorite ? 'currentColor' : 'none'} /></button>}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {place.services.slice(0, compact ? 2 : 4).map((service) => <ServiceChip key={service} service={service} />)}
      </div>
      <p className="mt-3 text-[13px] text-akola-text">{place.access}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <TrustBadge state={place.trustState} />
        <span className="text-xs text-akola-muted">{place.lastConfirmed}</span>
      </div>
    </Link>
  );
}
