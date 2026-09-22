import React, { useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot, setDoc, Timestamp } from 'firebase/firestore';
import { Check, Plus, Trash2, Save, Clock3, CreditCard, ListChecks, Zap } from 'lucide-react';
import { db, auth } from '../firebase';
import { BookingWorkflow, WorkflowChecklistItem, WorkflowTimelineItem, WorkflowPayment } from '../types';

interface Props { booking: any; onClose: () => void; }

const emptyWorkflow = (id: string): BookingWorkflow => ({
  bookingId: id,
  timeline: [],
  checklist: [],
  payments: [],
  automations: { onStatusChange: true, onPaymentDue: true, onEventReminder: true },
  updatedAt: new Date().toISOString()
});

export const BookingWorkflowPanel: React.FC<Props> = ({ booking, onClose }) => {
  const [data, setData] = useState<BookingWorkflow>(() => emptyWorkflow(booking.id));
  const [saving, setSaving] = useState(false);
  const [newTimeline, setNewTimeline] = useState('');
  const [newTask, setNewTask] = useState('');
  const [newPayment, setNewPayment] = useState({ title: '', amount: '', dueDate: '' });
  const [newQuestion, setNewQuestion] = useState('');
  const [contractTitle, setContractTitle] = useState('عقد خدمات Ibra Production');
  const [contractBody, setContractBody] = useState('تم الاتفاق بين Ibra Production والعميل على تنفيذ الخدمات الموضحة في الحجز وفق البيانات والمواعيد المعتمدة.');
  const [signatureName, setSignatureName] = useState('');

  useEffect(() => {
    const ref = doc(db, 'bookingWorkflows', booking.id);
    return onSnapshot(ref, snap => {
      if (snap.exists()) {
        const raw = snap.data() as Partial<BookingWorkflow>;
        setData({ ...emptyWorkflow(booking.id), ...raw, bookingId: booking.id });
      } else {
        setData(emptyWorkflow(booking.id));
      }
    });
  }, [booking.id]);

  const questionnaire = data.questionnaire || [];
  const contract = data.contract || { title: contractTitle, body: contractBody };

  const totals = useMemo(() => {
    const paid = data.payments.reduce((s, p) => s + Number(p.paidAmount || 0), 0);
    const scheduled = data.payments.reduce((s, p) => s + Number(p.amount || 0), 0);
    return { paid, scheduled, remaining: Math.max(scheduled - paid, 0) };
  }, [data.payments]);

  const ensurePortalCode = () => data.portalCode || crypto.randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase();

  const save = async () => {
    const user = auth.currentUser;
    if (!user) return alert('يجب تسجيل الدخول كمسؤول.');
    setSaving(true);
    try {
      const portalCode = ensurePortalCode();
      const next = { ...data, bookingId: booking.id, portalCode, questionnaire, contract: { title: contractTitle, body: contractBody, signatureName, signedAt: signatureName.trim() ? new Date().toISOString() : undefined }, updatedAt: new Date().toISOString() };
      await setDoc(doc(db, 'bookingWorkflows', booking.id), { ...next, updatedAt: Timestamp.now() }, { merge: true });
      await setDoc(doc(db, 'clientPortals', portalCode), {
        bookingId: booking.id,
        portalCode,
        client: { groomName: booking.groomName || '', brideName: booking.brideName || '', phone: booking.phone || '' },
        event: { eventType: booking.eventType || '', eventDates: Array.isArray(booking.eventDates) ? booking.eventDates : (booking.eventDate ? [booking.eventDate] : []), eventTime: booking.eventTime || '', venue: booking.venue || '', wilaya: booking.wilaya || '' },
        status: booking.status || 'new',
        timeline: next.timeline,
        checklist: next.checklist,
        payments: next.payments,
        updatedAt: Timestamp.now()
      }, { merge: true });
      setData(next);
      alert('تم حفظ سير العمل وإنشاء/تحديث بوابة العميل.');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'تعذر حفظ سير العمل.');
    } finally { setSaving(false); }
  };

  const addTimeline = () => {
    const title = newTimeline.trim();
    if (!title) return;
    const item: WorkflowTimelineItem = { id: crypto.randomUUID(), title, status: 'pending', date: new Date().toISOString().slice(0,10) };
    setData(d => ({ ...d, timeline: [...d.timeline, item] }));
    setNewTimeline('');
  };

  const addTask = () => {
    const title = newTask.trim();
    if (!title) return;
    const item: WorkflowChecklistItem = { id: crypto.randomUUID(), title, completed: false };
    setData(d => ({ ...d, checklist: [...d.checklist, item] }));
    setNewTask('');
  };

  const addPayment = () => {
    const title = newPayment.title.trim();
    const amount = Number(newPayment.amount);
    if (!title || !Number.isFinite(amount) || amount <= 0) return alert('أدخل اسم الدفعة والمبلغ بشكل صحيح.');
    const item: WorkflowPayment = { id: crypto.randomUUID(), title, amount, paidAmount: 0, dueDate: newPayment.dueDate, status: 'pending' };
    setData(d => ({ ...d, payments: [...d.payments, item] }));
    setNewPayment({ title: '', amount: '', dueDate: '' });
  };

  const updatePayment = (id: string, patch: Partial<WorkflowPayment>) => {
    setData(d => ({ ...d, payments: d.payments.map(p => p.id === id ? { ...p, ...patch, status: Number(paidValue(p, patch)) >= Number(p.amount) ? 'paid' : 'pending' } : p) }));
  };
  const paidValue = (p: WorkflowPayment, patch?: Partial<WorkflowPayment>) => patch?.paidAmount ?? p.paidAmount;

  return (
    <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-6xl bg-neutral-950 border border-neutral-800 rounded-3xl p-5 md:p-7 my-6 text-white">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs text-amber-400 mb-1">نظام إدارة الحجز</div>
            <h2 className="text-2xl font-bold">سير عمل: {booking.groomName} × {booking.brideName || '—'}</h2>
            <div className="text-xs text-neutral-500 mt-1">#{booking.id}</div>
          </div>
          <button onClick={onClose} className="px-4 py-2 bg-neutral-800 rounded-xl">إغلاق</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <section className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4"><Clock3 className="w-5 h-5 text-amber-400"/><h3 className="font-bold">Timeline</h3></div>
            <div className="space-y-3">
              {data.timeline.map((item, i) => (
                <div key={item.id} className="flex gap-3 items-center bg-neutral-950 rounded-xl p-3">
                  <button onClick={() => setData(d => ({...d, timeline: d.timeline.map((x,n)=>n===i?{...x,status:x.status==='done'?'pending':'done'}:x)}))} className={`w-8 h-8 rounded-full border flex items-center justify-center ${item.status==='done'?'bg-emerald-500 border-emerald-500':'border-neutral-700'}`}><Check className="w-4 h-4"/></button>
                  <div className="flex-1"><div className="font-semibold">{item.title}</div><div className="text-xs text-neutral-500">{item.date || 'بدون تاريخ'}</div></div>
                  <button onClick={() => setData(d => ({...d, timeline:d.timeline.filter(x=>x.id!==item.id)}))} className="text-red-400"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <input value={newTimeline} onChange={e=>setNewTimeline(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTimeline()} placeholder="مثال: تأكيد الحجز / جلسة التصوير / التسليم" className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2"/>
              <button onClick={addTimeline} className="px-4 rounded-xl bg-amber-500 text-black"><Plus className="w-4 h-4"/></button>
            </div>
          </section>

          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4"><ListChecks className="w-5 h-5 text-amber-400"/><h3 className="font-bold">Checklist</h3></div>
            <div className="space-y-2">
              {data.checklist.map((item,i)=><div key={item.id} className="flex items-center gap-2 bg-neutral-950 rounded-xl p-3">
                <input type="checkbox" checked={item.completed} onChange={e=>setData(d=>({...d,checklist:d.checklist.map((x,n)=>n===i?{...x,completed:e.target.checked}:x)}))} className="w-4 h-4 accent-amber-500"/>
                <span className={item.completed?'line-through text-neutral-500':'flex-1'}>{item.title}</span>
                <button onClick={()=>setData(d=>({...d,checklist:d.checklist.filter(x=>x.id!==item.id)}))} className="text-red-400"><Trash2 className="w-4 h-4"/></button>
              </div>)}
            </div>
            <div className="flex gap-2 mt-4">
              <input value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTask()} placeholder="مهمة جديدة" className="flex-1 min-w-0 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2"/>
              <button onClick={addTask} className="px-4 rounded-xl bg-amber-500 text-black"><Plus className="w-4 h-4"/></button>
            </div>
          </section>

          <section className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4"><CreditCard className="w-5 h-5 text-amber-400"/><h3 className="font-bold">Payment Schedule</h3></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
              <input value={newPayment.title} onChange={e=>setNewPayment({...newPayment,title:e.target.value})} placeholder="اسم الدفعة" className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2"/>
              <input type="number" value={newPayment.amount} onChange={e=>setNewPayment({...newPayment,amount:e.target.value})} placeholder="المبلغ" className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2"/>
              <input type="date" value={newPayment.dueDate} onChange={e=>setNewPayment({...newPayment,dueDate:e.target.value})} className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2"/>
              <button onClick={addPayment} className="rounded-xl bg-amber-500 text-black font-bold">إضافة</button>
            </div>
            <div className="space-y-2">
              {data.payments.map(p=><div key={p.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center bg-neutral-950 rounded-xl p-3">
                <div className="font-semibold">{p.title}</div><div>{Number(p.amount).toLocaleString()} DA</div><div className="text-xs text-neutral-500">{p.dueDate || '—'}</div>
                <input type="number" value={p.paidAmount} onChange={e=>updatePayment(p.id,{paidAmount:Number(e.target.value)})} className="bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1"/>
                <button onClick={()=>setData(d=>({...d,payments:d.payments.filter(x=>x.id!==p.id)}))} className="text-red-400 justify-self-end"><Trash2 className="w-4 h-4"/></button>
              </div>)}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-center text-sm">
              <div className="bg-neutral-950 rounded-xl p-3"><div className="text-neutral-500">المجدول</div><b>{totals.scheduled.toLocaleString()} DA</b></div>
              <div className="bg-neutral-950 rounded-xl p-3"><div className="text-neutral-500">المدفوع</div><b>{totals.paid.toLocaleString()} DA</b></div>
              <div className="bg-neutral-950 rounded-xl p-3"><div className="text-neutral-500">المتبقي</div><b>{totals.remaining.toLocaleString()} DA</b></div>
            </div>
          </section>

          <section className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4"><ListChecks className="w-5 h-5 text-amber-400"/><h3 className="font-bold">Questionnaire</h3></div>
            <div className="space-y-2">{questionnaire.map((q,i)=><div key={q.id} className="flex gap-2"><input value={q.question} onChange={e=>setData(d=>({...d,questionnaire:(d.questionnaire||[]).map((x,n)=>n===i?{...x,question:e.target.value}:x)}))} className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2"/><input value={q.answer} onChange={e=>setData(d=>({...d,questionnaire:(d.questionnaire||[]).map((x,n)=>n===i?{...x,answer:e.target.value}:x)}))} placeholder="إجابة العميل" className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2"/><button onClick={()=>setData(d=>({...d,questionnaire:(d.questionnaire||[]).filter(x=>x.id!==q.id)}))} className="text-red-400"><Trash2 className="w-4 h-4"/></button></div>)}</div>
            <div className="flex gap-2 mt-4"><input value={newQuestion} onChange={e=>setNewQuestion(e.target.value)} placeholder="سؤال جديد" className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2"/><button onClick={()=>{if(!newQuestion.trim())return;setData(d=>({...d,questionnaire:[...(d.questionnaire||[]),{id:crypto.randomUUID(),question:newQuestion.trim(),answer:''}]}));setNewQuestion('')}} className="px-4 rounded-xl bg-amber-500 text-black"><Plus className="w-4 h-4"/></button></div>
          </section>

          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4"><Check className="w-5 h-5 text-amber-400"/><h3 className="font-bold">Contract + Signature</h3></div>
            <input value={contractTitle} onChange={e=>setContractTitle(e.target.value)} placeholder="عنوان العقد" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 mb-2"/>
            <textarea value={contractBody} onChange={e=>setContractBody(e.target.value)} rows={5} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2"/>
            <input value={signatureName} onChange={e=>setSignatureName(e.target.value)} placeholder="اسم التوقيع الإلكتروني" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 mt-2"/>
            <div className="text-xs text-neutral-500 mt-2">{signatureName.trim() ? 'تم إدخال توقيع إلكتروني نصي وسيُحفظ مع وقت التوقيع.' : 'لم يتم توقيع العقد بعد.'}</div>
          </section>

          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4"><Zap className="w-5 h-5 text-amber-400"/><h3 className="font-bold">Automation</h3></div>
            {([
              ['onStatusChange','عند تغيير حالة الحجز'],
              ['onPaymentDue','عند استحقاق دفعة'],
              ['onEventReminder','تذكير قبل موعد المناسبة']
            ] as const).map(([key,label])=><label key={key} className="flex items-center gap-3 p-3 bg-neutral-950 rounded-xl mb-2 cursor-pointer">
              <input type="checkbox" checked={data.automations[key]} onChange={e=>setData(d=>({...d,automations:{...d.automations,[key]:e.target.checked}}))} className="w-4 h-4 accent-amber-500"/>
              <span className="text-sm">{label}</span>
            </label>)}
            <div className="text-xs text-neutral-500 mt-3 leading-6">هذه المرحلة تحفظ قواعد الأتمتة مع الحجز، وسيتم ربطها لاحقاً بقنوات WhatsApp/SMS والإشعارات.</div>
          </section>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-3 mt-6">
          <button onClick={async()=>{ try { const code=ensurePortalCode(); const url=window.location.origin+'/?portal='+encodeURIComponent(code); await navigator.clipboard.writeText(url); setData(d=>({...d,portalCode:code})); alert('تم نسخ رابط بوابة العميل.'); } catch { alert('تعذر نسخ الرابط. احفظ سير العمل أولاً.'); } }} className="px-5 py-3 bg-neutral-800 text-white rounded-xl font-bold">نسخ رابط العميل</button>
          <div className="text-xs text-neutral-500">رابط خاص بالعميل — شاركه معه فقط.</div>
        </div>

        <div className="flex justify-end mt-6">
          <button onClick={save} disabled={saving} className="px-6 py-3 bg-amber-500 text-black rounded-xl font-bold flex items-center gap-2">{saving?'جارٍ الحفظ...':<><Save className="w-4 h-4"/>حفظ سير العمل</>}</button>
        </div>
      </div>
    </div>
  );
};
