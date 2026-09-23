import React,{useState} from 'react';
import {Search, X, ArrowLeft} from 'lucide-react';

export const ClientTrackingButton:React.FC=()=>{
  const [open,setOpen]=useState(false);
  const [code,setCode]=useState('');
  const go=()=>{
    const value=code.trim().toUpperCase();
    if(!value) return;
    window.location.href=`${window.location.origin}?portal=${encodeURIComponent(value)}`;
  };
  return <>
    <button data-client-tracking onClick={()=>setOpen(true)} className="fixed bottom-5 left-5 z-40 px-4 py-3 rounded-2xl bg-amber-500 text-black font-black shadow-2xl inline-flex items-center gap-2 hover:scale-[1.02] transition-transform"><Search className="w-4 h-4"/> متابعة الطلب</button>
    {open&&<div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-5" onClick={()=>setOpen(false)}>
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-3xl p-6 text-white" onClick={e=>e.stopPropagation()}>
        <div className="flex justify-between items-center"><div><div className="text-amber-400 text-xs font-bold">IBRA PRODUCTION</div><h2 className="text-2xl font-black mt-1">متابعة طلبك</h2></div><button onClick={()=>setOpen(false)} className="p-2 bg-neutral-900 rounded-xl"><X className="w-5 h-5"/></button></div>
        <p className="text-neutral-500 text-sm mt-4">أدخل كود ملفك الذي أرسلته لك Ibra Production.</p>
        <input autoFocus value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()} placeholder="مثال: A83F91D20C4B7E11" className="w-full mt-5 bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-4 tracking-widest text-center font-bold"/>
        <button onClick={go} className="w-full mt-3 bg-amber-500 text-black rounded-2xl py-4 font-black inline-flex items-center justify-center gap-2">فتح ملفي <ArrowLeft className="w-4 h-4"/></button>
      </div>
    </div>}
  </>;
};
