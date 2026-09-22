import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PackageItem, ServiceItem } from '../types';
import {
  X,
  Calendar,
  CheckCircle2,
  Phone,
  Mail,
  User,
  MapPin,
  Upload,
  FileText,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Eye,
  Loader2,
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: ServiceItem | null;
  preselectedPackage?: PackageItem | null;
}

const WILAYAS = [
  ['01', 'أدرار', 'Adrar'],
  ['02', 'الشلف', 'Chlef'],
  ['03', 'الأغواط', 'Laghouat'],
  ['04', 'أم البواقي', 'Oum El Bouaghi'],
  ['05', 'باتنة', 'Batna'],
  ['06', 'بجاية', 'Béjaïa'],
  ['07', 'بسكرة', 'Biskra'],
  ['08', 'بشار', 'Béchar'],
  ['09', 'البليدة', 'Blida'],
  ['10', 'البويرة', 'Bouira'],
  ['11', 'تمنراست', 'Tamanrasset'],
  ['12', 'تبسة', 'Tébessa'],
  ['13', 'تلمسان', 'Tlemcen'],
  ['14', 'تيارت', 'Tiaret'],
  ['15', 'تيزي وزو', 'Tizi Ouzou'],
  ['16', 'الجزائر العاصمة', 'Alger'],
  ['17', 'الجلفة', 'Djelfa'],
  ['18', 'جيجل', 'Jijel'],
  ['19', 'سطيف', 'Sétif'],
  ['20', 'سعيدة', 'Saïda'],
  ['21', 'سكيكدة', 'Skikda'],
  ['22', 'سيدي بلعباس', 'Sidi Bel Abbès'],
  ['23', 'عنابة', 'Annaba'],
  ['24', 'قالمة', 'Guelma'],
  ['25', 'قسنطينة', 'Constantine'],
  ['26', 'المدية', 'Médéa'],
  ['27', 'مستغانم', 'Mostaganem'],
  ['28', 'المسيلة', 'M’Sila'],
  ['29', 'معسكر', 'Mascara'],
  ['30', 'ورقلة', 'Ouargla'],
  ['31', 'وهران', 'Oran'],
  ['32', 'البيض', 'El Bayadh'],
  ['33', 'إليزي', 'Illizi'],
  ['34', 'برج بوعريريج', 'Bordj Bou Arréridj'],
  ['35', 'بومرداس', 'Boumerdès'],
  ['36', 'الطارف', 'El Tarf'],
  ['37', 'تندوف', 'Tindouf'],
  ['38', 'تيسمسيلت', 'Tissemsilt'],
  ['39', 'الوادي', 'El Oued'],
  ['40', 'خنشلة', 'Khenchela'],
  ['41', 'سوق أهراس', 'Souk Ahras'],
  ['42', 'تيبازة', 'Tipaza'],
  ['43', 'ميلة', 'Mila'],
  ['44', 'عين الدفلى', 'Aïn Defla'],
  ['45', 'النعامة', 'Naâma'],
  ['46', 'عين تموشنت', 'Aïn Témouchent'],
  ['47', 'غرداية', 'Ghardaïa'],
  ['48', 'غليزان', 'Relizane'],
  ['49', 'تيميمون', 'Timimoun'],
  ['50', 'برج باجي مختار', 'Bordj Badji Mokhtar'],
  ['51', 'أولاد جلال', 'Ouled Djellal'],
  ['52', 'بني عباس', 'Béni Abbès'],
  ['53', 'إن صالح', 'In Salah'],
  ['54', 'إن قزام', 'In Guezzam'],
  ['55', 'تقرت', 'Touggourt'],
  ['56', 'جانت', 'Djanet'],
  ['57', 'المغير', 'El Meghaier'],
  ['58', 'المنيعة', 'El Meniaa'],
  ['59', 'آفلو', 'Aflou'],
  ['60', 'بريكة', 'Barika'],
  ['61', 'القنطرة', 'El Kantara'],
  ['62', 'بئر العاتر', 'Bir El Ater'],
  ['63', 'العريشة', 'El Aricha'],
  ['64', 'قصر الشلالة', 'Ksar Chellala'],
  ['65', 'عين وسارة', 'Aïn Oussara'],
  ['66', 'مسعد', 'Messaad'],
  ['67', 'قصر البخاري', 'Ksar El Boukhari'],
  ['68', 'بوسعادة', 'Bou Saâda'],
  ['69', 'الأبيض سيدي الشيخ', 'El Bayadh Sidi Cheikh'],
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
  preselectedPackage,
}) => {
  const {
    language,
    services,
    packages,
    addBooking,
    bookings,
  } = useApp();

  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [eventType, setEventType] = useState(
    preselectedPackage ? 'حفل زفاف (باقة)' : 'تصوير أعراس'
  );

  const [eventDates, setEventDates] = useState<string[]>(['']);
  const [eventTime, setEventTime] = useState('16:00');
  const [wilaya, setWilaya] = useState('');
  const [venue, setVenue] = useState('');

  const [serviceId, setServiceId] = useState(
    preselectedService?.id || services[0]?.id || ''
  );

  const [packageId, setPackageId] = useState(
    preselectedPackage?.id || ''
  );

  const [notes, setNotes] = useState('');

  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [idCardUrl, setIdCardUrl] = useState('');
  const [idCardName, setIdCardName] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const updateEventDate = (index: number, value: string) => {
    setEventDates((current) =>
      current.map((date, i) => (i === index ? value : date))
    );
  };

  const addEventDate = () => {
    setEventDates((current) => [...current, '']);
  };

  const removeEventDate = (index: number) => {
    setEventDates((current) => {
      if (current.length === 1) {
        return [''];
      }

      return current.filter((_, i) => i !== index);
    });
  };

  const isDateBlocked = (date: string) => {
    if (!date) return false;

    return bookings.some((booking) => {
      if (booking.status === 'cancelled') {
        return false;
      }

      const dates =
        booking.eventDates && booking.eventDates.length > 0
          ? booking.eventDates
          : booking.eventDate
          ? [booking.eventDate]
          : [];

      return dates.includes(date);
    });
  };

  const handleIdCardChange = (file: File | null) => {
    if (!file) {
      setIdCardFile(null);
      setIdCardUrl('');
      setIdCardName('');
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        language === 'ar'
          ? 'يرجى اختيار صورة JPG أو PNG أو ملف PDF.'
          : language === 'fr'
          ? 'Veuillez sélectionner une image JPG, PNG ou un fichier PDF.'
          : 'Please select a JPG, PNG image or PDF file.'
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        language === 'ar'
          ? 'حجم الملف يجب ألا يتجاوز 5 ميغابايت.'
          : language === 'fr'
          ? 'La taille du fichier ne doit pas dépasser 5 Mo.'
          : 'File size must not exceed 5 MB.'
      );
      return;
    }

    setIdCardFile(file);
    setIdCardName(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === 'string') {
        setIdCardUrl(result);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleResetAndClose = () => {
    setGroomName('');
    setBrideName('');
    setPhone('');
    setEmail('');

    setEventType(
      preselectedPackage ? 'حفل زفاف (باقة)' : 'تصوير أعراس'
    );

    setEventDates(['']);
    setEventTime('16:00');
    setWilaya('');
    setVenue('');

    setServiceId(
      preselectedService?.id || services[0]?.id || ''
    );

    setPackageId(preselectedPackage?.id || '');
    setNotes('');

    setIdCardFile(null);
    setIdCardUrl('');
    setIdCardName('');

    setSubmitted(false);
    setStep(1);
    setIsSubmitting(false);

    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) { setStep((current) => current + 1); return; }

    const cleanDates = Array.from(
      new Set(eventDates.filter(Boolean))
    ).sort();

    if (!groomName || !phone || !wilaya || cleanDates.length === 0) {
      alert(
        language === 'ar'
          ? 'يرجى ملء الحقول الإجبارية: اسم العريس، رقم الهاتف، الولاية وتاريخ المناسبة.'
          : language === 'fr'
          ? 'Veuillez remplir les champs obligatoires : nom, téléphone, wilaya et date.'
          : 'Please fill in the required fields: groom name, phone, wilaya and event date.'
      );

      return;
    }

    if (!idCardFile || !idCardUrl) {
      alert(
        language === 'ar'
          ? 'نسخة بطاقة التعريف الوطنية إجبارية لإرسال طلب الحجز.'
          : language === 'fr'
          ? "La copie de la carte d'identité nationale est obligatoire."
          : 'A copy of the national ID card is required.'
      );

      return;
    }

    if (cleanDates.length !== eventDates.filter(Boolean).length) {
      alert(
        language === 'ar'
          ? 'لا يمكن تكرار نفس تاريخ المناسبة.'
          : language === 'fr'
          ? 'La même date ne peut pas être sélectionnée plusieurs fois.'
          : 'The same event date cannot be selected more than once.'
      );

      return;
    }

    const blockedDates = cleanDates.filter(isDateBlocked);

    if (blockedDates.length > 0) {
      alert(
        language === 'ar'
          ? `التواريخ التالية محجوزة مسبقاً: ${blockedDates.join('، ')}`
          : language === 'fr'
          ? `Les dates suivantes sont déjà réservées : ${blockedDates.join(', ')}`
          : `The following dates are already booked: ${blockedDates.join(', ')}`
      );

      return;
    }

    try {
      setIsSubmitting(true);
      await addBooking({
        groomName,
        brideName,
        phone,
        email,
        eventType,

        // Keep first date for compatibility with existing system
        eventDate: cleanDates[0],

        // New multi-date field
        eventDates: cleanDates,

        eventTime,
        wilaya,
        venue,
        serviceId,
        packageId: packageId || undefined,
        notes,

        // Required ID card
        idCardUrl,
        idCardName,
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Booking error:', error);

      alert(
        language === 'ar'
          ? 'حدث خطأ أثناء حفظ الحجز.'
          : language === 'fr'
          ? "Une erreur est survenue lors de l'enregistrement de la réservation."
          : 'An error occurred while saving the booking.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanDatesPreview = (dates: string[]) => dates.filter(Boolean).join(' • ') || '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-neutral-900 border border-amber-500/30 rounded-3xl max-w-2xl w-full p-6 sm:p-10 relative shadow-2xl overflow-y-auto max-h-[95vh]">

        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-400 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mb-4">
              {language === 'ar'
                ? 'تم إرسال طلب حجزك بنجاح!'
                : language === 'fr'
                ? 'Demande de Réservation Envoyée!'
                : 'Booking Request Sent Successfully!'}
            </h3>

            <p className="text-neutral-300 text-base max-w-md mx-auto mb-8 leading-relaxed">
              {language === 'ar'
                ? 'شكراً لثقتكم في IBRA PRODUCTION. سنتواصل معكم عبر الهاتف أو واتساب في أقرب وقت لتأكيد موعدكم.'
                : language === 'fr'
                ? 'Merci de votre confiance. Nous vous contacterons très bientôt pour confirmer votre rendez-vous.'
                : 'Thank you for choosing IBRA PRODUCTION. We will contact you soon to confirm your appointment.'}
            </p>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition-all shadow-lg shadow-amber-500/20"
            >
              {language === 'ar'
                ? 'العودة للموقع'
                : language === 'fr'
                ? 'Retour au site'
                : 'Return to Website'}
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest block mb-2 font-cinzel">
                IBRA PRODUCTION
              </span>

              <h3 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
                {language === 'ar'
                  ? 'احجز موعدك الآن'
                  : language === 'fr'
                  ? 'Réserver Votre Date'
                  : 'Book Your Appointment'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-3 gap-2 mb-7">
                {[
                  { n: 1, ar: 'المعلومات', fr: 'Infos', en: 'Info' },
                  { n: 2, ar: 'المناسبة', fr: 'Événement', en: 'Event' },
                  { n: 3, ar: 'التأكيد', fr: 'Confirmation', en: 'Confirm' },
                ].map((item) => (
                  <div key={item.n} className="text-center">
                    <div className={`h-1 rounded-full mb-2 transition-all duration-300 ${step >= item.n ? 'bg-amber-500' : 'bg-neutral-800'}`} />
                    <span className={`text-[10px] sm:text-xs font-semibold ${step === item.n ? 'text-amber-400' : 'text-neutral-500'}`}>
                      {language === 'ar' ? item.ar : language === 'fr' ? item.fr : item.en}
                    </span>
                  </div>
                ))}
              </div>

              {step === 1 && <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {language === 'ar'
                      ? 'اسم العريس *'
                      : language === 'fr'
                      ? 'Nom du marié *'
                      : 'Groom Name *'}
                  </label>

                  <div className="relative">
                    <User className="absolute top-3.5 right-3.5 w-4 h-4 text-neutral-500" />

                    <input
                      type="text"
                      required
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      placeholder="أمين بلحاج"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none pr-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {language === 'ar'
                      ? 'اسم العروس'
                      : language === 'fr'
                      ? 'Nom de la mariée'
                      : 'Bride Name'}
                  </label>

                  <div className="relative">
                    <User className="absolute top-3.5 right-3.5 w-4 h-4 text-neutral-500" />

                    <input
                      type="text"
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      placeholder="سارة بن عمارة"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none pr-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {language === 'ar'
                      ? 'رقم الهاتف (الواتساب) *'
                      : language === 'fr'
                      ? 'Numéro de téléphone *'
                      : 'Phone Number *'}
                  </label>

                  <div className="relative">
                    <Phone className="absolute top-3.5 right-3.5 w-4 h-4 text-neutral-500" />

                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0779000833"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none pr-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {language === 'ar'
                      ? 'البريد الإلكتروني'
                      : language === 'fr'
                      ? 'Adresse e-mail'
                      : 'Email Address'}
                  </label>

                  <div className="relative">
                    <Mail className="absolute top-3.5 right-3.5 w-4 h-4 text-neutral-500" />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact@ibraprod.online"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none pr-10"
                    />
                  </div>
                </div>
              </div>

              </div>}

              {step === 2 && <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  {language === 'ar'
                    ? 'نوع المناسبة'
                    : language === 'fr'
                    ? "Type d'événement"
                    : 'Event Type'}
                </label>

                <input
                  type="text"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  placeholder="حفل زفاف"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  {language === 'ar'
                    ? 'تواريخ المناسبة *'
                    : language === 'fr'
                    ? "Dates de l'événement *"
                    : 'Event Dates *'}
                </label>

                <div className="space-y-3">
                  {eventDates.map((date, index) => (
                    <div
                      key={index}
                      className="flex gap-2"
                    >
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) =>
                          updateEventDate(index, e.target.value)
                        }
                        className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                      />

                      {eventDates.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEventDate(index)}
                          className="px-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          title="Remove date"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addEventDate}
                  className="mt-3 inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  {language === 'ar'
                    ? 'إضافة تاريخ آخر'
                    : language === 'fr'
                    ? 'Ajouter une autre date'
                    : 'Add another date'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {language === 'ar'
                      ? 'الولاية *'
                      : language === 'fr'
                      ? 'Wilaya *'
                      : 'Wilaya *'}
                  </label>

                  <select
                    required
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                  >
                    <option value="">
                      {language === 'ar'
                        ? '-- اختر الولاية --'
                        : language === 'fr'
                        ? '-- Choisir la wilaya --'
                        : '-- Select wilaya --'}
                    </option>

                    {WILAYAS.map(([code, ar, fr]) => (
                      <option
                        key={code}
                        value={`${code} - ${ar}`}
                      >
                        {code} - {language === 'ar' ? ar : fr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {language === 'ar'
                      ? 'الوقت'
                      : language === 'fr'
                      ? 'Heure'
                      : 'Time'}
                  </label>

                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {language === 'ar'
                      ? 'مكان المناسبة / القاعة'
                      : language === 'fr'
                      ? 'Lieu / Salle'
                      : 'Venue / Location'}
                  </label>

                  <div className="relative">
                    <MapPin className="absolute top-3.5 right-3.5 w-4 h-4 text-neutral-500" />

                    <input
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="قاعة الحفلات، الجزائر"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none pr-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {language === 'ar'
                      ? 'الخدمة المطلوبة'
                      : language === 'fr'
                      ? 'Service demandé'
                      : 'Requested Service'}
                  </label>

                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.titleAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  {language === 'ar'
                    ? 'الباقة المفضلة (اختياري)'
                    : language === 'fr'
                    ? 'Forfait préféré (optionnel)'
                    : 'Package (Optional)'}
                </label>

                <select
                  value={packageId}
                  onChange={(e) => setPackageId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                >
                  <option value="">
                    {language === 'ar'
                      ? '-- بدون باقة محددة --'
                      : language === 'fr'
                      ? '-- Aucun forfait spécifique --'
                      : '-- No specific package --'}
                  </option>

                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nameAr} ({p.price.toLocaleString()} دج)
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-2 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-1"><ShieldCheck className="w-4 h-4" /> {language === 'ar' ? 'بيانات المناسبة' : language === 'fr' ? 'Détails de l’événement' : 'Event details'}</div>
                <p className="text-xs text-neutral-400">{cleanDatesPreview(eventDates)} · {wilaya || '—'} · {eventTime || '—'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  {language === 'ar'
                    ? 'نسخة بطاقة التعريف الوطنية *'
                    : language === 'fr'
                    ? "Copie de la carte d'identité nationale *"
                    : 'National ID Card Copy *'}
                </label>

                <label className="flex items-center gap-3 w-full cursor-pointer bg-neutral-950 border border-dashed border-amber-500/40 hover:border-amber-500 rounded-xl px-4 py-4 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    {idCardFile ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-white font-medium truncate">
                      {idCardFile
                        ? idCardName
                        : language === 'ar'
                        ? 'اضغط لرفع نسخة بطاقة التعريف'
                        : language === 'fr'
                        ? "Cliquez pour joindre la carte d'identité"
                        : 'Click to upload ID card copy'}
                    </div>

                    <div className="text-xs text-neutral-500 mt-1">
                      JPG / PNG / PDF — 5 MB maximum
                    </div>
                  </div>

                  <input
                    type="file"
                    required
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    className="hidden"
                    onChange={(e) =>
                      handleIdCardChange(
                        e.target.files?.[0] || null
                      )
                    }
                  />
                </label>

                <p className="text-xs text-amber-400/80 mt-2">
                  {language === 'ar'
                    ? 'رفع نسخة بطاقة التعريف إلزامي لإرسال الحجز.'
                    : language === 'fr'
                    ? "La copie de la carte d'identité est obligatoire pour envoyer la réservation."
                    : 'The ID card copy is required to submit the booking.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  {language === 'ar'
                    ? 'ملاحظات إضافية'
                    : language === 'fr'
                    ? 'Notes supplémentaires'
                    : 'Additional Notes'}
                </label>

                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'أي تفاصيل خاصة ترغب في إضافتها...'
                      : language === 'fr'
                      ? 'Toute demande particulière...'
                      : 'Any special requests...'
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              </div>}

              {step === 3 && <div className="space-y-5">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-widest">IBRA PRODUCTION</p>
                      <h4 className="text-lg font-bold text-white mt-1">{language === 'ar' ? 'مراجعة طلب الحجز' : language === 'fr' ? 'Vérifier la réservation' : 'Review booking'}</h4>
                    </div>
                    <ShieldCheck className="w-7 h-7 text-amber-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {[
                      [language === 'ar' ? 'العريس' : 'Groom', groomName],
                      [language === 'ar' ? 'العروس' : 'Bride', brideName || '—'],
                      [language === 'ar' ? 'الهاتف' : 'Phone', phone],
                      [language === 'ar' ? 'الولاية' : 'Wilaya', wilaya],
                      [language === 'ar' ? 'التاريخ' : 'Date', eventDates.filter(Boolean).join(' • ')],
                      [language === 'ar' ? 'الوقت' : 'Time', eventTime],
                      [language === 'ar' ? 'المكان' : 'Venue', venue || '—'],
                      [language === 'ar' ? 'الباقة' : 'Package', packageId ? (packages.find(p => p.id === packageId)?.nameAr || '—') : '—'],
                    ].map(([label, value]) => <div key={label} className="rounded-xl bg-neutral-900 border border-neutral-800 p-3"><span className="block text-neutral-500 mb-1">{label}</span><strong className="text-white break-words">{value}</strong></div>)}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-amber-400"><FileText className="w-4 h-4" /> {idCardName || '—'}</div>
                </div>
              </div>}

              <div className="flex gap-3 pt-2">
                {step > 1 && <button type="button" onClick={() => setStep((current) => current - 1)} className="flex-1 py-4 rounded-xl bg-neutral-800 border border-neutral-700 text-white font-bold flex items-center justify-center gap-2 hover:bg-neutral-700 transition-all"><ArrowLeft className="w-4 h-4" /> {language === 'ar' ? 'رجوع' : language === 'fr' ? 'Retour' : 'Back'}</button>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold text-base tracking-wider uppercase shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : step < 3 ? <ArrowRight className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}

                <span>
                  {isSubmitting ? (language === 'ar' ? 'جاري إرسال الطلب...' : language === 'fr' ? 'Envoi en cours...' : 'Sending...') : step < 3 ? (language === 'ar' ? 'التالي' : language === 'fr' ? 'Suivant' : 'Next') : (language === 'ar' ? 'تأكيد وإرسال الحجز' : language === 'fr' ? 'Confirmer et envoyer' : 'Confirm & submit')}
                </span>
              </button>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
};
