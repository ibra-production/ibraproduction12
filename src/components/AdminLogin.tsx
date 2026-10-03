import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { X, Smartphone, ShieldCheck, ArrowLeft, Fingerprint, KeyRound } from 'lucide-react';
import { auth } from '../firebase';

interface AdminLoginProps { isOpen:boolean; onClose:()=>void; onLoginSuccess:()=>void; }

const OWNER_EMAILS = new Set([
  'owner556967093@ibraprod.online',
  'owner779000833@ibraprod.online',
  'owner558948485@ibraprod.online',
]);

const normalizeAlgerianPhone = (value:string) => {
  const raw=value.replace(/[\s()-]/g,'');
  if(raw.startsWith('+213')) return raw;
  if(raw.startsWith('00213')) return '+'+raw.slice(2);
  if(/^0[5-7]\d{8}$/.test(raw)) return '+213'+raw.slice(1);
  return raw;
};

const phoneToEmail=(phone:string)=>{
  const digits=normalizeAlgerianPhone(phone).replace('+213','');
  return `owner${digits}@ibraprod.online`;
};

export const AdminLogin:React.FC<AdminLoginProps>=({isOpen,onClose,onLoginSuccess})=>{
  const [phone,setPhone]=useState('');
  const [secret,setSecret]=useState('');
  const [step,setStep]=useState<'credentials'|'unlock'>('credentials');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const [holdProgress,setHoldProgress]=useState(0);

  useEffect(()=>{ if(!isOpen)return; setError(''); setBusy(false); setHoldProgress(0); return()=>{setSecret('');}; },[isOpen]);

  const reset=()=>{setPhone('');setSecret('');setStep('credentials');setError('');setBusy(false);setHoldProgress(0);};
  const handleClose=()=>{reset();onClose();};

  const login=async(event:React.FormEvent)=>{
    event.preventDefault(); setError('');
    const normalized=normalizeAlgerianPhone(phone);
    if(!/^\+213[5-7]\d{8}$/.test(normalized)){setError('أدخل رقم هاتف جزائري صالح.');return;}
    const email=phoneToEmail(normalized);
    if(!OWNER_EMAILS.has(email)){setError('هذا الرقم غير مخول للدخول إلى لوحة Ibra Production.');return;}
    if(secret.length<6){setError('أدخل الرمز السري بشكل صحيح.');return;}
    setBusy(true);
    try{
      try{ await signInWithEmailAndPassword(auth,email,secret); }
      catch(signInError:any){
        if(signInError?.code==='auth/user-not-found'){ await createUserWithEmailAndPassword(auth,email,secret); }
        else throw signInError;
      }
      setStep('unlock');
    }catch(err:any){
      console.error('Ibra password auth error:',err);
      const codeName=String(err?.code||'');
      const messages:Record<string,string>={
        'auth/invalid-credential':'رقم الهاتف أو الرمز السري غير صحيح.',
        'auth/wrong-password':'الرمز السري غير صحيح.',
        'auth/user-disabled':'تم تعطيل حساب الدخول.',
        'auth/too-many-requests':'تم تجاوز عدد المحاولات مؤقتاً. حاول لاحقاً.',
        'auth/operation-not-allowed':'فعّل تسجيل الدخول بالبريد الإلكتروني/كلمة المرور في Firebase.',
        'auth/network-request-failed':'تعذر الاتصال بخدمة المصادقة.',
        'auth/weak-password':'الرمز السري ضعيف جداً.',
      };
      setError(messages[codeName]||'تعذر تسجيل الدخول. تحقق من الرقم والرمز السري.');
      setSecret('');
    }finally{setBusy(false);}
  };

  const startHold=()=>{
    if(step!=='unlock'||busy)return;
    const started=Date.now();
    const timer=window.setInterval(()=>{
      const progress=Math.min(100,Math.round(((Date.now()-started)/1200)*100));
      setHoldProgress(progress);
      if(progress>=100){window.clearInterval(timer);onLoginSuccess();handleClose();}
    },30);
    (window as any).__ibraAdminHoldTimer=timer;
  };
  const stopHold=()=>{
    const timer=(window as any).__ibraAdminHoldTimer as number|undefined;
    if(timer)window.clearInterval(timer);
    delete (window as any).__ibraAdminHoldTimer;
    setHoldProgress(0);
  };
  const back=async()=>{stopHold();setError('');await signOut(auth).catch(()=>undefined);setStep('credentials');};

  if(!isOpen)return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/95 backdrop-blur-xl animate-fade-in">
    <div className="bg-neutral-900 border border-amber-500/25 rounded-[2rem] max-w-md w-full p-7 sm:p-9 relative shadow-2xl overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"/>
      <button type="button" onClick={handleClose} className="absolute top-5 right-5 p-2.5 text-neutral-400 hover:text-white bg-neutral-800 rounded-full transition" aria-label="إغلاق"><X className="w-5 h-5"/></button>
      <div className="text-center mb-7">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto mb-4 text-amber-400">{step==='unlock'?<Fingerprint className="w-8 h-8"/>:<KeyRound className="w-8 h-8"/>}</div>
        <p className="text-[10px] tracking-[0.28em] text-amber-500 font-bold mb-2">IBRA ACCESS</p>
        <h3 className="text-2xl font-bold font-cinzel text-white">{step==='credentials'?'الدخول الذكي':'افتح لوحة Ibra'}</h3>
        <p className="text-xs text-neutral-400 mt-2">{step==='credentials'?'رقم الهاتف + الرمز السري — بدون SMS وبدون بريد ظاهر':'تم التحقق بنجاح. اضغط باستمرار لفتح لوحة الإدارة'}</p>
      </div>
      {error&&<div className="bg-red-500/10 border border-red-500/25 text-red-300 text-xs p-3 rounded-xl mb-5 text-center">{error}</div>}
      {step==='credentials'&&<form onSubmit={login} className="space-y-5">
        <div><label className="block text-xs font-medium text-neutral-300 mb-2">رقم هاتف المالك</label><div className="relative"><Smartphone className="absolute top-3.5 right-3.5 w-4 h-4 text-neutral-500"/><input type="tel" inputMode="tel" dir="ltr" required value={phone} onChange={e=>setPhone(e.target.value)} autoComplete="tel" placeholder="05 XX XX XX XX" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-white text-sm focus:border-amber-500 focus:outline-none pr-10"/></div></div>
        <div><label className="block text-xs font-medium text-neutral-300 mb-2">الرمز السري</label><div className="relative"><KeyRound className="absolute top-3.5 right-3.5 w-4 h-4 text-neutral-500"/><input type="password" dir="ltr" required minLength={6} value={secret} onChange={e=>setSecret(e.target.value)} autoComplete="current-password" placeholder="••••••••" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-white text-sm focus:border-amber-500 focus:outline-none pr-10"/></div></div>
        <button type="submit" disabled={busy} className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 transition">{busy?'جارٍ التحقق...':'دخول آمن'}</button>
      </form>}
      {step==='unlock'&&<div className="space-y-5">
        <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-4 text-center"><ShieldCheck className="w-7 h-7 text-emerald-400 mx-auto mb-2"/><p className="text-sm text-emerald-300 font-semibold">تم التحقق بنجاح</p><p className="text-[11px] text-neutral-500 mt-1">اضغط باستمرار على الزر لمدة ثانية واحدة</p></div>
        <button type="button" onPointerDown={startHold} onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold} className="relative w-full h-24 overflow-hidden rounded-2xl border border-amber-500/30 bg-neutral-950 text-white select-none touch-none">
          <div className="absolute inset-y-0 left-0 bg-amber-500/15 transition-none" style={{width:`${holdProgress}%`}}/>
          <span className="relative z-10 font-bold tracking-wide">{holdProgress>0?`فتح اللوحة… ${holdProgress}%`:'اضغط باستمرار لفتح لوحة Ibra'}</span>
        </button>
        <button type="button" onClick={back} className="w-full text-xs text-neutral-400 hover:text-white flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4"/>رجوع</button>
      </div>}
      <div className="mt-6 text-center text-[10px] text-neutral-600">IBRA PRODUCTION • IBRA ACCESS</div>
    </div>
  </div>;
};
