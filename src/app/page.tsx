import Link from 'next/link';
import { Accessibility, ArrowRight, Droplets, MapPin, Toilet } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PlaceCard } from '@/components/place-card';
import { SectionHeading } from '@/components/section-heading';
import { offers, places } from '@/mocks/places';

export default function HomePage() {
  return (
    <AppShell>
      <section className="grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
        <div className="max-w-2xl py-4 lg:py-10">
          <span className="inline-flex rounded-full bg-akola-soft px-3 py-2 text-xs font-semibold text-akola-brand">Seu ponto de apoio na cidade</span>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.03em] text-akola-text sm:text-5xl">O que você precisa agora?</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-akola-muted">Encontre banheiro, água e estruturas úteis perto de você, com informações recentes da comunidade e dos estabelecimentos.</p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link href="/mapa?servico=banheiro" className="group rounded-[22px] border border-akola-border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F1EFFA] text-akola-toilet"><Toilet size={23} /></div>
                <ArrowRight size={19} className="text-akola-muted transition group-hover:translate-x-1 group-hover:text-akola-brand" />
              </div>
              <h2 className="mt-8 text-xl font-semibold">Banheiro</h2>
              <p className="mt-1 text-sm text-akola-muted">32 opções perto de você</p>
            </Link>
            <Link href="/mapa?servico=agua" className="group rounded-[22px] border border-akola-border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EDF5FB] text-akola-water"><Droplets size={23} /></div>
                <ArrowRight size={19} className="text-akola-muted transition group-hover:translate-x-1 group-hover:text-akola-brand" />
              </div>
              <h2 className="mt-8 text-xl font-semibold">Água</h2>
              <p className="mt-1 text-sm text-akola-muted">18 pontos próximos</p>
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] border border-akola-border bg-akola-brand p-6 text-white shadow-soft">
          <div className="flex items-center gap-3 text-sm font-medium text-white/80"><MapPin size={18} />Brasília · Asa Sul</div>
          <h2 className="mt-10 text-3xl font-semibold tracking-tight">Você está a 3 minutos de um Ponto Akolá.</h2>
          <p className="mt-3 text-sm leading-6 text-white/75">Padaria Bellini tem banheiro, água e acesso gratuito. Confirmado há 18 minutos.</p>
          <div className="mt-8 flex gap-2">
            <span className="rounded-full bg-white/12 px-3 py-2 text-xs">Banheiro</span>
            <span className="rounded-full bg-white/12 px-3 py-2 text-xs">Água</span>
            <span className="rounded-full bg-white/12 px-3 py-2 text-xs"><Accessibility size={13} className="mr-1 inline" />Acessível</span>
          </div>
          <Link href="/locais/padaria-bellini?from=home" className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-akola-brand">Ver ponto</Link>
        </div>
      </section>

      <section className="mt-12">
        <SectionHeading title="Pontos Akolá próximos" description="Prioridade para lugares abertos e com informação recente." action={<Link href="/mapa" className="text-sm font-semibold text-akola-brand">Ver mapa</Link>} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {places.slice(0, 3).map((place) => <PlaceCard key={place.id} place={place} source="home" />)}
        </div>
      </section>

      <section className="mt-12">
        <SectionHeading title="Benefícios por perto" description="Ofertas de Parceiros Akolá, sem atrapalhar sua busca principal." />
        <div className="grid gap-4 md:grid-cols-2">
          {offers.map((offer) => {
            const place = places.find((p) => p.id === offer.placeId)!;
            return (
              <Link key={offer.id} href={`/ofertas/${offer.id}`} className="rounded-[20px] border border-akola-border bg-white p-5 transition hover:shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-xs font-semibold uppercase tracking-[.12em] text-akola-brand">Parceiro Akolá</p><h3 className="mt-2 text-lg font-semibold">{offer.title}</h3><p className="mt-1 text-sm text-akola-muted">{place.name} · {offer.validUntil}</p></div>
                  <span className="rounded-full bg-akola-soft px-3 py-2 text-sm font-semibold text-akola-brand">{offer.price}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
