import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CalendarCheck, Images, MessageCircle, MapPin, ChevronDown, ShieldCheck, Clock3, Sparkles } from 'lucide-react';

export const ClientExperience: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const { language, settings } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const ar = language === 'ar';
  const fr = language === 'fr';

  const faqs = [
    [ar ? 'كيف أرسل طلب حجز؟' : fr ? 'Comment envoyer une demande ?' : 'How do I send a booking request?', ar ? 'اضغط على احجز الآن، اختر الخدمة والتاريخ والولاية وأرفق نسخة بطاقة التعريف ثم أرسل الطلب.' : fr ? 'Cliquez sur Réserver, choisissez le service, la date, la wilaya et joignez votre pièce d’identité.' : 'Click Book Now, choose the service, date and wilaya, attach your ID copy and submit the request.'],
    [ar ? 'هل يمكن اختيار أكثر من تاريخ؟' : fr ? 'Puis-je choisir plusieurs dates ?' : 'Can I choose multiple dates?', ar ? 'نعم، يمكنك إضافة أكثر من تاريخ في نفس طلب الحجز.' : fr ? 'Oui, plusieurs dates peuvent être ajoutées à la même demande.' : 'Yes, multiple dates can be added to the same booking request.'],
    [ar ? 'هل تعملون خارج تبسة؟' : fr ? 'Travaillez-vous hors de Tébessa ?' : 'Do you work outside Tébessa?', ar ? 'نعم، Ibra Production تستقبل طلبات من جميع الولايات الـ69.' : fr ? 'Oui, Ibra Production accepte les demandes dans les 69 wilayas.' : 'Yes, Ibra Production accepts requests across all 69 wilayas.'],
    [ar ? 'كيف أتواصل بسرعة؟' : fr ? 'Comment vous contacter rapidement ?' : 'How can I contact you quickly?', ar ? 'يمكنك استعمال واتساب أو الاتصال مباشرة عبر الأرقام الموجودة في الموقع.' : fr ? 'Vous pouvez utiliser WhatsApp ou appeler directement les numéros affichés sur le site.' : 'Use WhatsApp or call the numbers displayed on the website.']
  ];

  return <section id="client-experience" className="py-20 bg-neutral-950 border-y border-neutral-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold tracking-widest"><Sparkles className="w-4 h-4" />{ar ? 'تجربة العميل' : fr ? 'EXPÉRIENCE CLIENT' : 'CLIENT EXPERIENCE'}</div>
        <h2 className="mt-5 text-3xl sm:text-5xl font-bold font-cinzel text-white">{ar ? 'كل ما تحتاجه قبل الحجز في مكان واحد' : fr ? 'Tout ce qu’il vous faut avant votre réservation' : 'Everything you need before booking'}</h2>
        <p className="mt-4 text-neutral-400">{ar ? 'حجز أسرع، معلومات أوضح، وتواصل مباشر مع Ibra Production.' : fr ? 'Réservation simple, informations claires et contact direct.' : 'Simple booking, clear information and direct contact.'}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-16">
        <button onClick={onOpenBooking} className="group p-5 sm:p-7 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 text-right transition-all"><CalendarCheck className="w-7 h-7 text-amber-400 mb-4" /><h3 className="font-bold text-white">{ar ? 'احجز الآن' : fr ? 'Réserver' : 'Book now'}</h3><p className="text-xs text-neutral-500 mt-2">{ar ? 'أرسل طلبك مباشرة' : fr ? 'Envoyez votre demande' : 'Send your request'}</p></button>
        <a href="#portfolio" className="p-5 sm:p-7 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 transition-all"><Images className="w-7 h-7 text-amber-400 mb-4" /><h3 className="font-bold text-white">{ar ? 'معرض الأعمال' : fr ? 'Portfolio' : 'Portfolio'}</h3><p className="text-xs text-neutral-500 mt-2">{ar ? 'شاهد أعمالنا' : fr ? 'Voir nos réalisations' : 'View our work'}</p></a>
        <a href={settings.whatsapp ? 'https://wa.me/' + settings.whatsapp.replace(/\D/g, '') : '#contact'} target="_blank" rel="noreferrer" className="p-5 sm:p-7 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 transition-all"><MessageCircle className="w-7 h-7 text-amber-400 mb-4" /><h3 className="font-bold text-white">WhatsApp</h3><p className="text-xs text-neutral-500 mt-2">{ar ? 'تواصل مباشرة' : fr ? 'Contact direct' : 'Direct contact'}</p></a>
        <a href={settings.googleMapsUrl || '#contact'} target="_blank" rel="noreferrer" className="p-5 sm:p-7 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 transition-all"><MapPin className="w-7 h-7 text-amber-400 mb-4" /><h3 className="font-bold text-white">{ar ? 'موقعنا' : fr ? 'Notre adresse' : 'Our location'}</h3><p className="text-xs text-neutral-500 mt-2">{settings.addressAr || 'الماء الأبيض، ولاية تبسة، الجزائر'}</p></a>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2"><h3 className="text-2xl font-bold text-white mb-5">{ar ? 'الأسئلة الشائعة' : fr ? 'Questions fréquentes' : 'Frequently asked questions'}</h3><div className="space-y-3">{faqs.map(([q,a],i)=><div key={i} className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden"><button onClick={()=>setOpenFaq(openFaq===i?null:i)} className="w-full flex items-center justify-between gap-4 p-5 text-right"><span className="font-semibold text-white">{q}</span><ChevronDown className={'w-5 h-5 text-amber-400 transition-transform '+(openFaq===i?'rotate-180':'')} /></button>{openFaq===i&&<div className="px-5 pb-5 text-sm leading-7 text-neutral-400">{a}</div>}</div>)}</div></div>
        <div className="rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-amber-500/20 p-7"><ShieldCheck className="w-9 h-9 text-amber-400 mb-5" /><h3 className="text-xl font-bold text-white">{ar ? 'خدمة منظمة واحترافية' : fr ? 'Service organisé et professionnel' : 'Professional service'}</h3><div className="mt-6 space-y-4 text-sm text-neutral-400"><div className="flex gap-3"><ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" /><span>{ar ? 'بيانات الحجز مرتبطة بالنظام مباشرة.' : fr ? 'Les demandes sont enregistrées dans le système.' : 'Booking requests are connected to the system.'}</span></div><div className="flex gap-3"><Clock3 className="w-5 h-5 text-amber-400 shrink-0" /><span>{ar ? 'فحص توفر التاريخ قبل إرسال الحجز.' : fr ? 'Vérification de disponibilité avant la demande.' : 'Availability check before submitting.'}</span></div><div className="flex gap-3"><CalendarCheck className="w-5 h-5 text-amber-400 shrink-0" /><span>{ar ? 'إمكانية إضافة عدة تواريخ للمناسبة.' : fr ? 'Plusieurs dates possibles.' : 'Multiple event dates supported.'}</span></div></div><button onClick={onOpenBooking} className="mt-8 w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold">{ar ? 'ابدأ الحجز' : fr ? 'Commencer' : 'Start booking'}</button></div>
      </div>
    </div>
  </section>;
};
