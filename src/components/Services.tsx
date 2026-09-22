import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceItem } from '../types';
import { Sparkles, ArrowRight, ArrowLeft, Clock, Check, X } from 'lucide-react';

interface ServicesProps {
  onSelectService: (service: ServiceItem) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const { language, services } = useApp();
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);

  const activeServices = services.filter(s => s.visible);

  return (
    <section id="services" className="py-24 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-widest">
              {language === 'ar' ? 'خدماتنا الاحترافية' : language === 'fr' ? 'Nos Services' : 'Our Services'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-cinzel text-white mb-6">
            {language === 'ar' ? 'خدمات الإنتاج والتصوير الراقي' : language === 'fr' ? 'Services de Production d’Excellence' : 'Excellence in Production & Capture'}
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg">
            {language === 'ar' 
              ? 'نقدم باقة متكاملة من خدمات التصوير والإنتاج الإعلامي بمعايير عالمية.'
              : language === 'fr'
              ? 'Nous offrons une gamme complète de services de photographie et de production média.'
              : 'We offer a complete suite of world-class photography and media production services.'}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServices.map((service) => {
            const title = language === 'fr' ? service.titleFr : language === 'en' ? service.titleEn : service.titleAr;
            const desc = language === 'fr' ? service.descFr : language === 'en' ? service.descEn : service.descAr;

            return (
              <div
                key={service.id}
                className="glass-card rounded-3xl overflow-hidden border border-neutral-800 hover:border-amber-500/50 transition-all duration-500 flex flex-col group shadow-xl hover:-translate-y-2 hover:shadow-amber-500/10"
              >
                {/* Image & Price Tag */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full border border-amber-400/30 bg-black/35 backdrop-blur-md flex items-center justify-center text-amber-400 text-xs font-cinzel font-bold">{String(activeServices.findIndex(s => s.id === service.id) + 1).padStart(2, "0")}</div>
                  <img
                    src={service.image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                  <div className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/30 text-amber-400 font-bold text-xs">
                    {service.price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{service.duration}</span>
                    </div>

                    <h3 className="text-xl font-bold font-cinzel text-white mb-3 group-hover:text-amber-400 transition-colors">
                      {title}
                    </h3>

                    <p className="text-neutral-400 text-sm mb-6 leading-relaxed line-clamp-3">
                      {desc}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedServiceModal(service)}
                    className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-neutral-900 group-hover:bg-amber-500 text-neutral-200 group-hover:text-neutral-950 font-semibold text-sm transition-all duration-300 border border-neutral-800 group-hover:border-amber-500"
                  >
                    <span>{language === 'ar' ? 'اكتشف الخدمة' : language === 'fr' ? 'Découvrir' : 'Discover Service'}</span>
                    {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Service Detail Modal */}
      {selectedServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-neutral-900 border border-amber-500/30 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedServiceModal(null)}
              className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6 border border-neutral-800">
              <img
                src={selectedServiceModal.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mb-3">
              {language === 'fr' ? selectedServiceModal.titleFr : language === 'en' ? selectedServiceModal.titleEn : selectedServiceModal.titleAr}
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold">
                {selectedServiceModal.price}
              </span>
              <span className="flex items-center gap-1.5 text-neutral-400 text-xs">
                <Clock className="w-4 h-4 text-amber-400" />
                {selectedServiceModal.duration}
              </span>
            </div>

            <p className="text-neutral-300 text-base mb-6 leading-relaxed">
              {language === 'fr' ? selectedServiceModal.descFr : language === 'en' ? selectedServiceModal.descEn : selectedServiceModal.descAr}
            </p>

            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-3">
              {language === 'ar' ? 'مميزات هذه الخدمة:' : language === 'fr' ? 'Caractéristiques :' : 'Service Features:'}
            </h4>

            <ul className="space-y-2 mb-8">
              {(Array.isArray(selectedServiceModal.features) ? selectedServiceModal.features : []).map((feat, idx) => (
                <li key={idx} className="flex items-center gap-3 text-neutral-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  const s = selectedServiceModal;
                  setSelectedServiceModal(null);
                  onSelectService(s);
                }}
                className="flex-1 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-center transition-all shadow-lg shadow-amber-500/20"
              >
                {language === 'ar' ? 'احجز هذه الخدمة الآن' : language === 'fr' ? 'Réserver ce service' : 'Book This Service'}
              </button>
              <button
                onClick={() => setSelectedServiceModal(null)}
                className="px-6 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium"
              >
                {language === 'ar' ? 'إغلاق' : language === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
