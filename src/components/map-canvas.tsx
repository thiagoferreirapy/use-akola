'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LocateFixed, Navigation } from 'lucide-react';
import type { Place } from '@/types/place';

type LeafletMap = { fitBounds: (bounds: [number, number][], options?: { padding?: [number, number]; maxZoom?: number }) => void; on: (event: string, handler: (event: { latlng: { lat: number; lng: number } }) => void) => LeafletMap; remove: () => void; setView: (center: [number, number], zoom: number) => void };
type LeafletMarker = { addTo: (map: LeafletMap) => LeafletMarker; bindTooltip: (content: string, options?: Record<string, unknown>) => LeafletMarker; on: (event: string, handler: () => void) => LeafletMarker; openTooltip: () => LeafletMarker; setIcon: (icon: unknown) => LeafletMarker; setLatLng: (coords: [number, number]) => LeafletMarker };
type Leaflet = {
  map: (element: HTMLElement, options: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, options: Record<string, unknown>) => { addTo: (map: LeafletMap) => unknown };
  marker: (coords: [number, number], options: Record<string, unknown>) => LeafletMarker;
  circleMarker: (coords: [number, number], options: Record<string, unknown>) => { addTo: (map: LeafletMap) => unknown };
  divIcon: (options: Record<string, unknown>) => unknown;
};

declare global { interface Window { L?: Leaflet } }

const DEFAULT_CENTER: [number, number] = [-15.8007, -47.8919];

function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (!document.getElementById('leaflet-stylesheet')) {
    const link = document.createElement('link');
    link.id = 'leaflet-stylesheet'; link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; link.crossOrigin = '';
    document.head.appendChild(link);
  }
  return new Promise<Leaflet>((resolve, reject) => {
    const existing = document.getElementById('leaflet-script') as HTMLScriptElement | null;
    const finish = () => window.L ? resolve(window.L) : reject(new Error('Leaflet indisponível'));
    if (existing) { existing.addEventListener('load', finish, { once: true }); existing.addEventListener('error', reject, { once: true }); return; }
    const script = document.createElement('script');
    script.id = 'leaflet-script'; script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.crossOrigin = ''; script.onload = finish; script.onerror = reject;
    document.head.appendChild(script);
  });
}

function markerIcon(leaflet: Leaflet, active: boolean) {
  return leaflet.divIcon({ className: '', html: `<span class="akola-map-marker${active ? ' is-active' : ''}" aria-hidden="true"><span></span></span>`, iconSize: active ? [48, 56] : [38, 46], iconAnchor: active ? [24, 54] : [19, 44], tooltipAnchor: [0, -42] });
}

