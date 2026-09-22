export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

const CODE39: Record<string,string> = {
"0":"101001101101","1":"110100101011","2":"101100101011","3":"110110010101","4":"101001101011","5":"110100110101","6":"101100110101","7":"101001011011","8":"110100101101","9":"101100101101",
"A":"110101001011","B":"101101001011","C":"110110100101","D":"101011001011","E":"110101100101","F":"101101100101","G":"101010011011","H":"110101001101","I":"101101001101","J":"101011001101",
"K":"110101010011","L":"101101010011","M":"110110101001","N":"101011010011","O":"110101101001","P":"101101101001","Q":"101010110011","R":"110101011001","S":"101101011001","T":"101011011001",
"U":"110010101011","V":"100110101011","W":"110011010101","X":"100101101011","Y":"110010110101","Z":"100110110101","-":"100101011011",".":"110010101101"," ":"100110101101","$":"100100100101","/":"100100101001","+":"100101001001","%":"101001001001","*":"100101101101"
};

export function code39Svg(rawValue:string,height=70):string {
  const value=String(rawValue||'').toUpperCase().replace(/[^0-9A-Z. $/+%-]/g,'');
  let x=10,bars='';
  for(const ch of ('*'+value+'*')) {
    for(const bit of (CODE39[ch]||CODE39['0'])) {
      if(bit==='1') bars += `<rect x="${x}" y="4" width="2" height="${height}" fill="#111"/>`;
      x+=2;
    }
    x+=2;
  }
  const width=x+10;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height+25}" viewBox="0 0 ${width} ${height+25}"><rect width="100%" height="100%" fill="#fff"/>${bars}<text x="${width/2}" y="${height+20}" text-anchor="middle" font-family="Arial" font-size="11" fill="#111">${escapeHtml(value)}</text></svg>`;
}

export function printBookingFile(booking:any,portal:any,portalCode:string):void {
  const dates=Array.isArray(booking?.eventDates)&&booking.eventDates.length?booking.eventDates:(booking?.eventDate?[booking.eventDate]:[]);
  const timeline=Array.isArray(portal?.timeline)?portal.timeline:[];
  const checklist=Array.isArray(portal?.checklist)?portal.checklist:[];
  const payments=Array.isArray(portal?.payments)?portal.payments:[];
  const questions=Array.isArray(portal?.questionnaire)?portal.questionnaire:[];
  const paid=payments.reduce((s:number,p:any)=>s+Number(p.paidAmount||0),0);
  const scheduled=payments.reduce((s:number,p:any)=>s+Number(p.amount||0),0);
  const row=(label:string,value:any)=>`<div class="row"><span>${escapeHtml(label)}</span><b>${escapeHtml(value||'—')}</b></div>`;
  const html=`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>ملف العميل - ${escapeHtml(booking?.groomName)}</title><style>
  @page{size:A4;margin:12mm}*{box-sizing:border-box}body{font-family:Arial,Tahoma,sans-serif;color:#111;line-height:1.6}.head{border-bottom:3px solid #111;padding-bottom:12px}.brand{font-size:25px;font-weight:900}.muted{color:#666;font-size:11px}h2{font-size:16px;border-bottom:1px solid #ddd;padding-bottom:5px;margin:18px 0 8px}.card{border:1px solid #ddd;border-radius:9px;padding:10px;margin:8px 0}.row{display:flex;justify-content:space-between;border-bottom:1px solid #eee;padding:5px}.row:last-child{border:0}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:6px;font-size:11px;text-align:right}.barcode{text-align:center;border:1px solid #ddd;padding:8px;margin-top:15px}.barcode svg{max-width:100%;height:auto}.footer{text-align:center;color:#777;font-size:9px;margin-top:18px;border-top:1px solid #ddd;padding-top:8px}</style></head><body>
  <div class="head"><div class="brand">IBRA PRODUCTION</div><div class="muted">الملف الشامل للعميل • الحجز #${escapeHtml(booking?.id)}</div></div>
  <div class="card">${row('العريس',booking?.groomName)}${row('العروس',booking?.brideName)}${row('الهاتف',booking?.phone)}${row('البريد الإلكتروني',booking?.email)}${row('نوع المناسبة',booking?.eventType)}${row('الولاية',booking?.wilaya)}${row('المكان',booking?.venue)}${row('الوقت',booking?.eventTime)}${row('الحالة',booking?.status)}${row('الخدمة',booking?.serviceId)}${row('الباقة',booking?.packageId)}</div>
  <h2>تواريخ المناسبة</h2><div class="card">${dates.map((d:string)=>`• ${escapeHtml(d)}<br>`).join('')||'—'}</div>
  <h2>Timeline</h2><table><tr><th>المهمة</th><th>الحالة</th><th>التاريخ</th></tr>${timeline.map((x:any)=>`<tr><td>${escapeHtml(x.title)}</td><td>${x.status==='done'?'مكتملة':'قيد التنفيذ'}</td><td>${escapeHtml(x.date)}</td></tr>`).join('')||'<tr><td colspan="3">لا توجد مراحل</td></tr>'}</table>
  <h2>Checklist</h2><table><tr><th>المهمة</th><th>الحالة</th></tr>${checklist.map((x:any)=>`<tr><td>${escapeHtml(x.title)}</td><td>${x.completed?'مكتملة':'غير مكتملة'}</td></tr>`).join('')||'<tr><td colspan="2">لا توجد مهام</td></tr>'}</table>
  <h2>الدفعات</h2><table><tr><th>الدفعة</th><th>المبلغ</th><th>المدفوع</th><th>الاستحقاق</th><th>الحالة</th></tr>${payments.map((p:any)=>`<tr><td>${escapeHtml(p.title)}</td><td>${Number(p.amount||0).toLocaleString()} DA</td><td>${Number(p.paidAmount||0).toLocaleString()} DA</td><td>${escapeHtml(p.dueDate)}</td><td>${p.status==='paid'?'مدفوعة':'مستحقة'}</td></tr>`).join('')||'<tr><td colspan="5">لا توجد دفعات</td></tr>'}</table>
  <div class="card">${row('إجمالي الدفعات',scheduled.toLocaleString()+' DA')}${row('إجمالي المدفوع',paid.toLocaleString()+' DA')}${row('المتبقي',Math.max(scheduled-paid,0).toLocaleString()+' DA')}</div>
  ${questions.length?`<h2>استبيان العميل</h2><div class="card">${questions.map((q:any)=>`<p><b>${escapeHtml(q.question)}</b><br>${escapeHtml(q.answer||'لم تتم الإجابة')}</p>`).join('')}</div>`:''}
  ${portal?.contract?`<h2>العقد</h2><div class="card"><b>${escapeHtml(portal.contract.title)}</b><p style="white-space:pre-wrap">${escapeHtml(portal.contract.body)}</p><b>التوقيع: ${escapeHtml(portal.contract.signatureName||'لم يتم التوقيع')}</b></div>`:''}
  <div class="barcode"><b>كود ملف العميل</b>${code39Svg(portalCode)}<div class="muted">الكود: ${escapeHtml(portalCode)}</div></div><div class="footer">Ibra Production • ibraprod.online • ملف خاص بالعميل</div>
  </body></html>`;
  const win=window.open('','_blank','noopener,noreferrer');
  if(!win){alert('يرجى السماح بفتح نافذة جديدة لإصدار PDF.');return;}
  win.document.write(html);win.document.close();setTimeout(()=>{win.focus();win.print();},500);
}
