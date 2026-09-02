import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PackageItem, ServiceItem } from '../types';
import { X, Calendar, CheckCircle2, Phone, Mail, User, MapPin, Clock, FileText } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: ServiceItem | null;
  preselectedPackage?: PackageItem | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
  preselectedPackage
}) => {
  const { language, services, packages, addBooking } = useApp();

  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState(preselectedPackage ? 'حفل زفاف (باقة)' : 'تصوير أعراس');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('16:00');
  const [venue, setVenue] = useState('');
  const [serviceId, setServiceId] = useState(preselectedService?.id || services[0]?.id || '');
  const [packageId, setPackageId] = useState(preselectedPackage?.id || '');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groomName || !phone || !eventDate) {
      alert(language === 'ar' ? 'يرجى ملء الحقول الإجبارية (اسم العريس، رقم الهاتف، تاريخ المناسبة)' : 'Please fill required fields');
      return;
    }

    addBooking({
      groomName,
      brideName,
      phone,
      email,
      eventType,
      eventDate,
      eventTime,
      venue,
      serviceId,
      packageId: packageId || undefined,
      notes
    });

    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setGroomName('');
    setBrideName('');
    setPhone('');
    setEmail('');
    setVenue('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-neutral-900 border border-amber-500/30 rounded-3xl max-w-2xl w-full p-6 sm:p-10 relative shadow-2xl overflow-y-auto max-h-[95vh]">
        
        <button
          onClick={handleResetAndClose}
          className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-400 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mb-4">
              {language === 'ar' ? 'تم إرسال طلب حجزك بنجاح!' : language === 'fr' ? 'Demande de Réservation Envoyée!' : 'Booking Request Sent Successfully!'}
            </h3>
            <p className="text-neutral-300 text-base max-w-md mx-auto mb-8 leading-relaxed">
              {language === 'ar'
                ? 'شكراً لثقتكم في IBRA PRODUCTION. سنتواصل معكم عبر الهاتف أو واتساب في أقرب وقت لتأكيد موعدكم.'
                : language === 'fr'
                ? 'Merci de votre confiance. Nous vous contacterons très bientôt pour confirmer votre rendez-vous.'
                : 'Thank you for choosing IBRA PRODUCTION. We will contact you soon to confirm your appointment.'}
            </p>
            <button
              onClick={handleResetAndClose}
              className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition-all shadow-lg shadow-amber-500/20"
            >
              {language === 'ar' ? 'العودة للموقع' : 'Return to Website'}
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest block mb-2 font-cinzel">
                IBRA PRODUCTION
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
                {language === 'ar' ? 'احجز موعدك الآن' : language === 'fr' ? 'Réserver Votre Date' : 'Book Your Appointment'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {language === 'ar' ? 'اسم العريس *' : 'Groom Name *'}
                  </label>
                  <div className="relative">
                    <User className="absolute top-3.5 right-3.5 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      required
                      value={groomName}
                      onChange={e => setGroomName(e.target.value)}
                      placeholder="أمين بلحاج"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none pr-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {language === 'ar' ? 'اسم العروس' : 'Bride Name'}
                  </label>
                  <div className="relative">
                    <User className="absolute top-3.5 right-3.5 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      value={brideName}
                      onChange={e => setBrideName(e.target.value)}
                      placeholder="سارة بن عمارة"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none pr-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {language === 'ar' ? 'رقم الهاتف (الواتساب) *' : 'Phone Number *'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute top-3.5 right-3.5 w-4 h-4 text-neutral-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="0779000833"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none pr-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute top-3.5 right-3.5 w-4 h-4 text-neutral-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="contact@ibraprod.online"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none pr-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {language === 'ar' ? 'نوع المناسبة' : 'Event Type'}
                  </label>
                  <input
                    type="text"
                    value={eventType}
                    onChange={e => setEventType(e.target.value)}
                    placeholder="حفل زفاف"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {language === 'ar' ? 'تاريخ المناسبة *' : 'Event Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {language === 'ar' ? 'الوقت' : 'Time'}
                  </label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={e => setEventTime(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {language === 'ar' ? 'مكان المناسبة / القاعة' : 'Venue / Location'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute top-3.5 right-3.5 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      value={venue}
                      onChange={e => setVenue(e.target.value)}
                      placeholder="قاعة الحفلات، الجزائر"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none pr-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {language === 'ar' ? 'الخدمة المطلوبة' : 'Requested Service'}
                  </label>
                  <select
                    value={serviceId}
                    onChange={e => setServiceId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.titleAr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  {language === 'ar' ? 'الباقة المفضلة (اختياري)' : 'Package (Optional)'}
                </label>
                <select
                  value={packageId}
                  onChange={e => setPackageId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                >
                  <option value="">{language === 'ar' ? '-- بدون باقة محددة --' : '-- No specific package --'}</option>
                  {packages.map(p => (
                    <option key={p.id} value={p.id}>{p.nameAr} ({p.price.toLocaleString()} دج)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  {language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={language === 'ar' ? 'أي تفاصيل خاصة ترغب في إضافتها...' : 'Any special requests...'}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold text-base tracking-wider uppercase shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span>{language === 'ar' ? 'إرسال طلب الحجز' : language === 'fr' ? 'Envoyer la Demande' : 'Submit Booking Request'}</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
