import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, CheckCircle2, AlertCircle, Sparkles, MapPin, Search } from 'lucide-react';

const WILAYAS: [string, string, string][] = [
  ['01','أدرار','Adrar'],['02','الشلف','Chlef'],['03','الأغواط','Laghouat'],['04','أم البواقي','Oum El Bouaghi'],
  ['05','باتنة','Batna'],['06','بجاية','Béjaïa'],['07','بسكرة','Biskra'],['08','بشار','Béchar'],
  ['09','البليدة','Blida'],['10','البويرة','Bouira'],['11','تمنراست','Tamanrasset'],['12','تبسة','Tébessa'],
  ['13','تلمسان','Tlemcen'],['14','تيارت','Tiaret'],['15','تيزي وزو','Tizi Ouzou'],['16','الجزائر العاصمة','Alger'],
  ['17','الجلفة','Djelfa'],['18','جيجل','Jijel'],['19','سطيف','Sétif'],['20','سعيدة','Saïda'],
  ['21','سكيكدة','Skikda'],['22','سيدي بلعباس','Sidi Bel Abbès'],['23','عنابة','Annaba'],['24','قالمة','Guelma'],
  ['25','قسنطينة','Constantine'],['26','المدية','Médéa'],['27','مستغانم','Mostaganem'],['28','المسيلة','M’Sila'],
  ['29','معسكر','Mascara'],['30','ورقلة','Ouargla'],['31','وهران','Oran'],['32','البيض','El Bayadh'],
  ['33','إليزي','Illizi'],['34','برج بوعريريج','Bordj Bou Arréridj'],['35','بومرداس','Boumerdès'],['36','الطارف','El Tarf'],
  ['37','تندوف','Tindouf'],['38','تيسمسيلت','Tissemsilt'],['39','الوادي','El Oued'],['40','خنشلة','Khenchela'],
  ['41','سوق أهراس','Souk Ahras'],['42','تيبازة','Tipaza'],['43','ميلة','Mila'],['44','عين الدفلى','Aïn Defla'],
  ['45','النعامة','Naâma'],['46','عين تموشنت','Aïn Témouchent'],['47','غرداية','Ghardaïa'],['48','غليزان','Relizane'],
  ['49','تيميمون','Timimoun'],['50','برج باجي مختار','Bordj Badji Mokhtar'],['51','أولاد جلال','Ouled Djellal'],
  ['52','بني عباس','Béni Abbès'],['53','إن صالح','In Salah'],['54','إن قزام','In Guezzam'],['55','تقرت','Touggourt'],
  ['56','جانت','Djanet'],['57','المغير','El Meghaier'],['58','المنيعة','El Meniaa'],['59','آفلو','Aflou'],
  ['60','بريكة','Barika'],['61','القنطرة','El Kantara'],['62','بئر العاتر','Bir El Ater'],['63','العريشة','El Aricha'],
  ['64','قصر الشلالة','Ksar Chellala'],['65','عين وسارة','Aïn Oussara'],['66','مسعد','Messaad'],
  ['67','قصر البخاري','Ksar El Boukhari'],['68','بوسعادة','Bou Saâda'],['69','الأبيض سيدي الشيخ','El Bayadh Sidi Cheikh']
];

interface AvailabilityCheckerProps {
  onOpenBooking: () => void;
}

