'use client';

import { AppShell } from '@/components/app-shell';
import { PlaceCard } from '@/components/place-card';
import { places } from '@/mocks/places';
import { useUi } from '@/components/ui-provider';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites } = useUi();
  const favoritePlaces = places.filter((place) => favorites.has(place.id));
  return (
    <AppShell title="Favoritos">
      <Link href="/perfil" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-akola-muted"><ArrowLeft size={16} />Voltar ao perfil</Link><p className="mb-5 text-sm text-akola-muted">Seus pontos confiáveis para encontrar rápido.</p>
      {favoritePlaces.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{favoritePlaces.map((place) => <PlaceCard key={place.id} place={place} source="favoritos" />)}</div> : <div className="rounded-[22px] border border-akola-border bg-white p-8 text-center"><p className="font-semibold">Nenhum favorito ainda</p><p className="mt-2 text-sm text-akola-muted">Toque no coração de um ponto para salvá-lo aqui.</p></div>}
    </AppShell>
  );
}
