'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight, Heart, LogIn, LogOut, MapPinned, Settings, ShieldCheck, UserRound } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { BottomSheet } from '@/components/bottom-sheet';
import { useUi } from '@/components/ui-provider';

const menu = [
  { href: '/minhas-contribuicoes', label: 'Minhas contribuições', icon: MapPinned, action: '' },
  { href: '/favoritos', label: 'Favoritos', icon: Heart, action: '' },
  { href: '', label: 'Privacidade e localização', icon: ShieldCheck, action: 'privacy' },
  { href: '', label: 'Configurações', icon: Settings, action: 'settings' },
];

export default function ProfilePage() {
  const [sheet, setSheet] = useState('');
  const [location, setLocation] = useState(true);
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const { toast, user, authLoading, logout } = useUi();
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">Seu Akolá</h1>
        <div className="mt-6 flex items-center gap-4 rounded-[22px] border border-akola-border bg-white p-5"><div className="grid h-14 w-14 place-items-center rounded-full bg-akola-soft text-akola-brand"><UserRound size={25} /></div><div className="min-w-0 flex-1">{authLoading ? <p className="text-sm text-akola-muted">Carregando perfil...</p> : user ? <><h2 className="truncate text-lg font-semibold">{user.name}</h2><p className="truncate text-sm text-akola-muted">{user.email} · nível Comunidade</p></> : <><h2 className="text-lg font-semibold">Você ainda não entrou</h2><p className="text-sm text-akola-muted">Entre para contribuir e salvar seus pontos.</p></>}</div>{!authLoading && !user && <Link href="/login" className="grid h-11 w-11 place-items-center rounded-xl bg-akola-brand text-white" aria-label="Entrar"><LogIn size={18} /></Link>}</div>
        <div className="mt-4 overflow-hidden rounded-[22px] border border-akola-border bg-white">{menu.map(({ href, label, icon: Icon, action }) => action ? <button key={label} onClick={() => setSheet(action)} className="flex w-full items-center justify-between border-b border-akola-border px-5 py-4 text-left last:border-b-0"><span className="flex items-center gap-3 text-sm font-medium"><Icon size={18} className="text-akola-brand" />{label}</span><ChevronRight size={17} className="text-akola-muted" /></button> : <Link key={label} href={href} className="flex items-center justify-between border-b border-akola-border px-5 py-4 last:border-b-0"><span className="flex items-center gap-3 text-sm font-medium"><Icon size={18} className="text-akola-brand" />{label}</span><ChevronRight size={17} className="text-akola-muted" /></Link>)}</div>
        <Link href="/parceiro" className="mt-5 block rounded-[22px] bg-akola-brand p-5 text-white"><p className="text-xs font-semibold uppercase tracking-[.12em] text-white/65">Para estabelecimentos</p><h2 className="mt-2 text-xl font-semibold">Gerencie um Ponto Akolá</h2><p className="mt-1 text-sm text-white/75">Reivindique seu perfil, atualize serviços, crie ofertas e acompanhe visitas.</p></Link>
        {user && <button onClick={() => { logout(); toast('Você saiu da sua conta'); }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] border border-akola-border bg-white px-4 py-3.5 text-sm font-semibold text-akola-danger"><LogOut size={17} />Sair</button>}
      </div>
      <BottomSheet open={sheet === 'privacy'} onClose={() => setSheet('')} title="Privacidade e localização" description="Você controla quando o Akolá pode usar sua localização."><label className="flex items-center justify-between rounded-[14px] border border-akola-border p-4 text-sm font-medium"><span>Usar localização nas buscas</span><input type="checkbox" checked={location} onChange={(event) => setLocation(event.target.checked)} className="h-5 w-5 accent-akola-brand" /></label><div className="mt-3 rounded-[14px] bg-akola-soft p-4 text-xs leading-5 text-akola-brand">Sua localização não aparece publicamente e é usada apenas para ordenar pontos próximos.</div><button onClick={() => { setSheet(''); toast('Preferências de privacidade salvas'); }} className="mt-4 h-[50px] w-full rounded-[14px] bg-akola-brand text-sm font-medium text-white">Salvar</button></BottomSheet>
      <BottomSheet open={sheet === 'settings'} onClose={() => setSheet('')} title="Configurações" description="Escolha como quer receber atualizações."><div className="space-y-2"><label className="flex items-center justify-between rounded-[14px] border border-akola-border p-4 text-sm font-medium"><span>Notificações no app</span><input type="checkbox" checked={push} onChange={(event) => setPush(event.target.checked)} className="h-5 w-5 accent-akola-brand" /></label><label className="flex items-center justify-between rounded-[14px] border border-akola-border p-4 text-sm font-medium"><span>Novidades por e-mail</span><input type="checkbox" checked={email} onChange={(event) => setEmail(event.target.checked)} className="h-5 w-5 accent-akola-brand" /></label></div><button onClick={() => { setSheet(''); toast('Configurações salvas'); }} className="mt-4 h-[50px] w-full rounded-[14px] bg-akola-brand text-sm font-medium text-white">Salvar</button></BottomSheet>
    </AppShell>
  );
}
