import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { PortfolioItem } from '../types';
import { Sparkles, Maximize2, X, MapPin, Calendar, Heart, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

export const Portfolio: React.FC = () => {
  const { language, portfolio } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredItems = portfolio.filter(item => {
    if (!item.visible) return false;
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  useEffect(() => {
    if (!lightboxItem) return;
    const items = filteredItems;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxItem(null);
      if (event.key === 'ArrowLeft' && items.length) setLightboxIndex((i) => (i - 1 + items.length) % items.length);
      if (event.key === 'ArrowRight' && items.length) setLightboxIndex((i) => (i + 1) % items.length);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxItem, filteredItems.length]);

  const categories = [
    { id: 'all', labelAr: 'الكل', labelFr: 'Tous', labelEn: 'All' },
    { id: 'weddings', labelAr: 'الأعراس', labelFr: 'Mariages', labelEn: 'Weddings' },
    { id: 'video', labelAr: 'الفيديو', labelFr: 'Vidéos', labelEn: 'Videos' },
    { id: 'portraits', labelAr: 'البورتريه', labelFr: 'Portraits', labelEn: 'Portraits' },
    { id: 'events', labelAr: 'الفعاليات', labelFr: 'Événements', labelEn: 'Events' },
    { id: 'content', labelAr: 'المحتوى', labelFr: 'Contenu', labelEn: 'Content' },
  ];


  return (
    <section id="portfolio" className="py-24 bg-neutral-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-widest">
              {language === 'ar' ? 'معرض الأعمال السينمائي' : language === 'fr' ? 'Portfolio Cinématographique' : 'Cinematic Portfolio'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-cinzel text-white mb-6">
            {language === 'ar' ? 'أعمال ناطقة بالفخامة والإبداع' : language === 'fr' ? 'Des Œuvres Rayonnant d’Élégance' : 'Masterpieces of Elegance & Art'}
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg">
            {language === 'ar'
              ? 'تصفح مختارات من أجمل لحظات الأعراس والمشاريع الإعلامية التي وثقناها.'
              : language === 'fr'
              ? 'Parcourez une sélection des plus beaux moments de mariages et projets.'
              : 'Browse a selection of the finest wedding moments and media projects we captured.'}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => {
            const label = language === 'fr' ? cat.labelFr : language === 'en' ? cat.labelEn : cat.labelAr;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/25 scale-105'
                    : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => {
            const title = language === 'fr' ? item.titleFr : language === 'en' ? item.titleEn : item.titleAr;
            return (
              <div
                key={item.id}
                onClick={() => { setLightboxIndex(filteredItems.findIndex(x => x.id === item.id)); setLightboxItem(item); }}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-amber-500/60 shadow-xl transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10"
              >
                <img
                  src={
  Array.isArray(item.images) && item.images.length > 0
    ? item.images[0]
    : item.image
}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  {item.coupleNames && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium w-fit mb-2 backdrop-blur-md">
                      <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{item.coupleNames}</span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold font-cinzel text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-neutral-300 font-medium">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-500" /> {item.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-500" /> {item.date}</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-neutral-950/80 backdrop-blur-md border border-neutral-800 flex items-center justify-center text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxItem && currentLightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-neutral-950/95 backdrop-blur-xl animate-fade-in">
          <button
            onClick={() => setLightboxItem(null)}
            className="absolute top-6 right-6 p-3 text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-full z-10 hover:bg-amber-500 hover:text-neutral-950 transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center bg-neutral-900/80 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="lg:col-span-2 aspect-[16/10] bg-neutral-950 relative">
              <button type="button" onClick={() => setLightboxIndex((i) => (i - 1 + filteredItems.length) % filteredItems.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-neutral-950/80 border border-neutral-700 text-white hover:text-amber-400 hover:border-amber-500 transition-all"><ChevronLeft className="w-5 h-5 mx-auto" /></button>
              <img
                src={
  Array.isArray(currentLightboxItem.images) &&
  currentLightboxItem.images.length > 0
    ? currentLightboxItem.images[0]
    : currentLightboxItem.image
}
                alt=""
                className="w-full h-full object-contain transition-opacity duration-300"
              />
            <button type="button" onClick={() => setLightboxIndex((i) => (i + 1) % filteredItems.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-neutral-950/80 border border-neutral-700 text-white hover:text-amber-400 hover:border-amber-500 transition-all"><ChevronRight className="w-5 h-5 mx-auto" /></button>
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {currentLightboxItem.coupleNames && (
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-2">
                    {lightboxItem.coupleNames}
                  </span>
                )}
                <h3 className="text-2xl font-bold font-cinzel text-white mb-4">
                  {language === 'fr' ? currentLightboxItem.titleFr : language === 'en' ? currentLightboxItem.titleEn : currentLightboxItem.titleAr}
                </h3>
                <p className="text-neutral-300 text-sm leading-relaxed mb-6">
                  {language === 'fr' ? currentLightboxItem.descriptionFr : language === 'en' ? currentLightboxItem.descriptionEn : currentLightboxItem.descriptionAr}
                </p>

                <div className="space-y-3 pt-4 border-t border-neutral-800 text-xs text-neutral-400">
                  <div className="flex items-center justify-between">
                    <span>{language === 'ar' ? 'الموقع:' : 'Location:'}</span>
                    <span className="text-white font-medium">{currentLightboxItem.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{language === 'ar' ? 'التاريخ:' : 'Date:'}</span>
                    <span className="text-white font-medium">{currentLightboxItem.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{language === 'ar' ? 'التصنيف:' : 'Category:'}</span>
                    <span className="text-amber-400 font-semibold uppercase">{currentLightboxItem.category}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="#contact"
                  onClick={() => setLightboxItem(null)}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-center block shadow-lg shadow-amber-500/20"
                >
                  {language === 'ar' ? 'احجز مثل هذه الجلسة' : language === 'fr' ? 'Réserver une séance similaire' : 'Book Similar Session'}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
