import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { CheckCircle2, Clock3, CreditCard, X } from 'lucide-react';
import { db } from '../firebase';

export const ClientPortal: React.FC = () => {
  const [code, setCode] = useState('');
  const [portal, setPortal] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (!code) return null;
  if (loading) return <div className="fixed inset-0 z-[100] bg-neutral-950 text-white flex items-center justify-center">جارٍ تحميل بوابة العميل...</div>;
  if (!portal) return <div className="fixed inset-0 z-[100] bg-neutral-950 text-white flex items-center justify-center p-6"><div className="max-w-md text-center"><h1 className="text-2xl font-bold mb-3">رابط بوابة العميل غير صالح</h1><p className="text-neutral-500">اطلب من Ibra Production إرسال رابط جديد.</p></div></div>;

  const timeline = Array.isArray(portal.timeline) ? portal.timeline : [];
  const checklist = Array.isArray(portal.checklist) ? portal.checklist : [];
  const payments = Array.isArray(portal.payments) ? portal.payments : [];
  const paid = payments.reduce((s:number,p:any)=>s+Number(p.paidAmount||0),0);
  const total = payments.reduce((s:number,p:any)=>s+Number(p.amount||0),0);

  return <div className="fixed inset-0 z-[100] overflow-y-auto bg-neutral-950 text-white">
    <div className="max-w-5xl mx-auto px-5 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <div><div className="text-amber-400 text-sm font-bold">IBRA PRODUCTION</div><h1 className="text-3xl font-black mt-1">بوابة العميل</h1></div>
        <button onClick={()=>window.location.href=window.location.origin} className="p-3 bg-neutral-900 rounded-xl"><X className="w-5 h-5"/></button>
      </div>
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 mb-6">
        <div className="text-neutral-400 text-sm">مرحباً</div><div className="text-2xl font-bold mt-1">{portal.client?.groomName || ''}{portal.client?.brideName ? ' × '+portal.client.brideName : ''}</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-5 text-sm">
          <div><span className="text-neutral-500">المناسبة</span><div className="mt-1">{portal.event?.eventType || '—'}</div></div>
          <div><span className="text-neutral-500">التاريخ</span><div className="mt-1">{(portal.event?.eventDates || []).join(' • ') || '—'}</div></div>
          <div><span className="text-neutral-500">الوقت</span><div className="mt-1">{portal.event?.eventTime || '—'}</div></div>
          <div><span className="text-neutral-500">المكان</span><div className="mt-1">{portal.event?.venue || '—'}</div></div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-5"><Clock3 className="text-amber-400"/><h2 className="font-bold text-xl">Timeline</h2></div>
          <div className="space-y-3">{timeline.map((x:any)=><div key={x.id} className="flex items-center gap-3 bg-neutral-950 rounded-xl p-3"><CheckCircle2 className={x.status==='done'?'text-emerald-400':'text-neutral-600'}/><div><div className="font-semibold">{x.title}</div><div className="text-xs text-neutral-500">{x.date || ''}</div></div></div>)}</div>
        </section>
        <section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-5"><CheckCircle2 className="text-amber-400"/><h2 className="font-bold text-xl">Checklist</h2></div>
          <div className="space-y-3">{checklist.map((x:any)=><div key={x.id} className="flex items-center gap-3 bg-neutral-950 rounded-xl p-3"><CheckCircle2 className={x.completed?'text-emerald-400':'text-neutral-700'}/><span className={x.completed?'line-through text-neutral-500':''}>{x.title}</span></div>)}</div>
        </section>
        <section className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-5"><CreditCard className="text-amber-400"/><h2 className="font-bold text-xl">Payment Schedule</h2></div>
          <div className="space-y-3">{payments.map((p:any)=><div key={p.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-neutral-950 rounded-xl p-4"><div className="font-semibold">{p.title}</div><div>{Number(p.amount).toLocaleString()} DA</div><div className="text-neutral-500">{p.dueDate || '—'}</div><div className={p.status==='paid'?'text-emerald-400':'text-amber-400'}>{p.status==='paid'?'مدفوعة':'مستحقة'} • {Number(p.paidAmount||0).toLocaleString()} DA</div></div>)}</div>
          <div className="grid grid-cols-2 gap-3 mt-5"><div className="bg-neutral-950 rounded-xl p-4"><div className="text-xs text-neutral-500">المجموع</div><b>{total.toLocaleString()} DA</b></div><div className="bg-neutral-950 rounded-xl p-4"><div className="text-xs text-neutral-500">المدفوع</div><b>{paid.toLocaleString()} DA</b></div></div>
        </section>
      </div>
      {Array.isArray(portal.questionnaire) && portal.questionnaire.length > 0 && <section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 mt-5">
        <h2 className="font-bold text-xl mb-5">Questionnaire</h2>
        <div className="space-y-3">{portal.questionnaire.map((q:any)=><div key={q.id} className="bg-neutral-950 rounded-xl p-4"><div className="text-sm text-neutral-400">{q.question}</div><div className="mt-2 font-semibold">{q.answer || 'لم تتم الإجابة بعد'}</div></div>)}</div>
      </section>}
      {portal.contract && <section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 mt-5">
        <h2 className="font-bold text-xl mb-4">{portal.contract.title || 'العقد'}</h2>
        <div className="whitespace-pre-wrap text-sm leading-7 text-neutral-300">{portal.contract.body || ''}</div>
        <div className="mt-5 pt-4 border-t border-neutral-800"><div className="text-xs text-neutral-500">التوقيع</div><div className="font-bold mt-1">{portal.contract.signatureName || 'لم يتم التوقيع بعد'}</div>{portal.contract.signedAt && <div className="text-xs text-emerald-400 mt-1">تم التوقيع: {new Date(portal.contract.signedAt).toLocaleString('ar-DZ')}</div>}</div>
      </section>}

      <div className="text-center text-xs text-neutral-600 mt-8">بوابة عميل خاصة من Ibra Production • يتم تحديث المعلومات تلقائياً</div>
    </div>
  </div>;
};
