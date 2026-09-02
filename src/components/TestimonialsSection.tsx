import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { language, testimonials } = useApp();

  const approvedTestimonials = testimonials.filter(t => t.approved);

  return (
    <section id="testimonials" className="py-24 bg-neutral-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-widest">
              {language === 'ar' ? 'آراء العملاء' : language === 'fr' ? 'Avis Clients' : 'Client Reviews'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-cinzel text-white mb-6">
            {language === 'ar' ? 'ماذا يقول عرائسنا عن تجربتهم معنا' : language === 'fr' ? 'Ce Que Disent Nos Mariés' : 'What Our Couples Say'}
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg">
            {language === 'ar'
              ? 'قصص نجاح وشهادات نفتخر بها من عملائنا الأعزاء.'
              : language === 'fr'
              ? 'Histoires de succès et témoignages de nos chers clients.'
              : 'Success stories and testimonials from our valued clients.'}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {approvedTestimonials.map((t) => {
            const comment = language === 'fr' ? t.commentFr : language === 'en' ? t.commentEn : t.commentAr;
            return (
              <div
                key={t.id}
                className="glass-card rounded-3xl p-8 border border-neutral-800 hover:border-amber-500/40 transition-all duration-500 flex flex-col justify-between relative shadow-xl group"
              >
                <div className="absolute top-6 right-6 text-amber-500/20 group-hover:text-amber-500/40 transition-colors">
                  <Quote className="w-10 h-10" />
                </div>

                <div>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-neutral-300 text-base leading-relaxed mb-8 font-light italic">
                    "{comment}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-neutral-800">
                  {t.image ? (
                    <img
                      src={t.image}
                      alt={t.clientName}
                      className="w-12 h-12 rounded-full object-cover border border-amber-500/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold flex items-center justify-center font-cinzel">
                      {t.clientName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-white font-cinzel text-base">
                      {t.clientName}
                    </h4>
                    <span className="text-xs text-neutral-400">{t.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
