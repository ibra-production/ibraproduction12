import React, { useState } from 'react';
import { auth } from '../firebase';
import { enablePushNotifications } from "../pushNotifications";
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  Camera,
  Package,
  Image as ImageIcon,
  Video,
  MessageSquare,
  Tag,
  Settings,
  History,
  LogOut,
  X,
  Plus,
  Trash2,
  Edit,
  Check,
  ShieldCheck,
  Download,
  Upload,
  PhoneCall,
  Send,
  Mail,
  BarChart3,
  CalendarDays,
  FileText,
  CheckSquare,
  Eye,
  FileImage,
  FileVideo
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const {
    settings,
    updateSettings,
    bookings,
    updateBookingStatus,
    deleteBooking,
    services,
    addService,
    updateService,
    deleteService,
    packages,
    addPackage,
    updatePackage,
    deletePackage,
    portfolio,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    uploadPortfolioImages,
    videos,
      addVideoItem,
      uploadVideoFile,
      updateVideoItem,
      deleteVideoItem,
    testimonials,
    offers,
    contactMessages,
    markContactMessageAsRead,
    deleteContactMessage,
    activityLogs,
    logout,
    backupData,
    restoreData
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    | 'dash'
    | 'bookings'
    | 'services'
    | 'packages'
    | 'portfolio'
    | 'videos'
    | 'testimonials'
    | 'offers'
    | 'messages'
    | 'analytics'
    | 'calendar'
    | 'idcards'
    | 'settings'
    | 'logs'
  >('dash');

  const [adminNotes, setAdminNotes] = useState<string>(() =>
    localStorage.getItem('ibra_admin_notes') ||
    'قائمة المهام اليومية:\n1. تأكيد مواعيد عطلة نهاية الأسبوع\n2. تسليم ألبومات الصور للعرسان\n3. شحن بطاريات كاميرات 4K'
  );

  const handleEnablePushNotifications = async () => {
    const token = await enablePushNotifications();

    if (token) {
      alert("✅ تم تفعيل إشعارات Ibra Production بنجاح.");
    } else {
      alert("⚠️ لم يتم تفعيل الإشعارات. تأكد من السماح بالإشعارات في المتصفح.");
    }
  };

  const [smsModalData, setSmsModalData] = useState<{
    booking: any;
    message: string;
  } | null>(null);

  const [invoiceModalData, setInvoiceModalData] = useState<any | null>(null);
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [bookingWilayaFilter, setBookingWilayaFilter] = useState('all');
  const [serviceModal, setServiceModal] = useState<any | null>(null);
  const [packageModal, setPackageModal] = useState<any | null>(null);
  const [portfolioModal, setPortfolioModal] = useState<any | null>(null);
const [videoModal, setVideoModal] = useState<any | null>(null);
  const [portfolioUploading, setPortfolioUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [idCardPreview, setIdCardPreview] = useState(null);
  const [idCardLoading, setIdCardLoading] = useState(false);

  const safeBookings = Array.isArray(bookings)
    ? bookings.filter(b => b && typeof b === 'object')
    : [];

  const safeMessages = Array.isArray(contactMessages)
    ? contactMessages.filter(m => m && typeof m === 'object')
    : [];

  const newBookingsCount = safeBookings.filter(
    b => b.status === 'new'
  ).length;

  const confirmedBookingsCount = safeBookings.filter(
    b => b.status === 'confirmed'
  ).length;

  const unreadMessagesCount = safeMessages.filter(
    m => !m.read
  ).length;

  const activeBookings = safeBookings.filter((b: any) => b.status !== 'cancelled');
  const analyticsRevenue = activeBookings.reduce((sum: number, b: any) => {
    const value = b.totalPrice ?? b.total ?? b.price ?? 0;
    const numeric = Number(String(value).replace(/[^0-9.-]/g, ''));
    return sum + (Number.isFinite(numeric) ? numeric : 0);
  }, 0);
  const analyticsPaid = activeBookings.reduce((sum: number, b: any) => {
    const value = b.totalPaid ?? b.paidAmount ?? b.paid ?? 0;
    const numeric = Number(String(value).replace(/[^0-9.-]/g, ''));
    return sum + (Number.isFinite(numeric) ? numeric : 0);
  }, 0);
  const analyticsRemaining = Math.max(analyticsRevenue - analyticsPaid, 0);
  const statusCounts = {
    new: activeBookings.filter((b: any) => b.status === 'new').length,
    confirmed: activeBookings.filter((b: any) => b.status === 'confirmed').length,
    processing: activeBookings.filter((b: any) => b.status === 'processing').length,
    completed: activeBookings.filter((b: any) => b.status === 'completed').length,
  };

  const filteredBookings = safeBookings.filter((b: any) => {
    const q = bookingSearch.trim().toLowerCase();
    const matchesSearch = !q || [
      b.id, b.groomName, b.brideName, b.phone, b.email,
      b.eventType, b.venue, b.wilaya, b.eventDate, b.serviceId, b.packageId
    ].some(value => String(value || '').toLowerCase().includes(q));
    const matchesStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
    const matchesWilaya = bookingWilayaFilter === 'all' || String(b.wilaya || '') === bookingWilayaFilter;
    return matchesSearch && matchesStatus && matchesWilaya;
  });

  const bookingWilayas = Array.from(
    new Set(safeBookings.map((b: any) => String(b.wilaya || '')).filter(Boolean))
  ).sort();

  const getIdCardBlob = async (value: string) => {
    if (value.startsWith('data:')) {
      const response = await fetch(value);
      return response.blob();
    }
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('يجب تسجيل الدخول كمسؤول.');
    const token = await currentUser.getIdToken();
    const response = await fetch(value, {
      headers: { Authorization: 'Bearer ' + token }
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(text || ('تعذر الوصول إلى بطاقة التعريف (' + response.status + ')'));
    }
    return response.blob();
  };

  const previewIdCard = async (booking: any) => {
    if (!booking?.idCardUrl) return;
    try {
      setIdCardLoading(true);
      const blob = await getIdCardBlob(String(booking.idCardUrl));
      const objectUrl = URL.createObjectURL(blob);
      setIdCardPreview({ url: objectUrl, name: booking.idCardName || 'id-card', type: blob.type || 'application/octet-stream' });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'تعذر معاينة بطاقة التعريف.');
    } finally {
      setIdCardLoading(false);
    }
  };

  const downloadIdCard = async (booking: any) => {
    if (!booking?.idCardUrl) return;
    try {
      setIdCardLoading(true);
      const blob = await getIdCardBlob(String(booking.idCardUrl));
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = booking.idCardName || 'id-card';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'تعذر تحميل بطاقة التعريف.');
    } finally {
      setIdCardLoading(false);
    }
  };

  const handleStatusChange = async (
    booking: any,
    newStatus: string
  ) => {
    if (!booking?.id) return;

    updateBookingStatus(booking.id, newStatus);

    if (newStatus === 'confirmed') {
      const smsText =
        `[IBRA PRODUCTION] مرحباً بالعريس ${booking.groomName || ''} والعروس ${booking.brideName || ''}! ` +
        `تم تأكيد حجزكم رقم (#${String(booking.id).slice(-4)}) ` +
        `لمناسبة ${booking.eventType || ''} بتاريخ ${booking.eventDate || ''}. ` +
        `للاستفسار: ${settings.phone}`;

      setSmsModalData({
        booking,
        message: smsText
      });
    }
  };

  const handleBackupExport = () => {
    const json = backupData();
    const blob = new Blob([json], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download =
      `ibra-production-backup-${new Date()
        .toISOString()
        .split('T')[0]}.json`;

    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBackupRestore = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = event => {
      const content = event.target?.result as string;

      if (!content) return;

      const success = restoreData(content);

      if (success) {
        alert('تم استعادة البيانات وإعدادات الموقع بنجاح!');
      } else {
        alert('خطأ في استعادة الملف.');
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-neutral-100 flex flex-col overflow-hidden font-sans">

      <header className="bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-center justify-between shrink-0">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-amber-500 text-neutral-950 font-bold flex items-center justify-center">
            IP
          </div>

          <div>
            <h1 className="font-bold text-lg text-white">
              IBRA PRODUCTION • لوحة التحكم
            </h1>

            <span className="text-xs text-amber-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              صلاحيات المسؤول مفعلة
            </span>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

      </header>

      <div className="flex flex-1 overflow-hidden">

        <aside className="w-64 bg-neutral-900/60 border-r border-neutral-800 p-4 space-y-1.5 overflow-y-auto shrink-0 hidden md:block">

          {[
            {
              id: 'dash',
              label: 'لوحة القيادة العامة',
              icon: <LayoutDashboard className="w-4 h-4" />
            },
            {
              id: 'bookings',
              label: `الحجوزات والطلبات (${newBookingsCount} جديدة)`,
              icon: <Calendar className="w-4 h-4" />
            },
            {
              id: 'analytics',
              label: 'الإحصائيات والأرباح',
              icon: <BarChart3 className="w-4 h-4" />
            },
            {
              id: 'calendar',
              label: 'تقويم المواعيد',
              icon: <CalendarDays className="w-4 h-4" />
            },
            {
              id: 'services',
              label: 'إدارة الخدمات',
              icon: <Camera className="w-4 h-4" />
            },
            {
              id: 'packages',
              label: 'الباقات والأسعار',
              icon: <Package className="w-4 h-4" />
            },
            {
              id: 'portfolio',
              label: 'معرض الأعمال',
              icon: <ImageIcon className="w-4 h-4" />
            },
            {
              id: 'videos',
              label: 'الفيديوهات',
              icon: <Video className="w-4 h-4" />
            },
            {
              id: 'messages',
              label: `رسائل التواصل (${unreadMessagesCount})`,
              icon: <Mail className="w-4 h-4" />
            },
            {
              id: 'testimonials',
              label: 'آراء العملاء',
              icon: <MessageSquare className="w-4 h-4" />
            },
            {
              id: 'offers',
              label: 'العروض الخاصة',
              icon: <Tag className="w-4 h-4" />
            },
            {
              id: 'idcards',
              label: 'بطاقات التعريف',
              icon: <FileText className="w-4 h-4" />
            },
            {
              id: 'settings',
              label: 'إعدادات الموقع',
              icon: <Settings className="w-4 h-4" />
            },
            {
              id: 'logs',
              label: 'سجل العمليات',
              icon: <History className="w-4 h-4" />
            }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}

        </aside>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 bg-neutral-950">
          <div className="md:hidden sticky top-0 z-20 mb-5 -mx-1 bg-neutral-950/95 backdrop-blur-md py-2">
            <select
              value={activeTab}
              onChange={e => setActiveTab(e.target.value as any)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500"
            >
              <option value="dash">لوحة القيادة العامة</option>
              <option value="bookings">الحجوزات والطلبات</option>
              <option value="analytics">الإحصائيات والأرباح</option>
              <option value="calendar">تقويم المواعيد</option>
              <option value="services">إدارة الخدمات</option>
              <option value="packages">الباقات والأسعار</option>
              <option value="portfolio">معرض الأعمال</option>
              <option value="videos">الفيديوهات</option>
              <option value="messages">رسائل التواصل</option>
              <option value="testimonials">آراء العملاء</option>
              <option value="offers">العروض الخاصة</option>
              <option value="idcards">بطاقات التعريف</option>
              <option value="settings">إعدادات الموقع</option>
              <option value="logs">سجل العمليات</option>
            </select>
          </div>

          {activeTab === 'dash' && (
            <div className="space-y-8">

              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  مرحباً بك مجدداً في لوحة تحكم IBRA PRODUCTION
                </h2>

                <p className="text-sm text-neutral-400">
                  إدارة الحجوزات والخدمات ومحتوى الموقع.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                <div className="glass-card p-6 rounded-2xl border border-neutral-800 hover:border-amber-500/30 hover:-translate-y-1 transition-all duration-300">
                  <span className="text-xs text-neutral-400">
                    إجمالي الحجوزات
                  </span>
                  <div className="text-3xl font-bold text-white mt-3">
                    {safeBookings.length}
                  </div>
                  <span className="text-xs text-amber-400">
                    {newBookingsCount} طلب جديد
                  </span>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-neutral-800">
                  <span className="text-xs text-neutral-400">
                    الحجوزات المؤكدة
                  </span>
                  <div className="text-3xl font-bold text-white mt-3">
                    {confirmedBookingsCount}
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-neutral-800">
                  <span className="text-xs text-neutral-400">
                    الخدمات
                  </span>
                  <div className="text-3xl font-bold text-white mt-3">
                    {services.length}
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-neutral-800">
                  <span className="text-xs text-neutral-400">
                    رسائل غير مقروءة
                  </span>
                  <div className="text-3xl font-bold text-white mt-3">
                    {unreadMessagesCount}
                  </div>
                </div>

              </div>

              <div className="glass-card p-6 rounded-3xl border border-neutral-800 hover:border-amber-500/20 transition-all">

                <div className="flex items-center justify-between mb-4">

                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-amber-400" />
                    <span className="text-white font-bold">
                      مفكرة المهام
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      localStorage.setItem(
                        'ibra_admin_notes',
                        adminNotes
                      );
                      alert('تم حفظ الملاحظات بنجاح!');
                    }}
                    className="px-4 py-2 bg-amber-500 text-neutral-950 rounded-xl font-bold text-xs"
                  >
                    حفظ
                  </button>

                </div>

                <textarea
                  rows={4}
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-white text-sm focus:border-amber-500 focus:outline-none"
                />

              </div>

            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  إدارة الحجوزات والطلبات الواردة
                </h2>

                <p className="text-xs text-neutral-400 mt-2">
                  جميع الحجوزات القادمة من الموقع.
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    value={bookingSearch}
                    onChange={e => setBookingSearch(e.target.value)}
                    placeholder="بحث بالاسم، الهاتف، البريد، المناسبة، المكان أو رقم الحجز..."
                    className="md:col-span-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-500"
                  />
                  <select
                    value={bookingStatusFilter}
                    onChange={e => setBookingStatusFilter(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                  >
                    <option value="all">كل الحالات</option>
                    <option value="new">جديد</option>
                    <option value="confirmed">مؤكد</option>
                    <option value="processing">قيد المعالجة</option>
                    <option value="completed">مكتمل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                  <select
                    value={bookingWilayaFilter}
                    onChange={e => setBookingWilayaFilter(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                  >
                    <option value="all">كل الولايات</option>
                    {bookingWilayas.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 mt-3 text-xs text-neutral-500">
                  <span>عرض {filteredBookings.length} من {safeBookings.length} حجز</span>
                  <button
                    onClick={() => { setBookingSearch(''); setBookingStatusFilter('all'); setBookingWilayaFilter('all'); }}
                    className="px-3 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
                  >
                    إعادة ضبط البحث
                  </button>
                </div>
              </div>

              <div className="md:hidden space-y-3">
                {filteredBookings.map((booking: any) => (
                  <div key={booking.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 hover:border-amber-500/30 transition-all">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="font-bold text-white">{booking.groomName || 'بدون اسم'}</div>
                        <div className="text-xs text-neutral-500 mt-1">{booking.brideName || '—'} • #{String(booking.id || '').slice(-6)}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-800 text-amber-400 border border-amber-500/20">
                        {booking.status === 'new' ? 'جديد' : booking.status === 'confirmed' ? 'مؤكد' : booking.status === 'processing' ? 'قيد المعالجة' : booking.status === 'completed' ? 'مكتمل' : 'ملغي'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                      <div className="bg-neutral-950 rounded-xl p-3"><span className="text-neutral-500 block mb-1">المناسبة</span><span className="text-neutral-200">{booking.eventType || '—'}</span></div>
                      <div className="bg-neutral-950 rounded-xl p-3"><span className="text-neutral-500 block mb-1">التاريخ</span><span className="text-neutral-200">{Array.isArray(booking.eventDates) && booking.eventDates.length ? booking.eventDates.join(' • ') : booking.eventDate || '—'}</span></div>
                      <div className="bg-neutral-950 rounded-xl p-3"><span className="text-neutral-500 block mb-1">الولاية</span><span className="text-neutral-200">{booking.wilaya || '—'}</span></div>
                      <div className="bg-neutral-950 rounded-xl p-3"><span className="text-neutral-500 block mb-1">الهاتف</span><a href={`tel:${booking.phone || ''}`} className="text-amber-400">{booking.phone || '—'}</a></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setInvoiceModalData(booking)} className="flex-1 min-w-[110px] px-3 py-2.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs">عرض التفاصيل</button>
                      {booking.phone && <a href={`https://wa.me/${String(booking.phone).replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer" className="px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">واتساب</a>}
                    </div>
                  </div>
                ))}
                {!filteredBookings.length && <div className="text-center py-12 text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-2xl">لا توجد حجوزات مطابقة للبحث.</div>}
              </div>

              <div className="hidden md:block bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">

                <div className="overflow-x-auto">

                  <table className="w-full text-right text-sm">

                    <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                      <tr>
                        <th className="p-4">العريس والعروس</th>
                        <th className="p-4">الهاتف</th>
                        <th className="p-4">المناسبة والتاريخ</th>
                        <th className="p-4">المكان</th>
                        <th className="p-4">الحالة</th>
                        <th className="p-4">الإجراءات</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-800">

                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-10 text-center text-neutral-500"
                          >
                            {safeBookings.length === 0 ? 'لا توجد حجوزات حتى الآن.' : 'لا توجد نتائج مطابقة للبحث.'}
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((b: any) => (
                          <tr
                            key={b.id}
                            className="hover:bg-neutral-800/40"
                          >
                            <td className="p-4">
                              <div className="font-bold text-white">
                                {b.groomName || '-'} & {b.brideName || '-'}
                              </div>
                              <div className="text-xs text-neutral-500">
                                {b.email || ''}
                              </div>
                            </td>

                            <td className="p-4">
                              <a
                                href={`tel:${b.phone || ''}`}
                                className="text-amber-400 flex items-center gap-1"
                              >
                                <PhoneCall className="w-3.5 h-3.5" />
                                {b.phone || '-'}
                              </a>
                            </td>

                            <td className="p-4">
                              <div className="text-white">
                                {b.eventType || '-'}
                              </div>
                              <div className="text-xs text-neutral-400">
                                {b.eventDate || '-'}{' '}
                                {b.eventTime
                                  ? `(${b.eventTime})`
                                  : ''}
                              </div>
                            </td>

                            <td className="p-4 text-neutral-300">
                              {b.venue || '-'}
                            </td>

                            <td className="p-4">
                              <span className="px-3 py-1 rounded-full text-xs bg-neutral-800 text-neutral-200">
                                {b.status === 'new'
                                  ? 'جديد'
                                  : b.status === 'confirmed'
                                  ? 'مؤكد'
                                  : b.status || '-'}
                              </span>
                            </td>

                            <td className="p-4">
                              <div className="flex items-center gap-2">

                                <select
                                  value={b.status || 'new'}
                                  onChange={e =>
                                    handleStatusChange(
                                      b,
                                      e.target.value
                                    )
                                  }
                                  className="bg-neutral-950 border border-amber-500/30 rounded-lg px-3 py-1.5 text-xs text-white"
                                >
                                  <option value="new">جديد</option>
                                  <option value="confirmed">
                                    تأكيد الحجز
                                  </option>
                                  <option value="processing">
                                    قيد المعالجة
                                  </option>
                                  <option value="completed">
                                    مكتمل
                                  </option>
                                  <option value="cancelled">
                                    ملغي
                                  </option>
                                </select>

                                <button
                                  onClick={() =>
                                    setInvoiceModalData(b)
                                  }
                                  className="p-2 bg-neutral-800 text-amber-400 rounded-lg"
                                  title="عرض كل تفاصيل الحجز"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                <a
                                  href={b.phone ? `tel:${b.phone}` : '#'}
                                  className="p-2 bg-neutral-800 text-green-400 rounded-lg"
                                  title="اتصال"
                                >
                                  <PhoneCall className="w-4 h-4" />
                                </a>

                                <button
                                  onClick={() =>
                                    deleteBooking(b.id)
                                  }
                                  className="p-2 text-red-400 rounded-lg hover:bg-red-500/10"
                                  title="حذف"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>

                              </div>
                            </td>

                          </tr>
                        ))
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>
          )}
           {activeTab === 'analytics' && (
            <div className="space-y-6">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  الإحصائيات والأرباح
                </h2>
                <p className="text-xs text-neutral-400 mt-2">
                  نظرة عامة على أداء الحجوزات والخدمات.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  ['إجمالي الحجوزات', safeBookings.length, ''],
                  ['الحجوزات النشطة', activeBookings.length, ''],
                  ['الإيراد المتوقع', analyticsRevenue.toLocaleString('ar-DZ') + ' DA', ''],
                  ['المبلغ المحصل', analyticsPaid.toLocaleString('ar-DZ') + ' DA', ''],
                ].map(([label,value]) => (
                  <div key={String(label)} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-amber-500/30 transition-all">
                    <div className="text-xs text-neutral-400">{label}</div>
                    <div className="text-2xl font-black text-white mt-3">{value}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                  <h3 className="font-bold text-white mb-4">توزيع الحالات</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(statusCounts).map(([key,value]) => (
                      <div key={key} className="bg-neutral-950 rounded-xl p-4">
                        <div className="text-xs text-neutral-500">{key === 'new' ? 'جديد' : key === 'confirmed' ? 'مؤكد' : key === 'processing' ? 'قيد المعالجة' : 'مكتمل'}</div>
                        <div className="text-xl font-black text-amber-400 mt-1">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                  <h3 className="font-bold text-white mb-4">الوضع المالي</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-neutral-950 rounded-xl p-4"><div className="text-xs text-neutral-500">المتبقي</div><div className="text-xl font-black text-white mt-1">{analyticsRemaining.toLocaleString('ar-DZ')} DA</div></div>
                    <div className="bg-neutral-950 rounded-xl p-4"><div className="text-xs text-neutral-500">نسبة التحصيل</div><div className="text-xl font-black text-amber-400 mt-1">{analyticsRevenue > 0 ? Math.round((analyticsPaid / analyticsRevenue) * 100) : 0}%</div></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                  <div className="text-sm text-neutral-400">
                    إجمالي الحجوزات
                  </div>
                  <div className="text-3xl font-bold text-white mt-3">
                    {safeBookings.length}
                  </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                  <div className="text-sm text-neutral-400">
                    الحجوزات المؤكدة
                  </div>
                  <div className="text-3xl font-bold text-amber-400 mt-3">
                    {confirmedBookingsCount}
                  </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                  <div className="text-sm text-neutral-400">
                    الطلبات الجديدة
                  </div>
                  <div className="text-3xl font-bold text-white mt-3">
                    {newBookingsCount}
                  </div>
                </div>

              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">

                <div className="p-5 border-b border-neutral-800">
                  <h3 className="font-bold text-white">
                    ملخص الحجوزات
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">

                    <thead className="bg-neutral-950 text-neutral-400">
                      <tr>
                        <th className="p-4">العميل</th>
                        <th className="p-4">الخدمة</th>
                        <th className="p-4">التاريخ</th>
                        <th className="p-4">الحالة</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-800">

                      {safeBookings.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-8 text-center text-neutral-500"
                          >
                            لا توجد بيانات.
                          </td>
                        </tr>
                      ) : (
                        safeBookings.map((b: any) => (
                          <tr key={b.id}>

                            <td className="p-4 text-white">
                              {b.groomName || '-'} & {b.brideName || '-'}
                            </td>

                            <td className="p-4 text-neutral-300">
                              {b.eventType || '-'}
                            </td>

                            <td className="p-4 text-neutral-300">
                              {b.eventDate || '-'}
                            </td>

                            <td className="p-4">
                              <span className="text-xs text-amber-400">
                                {b.status || 'new'}
                              </span>
                            </td>

                          </tr>
                        ))
                      )}

                    </tbody>

                  </table>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-6">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  تقويم المواعيد
                </h2>
                <p className="text-xs text-neutral-400 mt-2">
                  مواعيد الحجوزات المسجلة في الموقع.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {safeBookings.length === 0 ? (
                  <div className="col-span-full bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-500">
                    لا توجد مواعيد حالياً.
                  </div>
                ) : (
                  safeBookings.map((b: any) => (
                    <div
                      key={b.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5"
                    >

                      <div className="flex items-center justify-between mb-4">

                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-5 h-5 text-amber-400" />
                          <span className="font-bold text-white">
                            {b.eventDate || 'بدون تاريخ'}
                          </span>
                        </div>

                        <span className="text-xs text-neutral-400">
                          {b.eventTime || ''}
                        </span>

                      </div>

                      <div className="space-y-2 text-sm">

                        <div>
                          <span className="text-neutral-500">
                            العروس والعريس:
                          </span>
                          <span className="text-white mr-2">
                            {b.groomName || '-'} & {b.brideName || '-'}
                          </span>
                        </div>

                        <div>
                          <span className="text-neutral-500">
                            المناسبة:
                          </span>
                          <span className="text-white mr-2">
                            {b.eventType || '-'}
                          </span>
                        </div>

                        <div>
                          <span className="text-neutral-500">
                            المكان:
                          </span>
                          <span className="text-white mr-2">
                            {b.venue || '-'}
                          </span>
                        </div>

                        <div>
                          <span className="text-neutral-500">
                            الهاتف:
                          </span>
                          <span className="text-amber-400 mr-2">
                            {b.phone || '-'}
                          </span>
                        </div>

                      </div>

                    </div>
                  ))
                )}

              </div>

            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-6">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    إدارة الخدمات
                  </h2>
                  <p className="text-xs text-neutral-400 mt-2">
                    إضافة وتعديل وحذف الخدمات.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setServiceModal({
                      id: '',
                      titleAr: '',
                      titleFr: '',
                      titleEn: '',
                      descriptionAr: '',
                      descriptionFr: '',
                      descriptionEn: '',
                      price: 0,
                      image: '',
                      visible: true
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-neutral-950 rounded-xl text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  إضافة خدمة
                </button>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {Array.isArray(services) && services.length > 0 ? (
                  services.map((service: any) => (
                    <div
                      key={service.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden"
                    >

                      {service.image && (
                        <img
                          src={service.image}
                          alt={service.titleAr || ''}
                          className="w-full h-40 object-cover"
                        />
                      )}

                      <div className="p-5">

                        <h3 className="font-bold text-white">
                          {service.titleAr || '-'}
                        </h3>

                        <p className="text-xs text-neutral-400 mt-2 line-clamp-3">
                          {service.descriptionAr || ''}
                        </p>

                        <div className="flex items-center justify-between mt-5">

                          <span className="text-amber-400 font-bold">
                            {service.price
                              ? `${service.price} DA`
                              : 'حسب الطلب'}
                          </span>

                          <div className="flex items-center gap-2">

                            <button
                              onClick={() =>
                                setServiceModal(service)
                              }
                              className="p-2 bg-neutral-800 text-amber-400 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    'هل تريد حذف هذه الخدمة؟'
                                  )
                                ) {
                                  deleteService(service.id);
                                }
                              }}
                              className="p-2 bg-red-500/10 text-red-400 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-500">
                    لا توجد خدمات حالياً.
                  </div>
                )}

              </div>

            </div>
          )}

          {activeTab === 'packages' && (
            <div className="space-y-6">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    الباقات والأسعار
                  </h2>
                  <p className="text-xs text-neutral-400 mt-2">
                    إدارة الباقات الخاصة بـ Ibra Production.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setPackageModal({
                      id: '',
                      nameAr: '',
                      nameFr: '',
                      nameEn: '',
                      descriptionAr: '',
                      descriptionFr: '',
                      descriptionEn: '',
                      price: 0,
                      features: [],
                      visible: true
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-neutral-950 rounded-xl text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  إضافة باقة
                </button>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {Array.isArray(packages) && packages.length > 0 ? (
                  packages.map((pkg: any) => (
                    <div
                      key={pkg.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
                    >

                      <h3 className="text-xl font-bold text-white">
                        {pkg.nameAr || '-'}
                      </h3>

                      <p className="text-sm text-neutral-400 mt-3">
                        {pkg.descriptionAr || ''}
                      </p>

                      <div className="text-2xl font-bold text-amber-400 mt-5">
                        {pkg.price
                          ? `${pkg.price} DA`
                          : 'حسب الطلب'}
                      </div>

                      {Array.isArray(pkg.features) &&
                        pkg.features.length > 0 && (
                          <ul className="mt-5 space-y-2">
                            {pkg.features.map(
                              (feature: any, index: number) => (
                                <li
                                  key={index}
                                  className="text-xs text-neutral-300 flex items-center gap-2"
                                >
                                  <Check className="w-3.5 h-3.5 text-amber-400" />
                                  {typeof feature === 'string'
                                    ? feature
                                    : feature?.text || ''}
                                </li>
                              )
                            )}
                          </ul>
                        )}

                      <div className="flex items-center gap-2 mt-6">

                        <button
                          onClick={() =>
                            setPackageModal(pkg)
                          }
                          className="p-2 bg-neutral-800 text-amber-400 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (
                              confirm(
                                'هل تريد حذف هذه الباقة؟'
                              )
                            ) {
                              deletePackage(pkg.id);
                            }
                          }}
                          className="p-2 bg-red-500/10 text-red-400 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>

                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-500">
                    لا توجد باقات حالياً.
                  </div>
                )}

              </div>

            </div>
          )}
           {activeTab === 'portfolio' && (
            <div className="space-y-6">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    معرض الأعمال
                  </h2>
                  <p className="text-xs text-neutral-400 mt-2">
                    إدارة الصور والأعمال المنشورة في الموقع.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setPortfolioModal({
                      id: '',
                      titleAr: '',
                      titleFr: '',
                      titleEn: '',
                      category: 'weddings',
                      coupleNames: '',
                      date: '',
                      location: '',
                      image: '',
                      descriptionAr: '',
                      descriptionFr: '',
                      descriptionEn: '',
                      visible: true,
                      order: Array.isArray(portfolio)
                        ? portfolio.length + 1
                        : 1
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-neutral-950 rounded-xl text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  إضافة عمل
                </button>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {Array.isArray(portfolio) && portfolio.length > 0 ? (
                  portfolio.map((item: any) => (
                    <div
                      key={item.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden"
                    >

                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.titleAr || ''}
                          className="w-full h-52 object-cover"
                        />
                      )}

                      <div className="p-5">

                        <h3 className="font-bold text-white">
                          {item.titleAr || '-'}
                        </h3>

                        <div className="text-xs text-neutral-500 mt-2">
                          {item.coupleNames || ''}
                        </div>

                        <div className="text-xs text-neutral-400 mt-1">
                          {item.location || ''} • {item.date || ''}
                        </div>

                        <div className="flex items-center justify-between mt-5">

                          <span
                            className={`text-xs px-3 py-1 rounded-full ${
                              item.visible !== false
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-neutral-800 text-neutral-500'
                            }`}
                          >
                            {item.visible !== false
                              ? 'ظاهر'
                              : 'مخفي'}
                          </span>

                          <div className="flex items-center gap-2">

                            <button
                              onClick={() =>
                                setPortfolioModal(item)
                              }
                              className="p-2 bg-neutral-800 text-amber-400 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    'هل تريد حذف هذا العمل؟'
                                  )
                                ) {
                                  deletePortfolioItem(item.id);
                                }
                              }}
                              className="p-2 bg-red-500/10 text-red-400 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-500">
                    لا توجد أعمال في المعرض حالياً.
                  </div>
                )}

              </div>

            </div>
          )}

          {activeTab === 'videos' && (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold font-cinzel text-white">
        إدارة الفيديوهات
      </h2>

      <button
        onClick={() =>
          setVideoModal({
            titleAr: '',
            titleFr: '',
            titleEn: '',
            videoUrl: '',
            thumbnail: '',
            duration: ''
          })
        }
        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm"
      >
        <Plus className="w-4 h-4" />
        إضافة فيديو
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {videos.map(v => (
        <div
          key={v.id}
          className="glass-card p-4 rounded-2xl border border-neutral-800"
        >
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-4">
            {v.videoUrl ? (
              <video
                src={v.videoUrl}
                poster={v.thumbnail}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={v.thumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <h3 className="font-bold text-white text-sm mb-1">
            {v.titleAr}
          </h3>

          <span className="text-xs text-amber-400 block mb-4">
            {v.duration}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setVideoModal(v)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold"
            >
              <Edit className="w-4 h-4" />
              تعديل
            </button>

            <button
              onClick={() => {
                if (confirm('هل أنت متأكد من حذف هذا الفيديو؟')) {
                  deleteVideoItem(v.id);
                }
              }}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold"
            >
              <Trash2 className="w-4 h-4" />
              حذف
            </button>
          </div>
        </div>
      ))}
    </div>

    {videoModal && (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-amber-500/40 rounded-3xl max-w-xl w-full p-6 space-y-5">

          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              {videoModal.id ? 'تعديل الفيديو' : 'إضافة فيديو جديد'}
            </h3>

            <button
              onClick={() => setVideoModal(null)}
              className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <input
            value={videoModal.titleAr || ''}
            onChange={e =>
              setVideoModal({
                ...videoModal,
                titleAr: e.target.value
              })
            }
            placeholder="عنوان الفيديو بالعربية"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
          />

          <input
            value={videoModal.titleFr || ''}
            onChange={e =>
              setVideoModal({
                ...videoModal,
                titleFr: e.target.value
              })
            }
            placeholder="Titre du vidéo"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
          />

          <input
            value={videoModal.titleEn || ''}
            onChange={e =>
              setVideoModal({
                ...videoModal,
                titleEn: e.target.value
              })
            }
            placeholder="Video title"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
          />

          <div className="space-y-3">
            <label className="flex items-center gap-3 w-full cursor-pointer bg-neutral-950 border border-dashed border-amber-500/40 rounded-xl px-4 py-4">
              <FileVideo className="w-5 h-5 text-amber-400" />
              <div className="flex-1"><div className="text-sm text-white font-semibold">رفع فيديو من الحاسوب</div><div className="text-xs text-neutral-500">MP4 / WEBM / MOV — حتى 500MB</div></div>
              <input type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" disabled={videoUploading} onChange={async e=>{const file=e.target.files?.[0];if(!file)return;try{setVideoUploading(true);const url=await uploadVideoFile(file);setVideoModal((m:any)=>({...m,videoUrl:url}));}catch(error){alert(error instanceof Error?error.message:'فشل رفع الفيديو.');}finally{setVideoUploading(false);e.target.value='';}}}/>
            </label>
            {videoUploading && <div className="text-xs text-amber-400">جارٍ رفع الفيديو...</div>}
            <input value={videoModal.videoUrl || ''} onChange={e=>setVideoModal({...videoModal,videoUrl:e.target.value})} placeholder="أو أدخل رابط الفيديو" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
          </div>

          <input
            value={videoModal.thumbnail || ''}
            onChange={e =>
              setVideoModal({
                ...videoModal,
                thumbnail: e.target.value
              })
            }
            placeholder="رابط الصورة المصغرة"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
          />

          <input
            value={videoModal.duration || ''}
            onChange={e =>
              setVideoModal({
                ...videoModal,
                duration: e.target.value
              })
            }
            placeholder="المدة مثال: 01:25"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
          />

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                if (videoModal.id) {
                  updateVideoItem(videoModal.id, videoModal);
                } else {
                  addVideoItem(videoModal);
                }

                setVideoModal(null);
              }}
              className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
            >
              حفظ
            </button>

            <button
              onClick={() => setVideoModal(null)}
              className="px-6 py-3 rounded-xl bg-neutral-800 text-white font-bold"
            >
              إلغاء
            </button>
          </div>

        </div>
      </div>
    )}
  </div>
)}

{activeTab === 'testimonials' && (
            <div className="space-y-6">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  آراء العملاء
                </h2>
                <p className="text-xs text-neutral-400 mt-2">
                  مراجعة شهادات وآراء العملاء.
                </p>
              </div>

              <div className="space-y-4">

                {Array.isArray(testimonials) &&
                testimonials.length > 0 ? (
                  testimonials.map((item: any) => (
                    <div
                      key={item.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>
                          <h3 className="font-bold text-white">
                            {item.name ||
                              item.clientName ||
                              'عميل'}
                          </h3>

                          <p className="text-sm text-neutral-300 mt-3">
                            {item.text ||
                              item.comment ||
                              item.content ||
                              ''}
                          </p>
                        </div>

                        {item.rating && (
                          <span className="text-amber-400 text-sm">
                            ★ {item.rating}
                          </span>
                        )}

                      </div>

                    </div>
                  ))
                ) : (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-500">
                    لا توجد آراء حالياً.
                  </div>
                )}

              </div>

            </div>
          )}

          {activeTab === 'offers' && (
            <div className="space-y-6">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  العروض الخاصة
                </h2>
                <p className="text-xs text-neutral-400 mt-2">
                  إدارة العروض التي تظهر للعملاء.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {Array.isArray(offers) && offers.length > 0 ? (
                  offers.map((offer: any) => (
                    <div
                      key={offer.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
                    >

                      <div className="flex items-center justify-between">
                        <Tag className="w-6 h-6 text-amber-400" />

                        <span className="text-xs text-neutral-500">
                          {offer.visible !== false
                            ? 'نشط'
                            : 'مخفي'}
                        </span>
                      </div>

                      <h3 className="font-bold text-white text-lg mt-5">
                        {offer.titleAr ||
                          offer.nameAr ||
                          'عرض خاص'}
                      </h3>

                      <p className="text-sm text-neutral-400 mt-2">
                        {offer.descriptionAr ||
                          offer.description ||
                          ''}
                      </p>

                      {offer.price && (
                        <div className="text-amber-400 font-bold mt-4">
                          {offer.price} DA
                        </div>
                      )}

                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-500">
                    لا توجد عروض حالياً.
                  </div>
                )}

              </div>

            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  رسائل التواصل
                </h2>

                <p className="text-xs text-neutral-400 mt-2">
                  الرسائل المرسلة من زوار الموقع.
                </p>
              </div>

              <div className="space-y-4">

                {safeMessages.length === 0 ? (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-500">
                    لا توجد رسائل.
                  </div>
                ) : (
                  safeMessages.map((message: any) => (
                    <div
                      key={message.id}
                      className={`bg-neutral-900 border rounded-2xl p-5 ${
                        message.read
                          ? 'border-neutral-800'
                          : 'border-amber-500/40'
                      }`}
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex-1">

                          <div className="flex items-center gap-3">

                            <h3 className="font-bold text-white">
                              {message.name || 'زائر'}
                            </h3>

                            {!message.read && (
                              <span className="text-[10px] bg-amber-500 text-neutral-950 px-2 py-1 rounded-full font-bold">
                                جديد
                              </span>
                            )}

                          </div>

                          <div className="flex flex-wrap gap-4 mt-2 text-xs text-neutral-400">

                            {message.phone && (
                              <span>
                                الهاتف: {message.phone}
                              </span>
                            )}

                            {message.email && (
                              <span>
                                البريد: {message.email}
                              </span>
                            )}

                          </div>

                          <p className="text-sm text-neutral-300 mt-4 whitespace-pre-wrap">
                            {message.message ||
                              message.content ||
                              ''}
                          </p>

                        </div>

                        <div className="flex items-center gap-2">

                          {!message.read && (
                            <button
                              onClick={() =>
                                markContactMessageAsRead(
                                  message.id
                                )
                              }
                              className="p-2 bg-green-500/10 text-green-400 rounded-lg"
                              title="تحديد كمقروء"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  'هل تريد حذف هذه الرسالة؟'
                                )
                              ) {
                                deleteContactMessage(
                                  message.id
                                );
                              }
                            }}
                            className="p-2 bg-red-500/10 text-red-400 rounded-lg"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                      </div>

                    </div>
                  ))
                )}

              </div>

            </div>
          )}
          {activeTab === 'idcards' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">بطاقات التعريف المسجلة</h2>
                <p className="text-xs text-neutral-400 mt-2">معاينة وتحميل آمن لبطاقات التعريف المرفوعة مع الحجوزات.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {safeBookings.filter((b:any) => b.idCardUrl).map((b:any) => (
                  <div key={b.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-white">{b.groomName || '-'}{b.brideName ? ' & ' + b.brideName : ''}</h3>
                        <p className="text-xs text-neutral-500 mt-1">#{String(b.id || '').slice(-6)}</p>
                      </div>
                      <FileImage className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="text-xs text-neutral-400 mt-4 space-y-1">
                      <div>الهاتف: {b.phone || '-'}</div>
                      <div>التاريخ: {Array.isArray(b.eventDates) && b.eventDates.length ? b.eventDates.join('، ') : (b.eventDate || '-')}</div>
                      <div className="break-all">الملف: {b.idCardName || 'بطاقة التعريف'}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <button type="button" disabled={idCardLoading} onClick={() => previewIdCard(b)} className="flex items-center justify-center gap-2 px-3 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold disabled:opacity-50">
                        <Eye className="w-4 h-4" /> معاينة
                      </button>
                      <button type="button" disabled={idCardLoading} onClick={() => downloadIdCard(b)} className="flex items-center justify-center gap-2 px-3 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl text-xs font-bold disabled:opacity-50">
                        <Download className="w-4 h-4" /> تحميل
                      </button>
                    </div>
                  </div>
                ))}
                {safeBookings.filter((b:any) => b.idCardUrl).length === 0 && (
                  <div className="col-span-full bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-500">لا توجد بطاقات تعريف مسجلة.</div>
                )}
              </div>

              {idCardPreview && (
                <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="w-full max-w-5xl h-[90vh] bg-neutral-900 border border-amber-500/30 rounded-3xl overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between gap-3 p-4 border-b border-neutral-800">
                      <div className="min-w-0">
                        <div className="text-white font-bold">معاينة بطاقة التعريف</div>
                        <div className="text-xs text-neutral-500 truncate">{idCardPreview.name}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={idCardPreview.url} download={idCardPreview.name} className="px-4 py-2 bg-amber-500 text-neutral-950 rounded-xl text-xs font-bold">تحميل</a>
                        <button type="button" onClick={() => { URL.revokeObjectURL(idCardPreview.url); setIdCardPreview(null); }} className="p-2 bg-neutral-800 text-white rounded-xl">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 bg-neutral-950 p-4 overflow-auto flex items-center justify-center">
                      {idCardPreview.type.includes('pdf') ? (
                        <iframe src={idCardPreview.url} title="معاينة بطاقة التعريف" className="w-full h-full rounded-xl bg-white" />
                      ) : (
                        <img src={idCardPreview.url} alt="بطاقة التعريف" className="max-w-full max-h-full object-contain rounded-xl" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
           {activeTab === 'settings' && (
            <div className="space-y-6">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  إعدادات الموقع
                </h2>
                <p className="text-xs text-neutral-400 mt-2">
                  تعديل معلومات وبيانات Ibra Production.
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-5">

                <div>
                  <label className="block text-xs text-neutral-400 mb-2">
                    اسم الوكالة
                  </label>
                  <input
                    value={settings.agencyName || ''}
                    onChange={e =>
                      updateSettings({
                        ...settings,
                        agencyName: e.target.value
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-2">
                    الهاتف
                  </label>
                  <input
                    value={settings.phone || ''}
                    onChange={e =>
                      updateSettings({
                        ...settings,
                        phone: e.target.value
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-2">
                    WhatsApp
                  </label>
                  <input
                    value={settings.whatsapp || ''}
                    onChange={e =>
                      updateSettings({
                        ...settings,
                        whatsapp: e.target.value
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    value={settings.email || ''}
                    onChange={e =>
                      updateSettings({
                        ...settings,
                        email: e.target.value
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-2">
                    العنوان بالعربية
                  </label>
                  <input
                    value={settings.addressAr || ''}
                    onChange={e =>
                      updateSettings({
                        ...settings,
                        addressAr: e.target.value
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
                  />
                </div>

                <div className="flex justify-end pt-3">

                  <button
                    onClick={() => {
                      localStorage.setItem(
                        'ibra_settings',
                        JSON.stringify(settings)
                      );
                      alert('تم حفظ إعدادات الموقع بنجاح.');
                    }}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl font-bold text-sm"
                  >
                    حفظ الإعدادات
                  </button>

                </div>

              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">

                <h3 className="font-bold text-white mb-4">
                  النسخ الاحتياطي
                </h3>

                <div className="flex flex-wrap gap-3">

                  <button
                    onClick={handleBackupExport}
                    className="flex items-center gap-2 px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-bold"
                  >
                    <Download className="w-4 h-4" />
                    تصدير نسخة احتياطية
                  </button>

                  <label className="flex items-center gap-2 px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-bold cursor-pointer">

                    <Upload className="w-4 h-4" />

                    استعادة نسخة احتياطية

                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleBackupRestore}
                      className="hidden"
                    />

                  </label>

                </div>

              </div>

            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-6">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  سجل العمليات
                </h2>
                <p className="text-xs text-neutral-400 mt-2">
                  آخر العمليات التي تمت داخل لوحة التحكم.
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">

                {Array.isArray(activityLogs) &&
                activityLogs.length > 0 ? (
                  <div className="divide-y divide-neutral-800">

                    {activityLogs.map((log: any, index: number) => (
                      <div
                        key={log.id || index}
                        className="p-5 flex items-start gap-4"
                      >

                        <History className="w-5 h-5 text-amber-400 mt-0.5" />

                        <div className="flex-1">

                          <div className="text-sm text-white">
                            {log.action ||
                              log.message ||
                              log.description ||
                              'عملية'}
                          </div>

                          {log.details && (
                            <div className="text-xs text-neutral-500 mt-1">
                              {typeof log.details === 'string'
                                ? log.details
                                : JSON.stringify(log.details)}
                            </div>
                          )}

                          <div className="text-[11px] text-neutral-600 mt-2">
                            {log.timestamp
                              ? String(log.timestamp)
                              : ''}
                          </div>

                        </div>

                      </div>
                    ))}

                  </div>
                ) : (
                  <div className="p-10 text-center text-neutral-500">
                    لا توجد عمليات مسجلة.
                  </div>
                )}

              </div>

            </div>
          )}

        </main>

      </div>

      {smsModalData && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">

          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6">

            <div className="flex items-center justify-between mb-5">

              <h3 className="text-lg font-bold text-white">
                إرسال رسالة تأكيد
              </h3>

              <button
                onClick={() => setSmsModalData(null)}
                className="p-2 bg-neutral-800 rounded-full text-neutral-400"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            <textarea
              value={smsModalData.message}
              onChange={e =>
                setSmsModalData({
                  ...smsModalData,
                  message: e.target.value
                })
              }
              rows={7}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-white text-sm"
            />

            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={() => setSmsModalData(null)}
                className="px-5 py-2.5 bg-neutral-800 text-white rounded-xl text-sm"
              >
                إلغاء
              </button>

              <button
                onClick={() => {
                  const phone =
                    smsModalData.booking?.phone || '';

                  window.location.href =
                    `sms:${phone}?body=${encodeURIComponent(
                      smsModalData.message
                    )}`;

                  setSmsModalData(null);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-neutral-950 rounded-xl text-sm font-bold"
              >
                <Send className="w-4 h-4" />
                فتح تطبيق SMS
              </button>

            </div>

          </div>

        </div>
      )}

      {invoiceModalData && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <style>{`
            @media print {
              @page { size: A4; margin: 12mm; }
              body * { visibility: hidden !important; }
              .ibra-booking-print, .ibra-booking-print * { visibility: visible !important; }
              .ibra-booking-print {
                position: absolute !important;
                inset: 0 !important;
                width: 100% !important;
                max-width: none !important;
                margin: 0 !important;
                border: 0 !important;
                box-shadow: none !important;
                border-radius: 0 !important;
              }
              .ibra-print-actions { display: none !important; }
            }
          `}</style>

          <div className="ibra-booking-print w-full max-w-4xl bg-white text-neutral-900 rounded-[28px] shadow-2xl overflow-hidden my-6" dir="rtl">
            <div className="bg-neutral-950 text-white px-8 py-7">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 text-neutral-950 flex items-center justify-center font-black text-xl">IP</div>
                  <div>
                    <div className="text-2xl font-black tracking-wide">IBRA PRODUCTION</div>
                    <div className="text-sm text-neutral-300 mt-1">تفاصيل الحجز الرسمية</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-[11px] text-neutral-400">رقم الحجز</div>
                  <div className="text-xl font-black text-amber-400">#{String(invoiceModalData.id || '').slice(-8) || '-'}</div>
                  <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-white/10 text-xs font-bold">
                    {invoiceModalData.status === 'new' ? 'جديد' :
                     invoiceModalData.status === 'confirmed' ? 'مؤكد' :
                     invoiceModalData.status === 'processing' ? 'قيد المعالجة' :
                     invoiceModalData.status === 'completed' ? 'مكتمل' :
                     invoiceModalData.status === 'cancelled' ? 'ملغي' :
                     invoiceModalData.status || '-'}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-7">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-7 bg-amber-500 rounded-full" />
                  <h3 className="text-lg font-black">بيانات العميل</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    ['اسم العريس', invoiceModalData.groomName],
                    ['اسم العروس', invoiceModalData.brideName],
                    ['رقم الهاتف', invoiceModalData.phone],
                    ['البريد الإلكتروني', invoiceModalData.email],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                      <div className="text-xs text-neutral-500 mb-1">{label}</div>
                      <div className="font-bold break-words">{value || '-'}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-7 bg-amber-500 rounded-full" />
                  <h3 className="text-lg font-black">تفاصيل المناسبة</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">نوع المناسبة</div>
                    <div className="font-bold">{invoiceModalData.eventType || '-'}</div>
                  </div>
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">الولاية</div>
                    <div className="font-bold">{invoiceModalData.wilaya || '-'}</div>
                  </div>
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">المكان / القاعة</div>
                    <div className="font-bold">{invoiceModalData.venue || '-'}</div>
                  </div>
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">الوقت</div>
                    <div className="font-bold">{invoiceModalData.eventTime || '-'}</div>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="text-xs text-amber-700 mb-2 font-bold">تواريخ المناسبة</div>
                  {Array.isArray(invoiceModalData.eventDates) && invoiceModalData.eventDates.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {invoiceModalData.eventDates.map((date: string, index: number) => (
                        <span key={date + index} className="px-3 py-2 rounded-xl bg-white border border-amber-200 font-bold text-sm">
                          {date}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="font-bold">{invoiceModalData.eventDate || '-'}</div>
                  )}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-7 bg-amber-500 rounded-full" />
                  <h3 className="text-lg font-black">الخدمة والباقات</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">الخدمة</div>
                    <div className="font-bold">
                      {services.find((s: any) => s.id === invoiceModalData.serviceId)?.titleAr || invoiceModalData.serviceId || '-'}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1">ID: {invoiceModalData.serviceId || '-'}</div>
                  </div>
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">الباقة</div>
                    <div className="font-bold">
                      {packages.find((p: any) => p.id === invoiceModalData.packageId)?.nameAr || invoiceModalData.packageId || '-'}
                    </div>
                    {invoiceModalData.packageId && (
                      <div className="text-[11px] text-neutral-400 mt-1">
                        ID: {invoiceModalData.packageId}
                        {packages.find((p: any) => p.id === invoiceModalData.packageId)?.price != null
                          ? ` • ${packages.find((p: any) => p.id === invoiceModalData.packageId)?.price} DA`
                          : ''}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-7 bg-amber-500 rounded-full" />
                  <h3 className="text-lg font-black">الجانب المالي والمتابعة</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    ['السعر الإجمالي', invoiceModalData.totalPrice ?? invoiceModalData.total ?? invoiceModalData.price],
                    ['المبلغ المدفوع', invoiceModalData.totalPaid ?? invoiceModalData.paidAmount ?? invoiceModalData.paid],
                    ['المبلغ المتبقي', invoiceModalData.remainingBalance ?? invoiceModalData.remaining ?? invoiceModalData.balance],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                      <div className="text-xs text-neutral-500 mb-1">{label}</div>
                      <div className="font-black text-lg">{value !== undefined && value !== null && value !== '' ? `${value} DA` : '-'}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-7 bg-amber-500 rounded-full" />
                  <h3 className="text-lg font-black">ملاحظات وملفات</h3>
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">ملاحظات العميل</div>
                    <div className="font-medium whitespace-pre-wrap break-words">{invoiceModalData.notes || 'لا توجد ملاحظات.'}</div>
                  </div>
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">بطاقة التعريف الوطنية</div>
                    <div className="font-bold break-all">{invoiceModalData.idCardName || 'ملف بطاقة التعريف'}</div>
                    {invoiceModalData.idCardUrl ? (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button type="button" onClick={() => previewIdCard(invoiceModalData)} disabled={idCardLoading} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 text-sm font-bold disabled:opacity-50">
                          <Eye className="w-4 h-4" /> {idCardLoading ? 'جاري التحميل...' : 'معاينة'}
                        </button>
                        <button type="button" onClick={() => downloadIdCard(invoiceModalData)} disabled={idCardLoading} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-white text-sm font-bold border border-neutral-700 disabled:opacity-50">
                          <Download className="w-4 h-4" /> تحميل
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-red-500 mt-1">لا يوجد ملف مرفق</div>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-7 bg-amber-500 rounded-full" />
                  <h3 className="text-lg font-black">معلومات النظام</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">تاريخ إنشاء الحجز</div>
                    <div className="font-bold break-all">
                      {typeof invoiceModalData.createdAt === 'string'
                        ? invoiceModalData.createdAt
                        : invoiceModalData.createdAt?.toDate
                          ? invoiceModalData.createdAt.toDate().toLocaleString('ar-DZ')
                          : invoiceModalData.createdAt
                            ? String(invoiceModalData.createdAt)
                            : '-'}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">معرّف الحجز الكامل</div>
                    <div className="font-mono text-xs font-bold break-all">{invoiceModalData.id || '-'}</div>
                  </div>
                </div>
              </section>

              {Object.entries(invoiceModalData).filter(([key]) =>
                !['id','groomName','brideName','phone','email','eventType','eventDate','eventDates','wilaya','venue','eventTime','serviceId','packageId','notes','idCardUrl','idCardName','status','createdAt','totalPrice','total','price','totalPaid','paidAmount','paid','remainingBalance','remaining','balance'].includes(key)
              ).length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-7 bg-amber-500 rounded-full" />
                    <h3 className="text-lg font-black">بيانات إضافية</h3>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(invoiceModalData).filter(([key]) =>
                      !['id','groomName','brideName','phone','email','eventType','eventDate','eventDates','wilaya','venue','eventTime','serviceId','packageId','notes','idCardUrl','idCardName','status','createdAt'].includes(key)
                    ).map(([key, value]) => (
                      <div key={key} className="rounded-xl border border-neutral-200 p-3 flex items-start justify-between gap-4">
                        <span className="text-xs text-neutral-500">{key}</span>
                        <span className="text-sm font-medium text-left break-all">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value ?? '-')}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="ibra-print-actions flex flex-wrap gap-2 p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="text-xs text-neutral-500 self-center">تغيير الحالة:</span>
                {[
                  ['confirmed','تأكيد الحجز'],
                  ['processing','قيد المعالجة'],
                  ['completed','مكتمل'],
                  ['cancelled','إلغاء الحجز']
                ].map(([status,label]) => (
                  <button key={status} type="button" onClick={() => handleStatusChange(invoiceModalData, status)} className="px-3 py-2 rounded-xl bg-white border border-neutral-200 hover:border-amber-400 text-xs font-bold transition-all">
                    {label}
                  </button>
                ))}
              </div>

              <div className="border-t border-neutral-200 pt-5 flex items-center justify-between gap-4 ibra-print-actions">
                <button
                  onClick={() => setInvoiceModalData(null)}
                  className="px-5 py-3 bg-neutral-100 text-neutral-900 rounded-xl font-bold"
                >
                  إغلاق
                </button>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(String(invoiceModalData.id || ''));
                      alert('تم نسخ رقم الحجز.');
                    }}
                    className="px-4 py-3 bg-neutral-100 text-neutral-900 rounded-xl font-bold text-sm"
                  >
                    نسخ رقم الحجز
                  </button>
                  {invoiceModalData.phone && (
                    <a
                      href={`https://wa.me/${String(invoiceModalData.phone).replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-3 bg-neutral-100 text-neutral-900 rounded-xl font-bold text-sm"
                    >
                      WhatsApp
                    </a>
                  )}
                  <button
                    onClick={() => {
                      const data = JSON.stringify(invoiceModalData, null, 2);
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `booking-${String(invoiceModalData.id || 'unknown')}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-3 bg-neutral-100 text-neutral-900 rounded-xl font-bold text-sm"
                  >
                    تصدير البيانات
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-6 py-3 bg-neutral-950 text-white rounded-xl font-bold"
                  >
                    <Download className="w-4 h-4" />
                    طباعة A4
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex flex-wrap justify-between gap-3 text-xs text-neutral-500">
                <span>IBRA PRODUCTION</span>
                <span>{settings.phone || ''}</span>
                <span>{settings.email || ''}</span>
                <span>{settings.addressAr || ''}</span>
                <span>طُبع في: {new Date().toLocaleString('ar-DZ')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {serviceModal && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5 overflow-y-auto">

          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 my-8">

            <div className="flex items-center justify-between mb-6">

              <h3 className="text-xl font-bold text-white">
                {serviceModal.id
                  ? 'تعديل الخدمة'
                  : 'إضافة خدمة'}
              </h3>

              <button
                onClick={() => setServiceModal(null)}
                className="p-2 bg-neutral-800 rounded-full text-neutral-400"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <div className="space-y-4">

              <input
                placeholder="اسم الخدمة بالعربية"
                value={serviceModal.titleAr || ''}
                onChange={e =>
                  setServiceModal({
                    ...serviceModal,
                    titleAr: e.target.value
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

              <input
                placeholder="اسم الخدمة بالفرنسية"
                value={serviceModal.titleFr || ''}
                onChange={e =>
                  setServiceModal({
                    ...serviceModal,
                    titleFr: e.target.value
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

              <input
                placeholder="اسم الخدمة بالإنجليزية"
                value={serviceModal.titleEn || ''}
                onChange={e =>
                  setServiceModal({
                    ...serviceModal,
                    titleEn: e.target.value
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

              <textarea
                placeholder="وصف الخدمة"
                value={serviceModal.descriptionAr || ''}
                onChange={e =>
                  setServiceModal({
                    ...serviceModal,
                    descriptionAr: e.target.value
                  })
                }
                rows={4}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

              <input
                type="number"
                placeholder="السعر"
                value={serviceModal.price ?? ''}
                onChange={e =>
                  setServiceModal({
                    ...serviceModal,
                    price: Number(e.target.value)
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

              <input
                placeholder="رابط الصورة"
                value={serviceModal.image || ''}
                onChange={e =>
                  setServiceModal({
                    ...serviceModal,
                    image: e.target.value
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setServiceModal(null)}
                className="px-5 py-2.5 bg-neutral-800 text-white rounded-xl text-sm"
              >
                إلغاء
              </button>

              <button
                onClick={() => {

                  if (!serviceModal.titleAr) {
                    alert('يرجى إدخال اسم الخدمة.');
                    return;
                  }

                  if (serviceModal.id) {
                    updateService(
                      serviceModal.id,
                      serviceModal
                    );
                  } else {
                    addService(serviceModal);
                  }

                  setServiceModal(null);

                }}
                className="px-6 py-2.5 bg-amber-500 text-neutral-950 rounded-xl text-sm font-bold"
              >
                حفظ الخدمة
              </button>

            </div>

          </div>

        </div>
      )}
       {packageModal && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5 overflow-y-auto">

          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 my-8">

            <div className="flex items-center justify-between mb-6">

              <h3 className="text-xl font-bold text-white">
                {packageModal.id
                  ? 'تعديل الباقة'
                  : 'إضافة باقة'}
              </h3>

              <button
                onClick={() => setPackageModal(null)}
                className="p-2 bg-neutral-800 rounded-full text-neutral-400"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <div className="space-y-4">

              <input
                placeholder="اسم الباقة بالعربية"
                value={packageModal.nameAr || ''}
                onChange={e =>
                  setPackageModal({
                    ...packageModal,
                    nameAr: e.target.value
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

              <input
                placeholder="اسم الباقة بالفرنسية"
                value={packageModal.nameFr || ''}
                onChange={e =>
                  setPackageModal({
                    ...packageModal,
                    nameFr: e.target.value
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

              <input
                placeholder="اسم الباقة بالإنجليزية"
                value={packageModal.nameEn || ''}
                onChange={e =>
                  setPackageModal({
                    ...packageModal,
                    nameEn: e.target.value
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

              <textarea
                placeholder="وصف الباقة"
                value={packageModal.descriptionAr || ''}
                onChange={e =>
                  setPackageModal({
                    ...packageModal,
                    descriptionAr: e.target.value
                  })
                }
                rows={4}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

              <input
                type="number"
                placeholder="السعر"
                value={packageModal.price ?? ''}
                onChange={e =>
                  setPackageModal({
                    ...packageModal,
                    price: Number(e.target.value)
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

              <textarea
                placeholder="مميزات الباقة - كل ميزة في سطر"
                value={
                  Array.isArray(packageModal.features)
                    ? packageModal.features.join('\n')
                    : ''
                }
                onChange={e =>
                  setPackageModal({
                    ...packageModal,
                    features: e.target.value
                      .split('\n')
                      .map((x: string) => x.trim())
                      .filter(Boolean)
                  })
                }
                rows={5}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setPackageModal(null)}
                className="px-5 py-2.5 bg-neutral-800 text-white rounded-xl text-sm"
              >
                إلغاء
              </button>

              <button
                onClick={() => {

                  if (!packageModal.nameAr) {
                    alert('يرجى إدخال اسم الباقة.');
                    return;
                  }

                  if (packageModal.id) {
                    updatePackage(
                      packageModal.id,
                      packageModal
                    );
                  } else {
                    addPackage(packageModal);
                  }

                  setPackageModal(null);

                }}
                className="px-6 py-2.5 bg-amber-500 text-neutral-950 rounded-xl text-sm font-bold"
              >
                حفظ الباقة
              </button>

            </div>

          </div>

        </div>
      )}

      {portfolioModal && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5 overflow-y-auto">

          <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 my-8">

            <div className="flex items-center justify-between mb-6">

              <h3 className="text-xl font-bold text-white">
                {portfolioModal.id
                  ? 'تعديل العمل'
                  : 'إضافة عمل'}
              </h3>

              <button
                onClick={() => setPortfolioModal(null)}
                className="p-2 bg-neutral-800 rounded-full text-neutral-400"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                placeholder="عنوان العمل بالعربية"
                value={portfolioModal.titleAr || ''}
                onChange={e =>
                  setPortfolioModal({
                    ...portfolioModal,
                    titleAr: e.target.value
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

              <input
                placeholder="عنوان العمل بالفرنسية"
                value={portfolioModal.titleFr || ''}
                onChange={e =>
                  setPortfolioModal({
                    ...portfolioModal,
                    titleFr: e.target.value
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

              <input
                placeholder="عنوان العمل بالإنجليزية"
                value={portfolioModal.titleEn || ''}
                onChange={e =>
                  setPortfolioModal({
                    ...portfolioModal,
                    titleEn: e.target.value
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

              <input
                placeholder="أسماء العروسين"
                value={portfolioModal.coupleNames || ''}
                onChange={e =>
                  setPortfolioModal({
                    ...portfolioModal,
                    coupleNames: e.target.value
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

              <input
                placeholder="التاريخ"
                value={portfolioModal.date || ''}
                onChange={e =>
                  setPortfolioModal({
                    ...portfolioModal,
                    date: e.target.value
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

              <input
                placeholder="المكان"
                value={portfolioModal.location || ''}
                onChange={e =>
                  setPortfolioModal({
                    ...portfolioModal,
                    location: e.target.value
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

              <select
                value={portfolioModal.category || 'weddings'}
                onChange={e =>
                  setPortfolioModal({
                    ...portfolioModal,
                    category: e.target.value
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              >
                <option value="weddings">أعراس</option>
                <option value="graduations">تخرج</option>
                <option value="events">مناسبات</option>
                <option value="fashion">أزياء</option>
                <option value="other">أخرى</option>
              </select>

              <div className="md:col-span-2 space-y-3">
                <label className="flex items-center gap-3 w-full cursor-pointer bg-neutral-950 border border-dashed border-amber-500/40 rounded-xl px-4 py-4">
                  <FileImage className="w-5 h-5 text-amber-400" />
                  <div className="flex-1"><div className="text-sm text-white font-semibold">رفع صور من الحاسوب</div><div className="text-xs text-neutral-500">JPG / PNG / WEBP — عدة صور مسموحة</div></div>
                  <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" disabled={portfolioUploading} onChange={async e => {
                    const files = Array.from(e.target.files || []); if (!files.length) return;
                    try { setPortfolioUploading(true); const urls = await uploadPortfolioImages(files); setPortfolioModal((m:any) => ({...m, image: m?.image || urls[0] || '', images: [...(Array.isArray(m?.images) ? m.images : []), ...urls]})); }
                    catch(error){ alert(error instanceof Error ? error.message : 'فشل رفع الصور.'); }
                    finally { setPortfolioUploading(false); e.target.value=''; }
                  }} />
                </label>
                {portfolioUploading && <div className="text-xs text-amber-400">جارٍ رفع الصور...</div>}
                {Array.isArray(portfolioModal.images) && portfolioModal.images.length > 0 && <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{portfolioModal.images.map((url:string,i:number)=><div key={url+i} className="relative aspect-square rounded-xl overflow-hidden"><img src={url} className="w-full h-full object-cover" /><button type="button" onClick={()=>{const images=portfolioModal.images.filter((_:string,n:number)=>n!==i);setPortfolioModal({...portfolioModal,images,image:images[0]||''})}} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><X className="w-3 h-3"/></button></div>)}</div>}
                <input placeholder="أو أدخل رابط الصورة يدويًا" value={portfolioModal.image || ''} onChange={e=>setPortfolioModal({...portfolioModal,image:e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              </div>

              <textarea
                placeholder="وصف العمل"
                value={portfolioModal.descriptionAr || ''}
                onChange={e =>
                  setPortfolioModal({
                    ...portfolioModal,
                    descriptionAr: e.target.value
                  })
                }
                rows={5}
                className="md:col-span-2 w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

              <div className="md:col-span-2 flex items-center gap-3">

                <input
                  type="checkbox"
                  id="portfolioVisibleModal"
                  checked={portfolioModal.visible !== false}
                  onChange={e =>
                    setPortfolioModal({
                      ...portfolioModal,
                      visible: e.target.checked
                    })
                  }
                  className="w-4 h-4 accent-amber-500 rounded"
                />

                <label
                  htmlFor="portfolioVisibleModal"
                  className="text-sm text-neutral-200"
                >
                  عرض العمل في المعرض العام
                </label>

              </div>

            </div>

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-neutral-800">

              <button
                onClick={() => setPortfolioModal(null)}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-sm"
              >
                إلغاء
              </button>

              <button
                onClick={() => {

                  if (
                    !portfolioModal.titleAr ||
                    !(
                      portfolioModal.image ||
                      (
                        Array.isArray(portfolioModal.images) &&
                        portfolioModal.images.length > 0
                      )
                    )
                  ) {
                    alert(
                      'يرجى إدخال عنوان العمل وصورة واحدة على الأقل.'
                    );
                    return;
                  }

                  const data = {
                    ...portfolioModal,
                    titleFr:
                      portfolioModal.titleFr ||
                      portfolioModal.titleAr,
                    titleEn:
                      portfolioModal.titleEn ||
                      portfolioModal.titleAr,
                    descriptionFr:
                      portfolioModal.descriptionFr ||
                      portfolioModal.descriptionAr ||
                      '',
                    descriptionEn:
                      portfolioModal.descriptionEn ||
                      portfolioModal.descriptionAr ||
                      '',
                    visible:
                      portfolioModal.visible !== false
                  };

                  if (portfolioModal.id) {
                    updatePortfolioItem(
                      portfolioModal.id,
                      data
                    );
                  } else {
                    addPortfolioItem({
                      ...data,
                      order:
                        Array.isArray(portfolio)
                          ? portfolio.length + 1
                          : 1
                    });
                  }

                  setPortfolioModal(null);

                }}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-sm font-bold"
              >
                حفظ العمل
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
