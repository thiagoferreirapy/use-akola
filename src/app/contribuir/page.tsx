'use client';

import { useRef, useState } from 'react';
import { Camera, LocateFixed, MapPin } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { LocationPicker } from '@/components/map-canvas';
import { useUi } from '@/components/ui-provider';
import { api } from '@/lib/api';

type Coordinates = { latitude: number; longitude: number };
type ScheduleDay = { key: string; label: string; open: boolean; opensAt: string; closesAt: string };
type AddressFields = { postalCode: string; street: string; number: string; complement: string; neighborhood: string; city: string; state: string };

const createDefaultSchedule = (): ScheduleDay[] => [
  ['monday', 'Segunda', true], ['tuesday', 'Terça', true], ['wednesday', 'Quarta', true], ['thursday', 'Quinta', true], ['friday', 'Sexta', true], ['saturday', 'Sábado', true], ['sunday', 'Domingo', false],
].map(([key, label, open]) => ({ key: String(key), label: String(label), open: Boolean(open), opensAt: '08:00', closesAt: '20:00' }));
const defaultAddress: AddressFields = { postalCode: '', street: '', number: '', complement: '', neighborhood: '', city: 'Brasília', state: 'DF' };

export default function ContributePage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [photo, setPhoto] = useState('');
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleDay[]>(createDefaultSchedule);
  const [addressFields, setAddressFields] = useState<AddressFields>(defaultAddress);
  const [findingAddress, setFindingAddress] = useState(false);
  const geocodeTimer = useRef<number | null>(null);
  const geocodeRequest = useRef<AbortController | null>(null);
  const { toast, user } = useUi();

  function markLocation(latitude: number, longitude: number) {
    setCoordinates({ latitude, longitude });
    if (geocodeTimer.current) window.clearTimeout(geocodeTimer.current);
    geocodeRequest.current?.abort();
    setFindingAddress(true);
    geocodeTimer.current = window.setTimeout(async () => {
      const controller = new AbortController();
      geocodeRequest.current = controller;
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=pt-BR`, { signal: controller.signal });
        if (!response.ok) throw new Error('Endereço não encontrado');
        const result = await response.json() as { address?: Record<string, string> };
        const address = result.address ?? {};
        const isoState = address['ISO3166-2-lvl4']?.split('-').pop() ?? '';
        setAddressFields((current) => ({
          ...current,
          postalCode: address.postcode ?? '',
          street: address.road ?? address.pedestrian ?? address.residential ?? '',
          number: address.house_number ?? '',
          neighborhood: address.suburb ?? address.neighbourhood ?? address.quarter ?? '',
          city: address.city ?? address.town ?? address.municipality ?? current.city,
          state: (isoState || current.state).slice(0, 2).toUpperCase(),
        }));
        toast('Endereço preenchido a partir do mapa');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') toast('Local marcado. Complete o endereço manualmente.');
      } finally { if (!controller.signal.aborted) setFindingAddress(false); }
    }, 650);
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) { toast('Localização não disponível neste dispositivo'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      markLocation(coords.latitude, coords.longitude);
      setLocating(false);
    }, () => { setLocating(false); toast('Não foi possível acessar sua localização'); }, { enableHighAccuracy: true, timeout: 10000 });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) { toast('Entre na sua conta para adicionar um ponto'); window.location.href = '/login'; return; }
    if (!coordinates) { toast('Marque a localização exata do ponto no mapa'); return; }
    const invalidDay = schedule.find((day) => day.open && day.opensAt >= day.closesAt);
    if (invalidDay) { toast(`Em ${invalidDay.label}, o fechamento deve ser depois da abertura`); return; }
    if (!schedule.some((day) => day.open)) { toast('Informe pelo menos um dia de funcionamento'); return; }
    const values = new FormData(event.currentTarget);
    const street = String(values.get('street') ?? '').trim();
    const number = String(values.get('number') ?? '').trim();
    const complement = String(values.get('complement') ?? '').trim();
    const neighborhood = String(values.get('neighborhood') ?? '').trim();
    const city = String(values.get('city') ?? '').trim();
    const state = String(values.get('state') ?? '').trim().toUpperCase();
    const address = `${street}, ${number}${complement ? `, ${complement}` : ''} · ${neighborhood}, ${city} - ${state}`;
    setSubmitting(true);
    try {
      await api.post('/places', {
        name: values.get('name'), address, street, number, complement, neighborhood, city, state,
        postalCode: values.get('postalCode'), latitude: coordinates.latitude, longitude: coordinates.longitude,
        access: values.get('access'),
        openingHours: schedule.map(({ key, open, opensAt, closesAt }) => ({ day: key, open, opensAt: open ? opensAt : null, closesAt: open ? closesAt : null })),
        hours: schedule.filter((day) => day.open).map((day) => `${day.label.slice(0, 3)} ${day.opensAt}–${day.closesAt}`).join(' · '),
        notes: values.get('notes'),
        services: values.getAll('services'), photoName: photo || undefined,
      });
      formRef.current?.reset();
      setCoordinates(null);
      setPhoto('');
      setSchedule(createDefaultSchedule());
      setAddressFields(defaultAddress);
      toast('Ponto enviado para análise. Obrigado por contribuir!');
    } catch { toast('Não foi possível enviar o ponto'); }
    finally { setSubmitting(false); }
  }

  const inputClass = 'w-full rounded-[14px] border border-akola-border bg-white px-4 py-3.5 outline-none transition focus:border-akola-brand focus:ring-4 focus:ring-akola-brand/10';

  return <AppShell><div className="mx-auto max-w-3xl">
    <p className="text-sm font-semibold text-akola-brand">Contribuição comunitária</p>
    <h1 className="mt-2 text-3xl font-semibold tracking-tight">Adicionar um Ponto Akolá</h1>
    <p className="mt-2 text-sm leading-6 text-akola-muted">Preencha o endereço e marque a entrada exata no mapa para que outras pessoas encontrem o ponto com facilidade.</p>

    <form ref={formRef} onSubmit={submit} className="mt-7 space-y-7">
      <section className="rounded-[24px] border border-akola-border bg-white p-5 sm:p-7">
        <div className="mb-5 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-akola-soft text-sm font-semibold text-akola-brand">1</span><div><h2 className="font-semibold">Informações do local</h2><p className="text-xs text-akola-muted">Identificação e disponibilidade</p></div></div>
        <div className="space-y-5">
          <label className="block"><span className="mb-2 block text-sm font-medium">Nome do local</span><input name="name" required className={inputClass} placeholder="Ex.: Padaria Central" /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium">Regra de acesso</span><input name="access" required className={inputClass} placeholder="Ex.: gratuito ou para clientes" /></label>
          <div><p className="mb-2 text-sm font-medium">Serviços disponíveis</p><div className="grid gap-2 sm:grid-cols-3">{[['toilet','Banheiro'],['water','Água'],['accessible','Acessibilidade']].map(([value,label]) => <label key={value} className="flex items-center gap-2 rounded-[14px] border border-akola-border px-4 py-3 text-sm"><input name="services" value={value} type="checkbox" className="accent-akola-brand" />{label}</label>)}</div></div>
        </div>
      </section>

      <section className="rounded-[24px] border border-akola-border bg-white p-5 sm:p-7">
        <div className="mb-5"><h2 className="font-semibold">Horário de funcionamento</h2><p className="mt-1 text-xs text-akola-muted">Ative os dias e selecione os horários de abertura e fechamento.</p></div>
        <div className="divide-y divide-akola-border overflow-hidden rounded-[16px] border border-akola-border">
          {schedule.map((day, index) => <div key={day.key} className="grid gap-3 bg-white p-3 sm:grid-cols-[130px_1fr] sm:items-center sm:px-4">
            <button type="button" onClick={() => setSchedule((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, open: !item.open } : item))} className="flex items-center gap-3 text-left text-sm font-medium" aria-pressed={day.open}><span className={`relative h-6 w-11 shrink-0 rounded-full transition ${day.open ? 'bg-akola-brand' : 'bg-[#d7ddda]'}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${day.open ? 'left-6' : 'left-1'}`} /></span>{day.label}</button>
            {day.open ? <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2"><label><span className="sr-only">Abertura na {day.label}</span><input type="time" value={day.opensAt} onChange={(event) => setSchedule((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, opensAt: event.target.value } : item))} className={`${inputClass} py-2.5`} /></label><span className="text-xs text-akola-muted">até</span><label><span className="sr-only">Fechamento na {day.label}</span><input type="time" value={day.closesAt} onChange={(event) => setSchedule((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, closesAt: event.target.value } : item))} className={`${inputClass} py-2.5`} /></label></div> : <span className="text-sm text-akola-muted">Fechado</span>}
          </div>)}
        </div>
      </section>

      <section className="rounded-[24px] border border-akola-border bg-white p-5 sm:p-7">
        <div className="mb-5 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-akola-soft text-sm font-semibold text-akola-brand">2</span><div><h2 className="font-semibold">Endereço</h2><p className="text-xs text-akola-muted">Separe os dados para evitar endereços incompletos</p></div></div>
        <div className="grid gap-4 sm:grid-cols-6">
          <label className="sm:col-span-2"><span className="mb-2 block text-sm font-medium">CEP</span><input name="postalCode" inputMode="numeric" value={addressFields.postalCode} onChange={(event) => setAddressFields({ ...addressFields, postalCode: event.target.value })} className={inputClass} placeholder="00000-000" /></label>
          <label className="sm:col-span-4"><span className="mb-2 block text-sm font-medium">Rua ou avenida</span><input name="street" required value={addressFields.street} onChange={(event) => setAddressFields({ ...addressFields, street: event.target.value })} className={inputClass} placeholder="Ex.: CLS 107" /></label>
          <label className="sm:col-span-2"><span className="mb-2 block text-sm font-medium">Número</span><input name="number" required value={addressFields.number} onChange={(event) => setAddressFields({ ...addressFields, number: event.target.value })} className={inputClass} placeholder="Ex.: 12" /></label>
          <label className="sm:col-span-4"><span className="mb-2 block text-sm font-medium">Complemento</span><input name="complement" value={addressFields.complement} onChange={(event) => setAddressFields({ ...addressFields, complement: event.target.value })} className={inputClass} placeholder="Loja, bloco, entrada lateral…" /></label>
          <label className="sm:col-span-3"><span className="mb-2 block text-sm font-medium">Bairro</span><input name="neighborhood" required value={addressFields.neighborhood} onChange={(event) => setAddressFields({ ...addressFields, neighborhood: event.target.value })} className={inputClass} placeholder="Bairro" /></label>
          <label className="sm:col-span-2"><span className="mb-2 block text-sm font-medium">Cidade</span><input name="city" required value={addressFields.city} onChange={(event) => setAddressFields({ ...addressFields, city: event.target.value })} className={inputClass} /></label>
          <label className="sm:col-span-1"><span className="mb-2 block text-sm font-medium">UF</span><input name="state" required maxLength={2} value={addressFields.state} onChange={(event) => setAddressFields({ ...addressFields, state: event.target.value.toUpperCase() })} className={`${inputClass} uppercase`} /></label>
        </div>
      </section>

      <section className="rounded-[24px] border border-akola-border bg-white p-5 sm:p-7">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-akola-soft text-sm font-semibold text-akola-brand">3</span><div><h2 className="font-semibold">Localização exata</h2><p className="text-xs text-akola-muted">Marque no mapa a entrada usada pelo público</p></div></div><button type="button" onClick={useCurrentLocation} disabled={locating} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-akola-border px-4 text-sm font-medium text-akola-brand disabled:opacity-60"><LocateFixed size={17} />{locating ? 'Localizando…' : 'Usar minha localização'}</button></div>
        <LocationPicker latitude={coordinates?.latitude} longitude={coordinates?.longitude} onChange={markLocation} />
        <div className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs ${coordinates ? 'bg-akola-soft text-akola-brand' : 'bg-amber-50 text-akola-warning'}`}><MapPin size={15} />{findingAddress ? 'Buscando o endereço deste local…' : coordinates ? `Local marcado: ${coordinates.latitude.toFixed(5)}, ${coordinates.longitude.toFixed(5)}` : 'A localização no mapa é obrigatória'}</div>
      </section>

      <section className="rounded-[24px] border border-akola-border bg-white p-5 sm:p-7"><label className="block"><span className="mb-2 block text-sm font-medium">Observações</span><textarea name="notes" className={`${inputClass} min-h-28`} placeholder="Precisa pedir chave, banheiro no piso superior…" /></label><label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-akola-border px-4 py-3.5 text-sm font-medium"><Camera size={17} />{photo || 'Adicionar foto'}<input type="file" accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) { setPhoto(file.name); toast('Foto adicionada'); } }} /></label></section>
      <button disabled={submitting} className="w-full rounded-2xl bg-akola-brand px-4 py-4 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(14,92,87,.2)] disabled:opacity-60">{submitting ? 'Enviando…' : 'Enviar para análise'}</button>
    </form>
  </div></AppShell>;
}
