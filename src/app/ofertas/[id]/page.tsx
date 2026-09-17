import { AppShell } from '@/components/app-shell';
import { OfferDetails } from '@/components/offer-details';
import { offers, places } from '@/mocks/places';

export default async function OfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offer = offers.find((o) => o.id === id) ?? offers[0];
  const place = places.find((p) => p.id === offer.placeId)!;
  return <AppShell><OfferDetails offer={offer} place={place} /></AppShell>;
}
