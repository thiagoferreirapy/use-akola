import { AlertTriangle, Check, CircleDot } from 'lucide-react';
import type { TrustState } from '@/types/place';

const states = {
  partner: { label: 'Parceiro verificado', icon: Check, className: 'text-akola-brand bg-akola-soft' },
  recent: { label: 'Confirmado recentemente', icon: Check, className: 'text-akola-brand bg-akola-soft' },
  community: { label: 'Informação comunitária', icon: CircleDot, className: 'text-akola-muted bg-white border border-akola-border' },
  old: { label: 'Informação antiga', icon: AlertTriangle, className: 'text-akola-warning bg-[#FFF7E9]' },
  unavailable: { label: 'Possivelmente indisponível', icon: AlertTriangle, className: 'text-akola-danger bg-[#FCEEEE]' },
} satisfies Record<TrustState, { label: string; icon: React.ComponentType<{ size?: number }>; className: string }>;

export function TrustBadge({ state }: { state: TrustState }) {
  const item = states[state];
  const Icon = item.icon;
  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium ${item.className}`}>
      <Icon size={13} />
      {item.label}
    </span>
  );
}
