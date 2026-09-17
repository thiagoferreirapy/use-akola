'use client';

import Link from 'next/link';
import { Gift, Home, Map, UserRound } from 'lucide-react';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/mapa', label: 'Mapa', icon: Map },
  { href: '/beneficios', label: 'Benefícios', icon: Gift },
  { href: '/perfil', label: 'Perfil', icon: UserRound },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center justify-around rounded-2xl border border-akola-border bg-white/95 px-2 py-2 shadow-soft backdrop-blur md:hidden">
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link key={href} href={href} className={`flex min-w-[68px] flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium ${active ? 'bg-akola-soft text-akola-brand' : 'text-akola-muted'}`}>
            <Icon size={19} strokeWidth={active ? 2.4 : 2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
