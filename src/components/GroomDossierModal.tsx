import React, { useState } from 'react';
import { IbraEvent, EventPaymentItem } from '../types';
import { useApp } from '../context/AppContext';
import { BarcodeCard, SvgBarcode, SvgQrCode } from './BarcodeCard';
import { 
  X, Phone, MessageSquare, Printer, ExternalLink, Calendar, MapPin, 
  DollarSign, CheckCircle2, Clock, Users, HardDrive, FileText, Plus, 
  Sparkles, Camera, Video, ShieldCheck, Heart, UploadCloud, AlertCircle
} from 'lucide-react';

interface GroomDossierModalProps {
  event: IbraEvent;
  onClose: () => void;
  onNavigateToPortal?: (eventId: string) => void;
}

export const GroomDossierModal: React.FC<GroomDossierModalProps> = ({ 
  event, 
  onClose,
  onNavigateToPortal
}) => {
  const { teamMembers, addPaymentToEvent, updateEvent } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'finance' | 'services' | 'timeline' | 'team'>('overview');
  
  // Quick payment form state
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(30000);
  const [payMethod, setPayMethod] = useState<'CASH' | 'BANK' | 'OTHER'>('CASH');
  const [payNote, setPayNote] = useState('دفعة سداد إضافية');

  const remaining = Math.max(0, event.totalPrice - event.totalPaid);
  const percentPaid = event.totalPrice > 0 ? Math.min(100, Math.round((event.totalPaid / event.totalPrice) * 100)) : 100;

  // Resolve team members
  const assignedTeamObjects = (event.assignedTeam || [])
    .map(id => teamMembers.find(t => t.id === id))
    .filter(Boolean);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `مرحباً بالعريس ${event.groomName}! معك إدارة استوديو IBRA PRODUCTION بخصوص مناسبتكم (${event.eventId}) المقررة بتاريخ ${event.eventDate}. رابط بوابتكم الرقمية: https://ibraprod.online/my-event?id=${event.eventId}`
    );
    const cleanPhone = event.phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? '213' + cleanPhone.slice(1) : cleanPhone;
    window.open(`https://wa.me/${intlPhone}?text=${text}`, '_blank');
  };

  const handleAddPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;

    addPaymentToEvent(event.eventId, {
      eventId: event.eventId,
      amount: payAmount,
      date: new Date().toISOString().split('T')[0],
      method: payMethod,
      note: payNote,
      receiptNumber: `REC-${event.eventId.replace(/[^0-9]/g, '')}-${Date.now().toString().slice(-3)}`
    });

    setShowAddPayment(false);
  };

  const handleStatusChange = (newStatus: any) => {
    updateEvent(event.eventId, { status: newStatus });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in font-sans">
      <div className="bg-neutral-900 border border-amber-500/30 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-amber-500/10 text-neutral-100 overflow-hidden print:max-h-none print:shadow-none print:border-none print:bg-white print:text-black">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-b border-amber-500/20 px-6 py-4 flex items-center justify-between shrink-0 print:border-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-neutral-950 font-bold font-cinzel flex items-center justify-center text-sm shadow-md">
              IP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold font-cinzel text-lg sm:text-xl text-white">
                  الملف الشامل للعريس • {event.groomName} <span className="text-amber-400 font-sans">×</span> {event.brideName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {event.eventId}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                IBRA PRODUCTION Event Management Dossier & Verification System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              title="طباعة الملف الشامل"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-neutral-950/80 px-6 py-3 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`tel:${event.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>اتصال: {event.phone}</span>
            </a>

            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-semibold transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>واتساب العريس</span>
            </button>

            {onNavigateToPortal && (
              <button
                onClick={() => {
                  onNavigateToPortal(event.eventId);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>فتح بوابة العميل</span>
              </button>
            )}
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">حالة المناسبة:</span>
            <select
              value={event.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-neutral-900 border border-amber-500/30 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-semibold focus:outline-none"
            >
              <option value="CONFIRMED">مؤكدة (CONFIRMED)</option>
              <option value="IN_PROGRESS">قيد التنفيذ الميداني</option>
              <option value="COMPLETED">مكتملة ومسلّمة</option>
              <option value="PENDING">قيد المراجعة</option>
              <option value="CANCELLED">ملغاة</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 px-6 shrink-0 bg-neutral-900/60 print:hidden overflow-x-auto">
          {[
            { id: 'overview', label: 'نظرة شاملة والباركود' },
            { id: 'finance', label: `المالية والدفعات (${percentPaid}%)` },
            { id: 'services', label: 'الخدمات والباقة' },
            { id: 'timeline', label: `الجدول الزمني (${event.timeline?.length || 0})` },
            { id: 'team', label: `الفريق المعين (${assignedTeamObjects.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: OVERVIEW & BARCODE */}
          {(activeTab === 'overview' || window.matchMedia('print').matches) && (
            <div className="space-y-6">
              
              {/* Couple & Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card p-4 rounded-2xl border border-neutral-800 bg-neutral-950/50">
                  <span className="text-xs text-neutral-400 block mb-1">بيانات العريس والعروس</span>
                  <div className="text-base font-bold text-white mb-1">
                    العريس: {event.groomName}
                  </div>
                  <div className="text-base font-bold text-amber-300 mb-2">
                    العروس: {event.brideName}
                  </div>
                  <div className="text-xs text-neutral-400 space-y-1">
                    <div>الهاتف: <span className="text-neutral-200 font-mono">{event.phone}</span></div>
                    {event.email && <div>البريد: <span className="text-neutral-200">{event.email}</span></div>}
                  </div>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-neutral-800 bg-neutral-950/50">
                  <span className="text-xs text-neutral-400 block mb-1">الموعد والمكان</span>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-white mb-1">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>{event.eventDate} ({event.eventTime || 'مساءً'})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-300 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{event.location} • {event.wilaya}</span>
                  </div>
                  <div className="text-[11px] text-amber-400/80 bg-amber-500/10 rounded-lg p-2 border border-amber-500/20">
                    Smart USB ID: <span className="font-mono font-bold text-white">{event.smartUsbId || `USB-${event.eventId}`}</span>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-neutral-800 bg-neutral-950/50 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-neutral-400 block mb-1">الوضع المالي السريع</span>
                    <div className="text-xl font-bold font-cinzel text-amber-400">
                      {event.totalPrice.toLocaleString()} <span className="text-xs font-sans">دج</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-2 text-neutral-300">
                      <span>المدفوع: {event.totalPaid.toLocaleString()} دج</span>
                      <span className="text-amber-400 font-semibold">{percentPaid}%</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden mt-1.5">
                      <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${percentPaid}%` }} />
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-emerald-400 mt-2">
                    المتبقي: {remaining.toLocaleString()} دج
                  </div>
                </div>
              </div>

              {/* Barcode & VIP Card Showcase */}
              <div>
                <h4 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  بطاقة الباركود الرسمية المعتمدة للعريس (Printable VIP Pass)
                </h4>
                <BarcodeCard event={event} />
              </div>

              {/* Notes */}
              {event.notes && (
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                  <span className="text-xs font-bold text-amber-400 block mb-1">ملاحظات وطلبات العريس الخاصة:</span>
                  <p className="text-sm text-neutral-300 leading-relaxed">{event.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FINANCE */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <span className="text-xs text-neutral-400">إجمالي قيمة العقد</span>
                  <div className="text-2xl font-bold text-white font-cinzel mt-1">
                    {event.totalPrice.toLocaleString()} دج
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-emerald-500/30">
                  <span className="text-xs text-emerald-400">المبلغ المدفوع (العربون والدفعات)</span>
                  <div className="text-2xl font-bold text-emerald-400 font-cinzel mt-1">
                    {event.totalPaid.toLocaleString()} دج
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-amber-500/30">
                  <span className="text-xs text-amber-400">المبلغ المتبقي المستحق</span>
                  <div className="text-2xl font-bold text-amber-300 font-cinzel mt-1">
                    {remaining.toLocaleString()} دج
                  </div>
                </div>
              </div>

              {/* Payment Records Table */}
              <div className="glass-card rounded-2xl border border-neutral-800 overflow-hidden">
                <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    سجل الدفعات ووصولات القبض ({event.payments?.length || 0})
                  </h4>
                  <button
                    onClick={() => setShowAddPayment(true)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة دفعة جديدة</span>
                  </button>
                </div>

                {/* Add Payment Sub-form */}
                {showAddPayment && (
                  <form onSubmit={handleAddPaymentSubmit} className="p-4 bg-amber-500/5 border-b border-amber-500/20 space-y-3">
                    <span className="text-xs font-bold text-amber-300 block">تسجيل دفعة سداد جديدة من العريس:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-neutral-400 block mb-1">المبلغ (دج):</label>
                        <input
                          type="number"
                          value={payAmount}
                          onChange={(e) => setPayAmount(Number(e.target.value))}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-neutral-400 block mb-1">طريقة الدفع:</label>
                        <select
                          value={payMethod}
                          onChange={(e) => setPayMethod(e.target.value as any)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white"
                        >
                          <option value="CASH">نقداً (Cash)</option>
                          <option value="BANK">تحويل بنكي / بريدي موب</option>
                          <option value="OTHER">أخرى</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] text-neutral-400 block mb-1">بيان / ملاحظة:</label>
                        <input
                          type="text"
                          value={payNote}
                          onChange={(e) => setPayNote(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddPayment(false)}
                        className="px-3 py-1 rounded-lg bg-neutral-800 text-neutral-300 text-xs"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1 rounded-lg bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400"
                      >
                        حفظ الدفعة وتحديث الرصيد
                      </button>
                    </div>
                  </form>
                )}

                <div className="divide-y divide-neutral-800">
                  {(!event.payments || event.payments.length === 0) ? (
                    <div className="p-6 text-center text-xs text-neutral-400">
                      لا توجد دفعات مسجلة بعد.
                    </div>
                  ) : (
                    event.payments.map((p) => (
                      <div key={p.id} className="p-4 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white text-sm">
                            {p.amount.toLocaleString()} دج
                          </div>
                          <div className="text-neutral-400 text-[11px]">
                            {p.date} • {p.method === 'CASH' ? 'نقداً' : p.method === 'BANK' ? 'بريدي موب / بنك' : 'أخرى'} • وصل: <span className="font-mono text-amber-300">{p.receiptNumber || 'N/A'}</span>
                          </div>
                          {p.note && <div className="text-neutral-300 text-[11px] mt-0.5">{p.note}</div>}
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[10px]">
                          مدفوع رسميًا
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-neutral-950 border border-amber-500/20 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400">الباقة الرئيسية المختارة:</span>
                  <h4 className="text-base font-bold text-white mt-0.5">{event.packageName || 'الباقة الذهبية'}</h4>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  مشمول في العقد
                </span>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-neutral-300">الخدمات المعتمدة للمناسبة:</h5>
                {event.services.map((s, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{s.serviceTitle}</div>
                        <div className="text-[10px] text-neutral-400">معرف الخدمة: {s.serviceId}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                      {s.status === 'CONFIRMED' ? 'مؤكدة' : s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  الجدول الزمني ليوم العرس
                </h4>
                <span className="text-xs text-neutral-400">
                  {event.timeline?.length || 0} محطات مجدولة
                </span>
              </div>

              {(!event.timeline || event.timeline.length === 0) ? (
                <div className="p-8 text-center text-xs text-neutral-400 bg-neutral-950 rounded-2xl border border-neutral-800">
                  لم يتم إضافة محطات للجدول الزمني بعد.
                </div>
              ) : (
                <div className="space-y-3 relative before:absolute before:top-3 before:bottom-3 before:right-6 before:w-0.5 before:bg-neutral-800">
                  {event.timeline.map((item) => (
                    <div key={item.id} className="relative flex items-start gap-4 pr-12">
                      <div className={`absolute right-4 w-4 h-4 rounded-full border-2 transform translate-x-1/2 mt-1.5 ${
                        item.status === 'done' 
                          ? 'bg-emerald-500 border-emerald-400' 
                          : item.status === 'current'
                          ? 'bg-amber-500 border-amber-300 animate-pulse'
                          : 'bg-neutral-900 border-neutral-600'
                      }`} />
                      <div className="flex-1 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white text-xs sm:text-sm">{item.title}</span>
                          <span className="font-mono text-xs font-semibold text-amber-400">{item.time}</span>
                        </div>
                        <p className="text-xs text-neutral-400">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: TEAM & ASSETS */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  طاقم عمل IBRA PRODUCTION المعين للمناسبة
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {assignedTeamObjects.map((tm) => (
                    <div key={tm?.id} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-xs">{tm?.name}</div>
                        <div className="text-[11px] text-amber-400 font-medium">{tm?.role}</div>
                        <div className="text-[10px] text-neutral-400 font-mono mt-0.5">{tm?.phone}</div>
                      </div>
                      <a
                        href={`tel:${tm?.phone}`}
                        className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        title="اتصال بالعضو"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital Assets & USB */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-amber-400" />
                  الأصول الرقمية وفلاشة العريس (Smart USB)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                    <span className="text-neutral-400 block text-[10px]">كود الفلاشة الذكية المعتمد:</span>
                    <span className="font-mono text-sm font-bold text-amber-400">{event.smartUsbId || `USB-${event.eventId}`}</span>
                  </div>
                  <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                    <span className="text-neutral-400 block text-[10px]">صور معرض IBRA LIVE:</span>
                    <span className="text-sm font-bold text-white">{event.gallery?.length || 0} صورة مرفوعة</span>
                  </div>
                  <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                    <span className="text-neutral-400 block text-[10px]">صور وفيديوهات المعازيم والضيوف:</span>
                    <span className="text-sm font-bold text-emerald-400">{event.guestUploads?.length || 0} ملف تم رفعه</span>
                  </div>
                  <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                    <span className="text-neutral-400 block text-[10px]">المستندات والعقود المرفقة:</span>
                    <span className="text-sm font-bold text-white">{event.documents?.length || 0} مستند رسمي</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-neutral-950 px-6 py-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 shrink-0 print:border-black">
          <div>
            معرف المناسبة: <span className="font-mono text-amber-400 font-bold">{event.eventId}</span>
          </div>
          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة الملف الشامل (PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition-all shadow-md"
            >
              إغلاق
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
