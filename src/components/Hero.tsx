import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Play, Sparkles, Award, Video, Camera } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const { language, settings, stats } = useApp();

  const getTagline = () => {
    if (language === 'fr') return settings.taglineFr;
    if (language === 'en') return settings.taglineEn;
    return settings.taglineAr;
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Background Cinematic Image / Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=90"
          alt="IBRA PRODUCTION Luxury Wedding"
          className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-neutral-950/60 to-neutral-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-12">
        
        {/* Logo Badge */}
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-2xl shadow-amber-500/30 bg-neutral-900 animate-fade-in p-1">
            <img src="/logo.jpg" alt="IBRA PRODUCTION" className="w-full h-full object-cover rounded-full" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-md mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs sm:text-sm font-semibold text-amber-300 tracking-widest uppercase font-cinzel">
            Professional Wedding & Media Production
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-cinzel tracking-wider text-white mb-6 drop-shadow-2xl">
          {settings.agencyName}
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl md:text-3xl text-neutral-200 font-light max-w-3xl mx-auto mb-4 tracking-wide leading-relaxed">
          "{getTagline()}"
        </p>

        {/* Sub-tagline */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-amber-400/90 text-sm sm:text-base font-medium mb-12 tracking-widest uppercase">
          <span>{language === 'ar' ? 'تصوير' : 'Photography'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>{language === 'ar' ? 'فيديو' : 'Videography'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>{language === 'ar' ? 'إنتاج' : 'Production'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>{language === 'ar' ? 'صناعة محتوى' : 'Content Creation'}</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold text-base tracking-wider uppercase shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:from-amber-400 hover:to-amber-500 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <Calendar className="w-5 h-5" />
            <span>{language === 'ar' ? 'احجز موعدك' : language === 'fr' ? 'Réserver Votre Date' : 'Book Your Date'}</span>
          </button>

          <a
            href="#portfolio"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700/80 hover:border-amber-500/50 font-semibold text-base tracking-wider uppercase backdrop-blur-md transition-all flex items-center justify-center gap-3"
          >
            <Play className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>{language === 'ar' ? 'شاهد أعمالنا' : language === 'fr' ? 'Découvrir Nos Œuvres' : 'Explore Portfolio'}</span>
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {stats.map((stat, idx) => {
            const label = language === 'fr' ? stat.labelFr : language === 'en' ? stat.labelEn : stat.labelAr;
            return (
              <div
                key={stat.id || idx}
                className="glass-card p-6 rounded-2xl border border-amber-500/10 text-center hover:border-amber-500/30 transition-all group"
              >
                <div className="text-3xl sm:text-4xl font-bold font-cinzel text-amber-400 mb-1 group-hover:scale-105 transition-transform">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-neutral-400 font-medium tracking-wide">
                  {label}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
