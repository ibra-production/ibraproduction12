import React from 'react';
import { Activity, BarChart3, Bell, CalendarDays, CheckSquare, CreditCard, FileArchive, FileText, Gauge, GitBranch, Globe2, LayoutDashboard, MessageCircle, Package, QrCode, Search, Settings2, ShieldCheck, Smartphone, Users, Video, Image as ImageIcon, ClipboardList, Clock3, MapPin, Phone, Database, Download, Send, Star, Tag, Upload, Wallet, Zap } from 'lucide-react';

type Props={onNavigate:(tab:string)=>void; bookings:any[]; notifications:number};

const features=[
['01','مركز الحجوزات الذكي','بحث سريع، فلاتر، حالات وتعديل شامل','bookings',Search],
['02','كشف تعارض المواعيد','مراجعة الحجوزات المتداخلة','calendar',CalendarDays],
['03','تقويم متعدد التواريخ','عرض كل تواريخ العرس في تقويم واحد','calendar',CalendarDays],
['04','متابعة حالة الحجز','New / Confirmed / Processing / Completed','bookings',Activity],
['05','تعديل شامل للحجز','تعديل بيانات العميل والمناسبة والدفعات','bookings',Settings2],
['06','بوابة العميل','رابط خاص لمتابعة الطلب','workflow',Globe2],
['07','Timeline مباشر','مراحل العمل للعميل والفريق','workflow',GitBranch],
['08','Checklist','قائمة مهام قابلة للمتابعة','workflow',CheckSquare],
['09','جدول الدفعات','المدفوع والمستحق والمتبقي','workflow',CreditCard],
['10','استبيان العميل','جمع تفاصيل المناسبة','workflow',ClipboardList],
['11','العقد والتوقيع','حفظ العقد والتوقيع داخل الملف','workflow',FileText],
['12','Barcode للملف','كود فريد لكل عميل','workflow',QrCode],
['13','PDF شامل للعريس','ملف A4 للطباعة والأرشفة','workflow',FileArchive],
['14','إشعارات الحجز الجديد','تنبيه أجهزة الإدارة','notifications',Bell],
['15','Automation Engine','تذكيرات الحالة والموعد والدفعات','notifications',Zap],
['16','WhatsApp مركز الإرسال','رسائل تأكيد وتذكير ودفع','notifications',MessageCircle],
['17','Push Notifications','تسجيل أجهزة الإدارة','notifications',Smartphone],
['18','سجل الأتمتة','حالات queued/sent/failed','notifications',Activity],
['19','لوحة التحليلات','إحصائيات الحجوزات والأداء','analytics',BarChart3],
['20','إدارة الفريق','أعضاء، أدوار وملفات','team',Users],
['21','بطاقات التعريف','معالجة ملفات الهوية بشكل خاص','idcards',ShieldCheck],
['22','سجل العمليات','تتبع تعديلات الإدارة','logs',Activity],
['23','Backup / Restore','نسخة احتياطية واستعادة البيانات','settings',Database],
['24','إدارة الخدمات','الخدمات والأسعار والظهور','services',Settings2],
['25','إدارة الباقات','الباقات والخصومات والمزايا','packages',Package],
['26','معرض الأعمال','صور ومشاريع وتصنيفات','portfolio',ImageIcon],
['27','إدارة الفيديوهات','فيديوهات الموقع','videos',Video],
['28','آراء العملاء','إدارة واعتماد التقييمات','testimonials',Star],
['29','العروض الخاصة','حملات وأسعار وعروض محددة المدة','offers',Tag],
['30','رسائل الموقع','صندوق رسائل العملاء','messages',Send],
['31','دعم العربية/الفرنسية/الإنجليزية','محتوى متعدد اللغات','settings',Globe2],
['32','SEO للموقع','عنوان ووصف وكلمات وStructured Data','settings',Globe2],
['33','وضع الصيانة','إيقاف الموقع عند الحاجة','settings',Settings2],
['34','ترتيب المحتوى','Order للتحكم في العرض','settings',Activity],
['35','إظهار/إخفاء المحتوى','Visible لكل خدمة وباقة وعمل','settings',EyeIcon],
['36','واجهة Responsive','لوحة وموقع للهاتف والحاسوب','dash',Smartphone],
['37','نموذج الحجز العام','استقبال طلبات من الموقع','bookings',ClipboardList],
['38','رفع بطاقة الهوية الإجباري','حفظ الملف عبر R2','bookings',Upload],
['39','تواريخ متعددة للعرس','دعم أكثر من يوم','bookings',CalendarDays],
['40','وقت المناسبة','الحفاظ على وقت الحجز','bookings',Clock3],
['41','موقع المناسبة','ولاية ومكان مع فتح الخريطة','bookings',MapPin],
['42','اتصال مباشر بالعميل','زر اتصال من الإدارة/البوابة','bookings',Phone],
['43','حساب الرصيد','إجمالي ومدفوع ومتَبقي','workflow',Wallet],
['44','تذكيرات المواعيد','7/3/1/0 أيام','notifications',Bell],
['45','تذكيرات الدفعات','3/1/0/-1 أيام','notifications',CreditCard],
['46','معالجة idempotent','منع تكرار الأتمتة','notifications',ShieldCheck],
['47','مفكرة الإدارة','ملاحظات يومية محفوظة','dash',ClipboardList],
['48','ملف عميل قابل للطباعة','نسخة ورقية كاملة','workflow',FileText],
['49','كود ملف قابل للنسخ','نسخ كود العميل بسرعة','workflow',QrCode],
['50','مركز التحكم الاحترافي','مدخل واحد لكل أدوات النظام','pro',Gauge]
];