export function MapCanvas({ places, selectedId, onSelect, onLocate }: { places: Place[]; selectedId?: string; onSelect?: (id: string) => void; onLocate?: (success: boolean) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef(new Map<string, LeafletMarker>());
  const leafletRef = useRef<Leaflet | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then((leaflet) => {
      if (cancelled || !containerRef.current) return;
      leafletRef.current = leaflet;
      const coordinates = places.filter((place) => Number.isFinite(place.latitude) && Number.isFinite(place.longitude));
      const map = leaflet.map(containerRef.current, { center: DEFAULT_CENTER, zoom: 14, zoomControl: true, attributionControl: true });
      mapRef.current = map;
      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', maxZoom: 19 }).addTo(map);
      coordinates.forEach((place) => {
        const marker = leaflet.marker([place.latitude, place.longitude], { icon: markerIcon(leaflet, place.id === selectedId), title: place.name }).addTo(map).bindTooltip(`<strong>${place.name}</strong><br>${place.walkMinutes} min a pé`, { direction: 'top', offset: [0, -8] }).on('click', () => onSelect?.(place.id));
        markersRef.current.set(place.id, marker);
        if (place.id === selectedId) marker.openTooltip();
      });
      if (coordinates.length > 1) map.fitBounds(coordinates.map((place) => [place.latitude, place.longitude]), { padding: [44, 44], maxZoom: 16 });
      else if (coordinates[0]) map.setView([coordinates[0].latitude, coordinates[0].longitude], 16);
      setLoading(false);
    }).catch(() => { if (!cancelled) { setLoading(false); setFailed(true); } });
    return () => { cancelled = true; markersRef.current.clear(); mapRef.current?.remove(); mapRef.current = null; };
  }, [places, onSelect]);

  useEffect(() => {
    const leaflet = leafletRef.current;
    if (!leaflet) return;
    markersRef.current.forEach((marker, id) => marker.setIcon(markerIcon(leaflet, id === selectedId)));
    const selected = places.find((place) => place.id === selectedId);
    if (selected) { mapRef.current?.setView([selected.latitude, selected.longitude], 16); markersRef.current.get(selected.id)?.openTooltip(); }
  }, [places, selectedId]);

  const locate = useCallback(() => {
    if (!navigator.geolocation) { onLocate?.(false); return; }
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const position: [number, number] = [coords.latitude, coords.longitude];
      mapRef.current?.setView(position, 16);
      if (leafletRef.current && mapRef.current) leafletRef.current.circleMarker(position, { radius: 8, color: '#ffffff', weight: 3, fillColor: '#3b82f6', fillOpacity: 1 }).addTo(mapRef.current);
      onLocate?.(true);
    }, () => onLocate?.(false), { enableHighAccuracy: true, timeout: 10000 });
  }, [onLocate]);

  const showAll = useCallback(() => {
    const coordinates = places.filter((place) => Number.isFinite(place.latitude) && Number.isFinite(place.longitude)).map((place) => [place.latitude, place.longitude] as [number, number]);
    if (coordinates.length > 1) mapRef.current?.fitBounds(coordinates, { padding: [44, 44], maxZoom: 16 });
    else if (coordinates[0]) mapRef.current?.setView(coordinates[0], 16);
  }, [places]);

  return <div className="relative min-h-[480px] overflow-hidden rounded-[24px] border border-akola-border bg-[#EAF0ED]">
    <div ref={containerRef} className="absolute inset-0 z-0" aria-label="Mapa dos pontos Akolá" />
    {loading && <div className="absolute inset-0 z-10 grid place-items-center bg-akola-soft text-sm font-medium text-akola-muted">Carregando mapa…</div>}
    {failed && <div className="absolute inset-0 z-10 grid place-items-center bg-akola-soft px-6 text-center text-sm text-akola-muted">Não foi possível carregar o mapa. Verifique sua conexão.</div>}
    <div className="absolute bottom-6 right-4 z-[500] flex flex-col gap-2"><button onClick={locate} aria-label="Minha localização" className="grid h-11 w-11 place-items-center rounded-xl border border-akola-border bg-white text-akola-brand shadow-soft"><LocateFixed size={19} /></button><button onClick={showAll} aria-label="Mostrar todos os pontos" className="grid h-11 w-11 place-items-center rounded-xl border border-akola-border bg-white text-akola-brand shadow-soft"><Navigation size={19} /></button></div>
  </div>;
}

export function LocationPicker({ latitude, longitude, onChange }: { latitude?: number; longitude?: number; onChange: (latitude: number, longitude: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then((leaflet) => {
      if (cancelled || !containerRef.current) return;
      const center: [number, number] = latitude !== undefined && longitude !== undefined ? [latitude, longitude] : DEFAULT_CENTER;
      const map = leaflet.map(containerRef.current, { center, zoom: latitude !== undefined ? 17 : 14, zoomControl: true, attributionControl: true });
      mapRef.current = map;
      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', maxZoom: 19 }).addTo(map);
      const placeMarker = (coords: [number, number]) => {
        if (markerRef.current) markerRef.current.setLatLng(coords);
        else markerRef.current = leaflet.marker(coords, { icon: markerIcon(leaflet, true), title: 'Local do ponto' }).addTo(map);
      };
      if (latitude !== undefined && longitude !== undefined) placeMarker(center);
      map.on('click', ({ latlng }) => { const coords: [number, number] = [latlng.lat, latlng.lng]; placeMarker(coords); onChange(latlng.lat, latlng.lng); });
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; markerRef.current = null; mapRef.current?.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (latitude !== undefined && longitude !== undefined && markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapRef.current?.setView([latitude, longitude], 17);
    }
  }, [latitude, longitude]);

  return <div className="relative h-72 overflow-hidden rounded-[18px] border border-akola-border bg-akola-soft">
    <div ref={containerRef} className="absolute inset-0" aria-label="Selecione a localização exata do ponto no mapa" />
    {!failed && latitude === undefined && <div className="pointer-events-none absolute left-1/2 top-3 z-[500] -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 px-3 py-2 text-xs font-medium text-akola-text shadow-soft">Toque no mapa para marcar o local</div>}
    {failed && <div className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-akola-muted">Não foi possível carregar o mapa.</div>}
  </div>;
}
