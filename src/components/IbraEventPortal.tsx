import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, Calendar, Clock, MapPin, Phone, Heart, Download, Share2, 
  Upload, QrCode, CreditCard, FileText, Usb, Star, ArrowLeft, ArrowRight,
  CheckCircle2, Clock3, AlertCircle, Copy, Check, LogOut, Camera, Film,
  Music, UserCheck, ShieldCheck, ChevronRight, Eye, MessageSquare, Plus, ExternalLink,
  Barcode as BarcodeIcon
} from 'lucide-react';
import { IbraEvent, EventTimelineItem, EventMediaItem, GuestUploadItem } from '../types';
import { BarcodeCard } from './BarcodeCard';

interface IbraEventPortalProps {
  onBackToHome: () => void;
  initialEventId?: string;
}

export const IbraEventPortal: React.FC<IbraEventPortalProps> = ({ onBackToHome, initialEventId }) => {
  const { 
    language, setLanguage, dir, 
    events, clientUser, clientLogin, clientLogout,
    togglePhotoFavorite, addGuestUpload, addEventReview,
    settings
  } = useApp();

  // Active tab inside portal
  const [activeTab, setActiveTab] = useState<'overview' | 'barcode' | 'timeline' | 'gallery' | 'guests' | 'payments' | 'documents' | 'usb' | 'review'>('overview');

  // Login inputs
  const [loginPhone, setLoginPhone] = useState('');
  const [loginEventId, setLoginEventId] = useState(initialEventId || '');
  const [loginError, setLoginError] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // Review Form
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Guest upload form inside portal or guest view
  const [guestName, setGuestName] = useState('');
  const [guestNote, setGuestNote] = useState('');
  const [guestFileUrl, setGuestFileUrl] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Lightbox for gallery photos
  const [activeImageModal, setActiveImageModal] = useState<EventMediaItem | null>(null);

  // QR Modal
  const [qrModalType, setQrModalType] = useState<'event' | 'guest' | null>(null);

  // Selected or active event
  const currentEvent: IbraEvent | undefined = events.find(e => 
    (clientUser && e.eventId === clientUser.eventId) || 
    (initialEventId && e.eventId.toUpperCase() === initialEventId.toUpperCase())
  ) || (clientUser ? events.find(e => e.phone.includes(clientUser.phone)) : undefined);

  // Countdown calculations
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!currentEvent?.eventDate) return;

    const calculateCountdown = () => {
      const eventDateTime = new Date(`${currentEvent.eventDate}T${currentEvent.eventTime || '17:00'}:00`).getTime();
      const now = new Date().getTime();
      const difference = eventDateTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [currentEvent]);

  // Handle Login
  const handleClientLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');

    if (!loginPhone.trim() && !loginEventId.trim()) {
      setLoginError(language === 'ar' ? 'الرجاء إدخال رقم الهاتف أو رقم المناسبة.' : 'Please enter your phone number or Event ID.');
      return;
    }

    const res = clientLogin(loginPhone, loginEventId);
    if (!res.success) {
      setLoginError(res.error || (language === 'ar' ? 'لم يتم العثور على حجز بهذا الرقم.' : 'No event found for these credentials.'));
    }
  };

  const handleCopyEventId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent || !guestName.trim()) return;

    const sampleImages = [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80'
    ];
    const chosenUrl = guestFileUrl.trim() || sampleImages[Math.floor(Math.random() * sampleImages.length)];

    addGuestUpload(currentEvent.eventId, {
      eventId: currentEvent.eventId,
      guestName: guestName.trim(),
      fileUrl: chosenUrl,
      fileType: chosenUrl.endsWith('.mp4') ? 'video' : 'image',
      fileSize: '3.1 MB',
      notes: guestNote.trim()
    });

    setGuestName('');
    setGuestNote('');
    setGuestFileUrl('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent || !reviewComment.trim()) return;

    addEventReview(currentEvent.eventId, {
      eventId: currentEvent.eventId,
      clientName: `${currentEvent.groomName} & ${currentEvent.brideName}`,
      rating,
      comment: reviewComment.trim()
    });

    setReviewSubmitted(true);
    setReviewComment('');
  };

  // Status badge helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {language === 'ar' ? 'مؤكد رسمياً' : language === 'fr' ? 'Confirmé' : 'Confirmed'}
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            {language === 'ar' ? 'قيد التوثيق والتنفيذ' : language === 'fr' ? 'En cours' : 'In Progress'}
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            {language === 'ar' ? 'مكتمل ومسلّم' : language === 'fr' ? 'Terminé' : 'Completed'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
            <Clock3 className="w-3.5 h-3.5 text-neutral-400" />
            {language === 'ar' ? 'قيد المراجعة' : language === 'fr' ? 'En attente' : 'Pending'}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-neutral-950">
      {/* TOP LUXURY NAVBAR */}
      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-amber-500/20 px-4 sm:px-6 lg:px-8 py-3.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Portal Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-amber-500/40 transition-all flex items-center gap-1 text-xs"
              title={language === 'ar' ? 'الرجوع للموقع الرئيسي' : 'Back to Home'}
            >
              {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span className="hidden sm:inline">{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
            </button>

            <div className="h-6 w-px bg-neutral-800 hidden sm:block"></div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-md shadow-amber-500/20">
                <div className="w-full h-full bg-neutral-950 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-cinzel text-base sm:text-lg font-bold tracking-wider text-white">
                    IBRA EVENT
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    VIP
                  </span>
                </div>
                <span className="text-[10px] tracking-widest text-neutral-400 uppercase block">
                  by {settings.agencyName}
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-full p-0.5">
              <button
                onClick={() => setLanguage('ar')}
                className={`px-2 py-0.5 text-xs rounded-full transition-all ${language === 'ar' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                AR
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2 py-0.5 text-xs rounded-full transition-all ${language === 'fr' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 text-xs rounded-full transition-all ${language === 'en' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>

            {/* Logout button if authenticated */}
            {clientUser && (
              <button
                onClick={clientLogout}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 border border-neutral-800 hover:border-rose-500/30 text-xs flex items-center gap-1.5 transition-all"
                title={language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'ar' ? 'خروج' : 'Logout'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* PORTAL BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* VIEW 1: NOT LOGGED IN -> CLIENT LOGIN SCREEN */}
        {!clientUser ? (
          <div className="max-w-xl mx-auto py-8 sm:py-14 animate-fade-in">
            <div className="text-center mb-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Client Portal & Event Management</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold font-cinzel text-white">
                {language === 'ar' ? 'بوابة عملاء إبرا برودكشن' : 'Client Event Portal'}
              </h1>
              <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                {language === 'ar' 
                  ? 'تابعي وتابع أدق تفاصيل ليلة العمر، جدول التصوير الزمني، الصور المباشرة (Live)، المستحقات، وفلاش ديسك Smart USB.'
                  : 'Track your wedding event timeline, live cinematic photos, guest uploads, payments and smart USB.'}
              </p>
            </div>

            {/* Login Box */}
            <div className="bg-neutral-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

              <form onSubmit={handleClientLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-2">
                    {language === 'ar' ? 'رقم الهاتف المسجل في الحجز:' : 'Registered Phone Number:'}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="مثال: 0770123456 أو 0696967093"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      dir="ltr"
                    />
                    <Phone className="w-4 h-4 text-neutral-500 absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-neutral-300">
                      {language === 'ar' ? 'معرّف المناسبة (Event ID - اختياري):' : 'Event ID (Optional):'}
                    </label>
                    <span className="text-[10px] text-amber-400/80">مثال: IBRA-2026-1048</span>
                  </div>
                  <input
                    type="text"
                    value={loginEventId}
                    onChange={(e) => setLoginEventId(e.target.value)}
                    placeholder="IBRA-2026-1048"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 font-mono transition-colors uppercase"
                    dir="ltr"
                  />
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm tracking-wider uppercase shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{language === 'ar' ? 'دخول بوابة مناسبتي' : 'Access My Event Portal'}</span>
                </button>
              </form>

              {/* DEMO / QUICK ACCESS FOR TESTING */}
              <div className="mt-6 pt-6 border-t border-neutral-800 text-center">
                <p className="text-xs text-neutral-500 mb-3">
                  {language === 'ar' ? 'لتجربة البوابة فوراً بمناسبة حقيقية نموذجية:' : 'Quick preview with sample event:'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setLoginPhone('0770123456');
                    setLoginEventId('IBRA-2026-1048');
                    clientLogin('0770123456', 'IBRA-2026-1048');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-semibold border border-neutral-700 hover:border-amber-500/50 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>عرس محمد & سارة (IBRA-2026-1048)</span>
                </button>
              </div>
            </div>

            {/* PORTAL HIGHLIGHTS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              {[
                { icon: Clock, labelAr: 'الجدول الزمني التفاعلي', labelEn: 'Wedding Timeline' },
                { icon: Camera, labelAr: 'صور البث الحي IBRA LIVE', labelEn: 'Live Photo Stream' },
                { icon: QrCode, labelAr: 'باركود مشاركة الضيوف', labelEn: 'Guest Upload QR' },
                { icon: Usb, labelAr: 'فلاش ديسك Smart USB', labelEn: 'Smart USB System' },
              ].map((feat, idx) => (
                <div key={idx} className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-3.5 text-center space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                    <feat.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium text-neutral-300 block">
                    {language === 'ar' ? feat.labelAr : feat.labelEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : currentEvent ? (
          /* VIEW 2: LOGGED IN -> CLIENT DASHBOARD */
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            
            {/* VIP EVENT HERO BANNER */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
              {/* Subtle gold glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
                {/* Couple & Welcome info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs uppercase font-bold tracking-widest text-amber-400 font-cinzel">
                      IBRA EVENT PORTAL
                    </span>
                    <span className="text-neutral-600">•</span>
                    {renderStatusBadge(currentEvent.status)}
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-bold font-cinzel text-white flex items-center gap-3">
                    <span>{currentEvent.groomName}</span>
                    <span className="text-amber-400 font-serif text-xl sm:text-2xl">×</span>
                    <span>{currentEvent.brideName}</span>
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-neutral-300 pt-1">
                    <div className="flex items-center gap-1.5 text-amber-400/90">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>{currentEvent.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-neutral-400" />
                      <span>{currentEvent.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-neutral-400" />
                      <span>{currentEvent.location} ({currentEvent.wilaya})</span>
                    </div>
                  </div>

                  {/* EVENT ID BADGE */}
                  <div className="pt-2 flex items-center gap-2">
                    <div className="inline-flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800 text-xs font-mono text-neutral-300">
                      <span className="text-neutral-500">EVENT ID:</span>
                      <span className="font-bold text-amber-400">{currentEvent.eventId}</span>
                      <button
                        onClick={() => handleCopyEventId(currentEvent.eventId)}
                        className="text-neutral-400 hover:text-white transition-colors"
                        title={language === 'ar' ? 'نسخ معرف المناسبة' : 'Copy Event ID'}
                      >
                        {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <button
                      onClick={() => setQrModalType('event')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'رمز QR للمناسبة' : 'Event QR'}</span>
                    </button>
                  </div>
                </div>

                {/* COUNTDOWN CARD (باقي على المناسبة) */}
                <div className="bg-neutral-950/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-center min-w-[280px] shadow-xl backdrop-blur-md">
                  <span className="text-xs uppercase tracking-widest text-neutral-400 block mb-2 font-medium">
                    {language === 'ar' ? 'باقي على المناسبة الكبرى' : 'Countdown to Special Day'}
                  </span>
                  
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-2 text-center">
                      <span className="text-xl sm:text-2xl font-bold font-mono text-amber-400 block">
                        {countdown.days}
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase">
                        {language === 'ar' ? 'يوم' : 'Days'}
                      </span>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-2 text-center">
                      <span className="text-xl sm:text-2xl font-bold font-mono text-white block">
                        {countdown.hours}
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase">
                        {language === 'ar' ? 'ساعة' : 'Hours'}
                      </span>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-2 text-center">
                      <span className="text-xl sm:text-2xl font-bold font-mono text-white block">
                        {countdown.minutes}
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase">
                        {language === 'ar' ? 'دقيقة' : 'Mins'}
                      </span>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-2 text-center">
                      <span className="text-xl sm:text-2xl font-bold font-mono text-amber-500 block">
                        {countdown.seconds}
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase">
                        {language === 'ar' ? 'ثانية' : 'Secs'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB NAVIGATION BUTTONS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-800 text-xs sm:text-sm">
              {[
                { id: 'overview', icon: Sparkles, labelAr: 'نظرة عامة', labelEn: 'Overview' },
                { id: 'barcode', icon: BarcodeIcon, labelAr: 'بطاقة الباركود الرسمية', labelEn: 'VIP Barcode Pass' },
                { id: 'timeline', icon: Clock, labelAr: 'الجدول الزمني', labelEn: 'Timeline', count: currentEvent.timeline?.length },
                { id: 'gallery', icon: Camera, labelAr: 'البث الحي IBRA LIVE', labelEn: 'IBRA Live', count: currentEvent.gallery?.length },
                { id: 'guests', icon: Upload, labelAr: 'مشاركات الضيوف', labelEn: 'Guest Uploads', count: currentEvent.guestUploads?.length },
                { id: 'payments', icon: CreditCard, labelAr: 'المدفوعات', labelEn: 'Payments' },
                { id: 'documents', icon: FileText, labelAr: 'العقود والوثائق', labelEn: 'Documents', count: currentEvent.documents?.length },
                { id: 'usb', icon: Usb, labelAr: 'فلاش ديسك Smart USB', labelEn: 'Smart USB' },
                { id: 'review', icon: Star, labelAr: 'تقييم الخدمة', labelEn: 'Review' },
              ].map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                      isSelected 
                        ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20' 
                        : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800/80'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
                    {tab.count !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-neutral-950 text-amber-400' : 'bg-neutral-800 text-neutral-400'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENTS */}
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Financial & Progress Summary */}
                  <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>{language === 'ar' ? 'ملخص الدفعات والمستحقات' : 'Payments & Balance'}</span>
                    </h3>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-neutral-400">
                        <span>{language === 'ar' ? 'المدفوع من الإجمالي' : 'Paid amount'}</span>
                        <span className="font-mono text-white font-bold">
                          {currentEvent.totalPaid.toLocaleString()} / {currentEvent.totalPrice.toLocaleString()} DA
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full h-3 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.round((currentEvent.totalPaid / (currentEvent.totalPrice || 1)) * 100))}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center pt-2 text-xs">
                        <span className="text-neutral-400">{language === 'ar' ? 'المتبقي ليلة التسليم:' : 'Remaining:'}</span>
                        <span className="text-amber-400 font-mono font-bold text-sm">
                          {(currentEvent.totalPrice - currentEvent.totalPaid).toLocaleString()} DA
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('payments')}
                      className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition-colors"
                    >
                      {language === 'ar' ? 'عرض تفاصيل الدفعات والوصولات' : 'View Payment Details'}
                    </button>
                  </div>

                  {/* Confirmed Services */}
                  <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 space-y-4 md:col-span-2">
                    <h3 className="text-sm font-bold text-white flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-amber-400" />
                        <span>{language === 'ar' ? 'الخدمات المحجوزة للمناسبة' : 'Booked Services'}</span>
                      </span>
                      <span className="text-xs text-amber-400">{currentEvent.packageName || 'الباقة الذهبية'}</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentEvent.services.map((srv, idx) => (
                        <div key={idx} className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                            <span className="text-xs font-medium text-neutral-200">{srv.serviceTitle}</span>
                          </div>
                          {renderStatusBadge(srv.status)}
                        </div>
                      ))}
                    </div>

                    {currentEvent.notes && (
                      <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800/80 text-xs text-neutral-400">
                        <span className="font-bold text-amber-400 block mb-1">ملاحظات وطلبات خاصة:</span>
                        <p>{currentEvent.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div 
                    onClick={() => setActiveTab('timeline')}
                    className="p-5 rounded-2xl bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Clock className="w-5 h-5" />
                      </div>
                      <ChevronRight className={`w-4 h-4 text-neutral-500 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">جدول التوقيت الزمني</h4>
                    <p className="text-xs text-neutral-400">مواعيد جلسة التصوير، وصول الموكب، وبداية الحفل خطوة بخطوة.</p>
                  </div>

                  <div 
                    onClick={() => setActiveTab('gallery')}
                    className="p-5 rounded-2xl bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera className="w-5 h-5" />
                      </div>
                      <ChevronRight className={`w-4 h-4 text-neutral-500 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">معرض الصور المباشر (LIVE)</h4>
                    <p className="text-xs text-neutral-400">تصفح الصور أثناء الحفل واختيار المفضلة ❤️ للتضمين في الألبوم الفاخر.</p>
                  </div>

                  <div 
                    onClick={() => setQrModalType('guest')}
                    className="p-5 rounded-2xl bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <ChevronRight className={`w-4 h-4 text-neutral-500 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">باركود مشاركة الضيوف (QR)</h4>
                    <p className="text-xs text-neutral-400">دع الأهل والأصدقاء يرفعون صورهم وفيديوهاتهم من طاولات الحفل مباشرة!</p>
                  </div>
                </div>
              </div>
            )}

            {/* 1.5. BARCODE PASS TAB */}
            {activeTab === 'barcode' && (
              <div className="space-y-6 max-w-xl mx-auto animate-fade-in py-4">
                <div className="text-center space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-white">
                    {language === 'ar' ? 'بطاقة الباركود الرسمية المعتمدة للعريس' : 'Official VIP Wedding Barcode Pass'}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {language === 'ar' 
                      ? 'أظهر هذا الباركود أو كود QR لطاقم تصوير IBRA PRODUCTION يوم الحفل لتأكيد الهوية واستلام فلاش ديسك Smart USB.' 
                      : 'Present this barcode or QR code to the IBRA PRODUCTION team on your wedding day.'}
                  </p>
                </div>
                <BarcodeCard event={currentEvent} />
              </div>
            )}

            {/* 2. TIMELINE TAB */}
            {activeTab === 'timeline' && (
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-400" />
                      <span>{language === 'ar' ? 'الجدول الزمني للزفاف (Wedding Timeline)' : 'Wedding Day Timeline'}</span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      {language === 'ar' 
                        ? 'محدد بدقة وتنسيق كامل بين فريق إبرا برودكشن والعرسان لضمان سلاسة التوثيق.' 
                        : 'Accurate step-by-step schedule orchestrated by IBRA PRODUCTION.'}
                    </p>
                  </div>
                </div>

                <div className="relative border-r-2 border-neutral-800 mr-4 sm:mr-6 pr-6 sm:pr-8 space-y-8 my-6">
                  {currentEvent.timeline?.map((item) => (
                    <div key={item.id} className="relative group">
                      {/* Timeline dot */}
                      <div className={`absolute -right-[31px] sm:-right-[39px] top-1.5 w-4 h-4 rounded-full border-2 ${
                        item.status === 'done' 
                          ? 'bg-emerald-500 border-emerald-400' 
                          : item.status === 'current' 
                            ? 'bg-amber-500 border-amber-300 animate-pulse ring-4 ring-amber-500/20' 
                            : 'bg-neutral-900 border-neutral-600'
                      }`}></div>

                      <div className="bg-neutral-950 p-4 sm:p-5 rounded-2xl border border-neutral-800/90 hover:border-amber-500/40 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <span className="font-mono text-sm sm:text-base font-bold text-amber-400">
                            {item.time}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'done' 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : item.status === 'current' 
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                                : 'bg-neutral-800 text-neutral-400'
                          }`}>
                            {item.status === 'done' ? 'تم الإنجاز' : item.status === 'current' ? 'جارٍ الآن' : 'قادم'}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-white mb-1">{item.title}</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. IBRA LIVE GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <Camera className="w-5 h-5 text-amber-400" />
                        <span>IBRA LIVE</span>
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        LIVE STREAM
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      {language === 'ar' 
                        ? 'صور المناسبة يتم رفعها أولاً بأول! اضغط على القلب ❤️ لاختيار صورك المفضلة لألبوم الزفاف.' 
                        : 'Real-time wedding photos. Click the heart ❤️ to mark favorites for your luxury photo album.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-400 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800 flex items-center gap-1.5 font-bold">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{currentEvent.gallery?.filter(p => p.isFavorite).length || 0} مفضلة</span>
                    </span>
                  </div>
                </div>

                {/* Photo Grid */}
                {(!currentEvent.gallery || currentEvent.gallery.length === 0) ? (
                  <div className="py-16 text-center text-neutral-500 space-y-2">
                    <Camera className="w-10 h-10 mx-auto text-neutral-600" />
                    <p className="text-sm">{language === 'ar' ? 'لم يتم رفع صور حية بعد، ستبدأ بالظهور فور انطلاق الحفل!' : 'No photos yet. They will appear here live during the event!'}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentEvent.gallery.map((photo) => (
                      <div key={photo.id} className="group relative bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 hover:border-amber-500/40 transition-all shadow-lg">
                        <div className="aspect-[4/3] overflow-hidden relative cursor-pointer" onClick={() => setActiveImageModal(photo)}>
                          <img 
                            src={photo.url} 
                            alt={photo.caption || 'Wedding Photo'} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <span className="text-xs text-white line-clamp-1">{photo.caption}</span>
                          </div>
                        </div>

                        <div className="p-3 flex items-center justify-between bg-neutral-950">
                          <button
                            onClick={() => togglePhotoFavorite(currentEvent.eventId, photo.id)}
                            className={`p-1.5 rounded-xl transition-all flex items-center gap-1 text-xs font-bold ${
                              photo.isFavorite 
                                ? 'bg-rose-500/20 text-rose-400' 
                                : 'text-neutral-400 hover:text-rose-400 bg-neutral-900'
                            }`}
                            title={language === 'ar' ? 'إضافة للمفضلة' : 'Favorite'}
                          >
                            <Heart className={`w-4 h-4 ${photo.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span className="text-[10px]">{photo.isFavorite ? 'مفضلة' : ''}</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = photo.url;
                                link.download = `IBRA-PHOTO-${photo.id}.jpg`;
                                link.click();
                              }}
                              className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white"
                              title={language === 'ar' ? 'تحميل الصورة' : 'Download'}
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setActiveImageModal(photo)}
                              className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white"
                              title={language === 'ar' ? 'تكبير' : 'Full Screen'}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. GUEST UPLOADS TAB */}
            {activeTab === 'guests' && (
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <Upload className="w-5 h-5 text-amber-400" />
                      <span>{language === 'ar' ? 'مشاركات وتوثيقات الضيوف (Guest Uploads)' : 'Guest Uploaded Moments'}</span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      {language === 'ar' 
                        ? 'جميع الصور والتهاني التي التقطها المدعوون والضيوف عبر مسح باركود QR الخاص بالمناسبة.' 
                        : 'Photos and clips submitted by your wedding guests via the event QR code.'}
                    </p>
                  </div>

                  <button
                    onClick={() => setQrModalType('guest')}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>{language === 'ar' ? 'عرض وطباعة باركود الضيوف (QR)' : 'Show Guest QR Code'}</span>
                  </button>
                </div>

                {/* Upload Simulator form for test/manual upload */}
                <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800/80 space-y-4">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {language === 'ar' ? 'تجربة رفع صورة من هاتف ضيف:' : 'Simulate Guest Upload:'}
                  </h4>
                  <form onSubmit={handleGuestSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder={language === 'ar' ? 'اسم الضيف (مثال: عماد صديق العريس)' : 'Guest Name'}
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                      className="bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="text"
                      placeholder={language === 'ar' ? 'رسالة تهنئة أو تعليق...' : 'Congratulations note'}
                      value={guestNote}
                      onChange={(e) => setGuestNote(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="py-2 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold text-xs border border-neutral-700 flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'رفع ومشاركة' : 'Upload & Share'}</span>
                    </button>
                  </form>
                  {uploadSuccess && (
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تمت إضافة الصورة بنجاح وربطها بالمناسبة!</span>
                    </p>
                  )}
                </div>

                {/* Guest Uploads Feed */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {currentEvent.guestUploads?.map((item) => (
                    <div key={item.id} className="bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden shadow-lg">
                      <div className="aspect-[4/3] bg-neutral-900 relative">
                        <img 
                          src={item.fileUrl} 
                          alt={item.guestName} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] text-amber-400 font-mono">
                          {item.fileSize || '3 MB'}
                        </span>
                      </div>
                      <div className="p-3.5 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{item.guestName}</span>
                          <span className="text-[10px] text-neutral-500 font-mono">{item.createdAt}</span>
                        </div>
                        {item.notes && (
                          <p className="text-xs text-neutral-300 italic">"{item.notes}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. PAYMENTS TAB */}
            {activeTab === 'payments' && (
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-400" />
                    <span>{language === 'ar' ? 'سجل المدفوعات والوصولات الرسمية' : 'Payments & Invoicing'}</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {language === 'ar' 
                      ? 'توثيق رسمي شفاف لجميع الدفعات المالية والعربون المودع لدى إبرا برودكشن.' 
                      : 'Transparent record of all deposits and paid installments.'}
                  </p>
                </div>

                {/* Balance Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 text-center">
                    <span className="text-xs text-neutral-400 block mb-1">إجمالي تكلفة الباقة (Total)</span>
                    <span className="text-2xl font-mono font-bold text-white">{currentEvent.totalPrice.toLocaleString()} DA</span>
                  </div>

                  <div className="bg-neutral-950 p-5 rounded-2xl border border-emerald-500/30 text-center">
                    <span className="text-xs text-emerald-400 block mb-1">المبلغ المدفوع (Paid)</span>
                    <span className="text-2xl font-mono font-bold text-emerald-400">{currentEvent.totalPaid.toLocaleString()} DA</span>
                  </div>

                  <div className="bg-neutral-950 p-5 rounded-2xl border border-amber-500/30 text-center">
                    <span className="text-xs text-amber-400 block mb-1">المتبقي (Remaining Balance)</span>
                    <span className="text-2xl font-mono font-bold text-amber-400">
                      {(currentEvent.totalPrice - currentEvent.totalPaid).toLocaleString()} DA
                    </span>
                  </div>
                </div>

                {/* Payment History List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">سجل الدفعات:</h4>
                  {currentEvent.payments?.map((pay) => (
                    <div key={pay.id} className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{pay.receiptNumber || 'وصل دفع'}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                            {pay.method}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400">{pay.note}</p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-base font-mono font-bold text-emerald-400 block">
                          +{pay.amount.toLocaleString()} DA
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">{pay.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. DOCUMENTS TAB */}
            {activeTab === 'documents' && (
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    <span>{language === 'ar' ? 'العقود والوثائق الرسمية' : 'Contracts & Official Documents'}</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {language === 'ar' 
                      ? 'يمكنك الاطلاع على العقد المبرم، الفاتورة الأولية، وطباعة أو حفظ المستندات بصيغة PDF.' 
                      : 'View, download and print your official contract and invoices.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {currentEvent.documents?.map((doc) => (
                    <div key={doc.id} className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-colors">
                      <div className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-bold text-white">{doc.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <span className="font-mono">{doc.date}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-bold uppercase text-[10px]">{doc.status}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-900 flex items-center gap-2">
                        <button
                          onClick={() => window.print()}
                          className="flex-1 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          <span>تحميل PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. SMART USB TAB */}
            {activeTab === 'usb' && (
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Usb className="w-5 h-5 text-amber-400" />
                    <span>{language === 'ar' ? 'فلاش ديسك ذكي (Smart USB Package)' : 'Smart USB Experience'}</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {language === 'ar' 
                      ? 'كل باقة فاخرة تتضمن فلاش ديسك سينمائي خشبي فاخر مزود برمز QR ذكي يتيح الوصول الدائم لأرشيف الزفاف السحابي.' 
                      : 'Exclusive luxury wooden USB drive with built-in QR linking directly to your master cloud archive.'}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 p-6 sm:p-8 rounded-3xl border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-3 max-w-lg">
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                      MASTER ARCHIVE VAULT
                    </span>
                    <h4 className="text-xl font-bold font-cinzel text-white">
                      USB-ID: {currentEvent.smartUsbId || `USB-${currentEvent.eventId}`}
                    </h4>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      عند استلام علبة الفلاش ديسك الخشبية الملكية، يكفي مسح الرمز المنقوش عليها بهاتفك لفتح البوابة مباشرة وتحميل النسخ الخام 4K والألبوم الإلكتروني في أي وقت ومن أي جهاز حول العالم.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-neutral-400 pt-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>حماية سحابية وتشفير دائم</span>
                    </div>
                  </div>

                  <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 text-center space-y-3">
                    <div className="w-32 h-32 bg-white p-2 rounded-xl mx-auto flex items-center justify-center">
                      <QrCode className="w-28 h-28 text-neutral-950" />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 block">
                      {currentEvent.smartUsbId || `USB-${currentEvent.eventId}`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 8. REVIEW TAB */}
            {activeTab === 'review' && (
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold font-cinzel text-white">
                    {language === 'ar' ? 'تقييم تجربتك مع إبرا برودكشن' : 'Rate Your Experience'}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {language === 'ar' ? 'رأيكم الصادق يهمنا ويسعدنا مشاركته مع العرسان القادمين!' : 'Your feedback means the world to our production team!'}
                  </p>
                </div>

                {reviewSubmitted || currentEvent.review ? (
                  <div className="bg-neutral-950 p-6 rounded-2xl border border-emerald-500/30 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                    <h4 className="text-base font-bold text-white">شكراً جزيلاً لتقييمكم الجميل!</h4>
                    <p className="text-xs text-neutral-300 italic">
                      "{currentEvent.review?.comment || reviewComment || 'خدمة احترافية وقمة في الإبداع!'}"
                    </p>
                    <div className="flex justify-center gap-1 text-amber-400">
                      {[...Array(currentEvent.review?.rating || rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {/* Stars selector */}
                    <div className="text-center space-y-2">
                      <span className="text-xs text-neutral-400">التقييم العام:</span>
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setRating(s)}
                            className="p-1 hover:scale-125 transition-transform"
                          >
                            <Star className={`w-7 h-7 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1">
                        رسالتك أو انطباعك عن العمل والتعامل:
                      </label>
                      <textarea
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                        placeholder="اكتب رأيك هنا بكل صراحة..."
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
                    >
                      إرسال التقييم
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>
        ) : null}

      </main>

      {/* LIGHTBOX MODAL */}
      {activeImageModal && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setActiveImageModal(null)}
              className="absolute -top-10 right-0 text-white hover:text-amber-400 text-xs font-bold"
            >
              إغلاق (✕)
            </button>
            <img 
              src={activeImageModal.url} 
              alt={activeImageModal.caption} 
              className="max-h-[80vh] w-auto rounded-2xl object-contain border border-neutral-800"
            />
            {activeImageModal.caption && (
              <p className="text-xs text-neutral-300 mt-3 text-center">{activeImageModal.caption}</p>
            )}
          </div>
        </div>
      )}

      {/* QR MODAL */}
      {qrModalType && currentEvent && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setQrModalType(null)}
              className="absolute top-4 left-4 text-neutral-400 hover:text-white text-xs"
            >
              ✕
            </button>

            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 font-cinzel">
              IBRA PRODUCTION • QR SYSTEM
            </span>

            <h3 className="text-lg font-bold text-white font-cinzel">
              {qrModalType === 'guest' 
                ? `شارك صورك من عرس ${currentEvent.groomName} & ${currentEvent.brideName}` 
                : `رمز الدخول المباشر لمناسبة ${currentEvent.groomName} & ${currentEvent.brideName}`}
            </h3>

            <div className="bg-white p-4 rounded-2xl inline-block mx-auto shadow-inner">
              <QrCode className="w-48 h-48 text-neutral-950" />
            </div>

            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              {qrModalType === 'guest'
                ? 'يمكن طباعة هذا الرمز ووضعه على طاولات الحفل لتمكين الضيوف من رفع صورهم وفيديوهاتهم فوراً.'
                : 'امسح الرمز لفتح صفحة المناسبة مباشرة ومتابعة التحديثات.'}
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>طباعة الرمز</span>
              </button>
              <button
                onClick={() => setQrModalType(null)}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-neutral-900 py-6 px-4 text-center text-xs text-neutral-500">
        <p>© {new Date().getFullYear()} {settings.agencyName} • IBRA EVENT Client Portal. All Rights Reserved.</p>
      </footer>
    </div>
  );
};
