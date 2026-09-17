'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { AppShell } from '@/components/app-shell';

const questions = ['O banheiro continua disponível?','A água continua disponível?','Continua gratuito?','As informações estão corretas?'];

export default function ConfirmPage() {
  const [done, setDone] = useState(false);
  if (done) return <AppShell><div className="mx-auto max-w-lg rounded-[24px] border border-akola-border bg-white p-8 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-akola-soft text-akola-brand"><Check size={26} /></div><h1 className="mt-5 text-2xl font-semibold">Confirmação registrada</h1><p className="mt-2 text-sm leading-6 text-akola-muted">Sua resposta ajuda a manter o mapa confiável para quem precisar depois.</p></div></AppShell>;
  return <AppShell><div className="mx-auto max-w-xl"><h1 className="text-3xl font-semibold tracking-tight">Como está este ponto?</h1><p className="mt-2 text-sm leading-6 text-akola-muted">Responda em poucos toques. Não precisa preencher tudo se você não souber.</p><div className="mt-6 space-y-3">{questions.map((q) => <div key={q} className="rounded-2xl border border-akola-border bg-white p-5"><p className="text-sm font-medium">{q}</p><div className="mt-3 flex gap-2"><button className="rounded-full bg-akola-soft px-4 py-2 text-sm font-medium text-akola-brand">Sim</button><button className="rounded-full bg-[#FCEEEE] px-4 py-2 text-sm font-medium text-akola-danger">Não</button><button className="rounded-full border border-akola-border px-4 py-2 text-sm font-medium text-akola-muted">Não sei</button></div></div>)}</div><button onClick={() => setDone(true)} className="mt-5 w-full rounded-2xl bg-akola-brand px-4 py-3.5 text-sm font-semibold text-white">Enviar confirmação</button></div></AppShell>;
}
