import React from 'react';
import { useApp } from '../context/AppContext';
import { Camera, Video, Clapperboard, Sparkles, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  const { language, settings } = useApp();

  const titleAr = "وكالة الإنتاج الفني الأولى لذكرياتكم الخالدة";
  const titleFr = "L'agence de production leader pour vos souvenirs éternels";
  const titleEn = "The Leading Production Agency for Your Timeless Memories";

  const descAr = `تأسست ${settings.agencyName} لتكون الوجهة الأولى للباحثين عن الفخامة والتميز في توثيق الأعراس والمناسبات الكبرى. نجمع بين أحدث التقنيات السينمائية والرؤية الفنية الإبداعية لنرسم قصتكم بأسمى المعاني البصرية.`;
  const descFr = `${settings.agencyName} a été fondé pour être la première destination de ceux qui recherchent le luxe et l'excellence dans la documentation des mariages et des grands événements.`;
  const descEn = `${settings.agencyName} was established to be the premier destination for those seeking luxury and excellence in documenting weddings and major events.`;

  const highlights = language === 'fr' ? [
    "Photographie de mariage haut de gamme",
    "Vidéographie cinématographique 4K",
    "Production média et contenu digital",
    "Équipe d'experts passionnés"
  ] : language === 'en' ? [
    "High-end wedding photography",
    "4K cinematic videography",
    "Media production & digital content",
    "Passionate expert team"
  ] : [
    "تصوير أعراس فاخر واحترافي",
    "فيديو سينمائي بدقة 4K",
    "إنتاج إعلامي ومحتوى رقمي",
    "طاقم محترف بشغف سينمائي"
  ];

  return (
    <section id="about" className="py-24 bg-neutral-900/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Images collage */}
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-amber-500/20 aspect-[4/3]">
              <img
                src="/src/assets/about/file_00000000d7348210af4bc67f18918c76.png"
                alt="IBRA PRODUCTION Team at Work"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-2/3 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/30 hidden sm:block z-20">
              <img
                src="/src/assets/about/file_00000000d7348210af4bc67f18918c76.png"
                alt="Wedding Cinematic Moment"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -z-10" />
          </div>

          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-widest">
                {language === 'ar' ? 'من نحن' : language === 'fr' ? 'À propos de nous' : 'About Us'}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-cinzel text-white mb-6 leading-tight">
              {language === 'fr' ? titleFr : language === 'en' ? titleEn : titleAr}
            </h2>

            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed mb-8 font-light">
              {language === 'fr' ? descFr : language === 'en' ? descEn : descAr}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-neutral-200 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Specialties Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass-panel p-4 rounded-xl text-center border border-neutral-800 hover:border-amber-500/30 transition-all">
                <Camera className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-neutral-300">Wedding Photo</span>
              </div>
              <div className="glass-panel p-4 rounded-xl text-center border border-neutral-800 hover:border-amber-500/30 transition-all">
                <Video className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-neutral-300">Wedding Video</span>
              </div>
              <div className="glass-panel p-4 rounded-xl text-center border border-neutral-800 hover:border-amber-500/30 transition-all">
                <Clapperboard className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-neutral-300">Media Production</span>
              </div>
              <div className="glass-panel p-4 rounded-xl text-center border border-neutral-800 hover:border-amber-500/30 transition-all">
                <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-neutral-300">Content Creation</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
