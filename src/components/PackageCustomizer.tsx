import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, Plus, Sparkles, Calculator, ShieldCheck } from 'lucide-react';

interface PackageCustomizerProps {
  onOpenBooking: () => void;
}

export const PackageCustomizer: React.FC<PackageCustomizerProps> = ({ onOpenBooking }) => {
  const { language } = useApp();
  const [baseTier, setBaseTier] = useState<'classic' | 'royal' | 'vip'>('royal');
  const [addMavicDrone, setAddMavicDrone] = useState(true);
  const [addSameDayTeaser, setAddSameDayTeaser] = useState(true);
  const [addLuxuryAlbum, setAddLuxuryAlbum] = useState(true);
  const [addExtraCinematographer, setAddExtraCinematographer] = useState(false);

  // Calculate price in DZD
  const basePrices = {
    classic: 45000,
    royal: 85000,
    vip: 150000
  };

  let total = basePrices[baseTier];
  if (addMavicDrone) total += 15000;
  if (addSameDayTeaser) total += 20000;
  if (addLuxuryAlbum) total += 12000;
  if (addExtraCinematographer) total += 25000;

  return (
    <section id="customizer" className="py-20 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'حاسبة الباقات التفاعلية' : 'Calculateur de Forfait'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-cinzel text-white mb-4">
            {language === 'ar' ? 'صمم باقة زفافك الأحلام بنفسك' : 'Personnalisez Votre Forfait'}
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            {language === 'ar'
              ? 'اختر الباقة الأساسية وأضف اللمسات السينمائية التي تتناسب مع رغبتك وميزانيتك.'
              : 'Choisissez votre base et ajoutez les options de votre choix.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left / Center options */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Base Tier Selection */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-neutral-800">
              <h3 className="text-lg font-bold font-cinzel text-white mb-4">
                {language === 'ar' ? '1. اختر الباقة الأساسية' : '1. Choisissez la Base'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'classic', nameAr: 'باقة الأسر', nameFr: 'Classique', price: '45,000 دج' },
                  { id: 'royal', nameAr: 'الباقة الملكية', nameFr: 'Royal', price: '85,000 دج' },
                  { id: 'vip', nameAr: 'باقة VIP الفاخرة', nameFr: 'VIP Prestige', price: '150,000 دج' }
                ].map(tier => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setBaseTier(tier.id as any)}
                    className={`p-5 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                      baseTier === tier.id
                        ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/20 text-white'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold font-cinzel text-base">{language === 'ar' ? tier.nameAr : tier.nameFr}</span>
                        {baseTier === tier.id && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                    </div>
                    <div className="text-amber-400 font-mono font-bold text-sm mt-4">{tier.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cinematic Extras */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-neutral-800">
              <h3 className="text-lg font-bold font-cinzel text-white mb-4">
                {language === 'ar' ? '2. أضف الخيارات والخدمات السينمائية' : '2. Options Supplémentaires'}
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'drone', label: language === 'ar' ? 'تصوير جوي سينمائي (Drone 4K)' : 'Drone 4K', price: '+15,000 دج', checked: addMavicDrone, set: setAddMavicDrone },
                  { id: 'teaser', label: language === 'ar' ? 'فيديو تيزر قصير لنفس اليوم (Same-Day Teaser)' : 'Teaser Same-Day', price: '+20,000 دج', checked: addSameDayTeaser, set: setAddSameDayTeaser },
                  { id: 'album', label: language === 'ar' ? 'ألبوم ملكي فاخر مطبوع بالجلد الطبيعي' : 'Album Royal Cuir', price: '+12,000 دج', checked: addLuxuryAlbum, set: setAddLuxuryAlbum },
                  { id: 'cameraman', label: language === 'ar' ? 'مصور سينمائي إضافي (تغطية زاوية ثانية)' : '2ème Cameraman', price: '+25,000 دج', checked: addExtraCinematographer, set: setAddExtraCinematographer },
                ].map(opt => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      opt.checked ? 'bg-neutral-900 border-amber-500/50 text-white' : 'bg-neutral-950 border-neutral-900 text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={opt.checked}
                        onChange={e => opt.set(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 rounded"
                      />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </div>
                    <span className="text-amber-400 font-mono text-xs font-bold">{opt.price}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Summary Column */}
          <div className="glass-card p-8 rounded-3xl border border-amber-500/40 bg-gradient-to-b from-neutral-900 to-neutral-950 sticky top-28 space-y-6 shadow-2xl">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-400 font-cinzel">IBRA PRODUCTION</span>
              <h3 className="text-2xl font-bold font-cinzel text-white mt-1">
                {language === 'ar' ? 'ملخص العرض والتقدير' : 'Résumé du Devis'}
              </h3>
            </div>

            <div className="space-y-3 py-4 border-y border-neutral-800 text-sm">
              <div className="flex justify-between text-neutral-300">
                <span>{language === 'ar' ? 'الباقة الأساسية:' : 'Base:'}</span>
                <span className="font-mono font-bold text-white">
                  {baseTier === 'classic' ? '45,000 دج' : baseTier === 'royal' ? '85,000 دج' : '150,000 دج'}
                </span>
              </div>
              {addMavicDrone && <div className="flex justify-between text-neutral-400 text-xs"><span>+ تصوير جوي 4K</span><span className="font-mono">15,000 دج</span></div>}
              {addSameDayTeaser && <div className="flex justify-between text-neutral-400 text-xs"><span>+ تيزر نفس اليوم</span><span className="font-mono">20,000 دج</span></div>}
              {addLuxuryAlbum && <div className="flex justify-between text-neutral-400 text-xs"><span>+ ألبوم ملكي فاخر</span><span className="font-mono">12,000 دج</span></div>}
              {addExtraCinematographer && <div className="flex justify-between text-neutral-400 text-xs"><span>+ مصور إضافي</span><span className="font-mono">25,000 دج</span></div>}
            </div>

            <div>
              <span className="text-xs text-neutral-400 block mb-1">
                {language === 'ar' ? 'السعر التقديري الإجمالي' : 'Estimation Totale'}
              </span>
              <div className="text-3xl font-extrabold font-cinzel text-amber-400 font-mono">
                {total.toLocaleString()} دج
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">
                {language === 'ar' ? '* الأسعار قابلة للتعديل حسب متطلبات التصوير الخاصة.' : '* Tarifs indicatifs.'}
              </p>
            </div>

            <button
              onClick={onOpenBooking}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-2xl text-sm transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'ar' ? 'اعتماد الباقة وحجز الموعد' : 'Réserver Ce Forfait'}</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
