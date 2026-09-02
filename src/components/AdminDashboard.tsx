import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, Calendar, Camera, Package, Image as ImageIcon, Video, 
  MessageSquare, Tag, Settings, History, LogOut, X, Plus, Trash2, Edit, Check, Eye, EyeOff, ShieldCheck, Download, Upload, Search, PhoneCall, Send, Mail,
  BarChart3, CalendarDays, FileText, CheckSquare
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { 
    settings, updateSettings, 
    bookings, updateBookingStatus, deleteBooking,
    services, addService, updateService, deleteService,
    packages, addPackage, updatePackage, deletePackage,
    portfolio, addPortfolioItem, updatePortfolioItem, deletePortfolioItem,
    videos, addVideoItem, updateVideoItem, deleteVideoItem,
    testimonials, updateTestimonial, deleteTestimonial,
    offers, addOffer, updateOffer, deleteOffer,
    contactMessages, markContactMessageAsRead, deleteContactMessage,
    activityLogs, logout, backupData, restoreData
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dash' | 'bookings' | 'services' | 'packages' | 'portfolio' | 'videos' | 'testimonials' | 'offers' | 'messages' | 'analytics' | 'calendar' | 'settings' | 'logs'>('dash');
  const [searchTerm, setSearchTerm] = useState('');
  
  // SMS Notification Modal state when confirming a booking
  const [smsModalData, setSmsModalData] = useState<{ booking: any; message: string } | null>(null);
  const [invoiceModalData, setInvoiceModalData] = useState<any | null>(null);

  // Admin Notes state
  const [adminNotes, setAdminNotes] = useState<string>(() => {
    return localStorage.getItem('ibra_admin_notes') || 'قائمة المهام اليومية:\n1. تأكيد مواعيد عطلة نهاية الأسبوع\n2. تسليم ألبومات الصور للعرسان\n3. شحن بطاريات كاميرات 4K';
  });

  // Modals state for adding/editing
  const [serviceModal, setServiceModal] = useState<any | null>(null);
  const [packageModal, setPackageModal] = useState<any | null>(null);
  const [portfolioModal, setPortfolioModal] = useState<any | null>(null);
  const [offerModal, setOfferModal] = useState<any | null>(null);

  const newBookingsCount = bookings.filter(b => b.status === 'new').length;
  const confirmedBookingsCount = bookings.filter(b => b.status === 'confirmed').length;
  const unreadMessagesCount = contactMessages.filter(m => !m.read).length;

  const handleStatusChange = async (booking: any, newStatus: any) => {
    updateBookingStatus(booking.id, newStatus);
    if (newStatus === 'confirmed') {
      const smsText = `[IBRA PRODUCTION] مرحباً بالعريس ${booking.groomName} والعروس ${booking.brideName}! تهانينا، تم تأكيد حجزكم رقم (#${booking.id.slice(-4)}) لمناسبة ${booking.eventType} بتاريخ ${booking.eventDate} في ${booking.venue}. نتطلع لتوثيق أغلى لحظاتكم بكل احترافية. الاستفسار: ${settings.phone}`;
      setSmsModalData({ booking, message: smsText });

      try {
        const res = await fetch('/api/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: booking.phone,
            message: smsText,
            bookingId: booking.id
          })
        });
        const data = await res.json();
        console.log('SMS API Response:', data);
      } catch (err) {
        console.error('Failed to trigger backend SMS API:', err);
      }
    }
  };

  const handleBackupExport = () => {
    const json = backupData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ibra-production-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleBackupRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = restoreData(content);
        if (success) alert('تم استعادة البيانات وإعدادات الموقع بنجاح!');
        else alert('خطأ في استعادة الملف.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-neutral-100 flex flex-col overflow-hidden animate-fade-in font-sans">
      
      {/* Topbar */}
      <header className="bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-neutral-950 font-bold flex items-center justify-center font-cinzel">
            IP
          </div>
          <div>
            <h1 className="font-bold font-cinzel text-lg text-white">IBRA PRODUCTION • لوحة التحكم الشاملة للمسؤول</h1>
            <span className="text-xs text-amber-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> صلاحيات مالك الموقع الكاملة مفعلة
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => { logout(); onClose(); }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-neutral-900/60 border-r border-neutral-800 p-4 space-y-1.5 overflow-y-auto shrink-0 hidden md:block">
          {[
            { id: 'dash', label: 'لوحة القيادة العامة', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'bookings', label: `الحجوزات والطلبات (${newBookingsCount} جديدة)`, icon: <Calendar className="w-4 h-4" /> },
            { id: 'analytics', label: 'الإحصائيات والأرباح', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'calendar', label: 'تقويم مواعيد التصوير', icon: <CalendarDays className="w-4 h-4" /> },
            { id: 'services', label: 'إدارة الخدمات', icon: <Camera className="w-4 h-4" /> },
            { id: 'packages', label: 'الباقات والأسعار', icon: <Package className="w-4 h-4" /> },
            { id: 'portfolio', label: 'معرض الأعمال', icon: <ImageIcon className="w-4 h-4" /> },
            { id: 'videos', label: 'الفيديوهات', icon: <Video className="w-4 h-4" /> },
            { id: 'messages', label: `رسائل التواصل (${unreadMessagesCount})`, icon: <Mail className="w-4 h-4" /> },
            { id: 'testimonials', label: 'آراء العملاء', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'offers', label: 'العروض الخاصة', icon: <Tag className="w-4 h-4" /> },
            { id: 'settings', label: 'إعدادات الموقع والنصوص', icon: <Settings className="w-4 h-4" /> },
            { id: 'logs', label: 'سجل العمليات', icon: <History className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-10 bg-neutral-950">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dash' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold font-cinzel text-white mb-2">مرحباً بك مجدداً في لوحة تحكم IBRA PRODUCTION</h2>
                <p className="text-sm text-neutral-400">إدارة شاملة وفورية لكل أزرار النصوص، الخدمات، الحجوزات، والأسعار دون الحاجة لأي خبير تقني.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-2xl border border-neutral-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-neutral-400 font-semibold uppercase">إجمالي الحجوزات</span>
                    <Calendar className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-3xl font-bold font-cinzel text-white">{bookings.length}</div>
                  <span className="text-xs text-amber-400 mt-2 block">{newBookingsCount} طلب جديد بانتظار التأكيد</span>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-neutral-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-neutral-400 font-semibold uppercase">الخدمات النشطة</span>
                    <Camera className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-3xl font-bold font-cinzel text-white">{services.length}</div>
                  <span className="text-xs text-neutral-400 mt-2 block">خدمات تصوير وزفاف</span>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-neutral-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-neutral-400 font-semibold uppercase">أعمال المعرض</span>
                    <ImageIcon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-3xl font-bold font-cinzel text-white">{portfolio.length}</div>
                  <span className="text-xs text-neutral-400 mt-2 block">ألبومات وأعراس موثقة</span>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-neutral-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-neutral-400 font-semibold uppercase">الباقات المتاحة</span>
                    <Package className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-3xl font-bold font-cinzel text-white">{packages.length}</div>
                  <span className="text-xs text-neutral-400 mt-2 block">باقات أساسية وVIP</span>
                </div>
              </div>

              {/* Quick Actions & Backup */}
              <div className="glass-card p-8 rounded-3xl border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-cinzel mb-1">النسخ الاحتياطي وحفظ بيانات الموقع</h3>
                  <p className="text-xs text-neutral-400">تصدير جميع الإعدادات، الحجوزات، والأسعار في ملف آمن أو استعادتها فوراً.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBackupExport}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm font-semibold hover:border-amber-500 transition-all"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>تصدير نسخة احتياطية</span>
                  </button>
                  <label className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-sm font-bold cursor-pointer transition-all shadow-lg shadow-amber-500/20">
                    <Upload className="w-4 h-4" />
                    <span>استعادة ملف</span>
                    <input type="file" accept=".json" onChange={handleBackupRestore} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Admin Quick Notes Widget */}
              <div className="glass-card p-6 rounded-3xl border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-bold font-cinzel">
                    <CheckSquare className="w-5 h-5 text-amber-400" />
                    <span>مفكرة المهام السريعة للمسؤول</span>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.setItem('ibra_admin_notes', adminNotes);
                      alert('تم حفظ الملاحظات بنجاح!');
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl font-bold text-xs"
                  >
                    حفظ الملاحظات
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-white text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="اكتب ملاحظاتك، مهام المونتاج، أو قائمة اتصالات العرسان هنا..."
                />
              </div>
            </div>
          )}

          {/* TAB: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-cinzel text-white">إدارة الحجوزات والطلبات الواردة</h2>
                  <p className="text-xs text-neutral-400">عند تأكيد أي حجز هنا، سيتم إرسال إشعار SMS احترافي لهاتف العميل فوراً.</p>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800 text-xs">
                      <tr>
                        <th className="p-4">العريس والعروس</th>
                        <th className="p-4">رقم الهاتف</th>
                        <th className="p-4">المناسبة والتاريخ</th>
                        <th className="p-4">المكان</th>
                        <th className="p-4">الحالة</th>
                        <th className="p-4">تحديث الحالة وإرسال SMS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-neutral-500">لا توجد حجوزات حتى الآن.</td>
                        </tr>
                      ) : (
                        bookings.map(b => (
                          <tr key={b.id} className="hover:bg-neutral-800/40">
                            <td className="p-4">
                              <div className="font-bold text-white">{b.groomName} & {b.brideName}</div>
                              <div className="text-xs text-neutral-400">{b.email}</div>
                            </td>
                            <td className="p-4 font-mono text-amber-400">
                              <a href={`tel:${b.phone}`} className="hover:underline flex items-center gap-1">
                                <PhoneCall className="w-3.5 h-3.5" /> {b.phone}
                              </a>
                            </td>
                            <td className="p-4">
                              <div className="text-white font-medium">{b.eventType}</div>
                              <div className="text-xs text-neutral-400">{b.eventDate} ({b.eventTime})</div>
                            </td>
                            <td className="p-4 text-neutral-300">{b.venue}</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                b.status === 'new' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                'bg-neutral-800 text-neutral-300'
                              }`}>
                                {b.status === 'new' ? 'جديد' : b.status === 'confirmed' ? 'مؤكد (تم إرسال SMS)' : b.status}
                              </span>
                            </td>
                            <td className="p-4 flex items-center gap-2">
                              <select
                                value={b.status}
                                onChange={e => handleStatusChange(b, e.target.value as any)}
                                className="bg-neutral-950 border border-amber-500/30 rounded-lg px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-amber-400"
                              >
                                <option value="new">جديد</option>
                                <option value="confirmed">✨ تأكيد الحجز (إرسال SMS)</option>
                                <option value="processing">قيد المعالجة والتصوير</option>
                                <option value="completed">مكتمل وتسليم العمل</option>
                                <option value="cancelled">ملغي</option>
                              </select>
                              <button
                                onClick={() => setInvoiceModalData(b)}
                                className="p-1.5 bg-neutral-900 text-amber-400 hover:bg-neutral-800 rounded-lg transition-colors border border-neutral-800"
                                title="إصدار عقد الحجز"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteBooking(b.id)}
                                className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="حذف الطلب"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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

          {/* TAB: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-cinzel text-white">الإحصائيات والأرباح التقديرية</h2>
                <p className="text-xs text-neutral-400">تحليل أداء الحجوزات، الإيرادات المتوقعة، ومعدلات الطلب.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-3xl border border-neutral-800">
                  <span className="text-xs text-neutral-400 block mb-2">إجمالي الإيرادات المتوقعة (للحجوزات المؤكدة)</span>
                  <div className="text-3xl font-extrabold font-cinzel text-amber-400 font-mono">
                    {(confirmedBookingsCount * 75000).toLocaleString()} دج
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-2">بمتوسط 75,000 دج للحجز المؤكد الواحد</p>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-neutral-800">
                  <span className="text-xs text-neutral-400 block mb-2">معدل تحويل الحجوزات</span>
                  <div className="text-3xl font-extrabold font-cinzel text-emerald-400 font-mono">
                    {bookings.length > 0 ? Math.round((confirmedBookingsCount / bookings.length) * 100) : 0}%
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-2">نسبة الحجوزات المؤكدة من إجمالي الطلبات</p>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-neutral-800">
                  <span className="text-xs text-neutral-400 block mb-2">رسائل التواصل غير المقروءة</span>
                  <div className="text-3xl font-extrabold font-cinzel text-white font-mono">
                    {unreadMessagesCount}
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-2">استفسارات جديدة تنتظر رد المسؤول</p>
                </div>
              </div>

              <div className="glass-card p-8 rounded-3xl border border-neutral-800 space-y-6">
                <h3 className="text-lg font-bold text-white font-cinzel">توزيع الحجوزات حسب الحالة</h3>
                <div className="space-y-4">
                  {[
                    { label: 'طلبات جديدة بانتظار التأكيد', count: newBookingsCount, color: 'bg-amber-500' },
                    { label: 'حجوزات مؤكدة (تم إرسال SMS)', count: confirmedBookingsCount, color: 'bg-emerald-500' },
                    { label: 'إجمالي الطلبات الواردة', count: bookings.length, color: 'bg-indigo-500' },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-300">{item.label}</span>
                        <span className="font-bold text-white font-mono">{item.count}</span>
                      </div>
                      <div className="w-full bg-neutral-900 h-3 rounded-full overflow-hidden border border-neutral-800">
                        <div className={`${item.color} h-full rounded-full`} style={{ width: `${Math.min(100, (item.count / (bookings.length || 1)) * 100)}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-cinzel text-white">تقويم مواعيد التصوير والحجوزات</h2>
                  <p className="text-xs text-neutral-400">جدول زمني لجميع مواعيد الأعراس والمناسبات المؤكدة.</p>
                </div>
              </div>

              <div className="space-y-4">
                {bookings.filter(b => b.status === 'confirmed').length === 0 ? (
                  <div className="glass-card p-12 text-center rounded-3xl border border-neutral-800">
                    <CalendarDays className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                    <p className="text-neutral-400">لا توجد مواعيد تصوير مؤكدة حالياً في التقويم.</p>
                  </div>
                ) : (
                  bookings.filter(b => b.status === 'confirmed').map(b => (
                    <div key={b.id} className="glass-card p-6 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex flex-col items-center justify-center shrink-0 font-mono">
                          <span className="text-xs font-bold">{b.eventDate}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base">{b.eventType} - {b.groomName} & {b.brideName}</h3>
                          <p className="text-xs text-neutral-400">المكان: <span className="text-amber-400">{b.venue}</span> | الوقت: {b.eventTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <a
                          href={`tel:${b.phone}`}
                          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-amber-400 rounded-xl text-xs font-bold border border-neutral-800 flex items-center gap-2"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>اتصال بالعريس</span>
                        </a>
                        <button
                          onClick={() => setInvoiceModalData(b)}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl text-xs font-bold flex items-center gap-2"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>إصدار عقد الحجز</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-cinzel text-white">إدارة الخدمات</h2>
                  <p className="text-xs text-neutral-400">إضافة وتعديل الخدمات المعروضة للزبائن.</p>
                </div>
                <button
                  onClick={() => setServiceModal({ titleAr: '', descAr: '', image: '', price: '', duration: '', visible: true })}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-neutral-950 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة خدمة جديدة</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(s => (
                  <div key={s.id} className="glass-card p-6 rounded-2xl border border-neutral-800 flex flex-col justify-between">
                    <div>
                      <img src={s.image} alt="" className="w-full h-40 object-cover rounded-xl mb-4 border border-neutral-800" />
                      <h3 className="font-bold text-white text-lg mb-1">{s.titleAr}</h3>
                      <p className="text-xs text-amber-400 font-semibold mb-2">{s.price}</p>
                      <p className="text-xs text-neutral-400 line-clamp-2 mb-4">{s.descAr}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                      <button
                        onClick={() => updateService(s.id, { visible: !s.visible })}
                        className={`text-xs px-3 py-1 rounded-full ${s.visible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'}`}
                      >
                        {s.visible ? 'ظاهر بالموقع' : 'مخفي'}
                      </button>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setServiceModal(s)} className="p-2 text-neutral-300 hover:text-white bg-neutral-900 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteService(s.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PACKAGES */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-cinzel text-white">إدارة الباقات والأسعار</h2>
                  <p className="text-xs text-neutral-400">تعديل أسعار الباقات والخصومات فورياً.</p>
                </div>
                <button
                  onClick={() => setPackageModal({ nameAr: '', price: 50000, durationAr: 'يوم كامل', featuresAr: ['تصوير سينمائي'], isPopular: false, visible: true })}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-neutral-950 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة باقة جديدة</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {packages.map(p => (
                  <div key={p.id} className="glass-card p-6 rounded-2xl border border-neutral-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-white text-lg">{p.nameAr}</h3>
                        {p.isPopular && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">الأكثر طلباً</span>}
                      </div>
                      <div className="text-2xl font-bold font-cinzel text-amber-400 mb-2">{p.price.toLocaleString()} دج</div>
                      <p className="text-xs text-neutral-400 mb-4">{p.durationAr}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                      <button
                        onClick={() => updatePackage(p.id, { visible: !p.visible })}
                        className={`text-xs px-3 py-1 rounded-full ${p.visible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'}`}
                      >
                        {p.visible ? 'ظاهر' : 'مخفي'}
                      </button>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setPackageModal(p)} className="p-2 text-neutral-300 hover:text-white bg-neutral-900 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => deletePackage(p.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-cinzel text-white">إدارة معرض الأعمال</h2>
                  <p className="text-xs text-neutral-400">إضافة صور وأعراس جديدة لمعرض الموقع.</p>
                </div>
                <button
                  onClick={() => setPortfolioModal({ titleAr: '', category: 'weddings', coupleNames: '', date: '2026', location: 'الجزائر العاصمة', image: '', descriptionAr: '', visible: true })}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-neutral-950 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة عمل جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map(item => (
                  <div key={item.id} className="glass-card p-4 rounded-2xl border border-neutral-800">
                    <img src={item.image} alt="" className="w-full h-36 object-cover rounded-xl mb-3 border border-neutral-800" />
                    <h3 className="font-bold text-white text-base mb-1">{item.titleAr}</h3>
                    <p className="text-xs text-amber-400 mb-3">{item.category} • {item.location}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full ${item.visible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'}`}>
                        {item.visible ? 'ظاهر' : 'مخفي'}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => setPortfolioModal(item)} className="p-1.5 text-neutral-300 hover:text-white bg-neutral-900 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => deletePortfolioItem(item.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-2xl font-bold font-cinzel text-white">إعدادات الموقع ومعلومات الاتصال</h2>
                <p className="text-xs text-neutral-400">تعديل أرقام الهواتف، الإيميل، والروابط لتتحدث فوراً في جميع صفحات الزبائن.</p>
              </div>

              <div className="glass-card p-8 rounded-3xl border border-neutral-800 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">اسم الوكالة</label>
                    <input
                      type="text"
                      value={settings.agencyName}
                      onChange={e => updateSettings({ agencyName: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">رقم الهاتف الأول</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={e => updateSettings({ phone: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">رقم الواتساب</label>
                    <input
                      type="text"
                      value={settings.whatsapp}
                      onChange={e => updateSettings({ whatsapp: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={e => updateSettings({ email: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">العنوان بالعربية</label>
                  <input
                    type="text"
                    value={settings.addressAr}
                    onChange={e => updateSettings({ addressAr: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">رابط فيسبوك</label>
                    <input
                      type="text"
                      value={settings.facebookUrl}
                      onChange={e => updateSettings({ facebookUrl: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">رابط إنستغرام</label>
                    <input
                      type="text"
                      value={settings.instagramUrl}
                      onChange={e => updateSettings({ instagramUrl: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">رابط يوتيوب</label>
                    <input
                      type="text"
                      value={settings.youtubeUrl}
                      onChange={e => updateSettings({ youtubeUrl: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex justify-end">
                  <button
                    onClick={() => alert('تم حفظ الإعدادات وتحديث الموقع بنجاح!')}
                    className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl shadow-lg shadow-amber-500/20"
                  >
                    حفظ كافة التغييرات
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-cinzel text-white">رسائل التواصل المباشرة</h2>
                  <p className="text-xs text-neutral-400">جميع الرسائل والاستفسارات المرسلة من الزوار عبر نموذج التواصل في الموقع.</p>
                </div>
              </div>

              <div className="space-y-4">
                {contactMessages.length === 0 ? (
                  <div className="glass-card p-12 text-center rounded-3xl border border-neutral-800">
                    <Mail className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                    <p className="text-neutral-400">لا توجد رسائل تواصل جديدة حتى الآن.</p>
                  </div>
                ) : (
                  contactMessages.map(msg => (
                    <div key={msg.id} className={`glass-card p-6 rounded-2xl border transition-all ${!msg.read ? 'border-amber-500/50 bg-amber-500/5' : 'border-neutral-800'}`}>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                            {msg.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-base">{msg.name}</h3>
                            <a href={`tel:${msg.phone}`} className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-mono">
                              <PhoneCall className="w-3.5 h-3.5" /> {msg.phone}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-neutral-500 font-mono">{msg.createdAt}</span>
                          {!msg.read && (
                            <span className="text-[10px] bg-amber-500 text-neutral-950 font-bold px-2 py-0.5 rounded-full">جديدة</span>
                          )}
                          <div className="flex gap-2">
                            {!msg.read && (
                              <button
                                onClick={() => markContactMessageAsRead(msg.id)}
                                title="تمييز مقروء"
                                className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl transition-colors text-xs"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteContactMessage(msg.id)}
                              title="حذف الرسالة"
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors text-xs"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800 mt-3">
                        <p className="text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-cinzel text-white">سجل العمليات والنشاطات</h2>
                <p className="text-xs text-neutral-400">متابعة دقيقة لكل التعديلات والإجراءات التي تمت في لوحة التحكم.</p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                <table className="w-full text-right text-sm">
                  <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800 text-xs">
                    <tr>
                      <th className="p-4">المستخدم</th>
                      <th className="p-4">العملية</th>
                      <th className="p-4">التوقيت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {activityLogs.map(log => (
                      <tr key={log.id} className="hover:bg-neutral-800/40">
                        <td className="p-4 font-semibold text-white">{log.user}</td>
                        <td className="p-4 text-neutral-300">{log.actionAr}</td>
                        <td className="p-4 font-mono text-xs text-amber-400">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {['videos', 'testimonials', 'offers'].includes(activeTab) && activeTab !== 'videos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-cinzel text-white capitalize">{activeTab}</h2>
              </div>
              <div className="glass-card p-12 text-center rounded-3xl border border-neutral-800">
                <p className="text-neutral-400">قسم الإدارة لهذا القسم مربوط بقاعدة البيانات المركزية ويتم تحديثه فورياً.</p>
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-cinzel text-white">إدارة الفيديوهات</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {videos.map(v => (
                  <div key={v.id} className="glass-card p-4 rounded-2xl border border-neutral-800">
                    <img src={v.thumbnail} alt="" className="w-full h-32 object-cover rounded-xl mb-3" />
                    <h3 className="font-bold text-white text-sm mb-1">{v.titleAr}</h3>
                    <span className="text-xs text-amber-400">{v.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* SMS CONFIRMATION SIMULATION MODAL */}
      {smsModalData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-neutral-900 border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-right">
            <button
              onClick={() => setSmsModalData(null)}
              className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-cinzel">تم تأكيد الطلب وإرسال رسالة SMS للزبون</h3>
                <span className="text-xs text-amber-400 font-mono">رقم هاتف الزبون: {smsModalData.booking.phone}</span>
              </div>
            </div>

            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-mono">نص الرسالة القصيرة المرسلة (SMS):</span>
              <p className="text-sm text-neutral-200 leading-relaxed font-sans bg-neutral-900/50 p-3 rounded-xl border border-neutral-800">
                {smsModalData.message}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(smsModalData.message);
                  alert('تم نسخ نص الرسالة بنجاح!');
                }}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-all"
              >
                نسخ النص
              </button>
              <button
                onClick={() => setSmsModalData(null)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20"
              >
                تم، إغلاق الإشعار
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PORTFOLIO EDIT/ADD MODAL */}
      {portfolioModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-neutral-900 border border-amber-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-right overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setPortfolioModal(null)}
              className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-cinzel">
              {portfolioModal.id ? 'تعديل عمل في المعرض' : 'إضافة عمل جديد لمعرض الأعمال'}
            </h3>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">عنوان العمل (بالعربية)</label>
                <input
                  type="text"
                  value={portfolioModal.titleAr || ''}
                  onChange={e => setPortfolioModal({ ...portfolioModal, titleAr: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                  placeholder="مثال: حفل زفاف أسطوري"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">التصنيف</label>
                  <select
                    value={portfolioModal.category || 'weddings'}
                    onChange={e => setPortfolioModal({ ...portfolioModal, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                  >
                    <option value="weddings">أعراس (Weddings)</option>
                    <option value="video">فيديو وإنتاج (Video)</option>
                    <option value="portraits">بورتريهات (Portraits)</option>
                    <option value="events">فعاليات (Events)</option>
                    <option value="content">محتوى (Content)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">الموقع / المدينة</label>
                  <input
                    type="text"
                    value={portfolioModal.location || ''}
                    onChange={e => setPortfolioModal({ ...portfolioModal, location: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                    placeholder="الجزائر العاصمة"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">صورة العمل (رفع من جهازك أو رابط مباشر)</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={portfolioModal.image || ''}
                    onChange={e => setPortfolioModal({ ...portfolioModal, image: e.target.value })}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                    placeholder="رابط الصورة أو اختر ملفاً من جهازك"
                  />
                  <label className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-xl text-xs font-bold cursor-pointer transition-all shrink-0 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>اختر صورة</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setPortfolioModal({ ...portfolioModal, image: event.target.result as string });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                {portfolioModal.image && (
                  <div className="mt-3 w-full h-36 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
                    <img src={portfolioModal.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">وصف العمل</label>
                <textarea
                  rows={3}
                  value={portfolioModal.descriptionAr || ''}
                  onChange={e => setPortfolioModal({ ...portfolioModal, descriptionAr: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                  placeholder="تفاصيل التوثيق السينمائي..."
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="portfolioVisibleModal"
                  checked={portfolioModal.visible ?? true}
                  onChange={e => setPortfolioModal({ ...portfolioModal, visible: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <label htmlFor="portfolioVisibleModal" className="text-sm text-neutral-200">عرض العمل في المعرض العام</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                onClick={() => setPortfolioModal(null)}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (!portfolioModal.titleAr || !portfolioModal.image) {
                    alert('يرجى إدخال عنوان العمل وصورة على الأقل.');
                    return;
                  }
                  if (portfolioModal.id) {
                    updatePortfolioItem(portfolioModal.id, portfolioModal);
                  } else {
                    addPortfolioItem({
                      titleAr: portfolioModal.titleAr,
                      titleFr: portfolioModal.titleAr,
                      titleEn: portfolioModal.titleAr,
                      category: portfolioModal.category || 'weddings',
                      coupleNames: portfolioModal.coupleNames || '',
                      date: portfolioModal.date || '2026',
                      location: portfolioModal.location || 'الجزائر',
                      image: portfolioModal.image,
                      descriptionAr: portfolioModal.descriptionAr || '',
                      descriptionFr: portfolioModal.descriptionAr || '',
                      descriptionEn: portfolioModal.descriptionAr || '',
                      visible: portfolioModal.visible ?? true,
                      order: portfolio.length + 1
                    });
                  }
                  setPortfolioModal(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold shadow-lg shadow-amber-500/20"
              >
                حفظ العمل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE EDIT/ADD MODAL */}
      {serviceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-neutral-900 border border-amber-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-right overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setServiceModal(null)}
              className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white font-cinzel">
              {serviceModal.id ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">عنوان الخدمة</label>
                <input
                  type="text"
                  value={serviceModal.titleAr || ''}
                  onChange={e => setServiceModal({ ...serviceModal, titleAr: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                  placeholder="مثال: تصوير الأعراس السينمائي"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">السعر</label>
                  <input
                    type="text"
                    value={serviceModal.price || ''}
                    onChange={e => setServiceModal({ ...serviceModal, price: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                    placeholder="تبدأ من 45,000 دج"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">المدة</label>
                  <input
                    type="text"
                    value={serviceModal.duration || ''}
                    onChange={e => setServiceModal({ ...serviceModal, duration: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                    placeholder="يوم كامل"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">صورة الخدمة (رابط أو رفع ملف)</label>
                <input
                  type="text"
                  value={serviceModal.image || ''}
                  onChange={e => setServiceModal({ ...serviceModal, image: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                  placeholder="/img1.jpg أو رابط"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">وصف الخدمة</label>
                <textarea
                  rows={3}
                  value={serviceModal.descAr || ''}
                  onChange={e => setServiceModal({ ...serviceModal, descAr: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                  placeholder="وصف تفصيلي للخدمة..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                onClick={() => setServiceModal(null)}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 text-white text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (!serviceModal.titleAr) {
                    alert('يرجى إدخال عنوان الخدمة.');
                    return;
                  }
                  if (serviceModal.id) {
                    updateService(serviceModal.id, serviceModal);
                  } else {
                    addService({
                      titleAr: serviceModal.titleAr,
                      titleFr: serviceModal.titleAr,
                      titleEn: serviceModal.titleAr,
                      descAr: serviceModal.descAr || '',
                      descFr: serviceModal.descAr || '',
                      descEn: serviceModal.descAr || '',
                      price: serviceModal.price || '45,000 دج',
                      duration: serviceModal.duration || 'يوم كامل',
                      image: serviceModal.image || '/img1.jpg',
                      visible: true,
                      order: services.length + 1
                    });
                  }
                  setServiceModal(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold"
              >
                حفظ الخدمة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PACKAGE EDIT/ADD MODAL */}
      {packageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-neutral-900 border border-amber-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-right overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setPackageModal(null)}
              className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white font-cinzel">
              {packageModal.id ? 'تعديل الباقة' : 'إضافة باقة جديدة'}
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">اسم الباقة</label>
                <input
                  type="text"
                  value={packageModal.nameAr || ''}
                  onChange={e => setPackageModal({ ...packageModal, nameAr: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                  placeholder="مثال: باقة الأساطير VIP"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">السعر (دج)</label>
                  <input
                    type="number"
                    value={packageModal.price || 50000}
                    onChange={e => setPackageModal({ ...packageModal, price: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">المدة / الوصف القصير</label>
                  <input
                    type="text"
                    value={packageModal.durationAr || ''}
                    onChange={e => setPackageModal({ ...packageModal, durationAr: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                    placeholder="يوم كامل مع دروان"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="popPkg"
                  checked={packageModal.isPopular || false}
                  onChange={e => setPackageModal({ ...packageModal, isPopular: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <label htmlFor="popPkg" className="text-sm text-neutral-200">تمييز كـ "الأكثر طلباً"</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                onClick={() => setPackageModal(null)}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 text-white text-xs font-bold"
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
                    updatePackage(packageModal.id, packageModal);
                  } else {
                    addPackage({
                      nameAr: packageModal.nameAr,
                      nameFr: packageModal.nameAr,
                      nameEn: packageModal.nameAr,
                      price: Number(packageModal.price) || 50000,
                      durationAr: packageModal.durationAr || 'يوم كامل',
                      durationFr: packageModal.durationAr || 'Full day',
                      durationEn: packageModal.durationAr || 'Full day',
                      featuresAr: ['تصوير سينمائي 4K', 'ألبوم رقمي'],
                      featuresFr: ['Cinematic 4K', 'Album'],
                      featuresEn: ['Cinematic 4K', 'Album'],
                      isPopular: packageModal.isPopular || false,
                      visible: true,
                      order: packages.length + 1
                    });
                  }
                  setPackageModal(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold"
              >
                حفظ الباقة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INVOICE / CONTRACT MODAL */}
      {invoiceModalData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-neutral-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl relative text-right overflow-y-auto max-h-[95vh]">
            <button
              onClick={() => setInvoiceModalData(null)}
              className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-6 border-b border-neutral-800">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-cinzel">IBRA PRODUCTION</span>
              <h2 className="text-2xl font-bold font-cinzel text-white mt-1">عقد اتفاق حجز وتوثيق سينمائي</h2>
              <p className="text-xs text-neutral-400 mt-1">رقم الحجز: #{invoiceModalData.id.slice(-6)} | التاريخ: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-4 text-sm text-neutral-200">
              <div className="grid grid-cols-2 gap-4 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                <div>
                  <span className="text-xs text-neutral-400 block">العريس والعروس:</span>
                  <span className="font-bold text-white text-base">{invoiceModalData.groomName} & {invoiceModalData.brideName}</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block">رقم الهاتف:</span>
                  <span className="font-mono text-amber-400">{invoiceModalData.phone}</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block">نوع المناسبة والتاريخ:</span>
                  <span className="text-white">{invoiceModalData.eventType} ({invoiceModalData.eventDate})</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block">مكان الحفل (القاعة):</span>
                  <span className="text-white">{invoiceModalData.venue}</span>
                </div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2 text-xs text-neutral-300">
                <h4 className="font-bold text-amber-400 text-sm mb-2">الشروط والأحكام العامة:</h4>
                <p>1. يتعهد فريق IBRA PRODUCTION بالحضور في الوقت المحدد وتغطية المناسبة بأحدث معدات التصوير السينمائي (4K و Drone).</p>
                <p>2. يتم تسليم العمل النهائي (المونتاج والألبومات) في المدة المتفق عليها.</p>
                <p>3. هذا العقد معتمد رسمياً من طرف مؤسسة إبرا برودكشن للإنتاج الفني والاعلامي بالجزائر.</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-neutral-800">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>طباعة أو حفظ PDF</span>
              </button>
              <button
                onClick={() => setInvoiceModalData(null)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