export const AvailabilityChecker: React.FC<AvailabilityCheckerProps> = ({ onOpenBooking }) => {
  const { language, bookings } = useApp();
  const [checkDate, setCheckDate] = useState('');
  const [wilaya, setWilaya] = useState('16');
  const [resultStatus, setResultStatus] = useState<'idle' | 'available' | 'booked'>('idle');

  const selectedWilaya = WILAYAS.find(([code]) => code === wilaya);
  const wilayaName = selectedWilaya ? (language === 'ar' ? selectedWilaya[1] : selectedWilaya[2]) : wilaya;

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkDate) return;

    const normalizedWilaya = String(wilaya || "").trim();

    const isDateBooked = (booking: any): boolean => {
      if (!booking || booking.status === "cancelled") {
        return false;
      }

      const bookingDates =
        Array.isArray(booking.eventDates) &&
        booking.eventDates.length > 0
          ? booking.eventDates
          : booking.eventDate
            ? [booking.eventDate]
            : [];

      return bookingDates.some(
        (date: any) =>
          String(date || "").trim() === checkDate
      );
    };

    const booked = (
      Array.isArray(bookings)
        ? bookings
        : []
    ).some(isDateBooked);

    setResultStatus(
      booked ? "booked" : "available"
    );
  };

  return (
    <section className="py-16 bg-neutral-900/60 border-y border-neutral-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,158,11,0.05),transparent_50%)]" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'فحص توفر المواعيد الفوري' : 'Vérification de Disponibilité'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mb-3">
            {language === 'ar' ? 'هل تاريخ زفافك متاح؟ تحقق الآن' : 'Vérifiez la Disponibilité de Votre Date'}
          </h2>

          <p className="text-xs sm:text-sm text-neutral-400">
            {language === 'ar'
              ? 'اختر تاريخ مناسبتك والولاية لمعرفة ما إذا كان فريق إبرا برودكشن متاحاً لتغطية زفافك.'
              : 'Sélectionnez votre date et wilaya pour vérifier la disponibilité de notre équipe.'}
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-neutral-800 max-w-3xl mx-auto">
          <form onSubmit={handleCheck} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                {language === 'ar' ? 'تاريخ المناسبة' : "Date de l'événement"}
              </label>

              <div className="relative">
                <Calendar className="absolute top-3.5 right-3.5 w-4 h-4 text-neutral-500" />
                <input
                  type="date"
                  required
                  value={checkDate}
                  onChange={e => {
                    setCheckDate(e.target.value);
                    setResultStatus('idle');
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none pr-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                {language === 'ar' ? 'الولاية / المدينة' : 'Wilaya'}
              </label>

              <div className="relative">
                <MapPin className="absolute top-3.5 right-3.5 w-4 h-4 text-neutral-500" />

                <select
                  value={wilaya}
                  onChange={e => {
                    setWilaya(e.target.value);
                    setResultStatus('idle');
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none pr-10"
                >
                  {WILAYAS.map(([code, ar, fr]) => (
                    <option key={code} value={code}>
                      {language === 'ar' ? `${ar} (${code})` : `${fr} (${code})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>{language === 'ar' ? 'تحقق من التوفر' : 'Vérifier'}</span>
              </button>
            </div>
          </form>

          {resultStatus === 'available' && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-bold text-emerald-300 text-sm">
                    {language === 'ar' ? 'التاريخ متاح! فريقنا جاهز لتوثيق زفافك' : 'Date Disponible !'}
                  </h4>
                  <p className="text-xs text-neutral-300">
                    {language === 'ar'
                      ? `الموعد بتاريخ ${checkDate} في ${wilayaName} متاح حالياً. احجز الآن لتثبيته.`
                      : `Le ${checkDate} à ${wilayaName} est disponible.`}
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenBooking}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl shrink-0"
              >
                {language === 'ar' ? 'احجز الموعد فوراً' : 'Réserver'}
              </button>
            </div>
          )}

          {resultStatus === 'booked' && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-bold text-amber-300 text-sm">
                    {language === 'ar' ? 'ضغط كبير في هذا التاريخ (متبقي وقت محدود)' : 'Forte Demande'}
                  </h4>
                  <p className="text-xs text-neutral-300">
                    {language === 'ar'
                      ? `لدينا حجوزات سابقة في ${wilayaName} بهذا اليوم، يرجى التواصل هاتفياً للتحقق.`
                      : 'Contactez-nous directement.'}
                  </p>
                </div>
              </div>

              <a
                href="tel:0696967093"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shrink-0"
              >
                {language === 'ar' ? 'اتصال مباشر' : 'Appeler'}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
