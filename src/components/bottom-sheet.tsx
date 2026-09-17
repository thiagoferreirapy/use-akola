'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

export function BottomSheet({ open, onClose, title, description, children }: { open: boolean; onClose: () => void; title: string; description?: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', close);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', close); document.body.style.overflow = previous; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-akola-text/35 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onMouseDown={onClose}>
      <section role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()} className="relative max-h-[88vh] w-full overflow-y-auto rounded-t-[22px] border border-akola-border bg-white p-5 pt-7 shadow-soft sm:max-w-[390px] sm:rounded-[22px]">
        <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-akola-border" />
        <button onClick={onClose} aria-label="Fechar" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-akola-muted transition hover:bg-akola-soft"><X size={18} /></button>
        <h2 className="pr-10 text-[23px] font-semibold leading-[33px] text-akola-text">{title}</h2>
        {description && <p className="mt-2 text-sm leading-5 text-akola-muted">{description}</p>}
        <div className="mt-4">{children}</div>
      </section>
    </div>
  );
}