function EyeIcon(p:any){return <ShieldCheck {...p}/>}

export const ProFeaturesCenter:React.FC<Props>=({onNavigate,bookings,notifications})=>{
 const active=new Set(['bookings','calendar','workflow','notifications','analytics','team','idcards','logs','settings','services','packages','portfolio','videos','testimonials','offers','messages','dash']);
 return <div className="space-y-6">
  <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
   <div className="flex flex-wrap items-center justify-between gap-4">
    <div><div className="text-amber-400 text-xs font-black tracking-widest">IBRA PRODUCTION PRO</div><h2 className="text-2xl font-black text-white mt-1">مركز الـ 50 ميزة</h2><p className="text-sm text-neutral-500 mt-2">مركز موحد للوصول إلى منظومة الحجز والإدارة والمتابعة.</p></div>
    <div className="grid grid-cols-2 gap-2 text-center"><div className="bg-neutral-950 rounded-xl px-4 py-3"><b className="text-white">{features.length}</b><div className="text-[10px] text-neutral-500">ميزة</div></div><div className="bg-neutral-950 rounded-xl px-4 py-3"><b className="text-amber-400">{notifications}</b><div className="text-[10px] text-neutral-500">إشعار</div></div></div>
   </div>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
   {features.map(([n,title,desc,tab,Icon]:any)=><button key={n} onClick={()=>tab!=='pro'&&onNavigate(tab)} className="text-right bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all group">
    <div className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-neutral-950 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-black"><Icon className="w-5 h-5"/></div><div className="flex-1"><div className="flex items-center justify-between gap-2"><span className="text-[10px] text-neutral-600">#{n}</span><span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">مفعلة</span></div><h3 className="font-bold text-white mt-2">{title}</h3><p className="text-xs text-neutral-500 mt-1 leading-5">{desc}</p></div></div>
   </button>)}
  </div>
  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-xs text-neutral-500">بعض الميزات هي مراكز تجمع وظائف موجودة بالفعل في النظام، والضغط عليها يفتح الوحدة المرتبطة مباشرة.</div>
 </div>;
};
