import React from 'react';
import {
  CalendarCheck,
  Clock3,
  MapPinned,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Images,
  FileCheck2,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AgencyExperienceProps {
  onOpenBooking: () => void;
}

export const AgencyExperience: React.FC<AgencyExperienceProps> = ({ onOpenBooking }) => {
  const { language } = useApp();
  const ar = language === 'ar';
  const fr = language === 'fr';

  const features = [
    {
      icon: CalendarCheck,
      title: ar ? 'حجز ذكي ومتعدد التواريخ' : fr ? 'Réservation intelligente' : 'Smart multi-date booking',
      text: ar ? 'اختار تواريخ مناسبتك، الولاية والخدمة وتابع الحجز في خطوات واضحة.' : fr ? 'Choisissez vos dates, wilaya et service avec un parcours simple.' : 'Choose dates, wilaya and service through a clear booking flow.'
    },
    {
      icon: Clock3,
      title: ar ? 'فحص التوفر مباشرة' : fr ? 'Disponibilité en direct' : 'Live availability',
      text: ar ? 'تأكد من توفر الفريق قبل إرسال طلب الحجز.' : fr ? 'Vérifiez la disponibilité avant de confirmer votre demande.' : 'Check availability before sending your booking request.'
    },
    {
      icon: MapPinned,
      title: ar ? 'تغطية 69 ولاية' : fr ? 'Couverture 69 wilayas' : '69 wilayas coverage',
      text: ar ? 'خدمات التصوير والإنتاج وتنظيم المناسبات عبر كامل التراب الوطني.' : fr ? 'Photo, production et événementiel partout en Algérie.' : 'Photography, production and events across Algeria.'
    },
    {
      icon: Images,
      title: ar ? 'معرض أعمال تفاعلي' : fr ? 'Portfolio interactif' : 'Interactive portfolio',
      text: ar ? 'استعرض الصور والفيديوهات بتجربة سينمائية سريعة وسلسة.' : fr ? 'Découvrez photos et vidéos dans une expérience immersive.' : 'Explore photos and videos in an immersive experience.'
    },
    {
      icon: FileCheck2,
      title: ar ? 'ملف حجز منظم' : fr ? 'Dossier client structuré' : 'Structured client file',
      text: ar ? 'بيانات المناسبة، التواريخ، الخدمة والوثائق في مسار واحد منظم.' : fr ? 'Dates, service, informations et documents dans un seul parcours.' : 'Dates, service, details and documents in one organized flow.'
    },
    {
      icon: MessageCircle,
      title: ar ? 'تواصل سريع' : fr ? 'Contact rapide' : 'Fast contact',
      text: ar ? 'واتساب واتصال مباشر للوصول إلى الفريق بسرعة.' : fr ? 'WhatsApp et appel direct pour joindre rapidement l’équipe.' : 'WhatsApp and direct call access for quick communication.'
    }
  ];

  const steps = [
    ar ? 'اختيار الخدمة' : fr ? 'Choisir le service' : 'Choose service',
    ar ? 'فحص التوفر' : fr ? 'Vérifier la disponibilité' : 'Check availability',
    ar ? 'إرسال الحجز' : fr ? 'Envoyer la réservation' : 'Send booking',
    ar ? 'تأكيد الموعد' : fr ? 'Confirmer la date' : 'Confirm date'
  ];

  return (
    <section id="experience" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(196,122,82,.14),transparent_30%),radial-gradient(circle_at_85%_70%,rgba(164,74,99,.12),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[.8fr_1.2fr] gap-10 lg:gap-16 items-end mb-14">
          <div>
            <span className="ibra-eyebrow"><Sparkles className="w-4 h-4" /> {ar ? 'تجربة Ibra Production' : fr ? 'Expérience Ibra Production' : 'Ibra Production Experience'}</span>
            <h2 className="ibra-display mt-5">
              {ar ? 'موقع يخدم العريس قبل يوم المناسبة.' : fr ? 'Un site pensé pour le client, avant le grand jour.' : 'A website designed around the client journey.'}
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
            <button onClick={onOpenBooking} className="ibra-btn ibra-btn-primary">
              <CalendarCheck className="w-5 h-5" />
              {ar ? 'ابدأ الحجز' : fr ? 'Commencer' : 'Start booking'}
            </button>
            <a href="#portfolio" className="ibra-btn ibra-btn-secondary">
              {ar ? 'شاهد الأعمال' : fr ? 'Voir le portfolio' : 'View portfolio'}
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className="ibra-feature-card">
              <div className="ibra-feature-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="ibra-feature-icon"><Icon className="w-6 h-6" /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 ibra-process">
          <div className="flex items-center gap-3 mb-7">
            <ShieldCheck className="w-5 h-5" />
            <span>{ar ? 'طريقة الحجز' : fr ? 'Parcours de réservation' : 'Booking journey'}</span>
          </div>
          <div className="grid sm:grid-cols-4 gap-3">
            {steps.map((step, index) => (
              <div key={step} className="ibra-process-step">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
