'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { List, Map as MapIcon, Search, SlidersHorizontal } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { FilterChip } from '@/components/filter-chip';
import { MapCanvas } from '@/components/map-canvas';
import { PlaceCard } from '@/components/place-card';
import { places } from '@/mocks/places';
import { BottomSheet } from '@/components/bottom-sheet';
import { useUi } from '@/components/ui-provider';
import { api } from '@/lib/api';
import type { Place } from '@/types/place';

function MapContent() {
  const [selectedId, setSelectedId] = useState(places[0].id);
  const [availablePlaces, setAvailablePlaces] = useState<Place[]>(places);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const { toast } = useUi();
  const query = (searchParams.get('q') ?? '').toLowerCase();
  useEffect(() => { api.get<Place[]>('/places/nearby').then((response) => setAvailablePlaces(response.data)).catch(() => toast('Usando pontos salvos no aplicativo')); }, [toast]);
  const filteredPlaces = useMemo(() => availablePlaces.filter((place) => {
    const matchesQuery = !query || `${place.name} ${place.category} ${place.address} ${place.services.join(' ')}`.toLowerCase().includes(query.replace('banheiro', 'toilet').replace('água', 'water'));
    return matchesQuery && (!activeFilters.includes('Aberto agora') || place.openNow) && (!activeFilters.includes('Grátis') || place.access.toLowerCase().includes('grat')) && (!activeFilters.includes('Acessível') || place.services.includes('accessible')) && (!activeFilters.includes('Verificados') || place.trustState === 'partner');
  }), [query, activeFilters, availablePlaces]);
  const selected = filteredPlaces.find((p) => p.id === selectedId) ?? filteredPlaces[0];
  const toggleFilter = (label: string) => setActiveFilters((current) => current.includes(label) ? current.filter((item) => item !== label) : [...current, label]);

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div><h1 className="text-2xl font-semibold tracking-tight">Encontre um Ponto Akolá</h1><p className="mt-1 text-sm text-akola-muted">Resultados ordenados por utilidade, proximidade e confiança.</p></div>
          <div className="flex gap-2">
            <button onClick={() => setView('map')} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${view === 'map' ? 'bg-akola-brand text-white' : 'border border-akola-border bg-white'}`}><MapIcon size={16} />Mapa</button>
            <button onClick={() => setView('list')} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${view === 'list' ? 'bg-akola-brand text-white' : 'border border-akola-border bg-white'}`}><List size={16} />Lista</button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 akola-scrollbar">
          <button onClick={() => toast(`${filteredPlaces.length} pontos encontrados nesta região`)} className="flex min-w-[220px] items-center gap-2 rounded-full border border-akola-border bg-white px-4 py-2.5 text-left text-sm text-akola-muted"><Search size={16} />{query ? `Busca: ${searchParams.get('q')}` : 'Buscar nesta região'}</button>
          {['Aberto agora', 'Grátis', 'Acessível', 'Verificados'].map((label) => <FilterChip key={label} label={label} active={activeFilters.includes(label)} onClick={() => toggleFilter(label)} />)}
          <button onClick={() => setFiltersOpen(true)} className="flex items-center gap-2 rounded-full border border-akola-border bg-white px-4 py-2.5 text-sm font-medium"><SlidersHorizontal size={15} />Filtros</button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
          <aside className={`${view === 'map' ? 'hidden lg:block' : 'block'} max-h-[680px] space-y-3 overflow-y-auto pr-1 akola-scrollbar`}>
            {filteredPlaces.map((place) => (
              <div key={place.id} onMouseEnter={() => setSelectedId(place.id)} onClick={() => setSelectedId(place.id)} className={selectedId === place.id ? 'rounded-[18px] ring-2 ring-akola-brand/20' : ''}>
                <PlaceCard place={place} compact source="mapa" />
              </div>
            ))}
          </aside>
          <div className={`${view === 'list' ? 'hidden lg:block' : 'block'}`}>
            <MapCanvas places={filteredPlaces} selectedId={selectedId} onSelect={setSelectedId} onLocate={(success) => toast(success ? 'Mapa centralizado na sua localização' : 'Não foi possível acessar sua localização')} />
            {selected ? <div className="mt-3 lg:hidden"><PlaceCard place={selected} compact source="mapa" /></div> : <div className="mt-3 rounded-2xl border border-akola-border bg-white p-6 text-center text-sm text-akola-muted">Nenhum ponto encontrado com esses filtros.</div>}
          </div>
        </div>
      </div>
      <BottomSheet open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filtros" description="Mostre apenas pontos que atendem ao que você precisa."><div className="space-y-2">{['Aberto agora', 'Grátis', 'Acessível', 'Verificados'].map((label) => <label key={label} className="flex items-center justify-between rounded-[14px] border border-akola-border p-4 text-sm font-medium"><span>{label}</span><input type="checkbox" checked={activeFilters.includes(label)} onChange={() => toggleFilter(label)} className="h-5 w-5 accent-akola-brand" /></label>)}</div><button onClick={() => setFiltersOpen(false)} className="mt-4 h-[50px] w-full rounded-[14px] bg-akola-brand text-sm font-medium text-white">Ver {filteredPlaces.length} resultados</button><button onClick={() => setActiveFilters([])} className="mt-2 h-11 w-full text-sm font-medium text-akola-muted">Limpar filtros</button></BottomSheet>
    </AppShell>
  );
}

export default function MapPage() {
  return <Suspense fallback={<AppShell><div className="grid min-h-[480px] place-items-center rounded-[24px] border border-akola-border bg-akola-soft text-sm text-akola-muted">Carregando mapa…</div></AppShell>}><MapContent /></Suspense>;
}
