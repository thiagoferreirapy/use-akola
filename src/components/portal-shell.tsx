'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { partnerApi } from '@/lib/partner-api';

const partnerItems = [['Dashboard','/parceiro'],['Meu ponto','/parceiro/estabelecimento'],['Serviços','/parceiro/servicos'],['Fotos','/parceiro/fotos'],['Cardápio','/parceiro/cardapio'],['Promoções','/parceiro/promocoes'],['QR e visitas','/parceiro/qr'],['Métricas','/parceiro/metricas'],['Plano','/parceiro/plano']] as const;
const adminItems = [['Dashboard','/admin'],['Locais','/admin/locais'],['Denúncias','/admin/denuncias'],['Reivindicações','/admin/reivindicacoes'],['Parceiros','/admin/parceiros'],['Promoções','/admin/promocoes'],['Usuários','/admin/usuarios'],['Métricas','/admin/metricas']] as const;

export function PortalShell({type,children,title}:{type:'partner'|'admin';children:React.ReactNode;title:string}){
  const path=usePathname();
  const router=useRouter();
  const [menuOpen,setMenuOpen]=useState(false);
  const [accountName,setAccountName]=useState('Estabelecimento');
  const items=type==='partner'?partnerItems:adminItems;
  useEffect(()=>setMenuOpen(false),[path]);
  useEffect(()=>{document.body.style.overflow=menuOpen?'hidden':'';return()=>{document.body.style.overflow=''}},[menuOpen]);
  useEffect(()=>{partnerApi.get('/me').then(({data})=>{if(data.role!=='BUSINESS'&&data.role!=='ADMIN')throw new Error('role');setAccountName(data.name)}).catch(()=>{localStorage.removeItem('akola:partner-token');router.replace('/parceiro/boas-vindas')})},[router]);
  function logout(){localStorage.removeItem('akola:partner-token');localStorage.removeItem('akola:partner-user');sessionStorage.removeItem('akola:partner-onboarding');router.push('/parceiro/boas-vindas')}

  const navigation=<nav className="flex flex-col gap-1">{items.map(([label,href])=><Link onClick={()=>setMenuOpen(false)} key={href} href={href} className={`rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-[#eef4f1] ${path===href?'bg-[#eef4f1] text-[#0e5c57]':'text-[#687471]'}`}>{label}</Link>)}</nav>;

  return <main className="min-h-screen bg-[#f7f8f6] p-4 text-[#17211f] sm:p-6 lg:p-8">
    {menuOpen&&<button aria-label="Fechar menu" className="fixed inset-0 z-40 bg-[#17211f]/40 backdrop-blur-[1px] md:hidden" onClick={()=>setMenuOpen(false)}/>}
    <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white p-5 shadow-2xl transition-transform duration-300 md:hidden ${menuOpen?'translate-x-0':'-translate-x-full'}`}>
      <div className="mb-7 flex items-center justify-between"><div><p className="text-2xl font-semibold text-[#0e5c57]">Akolá</p><p className="mt-1 text-xs text-[#687471]">Portal do estabelecimento</p></div><button onClick={()=>setMenuOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-[#eef4f1]" aria-label="Fechar menu"><X size={20}/></button></div>
      {navigation}
      <div className="absolute inset-x-5 bottom-6 border-t border-[#e4e9e6] pt-4"><p className="truncate px-3 pb-2 text-xs text-akola-muted">{accountName}</p><Link href="/" className="block rounded-lg px-3 py-2.5 text-sm text-[#687471]">Voltar ao aplicativo</Link><button onClick={logout} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#687471]">Sair</button></div>
    </aside>

    <header className="fixed inset-x-0 top-0 z-30 border-b border-akola-border/80 bg-akola-background/92 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={type==='partner'?'/parceiro':'/admin'} className="text-2xl font-semibold tracking-tight text-akola-brand">Akolá</Link>
        <div className="hidden min-w-0 flex-1 px-8 md:block"><p className="text-xs font-medium text-akola-muted">{type==='partner'?'Portal do estabelecimento':'Administração'}</p><h1 className="truncate text-sm font-semibold">{title}</h1></div>
        <div className="flex items-center gap-2">
          <Link href="/" className="hidden h-10 items-center rounded-xl border border-akola-border bg-white px-4 text-sm font-semibold text-akola-brand sm:flex">Ver no app</Link>
          <button aria-label="Notificações" className="relative grid h-10 w-10 place-items-center rounded-xl border border-akola-border bg-white text-akola-muted"><Bell size={18}/><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-akola-danger ring-2 ring-white"/></button>
          <button onClick={()=>setMenuOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl bg-akola-brand text-white md:hidden" aria-label="Abrir menu"><Menu size={20}/></button>
        </div>
      </div>
    </header>
    <div className="mx-auto max-w-7xl pt-16">
      <div className="grid items-start gap-6 pt-6 md:grid-cols-[240px_minmax(0,1fr)]"><aside className="hidden rounded-[16px] border border-akola-border bg-white p-5 md:block">{navigation}</aside><section className="min-w-0 pb-10"><div className="mb-5 md:hidden"><p className="text-xs font-medium text-akola-muted">Portal do estabelecimento</p><h1 className="mt-1 text-2xl font-semibold">{title}</h1></div>{children}</section></div>
    </div>
  </main>;
}
