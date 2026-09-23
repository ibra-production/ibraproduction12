import React, { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, doc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { BarChart3, BriefcaseBusiness, CalendarDays, CheckCircle2, CreditCard, FileText, Image as ImageIcon, LockKeyhole, Plus, Printer, RefreshCw, Search, ShieldCheck, Usb, Users, WalletCards, ScanLine } from 'lucide-react';
import { db } from '../firebase';

type Props = { bookings: any[]; teamMembers: any[] };

const money=(n:any)=>Number(n||0).toLocaleString('fr-DZ')+' DA';
const dates=(b:any)=>Array.isArray(b?.eventDates)&&b.eventDates.length?b.eventDates:[b?.eventDate].filter(Boolean);
const code=(prefix:string,id:string)=>prefix+'-'+String(id||'').slice(-8).toUpperCase();

const CODE39:Record<string,string>={"0":"nnnwwnwnn","1":"wnnwnnnnw","2":"nnwwnnnnw","3":"wnwwnnnnn","4":"nnnwwnnnw","5":"wnnwwnnnn","6":"nnwwwnnnn","7":"nnnwnnwnw","8":"wnnwnnwnn","9":"nnwwnnwnn","A":"wnnnnwnnw","B":"nnwnnwnnw","C":"wnwnnwnnn","D":"nnnnwwnnw","E":"wnnnwwnnn","F":"nnwnwwnnn","G":"nnnnnwwnw","H":"wnnnnwwnn","I":"nnwnnwwnn","J":"nnnnwwwnn","K":"wnnnnnnww","L":"nnwnnnnww","M":"wnwnnnnwn","N":"nnnnwnnww","O":"wnnnwnnwn","P":"nnwnwnnwn","Q":"nnnnnnwww","R":"wnnnnnwwn","S":"nnwnnnwwn","T":"nnnnwnwwn","U":"wwnnnnnnw","V":"nwwnnnnnw","W":"wwwnnnnnn","X":"nwnnwnnnw","Y":"wwnnwnnnn","Z":"nwwnwnnnn","-":"nwnnnnwnw",".":"wwnnnnwnn"," ":"nwwnnnwnn","$":"nwnwnwnnn","/":"nwnwnnnwn","+":"nwnnnwnwn","%":"nnnwnwnwn","*":"nwnnwnwnn"};
const barcodeSvg=(raw:string)=>{const value=String(raw||"").toUpperCase().replace(/[^0-9A-Z\\-\\. $/+%]/g,"");const payload="*"+value+"*";let x=8;const bars:string[]=[];for(const ch of payload){const p=CODE39[ch]||CODE39["-"];[...p].forEach((u,i)=>{const w=u==="w"?5:2;if(i%2===0)bars.push('<rect x="'+x+'" y="4" width="'+w+'" height="68"/>');x+=w;});x+=2;}const width=x+8;return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+width+' 88" style="width:100%;height:auto;background:#fff;padding:5px">'+bars.join("")+'<text x="'+width/2+'" y="83" text-anchor="middle" font-family="monospace" font-size="11">'+value+'</text></svg>';};



export const OperationsCenter: React.FC<Props> = ({ bookings, teamMembers }) => {
  const [tab,setTab]=useState<'crm'|'shoot'|'usb'|'finance'|'permissions'|'gallery'>('crm');
  const [clients,setClients]=useState<any[]>([]);
  const [workflows,setWorkflows]=useState<any[]>([]);
  const [usbItems,setUsbItems]=useState<any[]>([]);
  const [permissions,setPermissions]=useState<any[]>([]);
  const [gallery,setGallery]=useState<any[]>([]);
  const [search,setSearch]=useState('');
  const [selected,setSelected]=useState<any|null>(null);
  const [loading,setLoading]=useState(false);
  const [scan,setScan]=useState('');
  const [scanBusy,setScanBusy]=useState(false);
  const [scanLogs,setScanLogs]=useState<any[]>([]);
  const scanRef=useRef<HTMLInputElement>(null);

  useEffect(()=>onSnapshot(collection(db,'clients'),s=>setClients(s.docs.map(d=>({id:d.id,...d.data()})))),[]);
  useEffect(()=>onSnapshot(collection(db,'bookingWorkflows'),s=>setWorkflows(s.docs.map(d=>({id:d.id,...d.data()})))),[]);
  useEffect(()=>onSnapshot(collection(db,'usbRecords'),s=>setUsbItems(s.docs.map(d=>({id:d.id,...d.data()})))),[]);
  useEffect(()=>onSnapshot(collection(db,'adminPermissions'),s=>setPermissions(s.docs.map(d=>({id:d.id,...d.data()})))),[]);
  useEffect(()=>onSnapshot(collection(db,'galleryItems'),s=>setGallery(s.docs.map(d=>({id:d.id,...d.data()})))),[]);
  useEffect(()=>onSnapshot(collection(db,'scanLogs'),s=>setScanLogs(s.docs.map(d=>({id:d.id,...d.data()})))),[]);

  const bookingById=useMemo(()=>new Map(bookings.map(b=>[String(b.id),b])),[bookings]);
  const visibleClients=useMemo(()=>{
    const q=search.trim().toLowerCase();
    const source=clients.length?clients:bookings.map(b=>({id:b.phone||b.id,phone:b.phone,groomName:b.groomName,brideName:b.brideName,email:b.email}));
    return source.filter(c=>!q||[c.groomName,c.brideName,c.phone,c.email,c.id].some(v=>String(v||'').toLowerCase().includes(q)));
  },[clients,bookings,search]);

  const upsertClient=async(b:any)=>{
    const id=String(b.phone||b.id||'').replace(/[^0-9A-Za-z_-]/g,'_');
    if(!id)return;
    await setDoc(doc(db,'clients',id),{
      phone:b.phone||'',groomName:b.groomName||'',brideName:b.brideName||'',email:b.email||'',
      lastBookingId:b.id||'',lastEventDates:dates(b),lastStatus:b.status||'new',
      updatedAt:serverTimestamp(),source:'booking'
    },{merge:true});
  };


  const openClientByBarcode=async(raw?:string)=>{
    const value=String(raw??scan).trim().toUpperCase();
    if(!value||scanBusy)return;
    setScanBusy(true);
    try{
      let snap=await getDocs(query(collection(db,'clients'),where('barcode','==',value)));
      if(snap.empty)snap=await getDocs(query(collection(db,'clients'),where('clientCode','==',value)));
      if(snap.empty){await addDoc(collection(db,'scanLogs'),{code:value,type:'client',success:false,createdAt:serverTimestamp()});alert('لم يتم العثور على ملف عميل بهذا الكود.');return;}
      const found={id:snap.docs[0].id,...snap.docs[0].data()} as any;
      const bs=bookings.filter(b=>String(b.clientId||'')===String(found.id)||String(b.clientCode||'').toUpperCase()===String(found.clientCode||'').toUpperCase()||String(b.phone||'')===String(found.phone||''));
      await addDoc(collection(db,'scanLogs'),{code:value,type:'client',success:true,clientId:found.id,clientCode:found.clientCode||value,createdAt:serverTimestamp()});
      setSelected({...found,bookings:bs});
      setScan('');
      setTab('crm');
    }catch(error){console.error(error);alert('تعذر تنفيذ عملية Scan.');}
    finally{setScanBusy(false);setTimeout(()=>scanRef.current?.focus(),50);}
  };

  const printClientCard=(client:any)=>{
    const value=String(client.clientCode||client.barcode||'').toUpperCase();
    if(!value)return;
    const safeName=String(client.fullName||client.groomName||'Client').replace(/[<>&]/g,'');
    const barcode=barcodeSvg(value);
    const html='<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>Ibra Client Card</title><style>body{font-family:Arial;padding:20px;background:#eee}.card{width:86mm;min-height:54mm;background:#111;color:#fff;border-radius:14px;padding:18px;text-align:center;box-sizing:border-box}.brand{color:#d4a84b;font-weight:900;letter-spacing:2px}.name{font-size:18px;font-weight:800;margin:10px}.code{font-family:monospace;color:#d4a84b}.hint{font-size:9px;color:#aaa;margin-top:8px}@media print{body{background:#fff;padding:0}}</style></head><body><div class="card"><div class="brand">IBRA PRODUCTION</div><div class="name">'+safeName+'</div><div class="code">'+value+'</div>'+barcode+'<div class="hint">Client ID — امسح الباركود لفتح الملف</div></div><script>window.print()</script></body></html>';
    const w=window.open('','_blank');if(w){w.document.write(html);w.document.close();}
  };

  const createUsb=async(b:any)=>{
    const usbCode=code('USB',b.id);
    await setDoc(doc(db,'usbRecords',usbCode),{
      id:usbCode,bookingId:b.id,clientPhone:b.phone||'',clientName:b.groomName||'',
      label:'USB Client Master',status:'pending',preparedAt:null,deliveredAt:null,
      createdAt:serverTimestamp(),updatedAt:serverTimestamp()
    },{merge:true});
    alert('تم إنشاء سجل USB: '+usbCode);
  };

  const updateUsb=async(item:any,status:string)=>{
    await setDoc(doc(db,'usbRecords',item.id),{...item,status,updatedAt:serverTimestamp(),...(status==='delivered'?{deliveredAt:serverTimestamp()}:{})},{merge:true});
  };

  const createWorkflow=async(b:any)=>{
    const existing=workflows.find(w=>String(w.bookingId)===String(b.id));
    if(existing){setSelected(b);setTab('shoot');return;}
    await setDoc(doc(db,'bookingWorkflows',String(b.id)),{
      bookingId:b.id,shootStatus:'planned',assignedTeam:[],equipment:[],locations:[],
      callTime:b.eventTime||'',eventDates:dates(b),notes:'',createdAt:serverTimestamp(),updatedAt:serverTimestamp()
    });
    setSelected(b);setTab('shoot');
  };

  const printShoot=()=>{
    if(!selected)return;
    const w=workflows.find(x=>String(x.bookingId)===String(selected.id))||{};
    const rows=(dates(selected).map((d:string)=>'<li>'+d+'</li>').join(''))||'<li>—</li>';
    const team=(Array.isArray(w.assignedTeam)?w.assignedTeam:[]).join('، ')||'غير محدد';
    const html='<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>Shoot Sheet</title><style>body{font-family:Arial;padding:35px;line-height:1.8}h1{color:#111}.box{border:1px solid #ddd;padding:15px;margin:12px 0;border-radius:10px}</style></head><body><h1>Ibra Production — Shoot Sheet</h1><div class="box"><b>العميل:</b> '+(selected.groomName||'')+' '+(selected.brideName?'× '+selected.brideName:'')+'<br><b>الهاتف:</b> '+(selected.phone||'—')+'<br><b>الحجز:</b> #'+selected.id+'<br><b>الوقت:</b> '+(selected.eventTime||'—')+'</div><div class="box"><b>تواريخ التصوير:</b><ul>'+rows+'</ul><b>الفريق:</b> '+team+'<br><b>المكان:</b> '+(selected.venue||'—')+'</div><script>window.print()</script></body></html>';
    const win=window.open('','_blank'); if(win){win.document.write(html);win.document.close();}
  };

  const tabs=[
    ['crm','CRM العملاء',Users],['scan','Ibra Scan Center',ScanLine],['shoot','Shoot Sheet',BriefcaseBusiness],['usb','USB / Barcode',Usb],
    ['finance','النظام المالي',WalletCards],['permissions','الصلاحيات',LockKeyhole],['gallery','Gallery / R2',ImageIcon]
  ] as const;

  return <section className="space-y-5" data-operations-center>
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h2 className="text-2xl font-black">Ibra Production Operations Center</h2><p className="text-xs text-neutral-400 mt-1">CRM + Shoot Sheet + USB + Finance + Permissions + Gallery</p></div>
        <div className="text-xs text-neutral-500">{bookings.length} حجز • {teamMembers.length} عضو فريق</div>
      </div>
      <div className="flex gap-2 overflow-x-auto mt-5 pb-1">{tabs.map(([id,label,Icon])=><button key={id} onClick={()=>setTab(id as any)} className={'px-4 py-2.5 rounded-xl whitespace-nowrap font-bold text-sm '+(tab===id?'bg-amber-500 text-black':'bg-neutral-950 text-neutral-300 border border-neutral-800')}><Icon className="w-4 h-4 inline ml-2"/>{label}</button>)}</div>
    </div>


    {tab==='scan'&&<div className="space-y-4">
      <div className="bg-neutral-900 border border-amber-500/30 rounded-3xl p-6">
        <div className="flex items-center gap-3"><ScanLine className="w-7 h-7 text-amber-400"/><div><h3 className="text-2xl font-black">Ibra Scan Center</h3><p className="text-sm text-neutral-400">قارئ USB يعمل كلوحة مفاتيح. امسح بطاقة العميل ثم Enter لفتح ملفه مباشرة.</p></div></div>
        <div className="flex gap-2 mt-6"><input ref={scanRef} autoFocus value={scan} onChange={e=>setScan(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();void openClientByBarcode();}}} placeholder="Scan Client Barcode..." className="flex-1 bg-neutral-950 border border-amber-500/40 rounded-2xl px-5 py-4 font-mono text-lg"/><button disabled={scanBusy} onClick={()=>void openClientByBarcode()} className="px-6 rounded-2xl bg-amber-500 text-black font-black">SCAN</button></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 text-xs"><div className="bg-neutral-950 rounded-xl p-4">ملفات العملاء <b className="block text-xl mt-1">{clients.length}</b></div><div className="bg-neutral-950 rounded-xl p-4">عمليات Scan <b className="block text-xl mt-1">{scanLogs.length}</b></div><div className="bg-neutral-950 rounded-xl p-4">آخر كود <b className="block text-amber-400 mt-1 font-mono">{scanLogs[scanLogs.length-1]?.code||'—'}</b></div></div>
      </div>
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5"><h3 className="font-black mb-3">سجل Scan</h3>{scanLogs.slice(-20).reverse().map(l=><div key={l.id} className="flex justify-between py-3 border-t border-neutral-800 text-xs"><span className={l.success?'text-emerald-400':'text-red-400'}>{l.success?'✓':'✕'} {l.code}</span><span className="text-neutral-500">{l.clientCode||'غير موجود'}</span></div>)}</div>
    </div>}
    {tab==='crm'&&<div className="space-y-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex gap-3"><Search className="w-5 h-5 text-neutral-500 mt-3"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث بالاسم أو الهاتف أو البريد..." className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3"/></div>
      <div className="grid gap-3">{visibleClients.map(c=>{
        const bs=bookings.filter(b=>String(b.phone||'')===String(c.phone||'')||String(b.id)===String(c.lastBookingId));
        return <div key={c.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="font-black text-lg">{c.groomName||'عميل'}{c.brideName?' × '+c.brideName:''}</div><div className="text-xs text-neutral-500 mt-1">{c.phone||'—'} • {c.email||'—'}</div></div><button onClick={()=>setSelected({...c,bookings:bs})} className="px-4 py-2 bg-amber-500 text-black rounded-xl font-bold">فتح الملف</button><button onClick={()=>printClientCard(c)} className="px-4 py-2 bg-neutral-800 rounded-xl"><Printer className="w-4 h-4 inline ml-1"/>بطاقة العميل</button></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 text-xs"><div className="bg-neutral-950 p-3 rounded-xl">الحجوزات <b className="block text-white mt-1">{bs.length}</b></div><div className="bg-neutral-950 p-3 rounded-xl">آخر حالة <b className="block text-white mt-1">{c.lastStatus||'—'}</b></div><div className="bg-neutral-950 p-3 rounded-xl">آخر موعد <b className="block text-white mt-1">{(c.lastEventDates||[])[0]||'—'}</b></div><div className="bg-neutral-950 p-3 rounded-xl">USB <b className="block text-white mt-1">{usbItems.filter(u=>u.clientPhone===c.phone).length}</b></div></div>
        </div>
      })}</div>
      {selected&&<div className="fixed inset-0 z-[120] bg-black/70 p-4 overflow-auto"><div className="max-w-4xl mx-auto bg-neutral-900 border border-neutral-700 rounded-3xl p-6"><div className="flex justify-between"><div><h3 className="text-2xl font-black">ملف العميل الكامل</h3><p className="text-neutral-400">{selected.groomName||'—'} {selected.brideName?'× '+selected.brideName:''}</p></div><button onClick={()=>setSelected(null)} className="px-3 py-2 bg-neutral-800 rounded-xl">إغلاق</button></div>
        <div className="grid md:grid-cols-3 gap-3 mt-5">{[['الهاتف',selected.phone],['البريد',selected.email],['عدد الحجوزات',selected.bookings?.length||0]].map(([a,b])=><div className="bg-neutral-950 rounded-xl p-4" key={String(a)}><div className="text-xs text-neutral-500">{a}</div><b>{String(b||'—')}</b></div>)}</div>
        <div className="mt-5"><h4 className="font-bold mb-3">سجل الحجوزات</h4>{(selected.bookings||[]).map((b:any)=><div key={b.id} className="bg-neutral-950 rounded-xl p-4 mb-2"><b>#{b.id}</b> • {b.eventType||'مناسبة'} • {dates(b).join(' • ')} • {b.status}</div>)}</div>
        <div className="flex flex-wrap gap-2 mt-5"><button onClick={()=>{const b=(selected.bookings||[])[0];if(b)createWorkflow(b)}} className="px-4 py-2.5 bg-amber-500 text-black rounded-xl font-bold">فتح Shoot Sheet</button><button onClick={()=>{const b=(selected.bookings||[])[0];if(b)createUsb(b)}} className="px-4 py-2.5 bg-neutral-800 rounded-xl">إنشاء USB</button></div>
      </div></div>}
    </div>}

    {tab==='shoot'&&<div className="space-y-4">
      <div className="grid gap-3">{bookings.filter(b=>b.status!=='cancelled').map(b=>{const w=workflows.find(x=>String(x.bookingId)===String(b.id))||{};return <div key={b.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3"><div><b>{b.groomName||'عميل'} {b.brideName?'× '+b.brideName:''}</b><div className="text-xs text-neutral-500 mt-1">{dates(b).join(' • ')} • {b.eventTime||'—'} • {b.venue||'—'}</div></div><div className="flex gap-2"><button onClick={()=>createWorkflow(b)} className="px-3 py-2 bg-neutral-800 rounded-xl">{w.id?'فتح':'إنشاء'}</button><button onClick={()=>{setSelected(b);void createWorkflow(b)}} className="px-3 py-2 bg-amber-500 text-black rounded-xl"><Printer className="w-4 h-4 inline ml-1"/>PDF/طباعة</button></div></div>})}</div>
      {selected&&<div className="bg-neutral-900 border border-amber-500/20 rounded-2xl p-5"><div className="flex justify-between"><h3 className="text-xl font-black">Shoot Sheet — #{selected.id}</h3><button onClick={printShoot} className="px-4 py-2 bg-white text-black rounded-xl font-bold">طباعة</button></div><div className="grid md:grid-cols-2 gap-3 mt-4"><div className="bg-neutral-950 rounded-xl p-4">العميل: <b>{selected.groomName||'—'}</b></div><div className="bg-neutral-950 rounded-xl p-4">الفريق: <b>{(workflows.find(w=>String(w.bookingId)===String(selected.id))?.assignedTeam||[]).join('، ')||'غير محدد'}</b></div><div className="bg-neutral-950 rounded-xl p-4">التواريخ: <b>{dates(selected).join(' • ')}</b></div><div className="bg-neutral-950 rounded-xl p-4">الوقت: <b>{selected.eventTime||'—'}</b></div></div></div>}
    </div>}

    {tab==='usb'&&<div className="space-y-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5"><h3 className="text-xl font-black">USB Delivery Tracking</h3><p className="text-xs text-neutral-500 mt-1">ربط USB بالعميل والحجز ومتابعة التحضير والتسليم.</p></div>
      <div className="grid gap-3">{bookings.filter(b=>b.status!=='cancelled').map(b=>{const u=usbItems.find(x=>String(x.bookingId)===String(b.id));return <div key={b.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-wrap justify-between gap-3"><div><b>{b.groomName||'عميل'}</b><div className="font-mono text-amber-300 text-sm">{u?.id||code('USB',b.id)}</div><div className="text-xs text-neutral-500">{u?.status||'غير منشأ'}</div></div><div className="flex gap-2">{!u?<button onClick={()=>createUsb(b)} className="px-4 py-2 bg-amber-500 text-black rounded-xl font-bold"><Plus className="w-4 h-4 inline ml-1"/>إنشاء</button>:<select value={u.status||'pending'} onChange={e=>void updateUsb(u,e.target.value)} className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2"><option value="pending">قيد التحضير</option><option value="ready">جاهز</option><option value="delivered">تم التسليم</option></select>}</div></div>})}</div>
    </div>}

    {tab==='finance'&&<div className="space-y-4">
      {(()=>{const rows=bookings.map(b=>{const w=workflows.find(x=>String(x.bookingId)===String(b.id));const ps=Array.isArray(w?.payments)?w.payments:[];return {b,ps,total:ps.reduce((s:number,p:any)=>s+Number(p.amount||0),0),paid:ps.reduce((s:number,p:any)=>s+Number(p.paidAmount||0),0)}});const total=rows.reduce((s,r)=>s+r.total,0),paid=rows.reduce((s,r)=>s+r.paid,0);return <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3"><div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5"><BarChart3 className="text-amber-400"/><div className="text-xs text-neutral-500 mt-2">إجمالي المبرمج</div><b className="text-2xl">{money(total)}</b></div><div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5"><CheckCircle2 className="text-emerald-400"/><div className="text-xs text-neutral-500 mt-2">إجمالي المدفوع</div><b className="text-2xl">{money(paid)}</b></div><div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5"><CreditCard className="text-amber-400"/><div className="text-xs text-neutral-500 mt-2">المتبقي</div><b className="text-2xl">{money(Math.max(total-paid,0))}</b></div></div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden"><div className="p-5 font-bold">كشف مالي حسب الحجز</div><div className="overflow-auto"><table className="w-full text-sm"><thead className="bg-neutral-950"><tr><th className="p-3 text-right">العميل</th><th className="p-3 text-right">المبرمج</th><th className="p-3 text-right">المدفوع</th><th className="p-3 text-right">المتبقي</th></tr></thead><tbody>{rows.map(r=><tr key={r.b.id} className="border-t border-neutral-800"><td className="p-3">{r.b.groomName||'—'}</td><td className="p-3">{money(r.total)}</td><td className="p-3">{money(r.paid)}</td><td className="p-3">{money(Math.max(r.total-r.paid,0))}</td></tr>)}</tbody></table></div></div>
      </>})()}
    </div>}

    {tab==='permissions'&&<div className="space-y-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5"><h3 className="text-xl font-black">Team Permissions</h3><p className="text-xs text-neutral-500 mt-1">الصلاحيات محفوظة في Firestore ويمكن تطويرها لاحقاً إلى Firebase Custom Claims.</p></div>
      {(teamMembers.length?teamMembers:[{id:'owner',fullName:'Owner',role:'Owner'}]).map((m:any)=>{const p=permissions.find(x=>x.id===m.id)||{viewBookings:true,editBookings:false,viewFinance:false,manageGallery:false,manageTeam:false,scanCenter:true};return <div key={m.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4"><div className="flex justify-between"><div><b>{m.fullName}</b><div className="text-xs text-neutral-500">{m.role||'Member'}</div></div><ShieldCheck className="text-amber-400"/></div><div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">{Object.keys(p).filter(k=>typeof p[k]==='boolean').map(k=><label key={k} className="bg-neutral-950 rounded-xl p-3 text-xs flex items-center gap-2"><input type="checkbox" checked={!!p[k]} onChange={async e=>{const next={...p,[k]:e.target.checked,updatedAt:serverTimestamp()};await setDoc(doc(db,'adminPermissions',m.id),next,{merge:true})}}/>{k}</label>)}</div></div>})}
    </div>}

    {tab==='gallery'&&<div className="space-y-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5"><h3 className="text-xl font-black">Client Gallery / Cloudflare R2</h3><p className="text-xs text-neutral-400 mt-1">هذه الطبقة تحفظ بيانات المعرض وروابط الملفات؛ الرفع الفعلي إلى R2 يجب أن يتم عبر Presigned URL / Worker حتى لا تظهر مفاتيح R2 داخل المتصفح.</p><div className="grid md:grid-cols-2 gap-3 mt-4"><input id="gallery-booking" placeholder="Booking ID" className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2"/><input id="gallery-url" placeholder="Public/R2 URL للملف" className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2"/><input id="gallery-title" placeholder="اسم الملف / الوصف" className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2"/><button onClick={async()=>{const b=(document.getElementById('gallery-booking') as HTMLInputElement).value.trim();const u=(document.getElementById('gallery-url') as HTMLInputElement).value.trim();const t=(document.getElementById('gallery-title') as HTMLInputElement).value.trim();if(!b||!u)return alert('أدخل Booking ID وR2 URL');await addDoc(collection(db,'galleryItems'),{bookingId:b,url:u,title:t||'Gallery file',type:'image',visible:true,createdAt:serverTimestamp()});alert('تم حفظ عنصر المعرض.');}} className="bg-amber-500 text-black rounded-xl font-bold">إضافة عنصر</button></div></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{gallery.map(g=><div key={g.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">{g.type==='image'&&<img src={g.url} alt="" className="w-full aspect-square object-cover" onError={e=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>}<div className="p-3 text-xs"><b>{g.title||'—'}</b><div className="text-neutral-500 mt-1">#{g.bookingId}</div></div></div>)}</div>
    </div>}
  </section>;
};
