import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Tag, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';

interface OffersProps {
  onOpenBooking: () => void;
}

export const OffersSection: React.FC<OffersProps> = ({ onOpenBooking }) => {
  const { language, offers } = useApp();

  const activeOffers = offers.filter(o => o.active);

  if (activeOffers.length === 0) return null;

  return (
    <section className="py-16 bg-neutral-950 relative overflow-hidden border-y border-amber-500/20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {activeOffers.map(offer => {
          const title = language === 'fr' ? offer.titleFr : language === 'en' ? offer.titleEn : offer.titleAr;
          const desc = language === 'fr' ? offer.descFr : language === 'en' ? offer.descEn : offer.descAr;

          return (
            <div
              key={offer.id}
              className="glass-card rounded-3xl overflow-hidden border border-amber-500/30 p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-6">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span>{offer.discountPercentage}</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-bold font-cinzel text-white mb-4">
                  {title}
                </h3>

                <p className="text-neutral-300 text-base sm:text-lg mb-8 leading-relaxed font-light">
                  {desc}
                </p>

                <div className="flex flex-wrap items-center gap-6 mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-cinzel text-amber-400">{offer.newPrice}</span>
                    <span className="text-neutral-400 line-through text-sm">{offer.oldPrice}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <CalendarIcon className="w-4 h-4 text-amber-500" />
                    <span>{language === 'ar' ? 'ساري حتى:' : 'Valid until:'} {offer.endDate}</span>
                  </div>
                </div>

                <button
                  onClick={onOpenBooking}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold text-base tracking-wider uppercase shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:from-amber-400 hover:to-amber-500 transition-all flex items-center gap-3"
                >
                  <span>{language === 'ar' ? 'استفد من العرض الآن' : language === 'fr' ? 'Profiter de l’Offre' : 'Claim Offer'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl">
                <img
                  src={offer.image}
                  alt={title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
