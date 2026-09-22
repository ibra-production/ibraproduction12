import React from 'react';
import { useApp } from '../context/AppContext';
import { PackageItem } from '../types';
import { Sparkles, Check, Star, Calendar, ArrowUpRight, Crown } from 'lucide-react';

interface PackagesProps {
  onSelectPackage: (pkg: PackageItem) => void;
}

export const PackagesSection: React.FC<PackagesProps> = ({
  onSelectPackage,
}) => {
  const { language, packages, settings } = useApp();

  /*
   * حماية كاملة من أي بيانات ناقصة أو قديمة في Firestore.
   * مهما كانت حالة الباقة، يجب أن يرجع هذا دائماً Array.
   */
  const getFeatures = (pkg: any): string[] => {
    const languageFeatures =
      language === 'fr'
        ? pkg?.featuresFr
        : language === 'en'
        ? pkg?.featuresEn
        : pkg?.featuresAr;

    // الشكل الصحيح الجديد
    if (Array.isArray(languageFeatures)) {
      return languageFeatures.filter(
        (feature) =>
          typeof feature === 'string' && feature.trim().length > 0
      );
    }

    // دعم البيانات القديمة إذا كانت features موجودة
    if (Array.isArray(pkg?.features)) {
      return pkg.features.filter(
        (feature: unknown): feature is string =>
          typeof feature === 'string' && feature.trim().length > 0
      );
    }

    // إذا كانت features القديمة محفوظة كنص String
    if (
      typeof pkg?.features === 'string' &&
      pkg.features.trim().length > 0
    ) {
      return pkg.features
        .split('\n')
        .map((feature: string) => feature.trim())
        .filter(Boolean);
    }

    return [];
  };

  /*
   * حماية إضافية:
   * حتى لو وصلت packages بشكل غير متوقع من Firestore،
   * لا نسمح للموقع بالسقوط.
   */
  const activePackages: PackageItem[] = Array.isArray(packages)
    ? packages.filter(
        (pkg): pkg is PackageItem =>
          !!pkg &&
          typeof pkg === 'object' &&
          pkg.visible !== false
      )
    : [];

  return (
    <section
      id="packages"
      className="py-24 bg-neutral-900/50 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />

            <span className="text-xs font-semibold text-amber-300 uppercase tracking-widest">
              {language === 'ar'
                ? 'الباقات والأسعار'
                : language === 'fr'
                ? 'Packs & Tarifs'
                : 'Packages & Pricing'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-cinzel text-white mb-6">
            {language === 'ar'
              ? 'باقات مصممة خصيصاً لتناسب تميزكم'
              : language === 'fr'
              ? 'Des Forfaits Sur Mesure pour Votre Grand Jour'
              : 'Tailored Packages for Your Special Day'}
          </h2>

          <p className="text-neutral-400 text-base sm:text-lg">
            {language === 'ar'
              ? 'اختر الباقة التي تلبي تطلعاتكم، مع إمكانية التخصيص الكامل.'
              : language === 'fr'
              ? 'Choisissez le forfait qui répond à vos attentes, entièrement personnalisable.'
              : 'Choose the package that fits your vision, fully customizable.'}
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {activePackages.map((pkg) => {
            const name =
              language === 'fr'
                ? pkg?.nameFr || pkg?.nameAr || ''
                : language === 'en'
                ? pkg?.nameEn || pkg?.nameAr || ''
                : pkg?.nameAr || '';

            const duration =
              language === 'fr'
                ? pkg?.durationFr || ''
                : language === 'en'
                ? pkg?.durationEn || ''
                : pkg?.durationAr || '';

            // أهم حماية ضد Black Screen
            const features = getFeatures(pkg);

            const price = Number(pkg?.price || 0);
            const oldPrice =
              pkg?.oldPrice !== undefined &&
              pkg?.oldPrice !== null &&
              Number(pkg?.oldPrice) > 0
                ? Number(pkg.oldPrice)
                : null;

            const isPopular = pkg?.isPopular === true;

            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden group glass-panel transition-all duration-700 hover:-translate-y-3 hover:shadow-2xl ${
                  isPopular
                    ? 'bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-neutral-950 border-2 border-amber-500 shadow-2xl shadow-amber-500/10 transform lg:-translate-y-4'
                    : 'glass-card border border-neutral-800 hover:border-amber-500/40'
                }`}
              >

                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-neutral-950" />

                    <span>
                      {language === 'ar'
                        ? 'الأكثر طلباً'
                        : language === 'fr'
                        ? 'Le Plus Populaire'
                        : 'Most Popular'}
                    </span>
                  </div>
                )}

                <div>

                  {/* Package Name */}
                  <h3 className="text-xl font-bold font-cinzel text-white mb-2 text-center group-hover:text-amber-300 transition-colors duration-300">
                    {name || '-'}
                  </h3>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl sm:text-4xl font-bold font-cinzel text-amber-400">
                        {price.toLocaleString()}
                      </span>

                      <span className="text-xs text-neutral-400 font-medium">
                        {settings?.currency || 'DA'}
                      </span>
                    </div>

                    {oldPrice !== null &&
                      oldPrice > 0 &&
                      oldPrice !== price && (
                        <div className="text-xs text-neutral-500 line-through mt-1">
                          {oldPrice.toLocaleString()}{' '}
                          {settings?.currency || 'DA'}
                        </div>
                      )}

                    {duration && (
                      <span className="inline-block mt-2 text-xs font-medium text-neutral-300 bg-neutral-800/80 px-3 py-1 rounded-full">
                        {duration}
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 border-t border-neutral-800 pt-6">

                    {features.length > 0 ? (
                      (Array.isArray(features) ? features : []).map((feat, idx) => (
                        <li
                          key={`${pkg.id}-feature-${idx}`}
                          className="flex items-start gap-3 text-sm text-neutral-300 transition-transform duration-300 group-hover:translate-x-1"
                        >
                          <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3" />
                          </div>

                          <span>{feat}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-neutral-500 text-center">
                        {language === 'ar'
                          ? 'تفاصيل الباقة متوفرة عند الطلب'
                          : language === 'fr'
                          ? 'Détails disponibles sur demande'
                          : 'Details available on request'}
                      </li>
                    )}

                  </ul>
                </div>

                {/* Select Package */}
                <button
                  onClick={() => onSelectPackage(pkg)}
                  className={`group/cta w-full py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                    isPopular
                      ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-lg shadow-amber-500/25'
                      : 'bg-neutral-800 hover:bg-amber-500 text-white hover:text-neutral-950 border border-neutral-700'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1" />

                  <span>
                    {language === 'ar'
                      ? 'اطلب هذه الباقة'
                      : language === 'fr'
                      ? 'Commander'
                      : 'Select Package'}
                  </span>
                </button>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};