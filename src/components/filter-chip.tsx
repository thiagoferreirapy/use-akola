'use client';

export function FilterChip({ label, active = false, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-[13px] font-medium transition ${active ? 'border-akola-brand bg-akola-soft text-akola-brand' : 'border-akola-border bg-white text-akola-text hover:border-[#C8D3CF]'}`}
    >
      {label}
    </button>
  );
}
