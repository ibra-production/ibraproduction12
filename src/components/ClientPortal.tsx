import React, { useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { CheckCircle2, Clock3, CreditCard, FileText, Phone, X, Download, Copy, ExternalLink, MapPin, CalendarDays, ShieldCheck } from 'lucide-react';
import { db } from '../firebase';
import { printBookingFile, code39Svg } from '../utils/bookingFile';

export const ClientPortal: React.FC = () => {
  const [code, setCode] = useState('');
  const [portal, setPortal] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('portal') || '';
    setCode(value);
    if (!value) { setLoading(false); return; }
    const unsub = onSnapshot(doc(db, 'clientPortals', value), snap => {
      setPortal(snap.exists() ? snap.data() : null);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  const timeline = Array.isArray(portal?.timeline) ? portal.timeline : [];
  const checklist = Array.isArray(portal?.checklist) ? portal.checklist : [];
  const payments = Array.isArray(portal?.payments) ? portal.payments : [];
  const paid = payments.reduce((s:number,p:any)=>s+Number(p.paidAmount||0),0);
  const total = payments.reduce((s:number,p:any)=>s+Number(p.amount||0),0);
  const completedTimeline = timeline.filter((x:any)=>x.status==='done').length;
  const completedChecklist = checklist.filter((x:any)=>x.completed).length;
  const progress = timeline.length ? Math.round((completedTimeline/timeline.length)*100) : (checklist.length ? Math.round((completedChecklist/checklist.length)*100) : 0);
  const booking = {
    id: portal?.bookingId || '—',
    groomName: portal?.client?.groomName || '',
    brideName: portal?.client?.brideName || '',
    phone: portal?.client?.phone || '',
    email: portal?.client?.email || '',
    eventType: portal?.event?.eventType || '',
    eventDates: portal?.event?.eventDates || [],
    eventTime: portal?.event?.eventTime || '',
    venue: portal?.event?.venue || '',
    wilaya: portal?.event?.wilaya || '',
    status: portal?.status || 'new',
    serviceId: portal?.event?.serviceId || '',
    packageId: portal?.event?.packageId || ''
  };

  if (!code) return null;
  if (loading) return <div className="fixed inset-0 z-[100] bg-neutral-950 text-white flex items-center justify-center">جارٍ تحميل بوابة العميل...</div>;
  if (!portal) return <div className="fixed inset-0 z-[100] bg-neutral-950 text-white flex items-center justify-center p-6"><div className="max-w-md text-center"><h1 className="text-2xl font-bold mb-3">رابط متابعة الطلب غير صالح</h1><p className="text-neutral-500">اطلب من Ibra Production إرسال رابط متابعة جديد.</p></div></div>;

  const statusLabel: Record<string,string> = { new:'طلب جديد', confirmed:'تم تأكيد الحجز', processing:'جاري التنفيذ', completed:'تم إكمال الطلب', cancelled:'ملغى' };

  const copyCode = async () => {
    await navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(()=>setCopied(false),1500);
  };

  return <div className="fixed inset-0 z-[100] overflow-y-auto bg-neutral-950 text-white">
    <div className="max-w-6xl mx-auto px-5 py-7 md:py-10">
      <div className="flex items-center justify-between gap-4 mb-7">
        <div><div className="text-amber-400 text-sm font-black tracking-widest">IBRA PRODUCTION</div><h1 className="text-3xl font-black mt-1">متابعة الطلب</h1><p className="text-neutral-500 text-sm mt-1">ملفك يتحدث تلقائياً مع كل تحديث من فريقنا</p></div>
        <button onClick={()=>window.location.href=window.location.origin} className="p-3 bg-neutral-900 rounded-xl"><X className="w-5 h-5"/></button>
      </div>

      <section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 md:p-7 mb-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div><div className="text-neutral-400 text-sm">العميل</div><div className="text-2xl md:text-3xl font-black mt-1">{booking.groomName}{booking.brideName ? ' × '+booking.brideName : ''}</div><div className="text-xs text-neutral-500 mt-2">رقم الحجز: #{booking.id}</div></div>
          <div className="flex flex-wrap gap-2"><span className="px-4 py-2 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">{statusLabel[booking.status] || booking.status}</span><span className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"><ShieldCheck className="inline w-4 h-4 mr-1"/> ملف خاص</span></div>
        </div>
        <div className="mt-6"><div className="flex justify-between text-xs text-neutral-400 mb-2"><span>نسبة تقدم الطلب</span><b className="text-white">{progress}%</b></div><div className="h-3 rounded-full bg-neutral-800 overflow-hidden"><div className="h-full bg-amber-500 transition-all" style={{width:`${progress}%`}}/></div></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
          <div className="bg-neutral-950 rounded-2xl p-3"><CalendarDays className="w-4 h-4 text-amber-400"/><div className="text-xs text-neutral-500 mt-2">التاريخ</div><b>{booking.eventDates?.length || 0} موعد</b></div>
          <div className="bg-neutral-950 rounded-2xl p-3"><Clock3 className="w-4 h-4 text-amber-400"/><div className="text-xs text-neutral-500 mt-2">الوقت</div><b>{booking.eventTime || '—'}</b></div>
          <div className="bg-neutral-950 rounded-2xl p-3"><MapPin className="w-4 h-4 text-amber-400"/><div className="text-xs text-neutral-500 mt-2">المكان</div><b>{booking.venue || '—'}</b></div>
          <div className="bg-neutral-950 rounded-2xl p-3"><CreditCard className="w-4 h-4 text-amber-400"/><div className="text-xs text-neutral-500 mt-2">المدفوع</div><b>{paid.toLocaleString()} DA</b></div>
          <div className="bg-neutral-950 rounded-2xl p-3"><CheckCircle2 className="w-4 h-4 text-amber-400"/><div className="text-xs text-neutral-500 mt-2">التقدم</div><b>{completedChecklist}/{checklist.length || 0}</b></div>
        </div>
        <div className="flex flex-wrap gap-2 mt-5">
          <button onClick={()=>printBookingFile(booking,portal,code)} className="px-4 py-2.5 rounded-xl bg-white text-black font-bold inline-flex items-center gap-2"><Download className="w-4 h-4"/> تحميل ملف PDF</button>
          <button onClick={copyCode} className="px-4 py-2.5 rounded-xl bg-neutral-800 inline-flex items-center gap-2"><Copy className="w-4 h-4"/> {copied?'تم النسخ':'نسخ كود الملف'}</button>
          {booking.phone && <a href={`tel:${booking.phone}`} className="px-4 py-2.5 rounded-xl bg-neutral-800 inline-flex items-center gap-2"><Phone className="w-4 h-4"/> اتصال</a>}
        </div>
      </section>

      <section className="bg-white rounded-3xl p-4 mb-5 text-center"><div className="text-black font-bold mb-2">كود ملف العميل</div><div className="overflow-hidden" dangerouslySetInnerHTML={{__html:code39Svg(code,55)}}/><div className="text-neutral-500 text-xs mt-1">{code}</div></section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5"><div className="flex items-center gap-2 mb-5"><Clock3 className="text-amber-400"/><h2 className="font-bold text-xl">رحلة الطلب</h2></div><div className="space-y-3">{timeline.map((x:any)=><div key={x.id} className="flex items-center gap-3 bg-neutral-950 rounded-xl p-3"><CheckCircle2 className={x.status==='done'?'text-emerald-400':'text-neutral-600'}/><div className="flex-1"><div className="font-semibold">{x.title}</div><div className="text-xs text-neutral-500">{x.date || ''}</div>{x.note&&<div className="text-xs text-neutral-400 mt-1">{x.note}</div>}</div></div>)}</div></section>
        <section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5"><div className="flex items-center gap-2 mb-5"><CheckCircle2 className="text-amber-400"/><h2 className="font-bold text-xl">المهام</h2></div><div className="space-y-3">{checklist.map((x:any)=><div key={x.id} className="flex items-center gap-3 bg-neutral-950 rounded-xl p-3"><CheckCircle2 className={x.completed?'text-emerald-400':'text-neutral-700'}/><div className={x.completed?'line-through text-neutral-500':''}>{x.title}</div>{x.dueDate&&<span className="mr-auto text-xs text-neutral-500">{x.dueDate}</span>}</div>)}</div></section>
        <section className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-3xl p-5"><div className="flex items-center gap-2 mb-5"><CreditCard className="text-amber-400"/><h2 className="font-bold text-xl">الدفعات</h2></div><div className="space-y-3">{payments.map((p:any)=><div key={p.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-neutral-950 rounded-xl p-4"><div className="font-semibold">{p.title}</div><div>{Number(p.amount).toLocaleString()} DA</div><div className="text-neutral-500">{p.dueDate || '—'}</div><div className={p.status==='paid'?'text-emerald-400':'text-amber-400'}>{p.status==='paid'?'مدفوعة':'مستحقة'} • {Number(p.paidAmount||0).toLocaleString()} DA</div></div>)}</div><div className="grid grid-cols-3 gap-3 mt-5"><div className="bg-neutral-950 rounded-xl p-4"><div className="text-xs text-neutral-500">المجموع</div><b>{total.toLocaleString()} DA</b></div><div className="bg-neutral-950 rounded-xl p-4"><div className="text-xs text-neutral-500">المدفوع</div><b>{paid.toLocaleString()} DA</b></div><div className="bg-neutral-950 rounded-xl p-4"><div className="text-xs text-neutral-500">المتبقي</div><b>{Math.max(total-paid,0).toLocaleString()} DA</b></div></div></section>
      </div>

      {Array.isArray(portal.questionnaire)&&portal.questionnaire.length>0&&<section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 mt-5"><h2 className="font-bold text-xl mb-5">استبيان المناسبة</h2><div className="space-y-3">{portal.questionnaire.map((q:any)=><div key={q.id} className="bg-neutral-950 rounded-xl p-4"><div className="text-sm text-neutral-400">{q.question}</div><div className="mt-2 font-semibold">{q.answer||'لم تتم الإجابة بعد'}</div></div>)}</div></section>}
      {portal.contract&&<section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 mt-5"><div className="flex items-center gap-2 mb-4"><FileText className="text-amber-400"/><h2 className="font-bold text-xl">{portal.contract.title||'العقد'}</h2></div><div className="whitespace-pre-wrap text-sm leading-7 text-neutral-300">{portal.contract.body||''}</div><div className="mt-5 pt-4 border-t border-neutral-800"><div className="text-xs text-neutral-500">التوقيع</div><div className="font-bold mt-1">{portal.contract.signatureName||'لم يتم التوقيع بعد'}</div></div></section>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
        <a href={booking.phone?`tel:${booking.phone}`:'#'} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 inline-flex items-center gap-3"><Phone className="text-amber-400"/><span>التواصل مع Ibra Production</span></a>
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.venue||'')}`} target="_blank" rel="noreferrer" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 inline-flex items-center gap-3"><ExternalLink className="text-amber-400"/><span>فتح الموقع</span></a>
        <button onClick={()=>printBookingFile(booking,portal,code)} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 inline-flex items-center gap-3"><FileText className="text-amber-400"/><span>إصدار الملف الشامل</span></button>
      </div>
      <div className="text-center text-xs text-neutral-600 mt-8">بوابة عميل خاصة من Ibra Production • يتم تحديث المعلومات تلقائياً</div>
    </div>
  </div>;
};
