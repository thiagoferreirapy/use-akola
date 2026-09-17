import { Accessibility, Baby, Droplets, Toilet } from 'lucide-react';
import type { ServiceType } from '@/types/place';

const config = {
  toilet: { label: 'Banheiro', icon: Toilet, className: 'bg-[#F1EFFA] text-akola-toilet' },
  water: { label: 'Água', icon: Droplets, className: 'bg-[#EDF5FB] text-akola-water' },
  accessible: { label: 'Acessível', icon: Accessibility, className: 'bg-akola-soft text-akola-brand' },
  changing: { label: 'Fraldário', icon: Baby, className: 'bg-[#FFF6E8] text-akola-warning' },
} satisfies Record<ServiceType, { label: string; icon: React.ComponentType<{ size?: number }>; className: string }>;

export function ServiceChip({ service }: { service: ServiceType }) {
  const item = config[service];
  const Icon = item.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-medium ${item.className}`}>
      <Icon size={14} />
      {item.label}
    </span>
  );
}
