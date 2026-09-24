import React, { useEffect, useMemo, useRef, useState } from 'react';
import { addDoc, collection, doc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { BarChart3, BriefcaseBusiness, CalendarDays, CheckCircle2, CreditCard, FileText, Image as ImageIcon, LockKeyhole, Plus, Printer, RefreshCw, Search, ShieldCheck, Usb, Users, WalletCards, ScanLine, Upload } from 'lucide-react';
import { db, storage } from '../firebase';

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
  const [contracts,setContracts]=useState<any[]>([]);
  const [invoices,setInvoices]=useState<any[]>([]);
  const [payments,setPayments]=useState<any[]>([]);
  const [clientTab,setClientTab]=useState<'overview'|'bookings'|'finance'|'documents'|'gallery'|'usb'|'shoot'|'activity'>('overview');
  const [recordModal,setRecordModal]=useState<{type:'contract'|'invoice'|'payment';bookingId:string}|null>(null);
  const [recordForm,setRecordForm]=useState<any>({title:'',number:'',amount:'',method:'cash',status:'draft',notes:''});
  const [galleryUploading,setGalleryUploading]=useState(false);
  const scanRef=useRef<HTMLInputElement>(null);

  useEffect(()=>onSnapshot(collection(db,'clients'),s=>setClients(s.docs.map(d=>({id:d.id,...d.data()})))),[]);
  useEffect(()=>onSnapshot(collection(db,'bookingWorkflows'),s=>setWorkflows(s.docs.map(d=>({id:d.id,...d.data()})))),[]);
  useEffect(()=>onSnapshot(collection(db,'usbRecords'),s=>setUsbItems(s.docs.map(d=>({id:d.id,...d.data()})))),[]);
  useEffect(()=>onSnapshot(collection(db,'adminPermissions'),s=>setPermissions(s.docs.map(d=>({id:d.id,...d.data()})))),[]);
  useEffect(()=>onSnapshot(collection(db,'galleryItems'),s=>setGallery(s.docs.map(d=>({id:d.id,...d.data()})))),[]);
  useEffect(()=>onSnapshot(collection(db,'scanLogs'),s=>setScanLogs(s.docs.map(d=>({id:d.id,...d.data()})))),[]);
  useEffect(()=>onSnapshot(collection(db,'contracts'),s=>setContracts(s.docs.map(d=>({id:d.id,...d.data()})))),[]);
  useEffect(()=>onSnapshot(collection(db,'invoices'),s=>setInvoices(s.docs.map(d=>({id:d.id,...d.data()})))),[]);
  useEffect(()=>onSnapshot(collection(db,'payments'),s=>setPayments(s.docs.map(d=>({id:d.id,...d.data()})))),[]);

  const bookingById=useMemo(()=>new Map(bookings.map(b=>[String(b.id),b])),[bookings]);
  const visibleClients=useMemo(()=>{
    const q=search.trim().toLowerCase();
    const source=clients.length?clients:bookings.map(b=>({id:b.phone||b.id,phone:b.phone,groomName:b.groomName,brideName:b.brideName,email:b.email}));
    return source.filter(c=>!q||[c.groomName,c.brideName,c.phone,c.email,c.id].some(v=>String(v||'').toLowerCase().includes(q)));
  },[clients,bookings,search]);

  const uploadClientGalleryFiles=async(files:FileList|File[],bookingId:string,client:any)=>{
    const list=Array.from(files||[]);
    if(!bookingId||!list.length)return;
    const allowed=['image/jpeg','image/png','image/webp','image/jpg'];
    try{
      setGalleryUploading(true);
      const clientCode=String(client?.clientCode||client?.barcode||'');
      for(const file of list){
        if(!allowed.includes(file.type))throw new Error('الصيغة غير مدعومة: '+file.name);
        if(file.size>15*1024*1024)throw new Error('الصورة أكبر من 15 MB: '+file.name);
        const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
        const path=`gallery/${bookingId}/${Date.now()}_${safe}`;
        const storageRef=ref(storage,path);
        await uploadBytes(storageRef,file,{contentType:file.type});
        const url=await getDownloadURL(storageRef);
        await addDoc(collection(db,'galleryItems'),{
          bookingId,
          clientId:client?.id||null,
          clientCode:clientCode||null,
          clientName:client?.groomName||client?.fullName||'',
          url,
          storagePath:path,
          title:file.name,
          type:'image',
          visible:true,
          createdAt:serverTimestamp(),
          source:'Ibra Production Client Gallery'
        });
      }
      alert('تم رفع صور العميل وربطها بملف الحجز والعميل.');
    }catch(error){
      console.error('Client gallery upload error:',error);
      alert(error instanceof Error?error.message:'فشل رفع صور العميل.');
    }finally{setGalleryUploading(false);}
  };

  const upsertClient=async(b:any)=>{
    const id=String(b.phone||b.id||'').replace(/[^0-9A-Za-z_-]/g,'_');
    if(!id)return;
    await setDoc(doc(db,'clients',id),{
      phone:b.phone||'',groomName:b.groomName||'',brideName:b.brideName||'',email:b.email||'',
      lastBookingId:b.id||'',lastEventDates:dates(b),lastStatus:b.status||'new',
      clientCode:code('IBRA-C',id),barcode:code('IBRA-C',id),
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
    const value=String(client.clientCode||client.barcode||'').toUpperCase(); if(!value)return;
    const safeName=String(client.fullName||client.groomName||'Client').replace(/[<>&]/g,'');
    const barcode=barcodeSvg(value);
    const html='<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>Ibra Client Card</title><style>body{font-family:Arial;padding:20px;background:#eee}.card{width:86mm;min-height:54mm;background:#111;color:#fff;border-radius:14px;padding:18px;text-align:center;box-sizing:border-box}.brand{color:#d4a84b;font-weight:900;letter-spacing:2px}.name{font-size:18px;font-weight:800;margin:10px}.code{font-family:monospace;color:#d4a84b}.hint{font-size:9px;color:#aaa;margin-top:8px}@media print{body{background:#fff;padding:0}}</style></head><body><div class="card"><div class="brand">IBRA PRODUCTION</div><div class="name">'+safeName+'</div><div class="code">'+value+'</div>'+barcode+'<div class="hint">Client ID — امسح الباركود لفتح الملف</div></div><script>window.print()</script></body></html>';
    const w=window.open('','_blank');if(w){w.document.write(html);w.document.close();}
  };

  const ensureClientIdentity=async(client:any)=>{
    const id=String(client?.id||''); if(!id) return {id:'',clientCode:''};
    const clientCode=String(client.clientCode||client.barcode||code('IBRA-C',id));
    await setDoc(doc(db,'clients',id),{clientCode,barcode:clientCode,updatedAt:serverTimestamp()},{merge:true});
    return {id,clientCode};
  };

  const openRecordModal=(type:'contract'|'invoice'|'payment',bookingId:string)=>{
    setRecordForm({title:type==='contract'?'عقد خدمات Ibra Production':type==='invoice'?'فاتورة خدمات':'دفعة',number:'',amount:'',method:'cash',status:type==='payment'?'paid':'draft',notes:''});
    setRecordModal({type,bookingId});
  };

  const saveClientRecord=async()=>{
    if(!recordModal||!selected)return;
    const booking=(selected.bookings||[]).find((b:any)=>String(b.id)===String(recordModal.bookingId));
    const identity=await ensureClientIdentity(selected);
    const common={clientId:identity.id,clientCode:identity.clientCode,bookingId:recordModal.bookingId,clientPhone:selected.phone||'',clientName:selected.groomName||selected.fullName||'',createdAt:serverTimestamp(),updatedAt:serverTimestamp()};
    if(recordModal.type==='contract'){
      await addDoc(collection(db,'contracts'),{...common,title:recordForm.title||'عقد خدمات',contractNumber:recordForm.number||('CTR-'+Date.now()),status:recordForm.status||'draft',notes:recordForm.notes||'',eventDates:booking?dates(booking):[]});
    }else if(recordModal.type==='invoice'){
      const amount=Number(recordForm.amount||0);
      await addDoc(collection(db,'invoices'),{...common,invoiceNumber:recordForm.number||('INV-'+Date.now()),title:recordForm.title||'فاتورة خدمات',total:amount,amount,status:recordForm.status||'draft',notes:recordForm.notes||''});
    }else{
      const amount=Number(recordForm.amount||0);
      await addDoc(collection(db,'payments'),{...common,paymentNumber:recordForm.number||('PAY-'+Date.now()),amount,paidAmount:amount,amountPaid:amount,method:recordForm.method||'cash',paymentMethod:recordForm.method||'cash',status:'paid',date:new Date().toISOString().slice(0,10),notes:recordForm.notes||''});
    }
    setRecordModal(null); alert('تم حفظ العملية وربطها بملف العميل.');
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
      {selected&&<div className="fixed inset-0 z-[120] bg-black/80 p-3 md:p-6 overflow-auto"><div className="max-w-6xl mx-auto bg-neutral-900 border border-neutral-700 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-5 md:p-7 bg-gradient-to-br from-neutral-950 to-neutral-900 border-b border-neutral-800">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="text-xs text-amber-400 font-black tracking-widest">IBRA PRODUCTION • CLIENT FILE</div><h3 className="text-3xl font-black mt-2">{selected.groomName||selected.fullName||'Client'} {selected.brideName?'× '+selected.brideName:''}</h3><div className="text-sm text-neutral-400 mt-2">{selected.phone||'—'} • {selected.email||'—'}</div><div className="flex flex-wrap gap-2 mt-3"><span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 font-mono text-xs">{selected.clientCode||selected.barcode||'NO-CODE'}</span><span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 text-xs">{selected.bookings?.length||0} حجز</span></div></div><div className="flex gap-2"><button onClick={()=>printClientCard(selected)} className="px-4 py-2 bg-amber-500 text-black rounded-xl font-black"><Printer className="w-4 h-4 inline ml-1"/> ID Card</button><button onClick={()=>{const b=(selected.bookings||[])[0];if(b)openRecordModal('contract',String(b.id));else alert('العميل لا يملك حجزاً بعد.')}} className="px-3 py-2 bg-neutral-800 rounded-xl font-bold"><FileText className="w-4 h-4 inline ml-1"/> عقد</button><button onClick={()=>{const b=(selected.bookings||[])[0];if(b)openRecordModal('invoice',String(b.id));else alert('العميل لا يملك حجزاً بعد.')}} className="px-3 py-2 bg-neutral-800 rounded-xl font-bold">فاتورة</button><button onClick={()=>{const b=(selected.bookings||[])[0];if(b)openRecordModal('payment',String(b.id));else alert('العميل لا يملك حجزاً بعد.')}} className="px-3 py-2 bg-neutral-800 rounded-xl font-bold"><CreditCard className="w-4 h-4 inline ml-1"/> دفعة</button><button onClick={()=>setSelected(null)} className="px-3 py-2 bg-neutral-800 rounded-xl">إغلاق</button></div></div>
        </div>
        <div className="flex gap-2 overflow-x-auto p-3 border-b border-neutral-800 bg-neutral-950"><button onClick={()=>setClientTab('overview' as any)} className={'px-3 py-2 rounded-xl whitespace-nowrap text-xs font-bold '+(clientTab==='overview'?'bg-amber-500 text-black':'bg-neutral-900 text-neutral-300')}>نظرة عامة</button><button onClick={()=>setClientTab('bookings' as any)} className={'px-3 py-2 rounded-xl whitespace-nowrap text-xs font-bold '+(clientTab==='bookings'?'bg-amber-500 text-black':'bg-neutral-900 text-neutral-300')}>الحجوزات</button><button onClick={()=>setClientTab('finance' as any)} className={'px-3 py-2 rounded-xl whitespace-nowrap text-xs font-bold '+(clientTab==='finance'?'bg-amber-500 text-black':'bg-neutral-900 text-neutral-300')}>المالية</button><button onClick={()=>setClientTab('documents' as any)} className={'px-3 py-2 rounded-xl whitespace-nowrap text-xs font-bold '+(clientTab==='documents'?'bg-amber-500 text-black':'bg-neutral-900 text-neutral-300')}>العقود والفواتير</button><button onClick={()=>setClientTab('gallery' as any)} className={'px-3 py-2 rounded-xl whitespace-nowrap text-xs font-bold '+(clientTab==='gallery'?'bg-amber-500 text-black':'bg-neutral-900 text-neutral-300')}>Gallery</button><button onClick={()=>setClientTab('usb' as any)} className={'px-3 py-2 rounded-xl whitespace-nowrap text-xs font-bold '+(clientTab==='usb'?'bg-amber-500 text-black':'bg-neutral-900 text-neutral-300')}>USB</button><button onClick={()=>setClientTab('shoot' as any)} className={'px-3 py-2 rounded-xl whitespace-nowrap text-xs font-bold '+(clientTab==='shoot'?'bg-amber-500 text-black':'bg-neutral-900 text-neutral-300')}>Shoot Sheet</button><button onClick={()=>setClientTab('activity' as any)} className={'px-3 py-2 rounded-xl whitespace-nowrap text-xs font-bold '+(clientTab==='activity'?'bg-amber-500 text-black':'bg-neutral-900 text-neutral-300')}>سجل العمليات</button></div>
        <div className="p-5 md:p-7">
          {clientTab==='overview'&&<div className="space-y-5"><div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-neutral-950 rounded-2xl p-4"><span className="text-xs text-neutral-500">الهاتف</span><b className="block mt-2">{selected.phone||'—'}</b></div>
            <div className="bg-neutral-950 rounded-2xl p-4"><span className="text-xs text-neutral-500">البريد</span><b className="block mt-2 break-all">{selected.email||'—'}</b></div>
            <div className="bg-neutral-950 rounded-2xl p-4"><span className="text-xs text-neutral-500">العنوان</span><b className="block mt-2">{selected.address||'—'}</b></div>
            <div className="bg-neutral-950 rounded-2xl p-4"><span className="text-xs text-neutral-500">Client ID</span><b className="block mt-2 font-mono text-amber-300">{selected.clientCode||selected.barcode||'—'}</b></div>
          </div><div className="grid md:grid-cols-2 gap-4"><div className="bg-neutral-950 rounded-2xl p-5"><h4 className="font-black mb-3">ملخص الحجوزات</h4>{(selected.bookings||[]).slice(0,5).map((b:any)=><div key={b.id} className="border-t border-neutral-800 py-3 text-sm">#{b.id} • {dates(b).join(' • ')} • {b.status}</div>)}</div><div className="bg-neutral-950 rounded-2xl p-5"><h4 className="font-black mb-3">ملخص التسليم</h4><div className="text-sm space-y-2"><div>USB: <b>{usbItems.filter(u=>u.clientId===selected.id||u.clientPhone===selected.phone).length}</b></div><div>Gallery: <b>{gallery.filter(g=>(selected.bookings||[]).some((b:any)=>String(b.id)===String(g.bookingId))).length}</b></div><div>Scans: <b>{scanLogs.filter(l=>l.clientId===selected.id||l.clientCode===selected.clientCode).length}</b></div></div></div></div></div>}
          {clientTab==='bookings'&&<div className="space-y-3">{(selected.bookings||[]).map((b:any)=><div key={b.id} className="bg-neutral-950 rounded-2xl p-5"><div className="flex justify-between gap-3"><b>الحجز #{b.id}</b><span>{b.status}</span></div><div className="grid md:grid-cols-3 gap-3 mt-3 text-sm"><div>النوع: <b>{b.eventType||'—'}</b></div><div>التواريخ: <b>{dates(b).join(' • ')||'—'}</b></div><div>الوقت: <b>{b.eventTime||'—'}</b></div><div>المكان: <b>{b.venue||'—'}</b></div><div>الباقة: <b>{b.packageName||b.package||'—'}</b></div><div>الطلب: <b>{b.orderNumber||'—'}</b></div></div><div className="flex flex-wrap gap-2 mt-4"><button onClick={()=>openRecordModal('contract',String(b.id))} className="px-3 py-2 bg-neutral-800 rounded-xl text-xs font-bold">+ عقد</button><button onClick={()=>openRecordModal('invoice',String(b.id))} className="px-3 py-2 bg-neutral-800 rounded-xl text-xs font-bold">+ فاتورة</button><button onClick={()=>openRecordModal('payment',String(b.id))} className="px-3 py-2 bg-emerald-600 rounded-xl text-xs font-bold">+ دفعة</button><button onClick={()=>{setSelected(b);void createUsb(b)}} className="px-3 py-2 bg-neutral-800 rounded-xl text-xs font-bold">USB</button><button onClick={()=>{setSelected(b);void createWorkflow(b)}} className="px-3 py-2 bg-neutral-800 rounded-xl text-xs font-bold">Shoot Sheet</button></div></div>)}</div>}
          {clientTab==='finance'&&<div className="space-y-4">{(selected.bookings||[]).map((b:any)=>{const w=workflows.find(x=>String(x.bookingId)===String(b.id));const ps=[...(Array.isArray(w?.payments)?w.payments:[]),...payments.filter(p=>String(p.clientId||p.bookingId||'')===String(selected.id)||String(p.bookingId||'')===String(b.id))];const paid=ps.reduce((n:number,p:any)=>n+Number(p.paidAmount??p.amountPaid??p.amount??0),0);const total=Number(b.totalPrice??b.total??b.price??w?.total??0);return <div key={b.id} className="bg-neutral-950 rounded-2xl p-5"><div className="font-black mb-3">الحجز #{b.id}</div><div className="grid grid-cols-3 gap-2 text-sm"><div>الإجمالي<br/><b>{money(total)}</b></div><div>المدفوع<br/><b className="text-emerald-400">{money(paid)}</b></div><div>المتبقي<br/><b className="text-amber-300">{money(Math.max(total-paid,0))}</b></div></div>{ps.length>0&&<div className="mt-4 space-y-2">{ps.map((p:any,i:number)=><div key={i} className="border-t border-neutral-800 pt-2 text-xs">{p.date||p.createdAt?.toDate?.()?.toLocaleDateString?.()||'—'} • {money(p.amount??p.paidAmount??p.amountPaid)} • {p.method||p.paymentMethod||'—'}</div>)}</div>}</div>})}</div>}
          {clientTab==='documents'&&<div className="space-y-4"><div className="grid md:grid-cols-2 gap-3"><div className="bg-neutral-950 rounded-2xl p-5"><h4 className="font-black">العقود</h4>{contracts.filter(x=>x.clientId===selected.id||x.clientCode===selected.clientCode||(selected.bookings||[]).some((b:any)=>String(b.id)===String(x.bookingId))).map(x=><div key={x.id} className="border-t border-neutral-800 mt-3 pt-3 text-sm"><b>{x.title||x.contractNumber||'Contract'}</b><div className="text-xs text-neutral-500">{x.url||x.pdfUrl||x.status||'—'}</div></div>)}{!contracts.some(x=>x.clientId===selected.id||x.clientCode===selected.clientCode||(selected.bookings||[]).some((b:any)=>String(b.id)===String(x.bookingId)))&&<div className="text-xs text-neutral-500 mt-3">لا توجد عقود مسجلة حالياً.</div>}</div><div className="bg-neutral-950 rounded-2xl p-5"><h4 className="font-black">الفواتير</h4>{invoices.filter(x=>x.clientId===selected.id||x.clientCode===selected.clientCode||(selected.bookings||[]).some((b:any)=>String(b.id)===String(x.bookingId))).map(x=><div key={x.id} className="border-t border-neutral-800 mt-3 pt-3 text-sm"><b>{x.invoiceNumber||x.title||'Invoice'}</b><div className="text-xs text-neutral-500">{money(x.total??x.amount)} • {x.status||'—'}</div></div>)}{!invoices.some(x=>x.clientId===selected.id||x.clientCode===selected.clientCode||(selected.bookings||[]).some((b:any)=>String(b.id)===String(x.bookingId)))&&<div className="text-xs text-neutral-500 mt-3">لا توجد فواتير مسجلة حالياً.</div>}</div></div></div>}
          {clientTab==='gallery'&&<div className="grid grid-cols-2 md:grid-cols-4 gap-3">{gallery.filter(g=>(selected.bookings||[]).some((b:any)=>String(b.id)===String(g.bookingId))||g.clientId===selected.id||g.clientCode===selected.clientCode).map(g=><div key={g.id} className="bg-neutral-950 rounded-2xl overflow-hidden">{g.type==='image'&&<img src={g.url} alt={g.title||''} className="w-full aspect-square object-cover"/>}<div className="p-3 text-xs">{g.title||'Gallery file'}</div></div>)}{gallery.filter(g=>(selected.bookings||[]).some((b:any)=>String(b.id)===String(g.bookingId))||g.clientId===selected.id||g.clientCode===selected.clientCode).length===0&&<div className="text-sm text-neutral-500 col-span-full">لا توجد ملفات Gallery لهذا العميل.</div>}</div>}
          {clientTab==='usb'&&<div className="space-y-3">{usbItems.filter(u=>u.clientId===selected.id||u.clientCode===selected.clientCode||u.clientPhone===selected.phone||(selected.bookings||[]).some((b:any)=>String(b.id)===String(u.bookingId))).map(u=><div key={u.id} className="bg-neutral-950 rounded-2xl p-5 flex justify-between"><div><b className="font-mono text-amber-300">{u.id}</b><div className="text-xs text-neutral-500 mt-1">{u.label||'USB Client Master'}</div></div><span>{u.status||'pending'}</span></div>)}{usbItems.filter(u=>u.clientId===selected.id||u.clientCode===selected.clientCode||u.clientPhone===selected.phone||(selected.bookings||[]).some((b:any)=>String(b.id)===String(u.bookingId))).length===0&&<div className="text-sm text-neutral-500">لا يوجد USB مسجل.</div>}</div>}
          {clientTab==='shoot'&&<div className="space-y-3">{(selected.bookings||[]).map((b:any)=>{const w=workflows.find(x=>String(x.bookingId)===String(b.id));return <div key={b.id} className="bg-neutral-950 rounded-2xl p-5"><div className="flex justify-between"><b>#{b.id}</b><button onClick={()=>{setSelected(b);void createWorkflow(b)}} className="px-3 py-2 bg-amber-500 text-black rounded-xl text-xs font-bold">فتح Shoot Sheet</button></div><div className="text-sm mt-3">التواريخ: {dates(b).join(' • ')} • الوقت: {b.eventTime||'—'} • الفريق: {(w?.assignedTeam||[]).join('، ')||'غير محدد'}</div></div>})}</div>}
          {clientTab==='activity'&&<div className="space-y-2">{[
            ...scanLogs.filter(l=>l.clientId===selected.id||l.clientCode===selected.clientCode).map(x=>({kind:'SCAN',label:x.success?'SCAN ناجح':'SCAN فاشل',detail:x.code,time:x.createdAt})),
            ...contracts.filter(x=>x.clientId===selected.id||x.clientCode===selected.clientCode||(selected.bookings||[]).some((b:any)=>String(b.id)===String(x.bookingId))).map(x=>({kind:'CONTRACT',label:'عقد',detail:x.contractNumber||x.title,time:x.createdAt})),
            ...invoices.filter(x=>x.clientId===selected.id||x.clientCode===selected.clientCode||(selected.bookings||[]).some((b:any)=>String(b.id)===String(x.bookingId))).map(x=>({kind:'INVOICE',label:'فاتورة',detail:(x.invoiceNumber||x.title)+' • '+money(x.total??x.amount),time:x.createdAt})),
            ...payments.filter(x=>x.clientId===selected.id||x.clientCode===selected.clientCode||(selected.bookings||[]).some((b:any)=>String(b.id)===String(x.bookingId))).map(x=>({kind:'PAYMENT',label:'دفعة',detail:money(x.amount??x.paidAmount??x.amountPaid)+' • '+(x.method||x.paymentMethod||''),time:x.createdAt})),
            ...(selected.bookings||[]).map((b:any)=>({kind:'BOOKING',label:'حجز',detail:'#'+b.id+' • '+dates(b).join(' • ')+' • '+b.status,time:b.createdAt}))
          ].sort((a:any,b:any)=>{const t=(v:any)=>v?.toMillis?v.toMillis():new Date(v||0).getTime()||0;return t(b.time)-t(a.time)}).map((x:any,i:number)=><div key={x.kind+'-'+i} className="bg-neutral-950 rounded-xl p-4 text-sm flex justify-between gap-3"><span><b className="text-amber-300">{x.label}</b> • {x.detail}</span><span className="text-xs text-neutral-500">{x.time?.toDate?.()?.toLocaleString?.('ar-DZ')||'—'}</span></div>)}</div>}
        </div>
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
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <h3 className="text-xl font-black">Client Gallery</h3>
        <p className="text-xs text-neutral-400 mt-1">رفع مباشر لصور العميل من الحاسوب وربطها تلقائياً بالحجز وملف العميل.</p>
        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <input id="gallery-booking" placeholder="Booking ID" className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2"/>
          <select id="gallery-client" className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2">
            <option value="">اختر العميل (اختياري)</option>
            {clients.map((cl:any)=><option key={cl.id} value={cl.id}>{cl.groomName||cl.fullName||'Client'} — {cl.phone||cl.clientCode||cl.id}</option>)}
          </select>
          <label className="md:col-span-2 flex items-center gap-3 cursor-pointer bg-neutral-950 border border-dashed border-amber-500/40 rounded-2xl px-4 py-5">
            <Upload className="w-6 h-6 text-amber-400"/>
            <div className="flex-1"><div className="font-bold">اختيار صور من الحاسوب</div><div className="text-xs text-neutral-500 mt-1">JPG / PNG / WEBP — حتى 15 MB للصورة — عدة صور مسموحة</div></div>
            <span className="px-4 py-2 rounded-xl bg-amber-500 text-black font-black text-sm">{galleryUploading?'جاري الرفع...':'اختيار الصور'}</span>
            <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" disabled={galleryUploading} onChange={async e=>{
              const bookingId=(document.getElementById('gallery-booking') as HTMLInputElement)?.value.trim();
              const clientId=(document.getElementById('gallery-client') as HTMLSelectElement)?.value;
              const client=clients.find((x:any)=>String(x.id)===String(clientId))||bookings.find((x:any)=>String(x.id)===String(bookingId));
              if(!bookingId)return alert('أدخل Booking ID أولاً.');
              await uploadClientGalleryFiles(e.target.files||[],bookingId,client);
              e.currentTarget.value='';
            }}/>
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{gallery.map(g=><div key={g.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">{g.type==='image'&&<img src={g.url} alt="" className="w-full aspect-square object-cover" onError={e=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>}<div className="p-3 text-xs"><b>{g.title||'—'}</b><div className="text-neutral-500 mt-1">#{g.bookingId}</div></div></div>)}</div>
    </div>}
    {recordModal&&<div className="fixed inset-0 z-[160] bg-black/80 p-4 flex items-center justify-center"><div className="w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-3xl p-6"><div className="flex justify-between items-center mb-5"><h3 className="text-xl font-black">{recordModal.type==='contract'?'إنشاء عقد':recordModal.type==='invoice'?'إنشاء فاتورة':'تسجيل دفعة'}</h3><button onClick={()=>setRecordModal(null)} className="px-3 py-2 bg-neutral-800 rounded-xl">إغلاق</button></div><div className="space-y-3"><input value={recordForm.title} onChange={e=>setRecordForm((x:any)=>({...x,title:e.target.value}))} placeholder="العنوان" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3"/><input value={recordForm.number} onChange={e=>setRecordForm((x:any)=>({...x,number:e.target.value}))} placeholder="رقم المستند (اختياري)" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3"/>{recordModal.type!=='contract'&&<input type="number" value={recordForm.amount} onChange={e=>setRecordForm((x:any)=>({...x,amount:e.target.value}))} placeholder="المبلغ بالدينار" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3"/>}{recordModal.type==='payment'&&<select value={recordForm.method} onChange={e=>setRecordForm((x:any)=>({...x,method:e.target.value}))} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3"><option value="cash">نقداً</option><option value="baridimob">BaridiMob</option><option value="ccp">CCP</option><option value="bank">تحويل بنكي</option><option value="other">أخرى</option></select>}<textarea value={recordForm.notes} onChange={e=>setRecordForm((x:any)=>({...x,notes:e.target.value}))} placeholder="ملاحظات" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 min-h-24"/><button onClick={()=>void saveClientRecord()} className="w-full bg-amber-500 text-black rounded-xl py-3 font-black">حفظ وربط بالعميل</button></div></div></div>}
  </section>;
};
