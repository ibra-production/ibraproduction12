import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowDown, ArrowUpRight, CalendarCheck, ChevronLeft, ChevronRight, Play, Sparkles, Star } from 'lucide-react';

interface HeroProps { onOpenBooking: () => void; }

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const { language, settings, stats } = useApp();
  const [index, setIndex] = useState(0);
  const ar = language === 'ar';
  const fr = language === 'fr';

  const slides = [
    {
      image: 'https://i.postimg.cc/fbZqcV5R/Re-Lens-IMG-20260625133005.jpg',
      label: ar ? 'تصوير احترافي' : fr ? 'Photographie professionnelle' : 'Professional photography',
    },
    {
      image: 'https://i.postimg.cc/rybhhnQV/IMG-2114.avif',
      label: ar ? 'تغطية المناسبات' : fr ? 'Couverture événementielle' : 'Event coverage',
    },
    {
      image: 'https://i.postimg.cc/jSTBX3Sx/IMG-8875.avif',
      label: ar ? 'أجمل التفاصيل' : fr ? 'Les plus beaux détails' : 'Beautiful details',
    },
    {
      image: 'https://i.postimg.cc/2SCXvq0V/IMG-8838.avif',
      label: ar ? 'إنتاج بصري' : fr ? 'Production visuelle' : 'Visual production',
    },
    {
      image: 'https://i.postimg.cc/RFtT29P5/IMG-8836.avif',
      label: ar ? 'Ibra Production' : 'Ibra Production',
    },
  ]

  useEffect(() => {
    const timer = window.setInterval(() => setIndex(i => (i + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const next = () => setIndex(i => (i + 1) % slides.length);
  const prev = () => setIndex(i => (i - 1 + slides.length) % slides.length);

  const tagline = fr ? settings.taglineFr : language === 'en' ? settings.taglineEn : settings.taglineAr;

  return (
    <section id="home" className="ibra-hero">
      <div className="ibra-hero-media">
        {slides.map((src, i) => (
          <img key={src} src={src} alt="Ibra Production" className={`ibra-hero-slide ${i === index ? 'is-active' : ''}`} />
        ))}
        <div className="ibra-hero-shade" />
        <div className="ibra-hero-grid" />
      </div>

      <div className="ibra-hero-content">
        <div className="ibra-hero-copy">
          <div className="ibra-eyebrow"><Sparkles className="w-4 h-4" /> {ar ? 'وكالة تصوير وإنتاج متكاملة' : fr ? 'Agence photo & production' : 'Photography & production agency'}</div>
          <div className="ibra-hero-kicker">{ar ? 'IBRA PRODUCTION' : 'IBRA PRODUCTION'} <span>—</span> {ar ? 'من الماء الأبيض إلى كامل الجزائر' : fr ? 'De El Ma Labiod à toute l’Algérie' : 'From El Ma Labiod across Algeria'}</div>
          <h1>{settings.agencyName}</h1>
          <p className="ibra-hero-tagline">{tagline}</p>
          <p className="ibra-hero-description">
            {ar ? 'تصوير، فيديو، صناعة محتوى وتنظيم مناسبات — بتجربة رقمية مصممة من أول استفسار حتى تسليم العمل.' : fr ? 'Photo, vidéo, contenu et événementiel — une expérience pensée du premier contact à la livraison.' : 'Photography, video, content and events — a digital experience from first contact to final delivery.'}
          </p>

          <div className="ibra-hero-actions">
            <button onClick={onOpenBooking} className="ibra-btn ibra-btn-primary ibra-btn-large">
              <CalendarCheck className="w-5 h-5" /> {ar ? 'احجز موعدك' : fr ? 'Réserver ma date' : 'Book your date'}
            </button>
            <a href="#portfolio" className="ibra-btn ibra-btn-ghost ibra-btn-large">
              <Play className="w-5 h-5" /> {ar ? 'اكتشف أعمالنا' : fr ? 'Découvrir nos travaux' : 'Explore our work'} <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="ibra-trust-row">
            <span><Star className="w-4 h-4 fill-current" /> {ar ? 'خدمة احترافية' : fr ? 'Service premium' : 'Premium service'}</span>
            <span>{ar ? '69 ولاية' : fr ? '69 wilayas' : '69 wilayas'}</span>
            <span>{ar ? 'حجز إلكتروني' : fr ? 'Réservation en ligne' : 'Online booking'}</span>
          </div>
        </div>

        <div className="ibra-hero-side-panel">
          <div className="ibra-side-label">{ar ? 'استوديو متنقل' : fr ? 'Studio mobile' : 'Mobile studio'}</div>
          <div className="ibra-side-title">{ar ? 'نجيـوك وين تكون مناسبتك.' : fr ? 'Nous venons là où votre événement se trouve.' : 'We go where your event happens.'}</div>
          <div className="ibra-side-line" />
          <div className="ibra-side-meta"><span>01</span><span>{String(index + 1).padStart(2,'0')} / {String(slides.length).padStart(2,'0')}</span></div>
          <div className="ibra-slider-controls">
            <button onClick={prev} aria-label="Previous"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={next} aria-label="Next"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="ibra-hero-bottom">
        <div className="ibra-stat-strip">
          {stats.slice(0, 4).map((stat, i) => (
            <div key={stat.id || i}><strong>{stat.value}</strong><span>{fr ? stat.labelFr : language === 'en' ? stat.labelEn : stat.labelAr}</span></div>
          ))}
        </div>
        <a href="#about" className="ibra-scroll-cue"><span>{ar ? 'اكتشف' : fr ? 'Découvrir' : 'Discover'}</span><ArrowDown className="w-4 h-4" /></a>
      </div>
    </section>
  );
};
