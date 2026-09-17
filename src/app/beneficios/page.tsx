import Link from 'next/link';
import { Gift, MapPin } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { offers, places } from '@/mocks/places';

export default function BenefitsPage() {
  return <AppShell title="Benefícios por perto"><p className="mb-5 text-sm text-akola-muted">Ofertas de Parceiros Akolá próximos de você.</p><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{offers.map((offer) => { const place = places.find((item) => item.id === offer.placeId)!; return <Link key={offer.id} href={`/ofertas/${offer.id}`} className="overflow-hidden rounded-[22px] border border-akola-border bg-white transition hover:-translate-y-0.5 hover:shadow-soft"><div className="bg-akola-brand p-5 text-white"><div className="flex items-center justify-between"><Gift size={20} /><span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">{offer.price}</span></div><h2 className="mt-8 text-xl font-semibold">{offer.title}</h2></div><div className="p-5"><p className="flex items-center gap-2 text-sm font-medium"><MapPin size={16} className="text-akola-brand" />{place.name}</p><p className="mt-2 text-xs text-akola-muted">{place.walkMinutes} min a pé · {offer.validUntil}</p><span className="mt-4 inline-flex text-sm font-semibold text-akola-brand">Ver benefício →</span></div></Link>; })}</div></AppShell>;
}
