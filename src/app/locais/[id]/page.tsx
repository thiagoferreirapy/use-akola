import { AppShell } from '@/components/app-shell';
import { PlaceDetails } from '@/components/place-details';
import { places } from '@/mocks/places';

export default async function PlaceDetailsPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ from?: string }> }) {
  const { id } = await params;
  const { from = 'mapa' } = await searchParams;
  const place = places.find((p) => p.id === id) ?? places[0];
  return <AppShell><PlaceDetails place={place} source={from} /></AppShell>;
}
