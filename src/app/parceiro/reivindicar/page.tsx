'use client';
import { useEffect,useState } from 'react';
import { useRouter } from 'next/navigation';
import { PortalShell } from '@/components/portal-shell';
import { partnerApi } from '@/lib/partner-api';
type Place={id:string;name:string;address:string;ownershipStatus?:string};
export default function ClaimPage(){
 const[q,setQ]=useState('');const[places,setPlaces]=useState<Place[]>([]);const[message,setMessage]=useState('');const router=useRouter();
 useEffect(()=>{partnerApi.get('/places/nearby').then(r=>setPlaces(r.data))},[]);
 const shown=places.filter(p=>(p.name+' '+p.address).toLowerCase().includes(q.toLowerCase()));
 async function claim(id:string){try{await partnerApi.post('/business/claim',{placeId:id});setMessage('Perfil vinculado com sucesso');setTimeout(()=>router.push('/parceiro'),800)}catch(c){setMessage((c as {response?:{data?:{error?:string}}}).response?.data?.error??'Não foi possível reivindicar')}}
 return <PortalShell type="partner" title="Buscar e reivindicar"><div className="max-w-[700px] space-y-4"><h2 className="text-[26px] font-semibold">Encontre seu estabelecimento</h2><p className="text-sm text-akola-muted">Procure antes de criar outro perfil: pontos já cadastrados pela comunidade podem ser reivindicados.</p><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Nome ou endereço" className="h-[52px] w-full rounded-[14px] border border-akola-border bg-akola-soft px-4 text-base outline-none focus:border-akola-brand"/>{message&&<p className="rounded-xl bg-akola-soft p-3 text-sm font-medium text-akola-brand">{message}</p>}<div className="space-y-3">{shown.map(p=><article key={p.id} className="rounded-[16px] border border-akola-border bg-white p-4"><h3 className="font-semibold">{p.name}</h3><p className="mt-1 text-sm text-akola-muted">{p.address}</p><p className="mt-2 text-xs text-akola-warning">{p.ownershipStatus==='CLAIMED'?'Perfil reivindicado':'Perfil da comunidade · disponível'}</p><button onClick={()=>claim(p.id)} className="mt-4 h-11 rounded-xl bg-akola-brand px-5 text-sm font-semibold text-white">Vincular ao meu negócio</button></article>)}</div></div></PortalShell>
}
