import React, { useState } from 'react';
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
  CheckSquare
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
    videos,
      addVideoItem,
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
    | 'settings'
    | 'logs'
  >('dash');

  const [adminNotes, setAdminNotes] = useState<string>(() => {
    return (
      localStorage.getItem('ibra_admin_notes') ||
      'قائمة المهام اليومية:\n1. تأكيد مواعيد عطلة نهاية الأسبوع\n2. تسليم ألبومات الصور للعرسان\n3. شحن بطاريات كاميرات 4K'
    );
  });

  const [smsModalData, setSmsModalData] = useState<{
    booking: any;
    message: string;
  } | null>(null);

  const [invoiceModalData, setInvoiceModalData] = useState<any | null>(null);
  const [serviceModal, setServiceModal] = useState<any | null>(null);
  const [packageModal, setPackageModal] = useState<any | null>(null);
  const [portfolioModal, setPortfolioModal] = useState<any | null>(null);
const [videoModal, setVideoModal] = useState<any | null>(null);

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

        <main className="flex-1 overflow-y-auto p-6 sm:p-10 bg-neutral-950">

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

                <div className="glass-card p-6 rounded-2xl border border-neutral-800">
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

              <div className="glass-card p-6 rounded-3xl border border-neutral-800">

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

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">

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

                      {safeBookings.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-10 text-center text-neutral-500"
                          >
                            لا توجد حجوزات حتى الآن.
                          </td>
                        </tr>
                      ) : (
                        safeBookings.map((b: any) => (
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
                                  title="العقد"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>

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

          <input
            value={videoModal.videoUrl || ''}
            onChange={e =>
              setVideoModal({
                ...videoModal,
                videoUrl: e.target.value
              })
            }
            placeholder="رابط الفيديو MP4"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
          />

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
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">

          <div className="w-full max-w-2xl bg-white text-neutral-900 rounded-3xl p-8">

            <div className="flex items-start justify-between border-b border-neutral-200 pb-5">

              <div>
                <h2 className="text-2xl font-bold">
                  IBRA PRODUCTION
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  عقد / تفاصيل الحجز
                </p>
              </div>

              <button
                onClick={() =>
                  setInvoiceModalData(null)
                }
                className="p-2 bg-neutral-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <div className="grid grid-cols-2 gap-5 mt-6 text-sm">

              <div>
                <span className="text-neutral-500">
                  العريس
                </span>
                <div className="font-bold mt-1">
                  {invoiceModalData.groomName || '-'}
                </div>
              </div>

              <div>
                <span className="text-neutral-500">
                  العروس
                </span>
                <div className="font-bold mt-1">
                  {invoiceModalData.brideName || '-'}
                </div>
              </div>

              <div>
                <span className="text-neutral-500">
                  الهاتف
                </span>
                <div className="font-bold mt-1">
                  {invoiceModalData.phone || '-'}
                </div>
              </div>

              <div>
                <span className="text-neutral-500">
                  المناسبة
                </span>
                <div className="font-bold mt-1">
                  {invoiceModalData.eventType || '-'}
                </div>
              </div>

              <div>
                <span className="text-neutral-500">
                  التاريخ
                </span>
                <div className="font-bold mt-1">
                  {invoiceModalData.eventDate || '-'}
                </div>
              </div>

              <div>
                <span className="text-neutral-500">
                  الوقت
                </span>
                <div className="font-bold mt-1">
                  {invoiceModalData.eventTime || '-'}
                </div>
              </div>

              <div className="col-span-2">
                <span className="text-neutral-500">
                  المكان
                </span>
                <div className="font-bold mt-1">
                  {invoiceModalData.venue || '-'}
                </div>
              </div>

              <div>
                <span className="text-neutral-500">
                  الحالة
                </span>
                <div className="font-bold mt-1">
                  {invoiceModalData.status || 'new'}
                </div>
              </div>

              <div>
                <span className="text-neutral-500">
                  رقم الحجز
                </span>
                <div className="font-bold mt-1">
                  #{String(invoiceModalData.id || '').slice(-6)}
                </div>
              </div>

            </div>

            <div className="border-t border-neutral-200 mt-8 pt-5 flex justify-between items-center">

              <span className="text-sm text-neutral-500">
                IBRA PRODUCTION
              </span>

              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-bold"
              >
                طباعة
              </button>

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

              <input
                placeholder="رابط صورة العمل"
                value={portfolioModal.image || ''}
                onChange={e =>
                  setPortfolioModal({
                    ...portfolioModal,
                    image: e.target.value
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

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
                    !portfolioModal.image
                  ) {
                    alert(
                      'يرجى إدخال عنوان العمل ورابط الصورة على الأقل.'
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
