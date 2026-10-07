import React, { useEffect, useMemo, useState } from 'react';
import { auth, db } from '../firebase';
import { addDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { enablePushNotifications } from "../pushNotifications";
import { useApp } from '../context/AppContext';
import { TeamManagement } from './TeamManagement';
import { BookingWorkflowPanel } from './BookingWorkflowPanel';
import { ProFeaturesCenter } from './ProFeaturesCenter';
import { OperationsCenter } from './OperationsCenter';
import { uploadImageToIbraR2 } from '../r2Upload';
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
  FileVideo,
  Users
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const {
    settings,
    updateSettings,
    bookings,
    teamMembers,
    updateBookingStatus,
    updateBooking,
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
    addTestimonial,
    updateTestimonial,
    offers,
    addOffer,
    updateOffer,
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
    | 'team'
    | 'settings'
    | 'logs'
    | 'workflow'
    | 'notifications'
    | 'pro'
    | 'scan'
    | 'operations'
  >('dash');

  const [adminNotes, setAdminNotes] = useState<string>(() =>
    localStorage.getItem('ibra_admin_notes') ||
    'Ù�Ø§Ø¦Ù�Ø© Ø§Ù�Ù�Ù�Ø§Ù� Ø§Ù�Ù�Ù�Ù�Ù�Ø©:\n1. ØªØ£Ù�Ù�Ø¯ Ù�Ù�Ø§Ø¹Ù�Ø¯ Ø¹Ø·Ù�Ø© Ù�Ù�Ø§Ù�Ø© Ø§Ù�Ø£Ø³Ø¨Ù�Ø¹\n2. ØªØ³Ù�Ù�Ù� Ø£Ù�Ø¨Ù�Ù�Ø§Øª Ø§Ù�ØµÙ�Ø± Ù�Ù�Ø¹Ø±Ø³Ø§Ù�\n3. Ø´Ø­Ù� Ø¨Ø·Ø§Ø±Ù�Ø§Øª Ù�Ø§Ù�Ù�Ø±Ø§Øª 4K'
  );

  const handleEnablePushNotifications = async () => {
    const token = await enablePushNotifications();

    if (token) {
      alert("â�� ØªÙ� ØªÙØ¹Ù�Ù� Ø¥Ø´Ø¹Ø§Ø±Ø§Øª Ibra Production Ø¨Ù�Ø¬Ø§Ø­.");
    } else {
      alert("â� ï¸ Ù�Ù� Ù�ØªÙ� ØªÙØ¹Ù�Ù� Ø§Ù�Ø¥Ø´Ø¹Ø§Ø±Ø§Øª. ØªØ£Ù�Ø¯ Ù�Ù� Ø§Ù�Ø³Ù�Ø§Ø­ Ø¨Ø§Ù�Ø¥Ø´Ø¹Ø§Ø±Ø§Øª ÙÙ� Ø§Ù�Ù�ØªØµÙØ­.");
    }
  };

  const [smsModalData, setSmsModalData] = useState<{
    booking: any;
    message: string;
  } | null>(null);

  const [invoiceModalData, setInvoiceModalData] = useState<any | null>(null);
  const [bookingEditModal, setBookingEditModal] = useState<any | null>(null);
  const [bookingEditSaving, setBookingEditSaving] = useState(false);
  const [workflowBooking, setWorkflowBooking] = useState<any | null>(null);
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [bookingWilayaFilter, setBookingWilayaFilter] = useState('all');
  const [serviceModal, setServiceModal] = useState<any | null>(null);
  const [serviceUploading, setServiceUploading] = useState(false);
  const [packageModal, setPackageModal] = useState<any | null>(null);
  const [packageUploading, setPackageUploading] = useState(false);
  const [testimonialModal, setTestimonialModal] = useState<any | null>(null);
  const [testimonialUploading, setTestimonialUploading] = useState(false);
  const [offerModal, setOfferModal] = useState<any | null>(null);
  const [offerUploading, setOfferUploading] = useState(false);
  const [portfolioModal, setPortfolioModal] = useState<any | null>(null);
const [videoModal, setVideoModal] = useState<any | null>(null);
  const [portfolioUploading, setPortfolioUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [idCardPreview, setIdCardPreview] = useState<any | null>(null);
  const [idCardLoading, setIdCardLoading] = useState(false);
  const [idCardSearch, setIdCardSearch] = useState('');
  const [idCardFilter, setIdCardFilter] = useState<'all' | 'image' | 'pdf'>('all');
  const [automationNotifications, setAutomationNotifications] = useState<any[]>([]);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [calendarView, setCalendarView] = useState<'month' | 'list'>('month');
  const [scanCode, setScanCode] = useState('');
  const [scanLogs, setScanLogs] = useState<any[]>([]);
  const [scanMessage, setScanMessage] = useState('Ø¬Ø§Ù�Ø² Ù�Ù�Ù�Ø³Ø­');
  const safeBookings = Array.isArray(bookings) ? bookings.filter(b => b && typeof b === 'object') : [];
  const [scanResult, setScanResult] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'scanLogs'), snapshot => {
      const items = snapshot.docs
        .map(item => ({ id: item.id, ...item.data() }))
        .sort((a: any, b: any) => {
          const at = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const bt = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return bt - at;
        })
        .slice(0, 100);
      setScanLogs(items);
    }, error => console.error('Scan logs error:', error));
    return () => unsubscribe();
  }, []);

  const handleScan = async (raw: string) => {
    const code = String(raw || '').trim();
    if (!code) return;
    setScanCode('');
    const normalized = code.toUpperCase();
    let scanType = 'unknown';
    let result = 'Ù�Ù� Ù�ØªÙ� Ø§Ù�ØªØ¹Ø±Ù Ø¹Ù�Ù� Ù�Ù�Ø¹ Ø§Ù�Ù�Ù�Ø¯';
    let match: any = null;
    let targetTab = '';

    const suffix = (prefix: string) => code.slice(prefix.length).trim().toLowerCase();

    if (normalized.startsWith('BOOK-')) {
      scanType = 'booking';
      const key = suffix('BOOK-');
      match = safeBookings.find((b: any) => String(b.id).toLowerCase() === key || String(b.id).toLowerCase().endsWith(key));
      result = match ? `ØªÙ� Ø§Ù�Ø¹Ø«Ù�Ø± Ø¹Ù�Ù� Ø§Ù�Ø­Ø¬Ø²: ${match.groomName || 'Ø¹Ù�Ù�Ù�'}` : 'Ø§Ù�Ù�Ù�Ø¯ Ù�Ø§ Ù�Ø·Ø§Ø¨Ù� Ø­Ø¬Ø²Ø§Ù� Ù�Ù�Ø¬Ù�Ø¯Ø§Ù�';
      targetTab = 'bookings';
    } else if (normalized.startsWith('CLIENT-')) {
      scanType = 'client';
      const key = suffix('CLIENT-');
      match = safeBookings.find((b: any) => String(b.id).toLowerCase() === key || String(b.id).toLowerCase().endsWith(key));
      result = match ? `ØªÙ� Ø§Ù�Ø¹Ø«Ù�Ø± Ø¹Ù�Ù� Ø¨Ù�Ø§Ø¨Ø© Ø§Ù�Ø¹Ù�Ù�Ù�: ${match.groomName || 'Ø¹Ù�Ù�Ù�'}` : 'Ø§Ù�Ù�Ù�Ø¯ Ù�Ø§ Ù�Ø·Ø§Ø¨Ù� Ø­Ø¬Ø²Ø§Ù� Ù�Ù�Ø¬Ù�Ø¯Ø§Ù�';
      targetTab = 'workflow';
    } else if (normalized.startsWith('USB-')) {
      scanType = 'usb';
      const key = suffix('USB-');
      match = safeBookings.find((b: any) => String(b.id).toLowerCase() === key || String(b.id).toLowerCase().endsWith(key));
      result = match ? `USB Ù�Ø±ØªØ¨Ø· Ø¨Ø§Ù�Ø­Ø¬Ø²: ${match.groomName || 'Ø¹Ù�Ù�Ù�'}` : 'ØªÙ� Ø§Ù�ØªØ¹Ø±Ù Ø¹Ù�Ù� Ù�Ù�Ø¯ USB';
      targetTab = match ? 'workflow' : 'scan';
    } else if (normalized.startsWith('TEAM-')) {
      scanType = 'team';
      result = 'ØªÙ� Ø§Ù�ØªØ¹Ø±Ù Ø¹Ù�Ù� Ù�Ù�Ø¯ Ø¹Ø¶Ù� Ø§Ù�ÙØ±Ù�Ù�';
      targetTab = 'team';
    } else if (normalized.startsWith('PAY-')) {
      scanType = 'payment';
      const key = suffix('PAY-');
      match = safeBookings.find((b: any) => String(b.id).toLowerCase() === key || String(b.id).toLowerCase().endsWith(key));
      result = match ? `ÙØªØ­ Ø§Ù�Ø¯ÙØ¹Ø§Øª: ${match.groomName || 'Ø¹Ù�Ù�Ù�'}` : 'ØªÙ� Ø§Ù�ØªØ¹Ø±Ù Ø¹Ù�Ù� Ù�Ù�Ø¯ Ø§Ù�Ø¯ÙØ¹';
      targetTab = 'workflow';
    } else if (normalized.startsWith('DELIVERY-')) {
      scanType = 'delivery';
      const key = suffix('DELIVERY-');
      match = safeBookings.find((b: any) => String(b.id).toLowerCase() === key || String(b.id).toLowerCase().endsWith(key));
      result = match ? `Ù�Ù�Ù Ø§Ù�ØªØ³Ù�Ù�Ù�: ${match.groomName || 'Ø¹Ù�Ù�Ù�'}` : 'ØªÙ� Ø§Ù�ØªØ¹Ø±Ù Ø¹Ù�Ù� Ù�Ù�Ø¯ Ø§Ù�ØªØ³Ù�Ù�Ù�';
      targetTab = 'workflow';
    } else if (normalized.startsWith('ALBUM-')) {
      scanType = 'album';
      const key = suffix('ALBUM-');
      match = safeBookings.find((b: any) => String(b.id).toLowerCase() === key || String(b.id).toLowerCase().endsWith(key));
      result = match ? `Ø£Ù�Ø¨Ù�Ù� Ø§Ù�Ø¹Ù�Ù�Ù�: ${match.groomName || 'Ø¹Ù�Ù�Ù�'}` : 'ØªÙ� Ø§Ù�ØªØ¹Ø±Ù Ø¹Ù�Ù� Ù�Ù�Ø¯ Ø§Ù�Ø£Ù�Ø¨Ù�Ù�';
      targetTab = 'workflow';
    } else {
      const direct = safeBookings.find((b: any) => String(b.id).toLowerCase() === code.toLowerCase());
      if (direct) {
        scanType = 'booking';
        match = direct;
        result = `ØªÙ� Ø§Ù�Ø¹Ø«Ù�Ø± Ø¹Ù�Ù� Ø§Ù�Ø­Ø¬Ø²: ${direct.groomName || 'Ø¹Ù�Ù�Ù�'}`;
        targetTab = 'bookings';
      }
    }

    const scanResultData = {
      code,
      scanType,
      result,
      bookingId: match?.id || null,
      groomName: match?.groomName || null,
      brideName: match?.brideName || null,
      phone: match?.phone || null,
      status: match?.status || null,
      scannedAt: new Date().toISOString()
    };
    setScanResult(scanResultData);
    setScanMessage(result);

    try {
      await addDoc(collection(db, 'scanLogs'), {
        ...scanResultData,
        source: 'USB/QR Scanner',
        operator: auth.currentUser?.email || 'admin',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Scan log error:', error);
      setScanMessage('ØªÙ�Øª Ø§Ù�Ù�Ø±Ø§Ø¡Ø© Ù�Ù�Ù� ØªØ¹Ø°Ø± Ø­ÙØ¸ Ø§Ù�Ø³Ø¬Ù�');
    }

    if (match && targetTab === 'workflow') {
      setWorkflowBooking(match);
    } else if (match && targetTab) {
      setActiveTab(targetTab as any);
    }
  };


  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (event.key === 'Enter') {
        const value = scanCode.trim();
        if (value) {
          void handleScan(value);
        }
      } else if (event.key.length === 1) {
        setScanCode(value => value + event.key);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [scanCode, safeBookings]);

  useEffect(() => {
    let initialized = false;
    let knownIds = new Set<string>();
    const unsubscribe = onSnapshot(collection(db, 'automationQueue'), snapshot => {
      const items = snapshot.docs
        .map(item => ({ id: item.id, ...item.data() }))
        .sort((a: any, b: any) => {
          const at = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const bt = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return bt - at;
        })
        .slice(0, 50);
      if (initialized && 'Notification' in window && Notification.permission === 'granted') {
        items.filter((item:any) => !knownIds.has(item.id)).forEach((item:any) => {
          new Notification('Ibra Production â�� Ø¥Ø´Ø¹Ø§Ø± Ø¬Ø¯Ù�Ø¯', {
            body: item.type === 'status_change'
              ? `ØªØºÙ�Ù�Ø± Ø­Ø§Ù�Ø© Ø§Ù�Ø­Ø¬Ø²: ${item.groomName || 'Ø¹Ù�Ù�Ù�'} â�� ${item.toStatus || ''}`
              : item.type === 'whatsapp_manual'
                ? `ØªÙ� ØªØ¬Ù�Ù�Ø² Ø±Ø³Ø§Ù�Ø© WhatsApp Ù�Ù� ${item.groomName || 'Ø§Ù�Ø¹Ù�Ù�Ù�'}`
                : 'ØªÙ� Ø¥Ù�Ø´Ø§Ø¡ Ø¹Ù�Ù�Ù�Ø© Ø£ØªÙ�ØªØ© Ø¬Ø¯Ù�Ø¯Ø©.',
            icon: '/logo.jpg'
          });
        });
      }
      knownIds = new Set(items.map((item:any) => item.id));
      initialized = true;
      setAutomationNotifications(items);
    }, error => {
      console.error('Automation notifications error:', error);
    });
    return () => unsubscribe();
  }, []);

  const openWhatsAppAutomation = async (booking: any, action: 'confirmation' | 'reminder' | 'payment') => {
    const rawPhone = String(booking?.phone || '').replace(/\D/g, '');
    if (!rawPhone) return alert('Ø±Ù�Ù� Ù�Ø§ØªÙ Ø§Ù�Ø¹Ù�Ù�Ù� ØºÙ�Ø± Ù�Ù�Ø¬Ù�Ø¯.');
    const phone = rawPhone.startsWith('213') ? rawPhone : rawPhone.startsWith('0') ? '213' + rawPhone.slice(1) : rawPhone;
    const dateText = getBookingDates(booking).join(' â�¢ ') || booking.eventDate || 'â��';
    const messages = {
      confirmation: `Ù�Ø±Ø­Ø¨Ø§Ù� ${booking.groomName || ''}Ø� Ù�Ø¹Ù�Ù� Ibra Production. ØªÙ� ØªØ£Ù�Ù�Ø¯ Ø­Ø¬Ø²Ù�Ù� Ø±Ù�Ù� #${String(booking.id).slice(-6)}. Ø§Ù�ØªØ§Ø±Ù�Ø®: ${dateText}. Ø§Ù�Ù�Ù�Øª: ${booking.eventTime || 'â��'}. Ø§Ù�Ù�Ù�Ø§Ù�: ${booking.venue || 'â��'}. Ø´Ù�Ø±Ø§Ù� Ù�Ø«Ù�ØªÙ�Ù� Ø¨Ù�Ø§.`,
      reminder: `Ù�Ø±Ø­Ø¨Ø§Ù� ${booking.groomName || ''}Ø� ØªØ°Ù�Ù�Ø± Ù�Ù� Ibra Production Ø¨Ø®ØµÙ�Øµ Ù�Ù�Ø§Ø³Ø¨ØªÙ�Ù� Ø¨ØªØ§Ø±Ù�Ø® ${dateText} Ø¹Ù�Ù� Ø§Ù�Ø³Ø§Ø¹Ø© ${booking.eventTime || 'â��'} ÙÙ� ${booking.venue || 'â��'}.`,
      payment: `Ù�Ø±Ø­Ø¨Ø§Ù� ${booking.groomName || ''}Ø� Ù�Ø°Ø§ ØªØ°Ù�Ù�Ø± Ù�Ù� Ibra Production Ø¨Ø®ØµÙ�Øµ Ø§Ù�Ø¯ÙØ¹Ø© Ø§Ù�Ù�Ø³ØªØ­Ù�Ø© Ù�Ø­Ø¬Ø²Ù�Ù� #${String(booking.id).slice(-6)}. Ù�Ø±Ø¬Ù� Ø§Ù�ØªÙ�Ø§ØµÙ� Ù�Ø¹Ù�Ø§ Ù�ØªØ£Ù�Ù�Ø¯ Ø§Ù�Ø¯ÙØ¹.`
    };
    const message = messages[action];
    try {
      await addDoc(collection(db, 'automationQueue'), {
        bookingId: booking.id,
        type: 'whatsapp_manual',
        action,
        phone: booking.phone || '',
        groomName: booking.groomName || '',
        message,
        createdAt: serverTimestamp(),
        status: 'opened'
      });
    } catch (error) {
      console.error('WhatsApp queue error:', error);
    }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };


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

  const idCardsCount = safeBookings.filter((b: any) => Boolean(b.idCardUrl)).length;
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayBookingsCount = safeBookings.filter((b: any) => getBookingDates(b).includes(todayKey)).length;
  const upcomingBookings = [...safeBookings]
    .filter((b: any) => b.status !== 'cancelled')
    .sort((a: any, b: any) => String(getBookingDates(a)[0] || '9999-12-31').localeCompare(String(getBookingDates(b)[0] || '9999-12-31')))
    .slice(0, 6);

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

  const getBookingDates = (booking: any) =>
    Array.isArray(booking?.eventDates) && booking.eventDates.length
      ? booking.eventDates.filter(Boolean)
      : booking?.eventDate
        ? [booking.eventDate]
        : [];

  const calendarBookings = [...safeBookings]
    .filter((b: any) => b.status !== 'cancelled')
    .sort((a: any, b: any) => {
      const ad = getBookingDates(a)[0] || '9999-12-31';
      const bd = getBookingDates(b)[0] || '9999-12-31';
      return String(ad).localeCompare(String(bd));
    });


  const uploadServiceImage = async (file: File) => {
    if (!file) return;
    try {
      setServiceUploading(true);
      const result = await uploadImageToIbraR2(file, 'services', 15);
      setServiceModal((current: any) => current ? ({
        ...current,
        image: result.url,
        imagePath: result.key,
        imageName: result.name
      }) : current);
    } catch (error) {
      console.error('Service image upload error:', error);
      alert(error instanceof Error ? error.message : 'ØªØ¹Ø°Ø± Ø±ÙØ¹ ØµÙ�Ø±Ø© Ø§Ù�Ø®Ø¯Ù�Ø©.');
    } finally {
      setServiceUploading(false);
    }
  };

  const uploadPackageImage = async (file: File) => {
    try {
      setPackageUploading(true);
      const result = await uploadImageToIbraR2(file, 'packages', 15);
      setPackageModal((m: any) => m ? ({ ...m, image: result.url, imagePath: result.key, imageName: result.name }) : m);
    } catch (e) { alert(e instanceof Error ? e.message : 'ÙØ´Ù� Ø±ÙØ¹ ØµÙ�Ø±Ø© Ø§Ù�Ø¨Ø§Ù�Ø©.'); }
    finally { setPackageUploading(false); }
  };

  const uploadTestimonialImage = async (file: File) => {
    try {
      setTestimonialUploading(true);
      const result = await uploadImageToIbraR2(file, 'testimonials', 15);
      setTestimonialModal((m: any) => m ? ({ ...m, image: result.url, imagePath: result.key, imageName: result.name }) : m);
    } catch (e) { alert(e instanceof Error ? e.message : 'ÙØ´Ù� Ø±ÙØ¹ ØµÙ�Ø±Ø© Ø§Ù�Ø¹Ù�Ù�Ù�.'); }
    finally { setTestimonialUploading(false); }
  };

  const uploadOfferImage = async (file: File) => {
    try {
      setOfferUploading(true);
      const result = await uploadImageToIbraR2(file, 'offers', 15);
      setOfferModal((m: any) => m ? ({ ...m, image: result.url, imagePath: result.key, imageName: result.name }) : m);
    } catch (e) { alert(e instanceof Error ? e.message : 'ÙØ´Ù� Ø±ÙØ¹ ØµÙ�Ø±Ø© Ø§Ù�Ø¹Ø±Ø¶.'); }
    finally { setOfferUploading(false); }
  };

  const getIdCardBlob = async (value: string, key?: string) => {
    const raw = String(value || '').trim();
    const normalizedKey = String(key || '').trim();
    if (!raw && !normalizedKey) throw new Error('رابط بطاقة التعريف غير موجود.');

    if (raw.startsWith('data:') || raw.startsWith('blob:')) {
      const response = await fetch(raw);
      if (!response.ok) throw new Error('تعذر قراءة ملف بطاقة التعريف.');
      return response.blob();
    }

    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('يجب تسجيل الدخول كمسؤول.');

    const token = await currentUser.getIdToken(true);
    const workerBase = 'https://yellow-bar-9020ibra-id-card-upload.bahibarhouma15.workers.dev/';
    const requestUrl = raw
      ? (raw.startsWith('http://') || raw.startsWith('https://')
          ? raw
          : new URL(raw, window.location.origin).toString())
      : `${workerBase}?key=${encodeURIComponent(normalizedKey)}`;

    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'image/*,application/pdf,application/octet-stream,*/*'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(
        text ||
        ('تعذر الوصول إلى بطاقة التعريف. رمز الخادم: ' + response.status)
      );
    }

    const blob = await response.blob();
    if (!blob.size) throw new Error('ملف بطاقة التعريف فارغ أو غير متاح.');
    return blob;
  };

  const getBookingIdCardRef = (booking: any) => ({
    url: String(booking?.idCardUrl || booking?.idCardFileUrl || booking?.idCard?.url || '').trim(),
    key: String(booking?.idCardKey || booking?.idCard?.key || '').trim(),
    name: String(booking?.idCardName || booking?.idCard?.name || 'بطاقة-التعريف').trim(),
    mime: String(booking?.idCardMimeType || booking?.idCard?.mimeType || '').trim().toLowerCase()
  });

  const previewIdCard = async (booking: any) => {
    const ref = getBookingIdCardRef(booking);
    if (!ref.url && !ref.key) {
      alert('لا توجد بطاقة تعريف مرتبطة بهذا الحجز.');
      return;
    }
    try {
      setIdCardLoading(true);
      const blob = await getIdCardBlob(ref.url, ref.key);
      const objectUrl = URL.createObjectURL(blob);
      setIdCardPreview({ url: objectUrl, name: ref.name, type: blob.type || ref.mime || 'application/octet-stream', bookingId: booking.id });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'ØªØ¹Ø°Ø± Ù�Ø¹Ø§Ù�Ù�Ø© Ø¨Ø·Ø§Ù�Ø© Ø§Ù�ØªØ¹Ø±Ù�Ù.');
    } finally {
      setIdCardLoading(false);
    }
  };

  const downloadIdCard = async (booking: any) => {
    const ref = getBookingIdCardRef(booking);
    if (!ref.url && !ref.key) {
      alert('لا توجد بطاقة تعريف مرتبطة بهذا الحجز.');
      return;
    }

    try {
      setIdCardLoading(true);
      const blob = await getIdCardBlob(ref.url, ref.key);
      const objectUrl = URL.createObjectURL(blob);

      const originalName = ref.name;
      const hasExtension = /\.[a-z0-9]{2,5}$/i.test(originalName);
      const extension = blob.type.includes('pdf') ? '.pdf' : blob.type.includes('png') ? '.png' : '.jpg';
      const fileName = hasExtension ? originalName : originalName + extension;

      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = fileName;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
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

    await updateBookingStatus(booking.id, newStatus);
    try {
      await addDoc(collection(db, 'automationQueue'), {
        bookingId: booking.id,
        type: 'status_change',
        fromStatus: booking.status || 'new',
        toStatus: newStatus,
        phone: booking.phone || '',
        groomName: booking.groomName || '',
        eventDate: booking.eventDate || '',
        createdAt: serverTimestamp(),
        status: 'queued'
      });
    } catch (automationError) {
      console.error('Automation queue error:', automationError);
    }

    if (newStatus === 'confirmed') {
      const smsText =
        `[IBRA PRODUCTION] Ù�Ø±Ø­Ø¨Ø§Ù� Ø¨Ø§Ù�Ø¹Ø±Ù�Ø³ ${booking.groomName || ''} Ù�Ø§Ù�Ø¹Ø±Ù�Ø³ ${booking.brideName || ''}! ` +
        `ØªÙ� ØªØ£Ù�Ù�Ø¯ Ø­Ø¬Ø²Ù�Ù� Ø±Ù�Ù� (#${String(booking.id).slice(-4)}) ` +
        `Ù�Ù�Ù�Ø§Ø³Ø¨Ø© ${booking.eventType || ''} Ø¨ØªØ§Ø±Ù�Ø® ${booking.eventDate || ''}. ` +
        `Ù�Ù�Ø§Ø³ØªÙØ³Ø§Ø±: ${settings.phone}`;

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
        alert('ØªÙ� Ø§Ø³ØªØ¹Ø§Ø¯Ø© Ø§Ù�Ø¨Ù�Ø§Ù�Ø§Øª Ù�Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù�Ù�Ù�Ù�Ø¹ Ø¨Ù�Ø¬Ø§Ø­!');
      } else {
        alert('Ø®Ø·Ø£ ÙÙ� Ø§Ø³ØªØ¹Ø§Ø¯Ø© Ø§Ù�Ù�Ù�Ù.');
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
              IBRA PRODUCTION â�¢ Ù�Ù�Ø­Ø© Ø§Ù�ØªØ­Ù�Ù�
            </h1>

            <span className="text-xs text-amber-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              ØµÙ�Ø§Ø­Ù�Ø§Øª Ø§Ù�Ù�Ø³Ø¤Ù�Ù� Ù�ÙØ¹Ù�Ø©
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
            ØªØ³Ø¬Ù�Ù� Ø§Ù�Ø®Ø±Ù�Ø¬
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
              label: 'Ù�Ù�Ø­Ø© Ø§Ù�Ù�Ù�Ø§Ø¯Ø© Ø§Ù�Ø¹Ø§Ù�Ø©',
              icon: <LayoutDashboard className="w-4 h-4" />
            },
            {
              id: 'bookings',
              label: `Ø§Ù�Ø­Ø¬Ù�Ø²Ø§Øª Ù�Ø§Ù�Ø·Ù�Ø¨Ø§Øª (${newBookingsCount} Ø¬Ø¯Ù�Ø¯Ø©)`,
              icon: <Calendar className="w-4 h-4" />
            },
            {
              id: 'analytics',
              label: 'Ø§Ù�Ø¥Ø­ØµØ§Ø¦Ù�Ø§Øª Ù�Ø§Ù�Ø£Ø±Ø¨Ø§Ø­',
              icon: <BarChart3 className="w-4 h-4" />
            },
            {
              id: 'calendar',
              label: 'ØªÙ�Ù�Ù�Ù� Ø§Ù�Ù�Ù�Ø§Ø¹Ù�Ø¯',
              icon: <CalendarDays className="w-4 h-4" />
            },
            {
              id: 'services',
              label: 'Ø¥Ø¯Ø§Ø±Ø© Ø§Ù�Ø®Ø¯Ù�Ø§Øª',
              icon: <Camera className="w-4 h-4" />
            },
            {
              id: 'packages',
              label: 'Ø§Ù�Ø¨Ø§Ù�Ø§Øª Ù�Ø§Ù�Ø£Ø³Ø¹Ø§Ø±',
              icon: <Package className="w-4 h-4" />
            },
            {
              id: 'portfolio',
              label: 'Ù�Ø¹Ø±Ø¶ Ø§Ù�Ø£Ø¹Ù�Ø§Ù�',
              icon: <ImageIcon className="w-4 h-4" />
            },
            {
              id: 'videos',
              label: 'Ø§Ù�ÙÙ�Ø¯Ù�Ù�Ù�Ø§Øª',
              icon: <Video className="w-4 h-4" />
            },
            {
              id: 'messages',
              label: `Ø±Ø³Ø§Ø¦Ù� Ø§Ù�ØªÙ�Ø§ØµÙ� (${unreadMessagesCount})`,
              icon: <Mail className="w-4 h-4" />
            },
            {
              id: 'testimonials',
              label: 'Ø¢Ø±Ø§Ø¡ Ø§Ù�Ø¹Ù�Ù�Ø§Ø¡',
              icon: <MessageSquare className="w-4 h-4" />
            },
            {
              id: 'offers',
              label: 'Ø§Ù�Ø¹Ø±Ù�Ø¶ Ø§Ù�Ø®Ø§ØµØ©',
              icon: <Tag className="w-4 h-4" />
            },
            {
              id: 'idcards',
              label: 'Ø¨Ø·Ø§Ù�Ø§Øª Ø§Ù�ØªØ¹Ø±Ù�Ù',
              icon: <FileText className="w-4 h-4" />
            },
            {
              id: 'team',
              label: 'Ø¥Ø¯Ø§Ø±Ø© ÙØ±Ù�Ù� Ø§Ù�Ø¹Ù�Ù�',
              icon: <Users className="w-4 h-4" />
            },
            {
              id: 'workflow',
              label: 'Ø³Ù�Ø± Ø¹Ù�Ù� Ø§Ù�Ø­Ø¬Ù�Ø²Ø§Øª',
              icon: <CheckSquare className="w-4 h-4" />
            },
            {
              id: 'notifications',
              label: `Ø§Ù�Ø¥Ø´Ø¹Ø§Ø±Ø§Øª Ù�Ø§Ù�Ø£ØªÙ�ØªØ© (${automationNotifications.length})`,
              icon: <Send className="w-4 h-4" />
            },
            {
              id: 'scan',
              label: `Ibra Scan Center (${scanLogs.length})`,
              icon: <ShieldCheck className="w-4 h-4" />
            },
            {
              id: 'operations',
              label: 'مركز العمليات',
              icon: <LayoutDashboard className="w-4 h-4" />
            },
            {
              id: 'pro',
              label: 'Ù�Ø±Ù�Ø² 50 Ù�Ù�Ø²Ø© Ø§Ø­ØªØ±Ø§ÙÙ�Ø©',
              icon: <BarChart3 className="w-4 h-4" />
            },
            {
              id: 'settings',
              label: 'Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù�Ù�Ù�Ù�Ø¹',
              icon: <Settings className="w-4 h-4" />
            },
            {
              id: 'logs',
              label: 'Ø³Ø¬Ù� Ø§Ù�Ø¹Ù�Ù�Ù�Ø§Øª',
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
              <option value="dash">Ù�Ù�Ø­Ø© Ø§Ù�Ù�Ù�Ø§Ø¯Ø© Ø§Ù�Ø¹Ø§Ù�Ø©</option>
              <option value="bookings">Ø§Ù�Ø­Ø¬Ù�Ø²Ø§Øª Ù�Ø§Ù�Ø·Ù�Ø¨Ø§Øª</option>
              <option value="analytics">Ø§Ù�Ø¥Ø­ØµØ§Ø¦Ù�Ø§Øª Ù�Ø§Ù�Ø£Ø±Ø¨Ø§Ø­</option>
              <option value="calendar">ØªÙ�Ù�Ù�Ù� Ø§Ù�Ù�Ù�Ø§Ø¹Ù�Ø¯</option>
              <option value="services">Ø¥Ø¯Ø§Ø±Ø© Ø§Ù�Ø®Ø¯Ù�Ø§Øª</option>
              <option value="packages">Ø§Ù�Ø¨Ø§Ù�Ø§Øª Ù�Ø§Ù�Ø£Ø³Ø¹Ø§Ø±</option>
              <option value="portfolio">Ù�Ø¹Ø±Ø¶ Ø§Ù�Ø£Ø¹Ù�Ø§Ù�</option>
              <option value="videos">Ø§Ù�ÙÙ�Ø¯Ù�Ù�Ù�Ø§Øª</option>
              <option value="messages">Ø±Ø³Ø§Ø¦Ù� Ø§Ù�ØªÙ�Ø§ØµÙ�</option>
              <option value="testimonials">Ø¢Ø±Ø§Ø¡ Ø§Ù�Ø¹Ù�Ù�Ø§Ø¡</option>
              <option value="offers">Ø§Ù�Ø¹Ø±Ù�Ø¶ Ø§Ù�Ø®Ø§ØµØ©</option>
              <option value="idcards">Ø¨Ø·Ø§Ù�Ø§Øª Ø§Ù�ØªØ¹Ø±Ù�Ù</option>
              <option value="team">Ø¥Ø¯Ø§Ø±Ø© ÙØ±Ù�Ù� Ø§Ù�Ø¹Ù�Ù�</option>
              <option value="workflow">Ø³Ù�Ø± Ø¹Ù�Ù� Ø§Ù�Ø­Ø¬Ù�Ø²Ø§Øª</option>
              <option value="notifications">Ø§Ù�Ø¥Ø´Ø¹Ø§Ø±Ø§Øª Ù�Ø§Ù�Ø£ØªÙ�ØªØ©</option>
              <option value="pro">Ù�Ø±Ù�Ø² 50 Ù�Ù�Ø²Ø© Ø§Ø­ØªØ±Ø§ÙÙ�Ø©</option>
              <option value="settings">Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù�Ù�Ù�Ù�Ø¹</option>
              <option value="logs">Ø³Ø¬Ù� Ø§Ù�Ø¹Ù�Ù�Ù�Ø§Øª</option>
            </select>
          </div>

          {activeTab === 'pro' && (
            <ProFeaturesCenter onNavigate={(tab) => setActiveTab(tab as any)} bookings={safeBookings} notifications={automationNotifications.length} />
          )}

          {activeTab === 'operations' && (
            <OperationsCenter bookings={safeBookings} teamMembers={teamMembers} />
          )}

          {activeTab === 'dash' && (
            <div className="space-y-6">
              <section className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-neutral-900 to-neutral-950 p-6 md:p-8">
                <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
                <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <div className="text-xs font-black tracking-[0.25em] text-amber-400 uppercase">IBRA PRODUCTION • ADMIN</div>
                    <h2 className="text-2xl md:text-4xl font-black text-white mt-2">لوحة التحكم الاحترافية</h2>
                    <p className="text-sm text-neutral-400 mt-2 max-w-2xl">كل عمليات الوكالة في مكان واحد: الحجوزات، العملاء، الدفعات، سير العمل، البطاقات، الفريق والأتمتة.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setActiveTab('bookings')} className="px-4 py-3 rounded-xl bg-amber-500 text-black font-black text-sm">الحجوزات</button>
                    <button onClick={() => setActiveTab('operations')} className="px-4 py-3 rounded-xl bg-neutral-800 text-white font-bold text-sm">مركز العمليات</button>
                    <button onClick={() => setActiveTab('workflow')} className="px-4 py-3 rounded-xl bg-neutral-800 text-white font-bold text-sm">سير العمل</button>
                  </div>
                </div>
              </section>
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {[
                  ['إجمالي الحجوزات', safeBookings.length, 'كل الحجوزات'],
                  ['طلبات جديدة', newBookingsCount, 'تحتاج متابعة'],
                  ['مواعيد اليوم', todayBookingsCount, 'مجدولة اليوم'],
                  ['بطاقات التعريف', idCardsCount, 'ملفات مرفوعة']
                ].map(([label,value,sub]) => (
                  <div key={String(label)} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 md:p-5 hover:border-amber-500/30 transition-all">
                    <div className="text-xs text-neutral-500">{label}</div>
                    <div className="text-2xl md:text-3xl font-black text-white mt-2">{value}</div>
                    <div className="text-[11px] text-amber-400 mt-1">{sub}</div>
                  </div>
                ))}
              </section>
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div><h3 className="font-black text-white">الحجوزات القادمة</h3><p className="text-xs text-neutral-500 mt-1">أقرب العمليات التي تحتاج متابعة.</p></div>
                    <button onClick={() => setActiveTab('calendar')} className="text-xs text-amber-400 font-bold">فتح التقويم</button>
                  </div>
                  <div className="space-y-2">
                    {upcomingBookings.length === 0 ? <div className="rounded-xl bg-neutral-950 p-6 text-center text-neutral-500">لا توجد حجوزات قادمة.</div> : upcomingBookings.map((b:any) => (
                      <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-neutral-950 border border-neutral-800 p-3">
                        <div className="min-w-0"><div className="font-bold text-white truncate">{b.groomName || 'عميل'}{b.brideName ? ' × ' + b.brideName : ''}</div><div className="text-xs text-neutral-500 mt-1">{getBookingDates(b).join(' • ') || 'بدون تاريخ'} • {b.eventTime || '—'} • {b.venue || '—'}</div></div>
                        <div className="flex items-center gap-2 shrink-0"><span className="text-[11px] px-2 py-1 rounded-full bg-amber-500/10 text-amber-300">{b.status || 'new'}</span><button onClick={() => setWorkflowBooking(b)} className="px-3 py-2 rounded-lg bg-neutral-800 text-xs font-bold">الملف</button></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                  <h3 className="font-black text-white mb-4">الوضع المالي</h3>
                  <div className="space-y-3">
                    <div className="rounded-xl bg-neutral-950 p-4"><div className="text-xs text-neutral-500">الإيراد المتوقع</div><div className="text-xl font-black text-white mt-1">{analyticsRevenue.toLocaleString('ar-DZ')} DA</div></div>
                    <div className="rounded-xl bg-neutral-950 p-4"><div className="text-xs text-neutral-500">المحصل</div><div className="text-xl font-black text-emerald-400 mt-1">{analyticsPaid.toLocaleString('ar-DZ')} DA</div></div>
                    <div className="rounded-xl bg-neutral-950 p-4"><div className="text-xs text-neutral-500">المتبقي</div><div className="text-xl font-black text-amber-400 mt-1">{analyticsRemaining.toLocaleString('ar-DZ')} DA</div></div>
                  </div>
                </div>
              </section>
              <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ['التقويم', 'calendar', CalendarDays],['بطاقات التعريف', 'idcards', FileText],['Ibra Scan Center', 'scan', ShieldCheck],['الإشعارات والأتمتة', 'notifications', Send]
                ].map(([label,tab,Icon]: any) => (
                  <button key={String(tab)} onClick={() => setActiveTab(String(tab) as any)} className="text-right bg-neutral-900 border border-neutral-800 rounded-2xl p-4 hover:border-amber-500/30 hover:bg-neutral-800 transition-all">
                    <Icon className="w-5 h-5 text-amber-400 mb-3" /><div className="font-bold text-white text-sm">{label}</div><div className="text-[11px] text-neutral-500 mt-1">فتح المركز</div>
                  </button>
                ))}
              </section>
              <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                <div className="flex items-center justify-between gap-3 mb-4"><div><h3 className="font-black text-white">مفكرة الإدارة</h3><p className="text-xs text-neutral-500 mt-1">ملاحظاتك اليومية محفوظة على هذا الجهاز.</p></div><button onClick={() => { localStorage.setItem('ibra_admin_notes', adminNotes); alert('تم حفظ الملاحظات بنجاح.'); }} className="px-4 py-2 rounded-xl bg-amber-500 text-black font-black text-xs">حفظ</button></div>
                <textarea rows={4} value={adminNotes} onChange={e => setAdminNotes(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-white text-sm focus:border-amber-500 focus:outline-none" />
              </section>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Ø¥Ø¯Ø§Ø±Ø© Ø§Ù�Ø­Ø¬Ù�Ø²Ø§Øª Ù�Ø§Ù�Ø·Ù�Ø¨Ø§Øª Ø§Ù�Ù�Ø§Ø±Ø¯Ø©
                </h2>

                <p className="text-xs text-neutral-400 mt-2">
                  Ø¬Ù�Ù�Ø¹ Ø§Ù�Ø­Ø¬Ù�Ø²Ø§Øª Ø§Ù�Ù�Ø§Ø¯Ù�Ø© Ù�Ù� Ø§Ù�Ù�Ù�Ù�Ø¹.
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    value={bookingSearch}
                    onChange={e => setBookingSearch(e.target.value)}
                    placeholder="Ø¨Ø­Ø« Ø¨Ø§Ù�Ø§Ø³Ù�Ø� Ø§Ù�Ù�Ø§ØªÙØ� Ø§Ù�Ø¨Ø±Ù�Ø¯Ø� Ø§Ù�Ù�Ù�Ø§Ø³Ø¨Ø©Ø� Ø§Ù�Ù�Ù�Ø§Ù� Ø£Ù� Ø±Ù�Ù� Ø§Ù�Ø­Ø¬Ø²..."
                    className="md:col-span-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-500"
                  />
                  <select
                    value={bookingStatusFilter}
                    onChange={e => setBookingStatusFilter(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                  >
                    <option value="all">Ù�Ù� Ø§Ù�Ø­Ø§Ù�Ø§Øª</option>
                    <option value="new">Ø¬Ø¯Ù�Ø¯</option>
                    <option value="confirmed">Ù�Ø¤Ù�Ø¯</option>
                    <option value="processing">Ù�Ù�Ø¯ Ø§Ù�Ù�Ø¹Ø§Ù�Ø¬Ø©</option>
                    <option value="completed">Ù�Ù�ØªÙ�Ù�</option>
                    <option value="cancelled">Ù�Ù�ØºÙ�</option>
                  </select>
                  <select
                    value={bookingWilayaFilter}
                    onChange={e => setBookingWilayaFilter(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                  >
                    <option value="all">Ù�Ù� Ø§Ù�Ù�Ù�Ø§Ù�Ø§Øª</option>
                    {bookingWilayas.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 mt-3 text-xs text-neutral-500">
                  <span>Ø¹Ø±Ø¶ {filteredBookings.length} Ù�Ù� {safeBookings.length} Ø­Ø¬Ø²</span>
                  <button
                    onClick={() => { setBookingSearch(''); setBookingStatusFilter('all'); setBookingWilayaFilter('all'); }}
                    className="px-3 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
                  >
                    Ø¥Ø¹Ø§Ø¯Ø© Ø¶Ø¨Ø· Ø§Ù�Ø¨Ø­Ø«
                  </button>
                </div>
              </div>

              <div className="md:hidden space-y-3">
                {filteredBookings.map((booking: any) => (
                  <div key={booking.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 hover:border-amber-500/30 transition-all">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="font-bold text-white">{booking.groomName || 'Ø¨Ø¯Ù�Ù� Ø§Ø³Ù�'}</div>
                        <div className="text-xs text-neutral-500 mt-1">{booking.brideName || 'â��'} â�¢ #{String(booking.id || '').slice(-6)}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-800 text-amber-400 border border-amber-500/20">
                        {booking.status === 'new' ? 'Ø¬Ø¯Ù�Ø¯' : booking.status === 'confirmed' ? 'Ù�Ø¤Ù�Ø¯' : booking.status === 'processing' ? 'Ù�Ù�Ø¯ Ø§Ù�Ù�Ø¹Ø§Ù�Ø¬Ø©' : booking.status === 'completed' ? 'Ù�Ù�ØªÙ�Ù�' : 'Ù�Ù�ØºÙ�'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                      <div className="bg-neutral-950 rounded-xl p-3"><span className="text-neutral-500 block mb-1">Ø§Ù�Ù�Ù�Ø§Ø³Ø¨Ø©</span><span className="text-neutral-200">{booking.eventType || 'â��'}</span></div>
                      <div className="bg-neutral-950 rounded-xl p-3"><span className="text-neutral-500 block mb-1">Ø§Ù�ØªØ§Ø±Ù�Ø®</span><span className="text-neutral-200">{Array.isArray(booking.eventDates) && booking.eventDates.length ? booking.eventDates.join(' â�¢ ') : booking.eventDate || 'â��'}</span></div>
                      <div className="bg-neutral-950 rounded-xl p-3"><span className="text-neutral-500 block mb-1">Ø§Ù�Ù�Ù�Ø§Ù�Ø©</span><span className="text-neutral-200">{booking.wilaya || 'â��'}</span></div>
                      <div className="bg-neutral-950 rounded-xl p-3"><span className="text-neutral-500 block mb-1">Ø§Ù�Ù�Ø§ØªÙ</span><a href={`tel:${booking.phone || ''}`} className="text-amber-400">{booking.phone || 'â��'}</a></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setInvoiceModalData(booking)} className="flex-1 min-w-[110px] px-3 py-2.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs">Ø¹Ø±Ø¶ Ø§Ù�ØªÙØ§ØµÙ�Ù�</button>
                      <button onClick={() => setBookingEditModal({
                        ...booking,
                        eventDates: Array.isArray(booking.eventDates) && booking.eventDates.length ? booking.eventDates.join("\n") : (booking.eventDate || ''),
                        totalPrice: booking.totalPrice ?? booking.total ?? booking.price ?? '',
                        totalPaid: booking.totalPaid ?? booking.paidAmount ?? booking.paid ?? ''
                      })} className="px-3 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold">ØªØ¹Ø¯Ù�Ù�</button>
                      {booking.phone && <a href={`https://wa.me/${String(booking.phone).replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer" className="px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">Ù�Ø§ØªØ³Ø§Ø¨</a>}
                    </div>
                  </div>
                ))}
                {!filteredBookings.length && <div className="text-center py-12 text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-2xl">Ù�Ø§ ØªÙ�Ø¬Ø¯ Ø­Ø¬Ù�Ø²Ø§Øª Ù�Ø·Ø§Ø¨Ù�Ø© Ù�Ù�Ø¨Ø­Ø«.</div>}
              </div>

              <div className="hidden md:block bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">

                <div className="overflow-x-auto">

                  <table className="w-full text-right text-sm">

                    <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                      <tr>
                        <th className="p-4">Ø§Ù�Ø¹Ø±Ù�Ø³ Ù�Ø§Ù�Ø¹Ø±Ù�Ø³</th>
                        <th className="p-4">Ø§Ù�Ù�Ø§ØªÙ</th>
                        <th className="p-4">Ø§Ù�Ù�Ù�Ø§Ø³Ø¨Ø© Ù�Ø§Ù�ØªØ§Ø±Ù�Ø®</th>
                        <th className="p-4">Ø§Ù�Ù�Ù�Ø§Ù�</th>
                        <th className="p-4">Ø§Ù�Ø­Ø§Ù�Ø©</th>
                        <th className="p-4">Ø§Ù�Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-800">

                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-10 text-center text-neutral-500"
                          >
                            {safeBookings.length === 0 ? 'Ù�Ø§ ØªÙ�Ø¬Ø¯ Ø­Ø¬Ù�Ø²Ø§Øª Ø­ØªÙ� Ø§Ù�Ø¢Ù�.' : 'Ù�Ø§ ØªÙ�Ø¬Ø¯ Ù�ØªØ§Ø¦Ø¬ Ù�Ø·Ø§Ø¨Ù�Ø© Ù�Ù�Ø¨Ø­Ø«.'}
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
                                  ? 'Ø¬Ø¯Ù�Ø¯'
                                  : b.status === 'confirmed'
                                  ? 'Ù�Ø¤Ù�Ø¯'
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
                                  <option value="new">Ø¬Ø¯Ù�Ø¯</option>
                                  <option value="confirmed">
                                    ØªØ£Ù�Ù�Ø¯ Ø§Ù�Ø­Ø¬Ø²
                                  </option>
                                  <option value="processing">
                                    Ù�Ù�Ø¯ Ø§Ù�Ù�Ø¹Ø§Ù�Ø¬Ø©
                                  </option>
                                  <option value="completed">
                                    Ù�Ù�ØªÙ�Ù�
                                  </option>
                                  <option value="cancelled">
                                    Ù�Ù�ØºÙ�
                                  </option>
                                </select>

                                <button
                                  onClick={() =>
                                    setInvoiceModalData(b)
                                  }
                                  className="p-2 bg-neutral-800 text-amber-400 rounded-lg"
                                  title="Ø¹Ø±Ø¶ Ù�Ù� ØªÙØ§ØµÙ�Ù� Ø§Ù�Ø­Ø¬Ø²"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => setBookingEditModal({
                                    ...b,
                                    eventDates: Array.isArray(b.eventDates) && b.eventDates.length ? b.eventDates.join("\n") : (b.eventDate || ''),
                                    totalPrice: b.totalPrice ?? b.total ?? b.price ?? '',
                                    totalPaid: b.totalPaid ?? b.paidAmount ?? b.paid ?? ''
                                  })}
                                  className="p-2 bg-neutral-800 text-sky-400 rounded-lg"
                                  title="ØªØ¹Ø¯Ù�Ù� Ø§Ù�Ø­Ø¬Ø² Ø¨Ø§Ù�Ù�Ø§Ù�Ù�"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setWorkflowBooking(b)}
                                  className="p-2 bg-neutral-800 text-amber-400 rounded-lg"
                                  title="Ø³Ù�Ø± Ø¹Ù�Ù� Ø§Ù�Ø­Ø¬Ø²"
                                >
                                  <CheckSquare className="w-4 h-4" />
                                </button>

                                <a
                                  href={b.phone ? `tel:${b.phone}` : '#'}
                                  className="p-2 bg-neutral-800 text-green-400 rounded-lg"
                                  title="Ø§ØªØµØ§Ù�"
                                >
                                  <PhoneCall className="w-4 h-4" />
                                </a>

                                <button
                                  onClick={() =>
                                    deleteBooking(b.id)
                                  }
                                  className="p-2 text-red-400 rounded-lg hover:bg-red-500/10"
                                  title="Ø­Ø°Ù"
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
           {activeTab === 'workflow' && (
            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div><h2 className="text-2xl font-black text-white">سير عمل الحجوزات</h2><p className="text-xs text-neutral-400 mt-2">افتح ملف أي عميل لإدارة Timeline وChecklist والدفعات والاستبيان والعقد والبوابة.</p></div>
                  <span className="px-3 py-2 rounded-xl bg-amber-500/10 text-amber-300 text-xs font-bold">{activeBookings.length} حجز نشط</span>
                </div>
              </div>
              <div className="grid gap-3">
                {activeBookings.length === 0 ? <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-500">لا توجد حجوزات نشطة.</div> : activeBookings.map((b:any) => (
                  <div key={b.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="min-w-0"><div className="font-black text-white">{b.groomName || 'عميل'}{b.brideName ? ' × ' + b.brideName : ''}</div><div className="text-xs text-neutral-500 mt-1">{getBookingDates(b).join(' • ') || 'بدون تاريخ'} • {b.eventTime || '—'} • {b.venue || '—'}</div></div>
                    <div className="flex flex-wrap items-center gap-2"><span className="text-xs text-amber-400">{b.status || 'new'}</span><button onClick={() => setWorkflowBooking(b)} className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-black text-xs">فتح ملف العميل</button><button onClick={() => openWhatsAppAutomation(b,'reminder')} className="px-4 py-2.5 rounded-xl bg-emerald-600/20 text-emerald-300 font-bold text-xs">WhatsApp</button></div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                <h2 className="text-2xl font-bold">Ø§Ù�Ø¥Ø´Ø¹Ø§Ø±Ø§Øª Ù�Ø§Ù�Ø£ØªÙ�ØªØ©</h2>
                <p className="text-xs text-neutral-400 mt-2">ØªÙ�Ø¨Ù�Ù�Ø§Øª Ù�Ù�Ø­Ø© Ø§Ù�ØªØ­Ù�Ù� Ù�Ù�Ø§Ø¦Ù�Ø© Ø¹Ù�Ù�Ù�Ø§Øª Ø§Ù�Ø£ØªÙ�ØªØ© Ø§Ù�Ø£Ø®Ù�Ø±Ø©.</p>
                <button
                  onClick={handleEnablePushNotifications}
                  className="mt-4 px-4 py-2.5 bg-amber-500 text-black rounded-xl text-xs font-bold"
                >
                  ØªÙØ¹Ù�Ù� Ø¥Ø´Ø¹Ø§Ø±Ø§Øª Ø§Ù�Ù�ØªØµÙØ­
                </button>
              </div>
              <div className="grid gap-3">
                {automationNotifications.map((item:any) => (
                  <div key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-bold">{item.type === 'status_change' ? 'ØªØºÙ�Ù�Ø± Ø­Ø§Ù�Ø© Ø§Ù�Ø­Ø¬Ø²' : item.type === 'whatsapp_manual' ? 'WhatsApp' : 'Automation'}</div>
                      <span className="text-[11px] text-neutral-500">{item.status || 'queued'}</span>
                    </div>
                    <div className="text-sm text-neutral-300 mt-2">{item.groomName || 'â��'} {item.toStatus ? `â�¢ ${item.fromStatus || ''} â�� ${item.toStatus}` : ''}</div>
                    {item.message && <div className="text-xs text-neutral-500 mt-2 line-clamp-2">{item.message}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-6">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Ø¥Ø¯Ø§Ø±Ø© Ø§Ù�Ø®Ø¯Ù�Ø§Øª
                  </h2>
                  <p className="text-xs text-neutral-400 mt-2">
                    Ø¥Ø¶Ø§ÙØ© Ù�ØªØ¹Ø¯Ù�Ù� Ù�Ø­Ø°Ù Ø§Ù�Ø®Ø¯Ù�Ø§Øª.
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
                  Ø¥Ø¶Ø§ÙØ© Ø®Ø¯Ù�Ø©
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
                              : 'Ø­Ø³Ø¨ Ø§Ù�Ø·Ù�Ø¨'}
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
                                    'Ù�Ù� ØªØ±Ù�Ø¯ Ø­Ø°Ù Ù�Ø°Ù� Ø§Ù�Ø®Ø¯Ù�Ø©Ø�'
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
                    Ù�Ø§ ØªÙ�Ø¬Ø¯ Ø®Ø¯Ù�Ø§Øª Ø­Ø§Ù�Ù�Ø§Ù�.
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
                    Ø§Ù�Ø¨Ø§Ù�Ø§Øª Ù�Ø§Ù�Ø£Ø³Ø¹Ø§Ø±
                  </h2>
                  <p className="text-xs text-neutral-400 mt-2">
                    Ø¥Ø¯Ø§Ø±Ø© Ø§Ù�Ø¨Ø§Ù�Ø§Øª Ø§Ù�Ø®Ø§ØµØ© Ø¨Ù� Ibra Production.
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
                  Ø¥Ø¶Ø§ÙØ© Ø¨Ø§Ù�Ø©
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
                          : 'Ø­Ø³Ø¨ Ø§Ù�Ø·Ù�Ø¨'}
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
                                'Ù�Ù� ØªØ±Ù�Ø¯ Ø­Ø°Ù Ù�Ø°Ù� Ø§Ù�Ø¨Ø§Ù�Ø©Ø�'
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
                    Ù�Ø§ ØªÙ�Ø¬Ø¯ Ø¨Ø§Ù�Ø§Øª Ø­Ø§Ù�Ù�Ø§Ù�.
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
                    Ù�Ø¹Ø±Ø¶ Ø§Ù�Ø£Ø¹Ù�Ø§Ù�
                  </h2>
                  <p className="text-xs text-neutral-400 mt-2">
                    Ø¥Ø¯Ø§Ø±Ø© Ø§Ù�ØµÙ�Ø± Ù�Ø§Ù�Ø£Ø¹Ù�Ø§Ù� Ø§Ù�Ù�Ù�Ø´Ù�Ø±Ø© ÙÙ� Ø§Ù�Ù�Ù�Ù�Ø¹.
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
                  Ø¥Ø¶Ø§ÙØ© Ø¹Ù�Ù�
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
                          {item.location || ''} â�¢ {item.date || ''}
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
                              ? 'Ø¸Ø§Ù�Ø±'
                              : 'Ù�Ø®ÙÙ�'}
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
                                    'Ù�Ù� ØªØ±Ù�Ø¯ Ø­Ø°Ù Ù�Ø°Ø§ Ø§Ù�Ø¹Ù�Ù�Ø�'
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
                    Ù�Ø§ ØªÙ�Ø¬Ø¯ Ø£Ø¹Ù�Ø§Ù� ÙÙ� Ø§Ù�Ù�Ø¹Ø±Ø¶ Ø­Ø§Ù�Ù�Ø§Ù�.
                  </div>
                )}

              </div>

            </div>
          )}

          {activeTab === 'videos' && (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold font-cinzel text-white">
        Ø¥Ø¯Ø§Ø±Ø© Ø§Ù�ÙÙ�Ø¯Ù�Ù�Ù�Ø§Øª
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
        Ø¥Ø¶Ø§ÙØ© ÙÙ�Ø¯Ù�Ù�
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
              ØªØ¹Ø¯Ù�Ù�
            </button>

            <button
              onClick={() => {
                if (confirm('Ù�Ù� Ø£Ù�Øª Ù�ØªØ£Ù�Ø¯ Ù�Ù� Ø­Ø°Ù Ù�Ø°Ø§ Ø§Ù�ÙÙ�Ø¯Ù�Ù�Ø�')) {
                  deleteVideoItem(v.id);
                }
              }}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold"
            >
              <Trash2 className="w-4 h-4" />
              Ø­Ø°Ù
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
              {videoModal.id ? 'ØªØ¹Ø¯Ù�Ù� Ø§Ù�ÙÙ�Ø¯Ù�Ù�' : 'Ø¥Ø¶Ø§ÙØ© ÙÙ�Ø¯Ù�Ù� Ø¬Ø¯Ù�Ø¯'}
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
            placeholder="Ø¹Ù�Ù�Ø§Ù� Ø§Ù�ÙÙ�Ø¯Ù�Ù� Ø¨Ø§Ù�Ø¹Ø±Ø¨Ù�Ø©"
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
            placeholder="Titre du vidÃ©o"
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
              <div className="flex-1"><div className="text-sm text-white font-semibold">Ø±ÙØ¹ ÙÙ�Ø¯Ù�Ù� Ù�Ù� Ø§Ù�Ø­Ø§Ø³Ù�Ø¨</div><div className="text-xs text-neutral-500">MP4 / WEBM / MOV â�� Ø­ØªÙ� 500MB</div></div>
              <input type="file" accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska" className="hidden" disabled={videoUploading} onChange={async e=>{const file=e.target.files?.[0];if(!file)return;try{setVideoUploading(true);const url=await uploadVideoFile(file);setVideoModal((m:any)=>({...m,videoUrl:url}));}catch(error){alert(error instanceof Error?error.message:'ÙØ´Ù� Ø±ÙØ¹ Ø§Ù�ÙÙ�Ø¯Ù�Ù�.');}finally{setVideoUploading(false);e.target.value='';}}}/>
            </label>
            {videoUploading && <div className="text-xs text-amber-400">Ø¬Ø§Ø±Ù Ø±ÙØ¹ Ø§Ù�ÙÙ�Ø¯Ù�Ù�...</div>}
            <input value={videoModal.videoUrl || ''} onChange={e=>setVideoModal({...videoModal,videoUrl:e.target.value})} placeholder="Ø£Ù� Ø£Ø¯Ø®Ù� Ø±Ø§Ø¨Ø· Ø§Ù�ÙÙ�Ø¯Ù�Ù�" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
          </div>

          <input
            value={videoModal.thumbnail || ''}
            onChange={e =>
              setVideoModal({
                ...videoModal,
                thumbnail: e.target.value
              })
            }
            placeholder="Ø±Ø§Ø¨Ø· Ø§Ù�ØµÙ�Ø±Ø© Ø§Ù�Ù�ØµØºØ±Ø©"
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
            placeholder="Ø§Ù�Ù�Ø¯Ø© Ù�Ø«Ø§Ù�: 01:25"
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
              Ø­ÙØ¸
            </button>

            <button
              onClick={() => setVideoModal(null)}
              className="px-6 py-3 rounded-xl bg-neutral-800 text-white font-bold"
            >
              Ø¥Ù�ØºØ§Ø¡
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
                  Ø¢Ø±Ø§Ø¡ Ø§Ù�Ø¹Ù�Ù�Ø§Ø¡
                </h2>
                <p className="text-xs text-neutral-400 mt-2">
                  Ø¥Ø¯Ø§Ø±Ø© Ø´Ù�Ø§Ø¯Ø§Øª Ù�Ø¢Ø±Ø§Ø¡ Ø§Ù�Ø¹Ù�Ù�Ø§Ø¡ Ù�ØµÙ�Ø±Ù�Ù�.
                </p>
                <button onClick={()=>setTestimonialModal({clientName:'',rating:5,commentAr:'',commentFr:'',commentEn:'',date:new Date().toISOString().slice(0,10),approved:true,image:''})} className="mt-4 px-5 py-2.5 bg-amber-500 text-neutral-950 rounded-xl font-bold">+ Ø¥Ø¶Ø§ÙØ© Ø±Ø£Ù� Ø¹Ù�Ù�Ù�</button>
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
                        <button onClick={()=>setTestimonialModal({...item})} className="px-3 py-2 bg-neutral-800 rounded-xl text-xs font-bold"><Edit className="w-4 h-4 inline ml-1"/>ØªØ¹Ø¯Ù�Ù�</button>
                        <div>
                          <h3 className="font-bold text-white">
                            {item.name ||
                              item.clientName ||
                              'Ø¹Ù�Ù�Ù�'}
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
                            â�� {item.rating}
                          </span>
                        )}

                      </div>

                    </div>
                  ))
                ) : (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-500">
                    Ù�Ø§ ØªÙ�Ø¬Ø¯ Ø¢Ø±Ø§Ø¡ Ø­Ø§Ù�Ù�Ø§Ù�.
                  </div>
                )}

              </div>

            </div>
          )}

          {activeTab === 'offers' && (
            <div className="space-y-6">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Ø§Ù�Ø¹Ø±Ù�Ø¶ Ø§Ù�Ø®Ø§ØµØ©
                </h2>
                <p className="text-xs text-neutral-400 mt-2">
                  Ø¥Ø¯Ø§Ø±Ø© Ø§Ù�Ø¹Ø±Ù�Ø¶ Ø§Ù�ØªÙ� ØªØ¸Ù�Ø± Ù�Ù�Ø¹Ù�Ù�Ø§Ø¡.
                </p>
                <button onClick={()=>setOfferModal({titleAr:'',titleFr:'',titleEn:'',descAr:'',descFr:'',descEn:'',oldPrice:'',newPrice:'',discountPercentage:'',startDate:'',endDate:'',image:'',active:true})} className="mt-4 px-5 py-2.5 bg-amber-500 text-neutral-950 rounded-xl font-bold">+ Ø¥Ø¶Ø§ÙØ© Ø¹Ø±Ø¶</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {Array.isArray(offers) && offers.length > 0 ? (
                  offers.map((offer: any) => (
                    <div
                      key={offer.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
                    >

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2"><button onClick={()=>setOfferModal({...offer})} className="px-3 py-2 bg-neutral-800 rounded-xl text-xs font-bold"><Edit className="w-4 h-4 inline ml-1"/>ØªØ¹Ø¯Ù�Ù�</button></div>
                        <Tag className="w-6 h-6 text-amber-400" />

                        <span className="text-xs text-neutral-500">
                          {offer.visible !== false
                            ? 'Ù�Ø´Ø·'
                            : 'Ù�Ø®ÙÙ�'}
                        </span>
                      </div>

                      <h3 className="font-bold text-white text-lg mt-5">
                        {offer.titleAr ||
                          offer.nameAr ||
                          'Ø¹Ø±Ø¶ Ø®Ø§Øµ'}
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
                    Ù�Ø§ ØªÙ�Ø¬Ø¯ Ø¹Ø±Ù�Ø¶ Ø­Ø§Ù�Ù�Ø§Ù�.
                  </div>
                )}

              </div>

            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Ø±Ø³Ø§Ø¦Ù� Ø§Ù�ØªÙ�Ø§ØµÙ�
                </h2>

                <p className="text-xs text-neutral-400 mt-2">
                  Ø§Ù�Ø±Ø³Ø§Ø¦Ù� Ø§Ù�Ù�Ø±Ø³Ù�Ø© Ù�Ù� Ø²Ù�Ø§Ø± Ø§Ù�Ù�Ù�Ù�Ø¹.
                </p>
              </div>

              <div className="space-y-4">

                {safeMessages.length === 0 ? (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-500">
                    Ù�Ø§ ØªÙ�Ø¬Ø¯ Ø±Ø³Ø§Ø¦Ù�.
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
                              {message.name || 'Ø²Ø§Ø¦Ø±'}
                            </h3>

                            {!message.read && (
                              <span className="text-[10px] bg-amber-500 text-neutral-950 px-2 py-1 rounded-full font-bold">
                                Ø¬Ø¯Ù�Ø¯
                              </span>
                            )}

                          </div>

                          <div className="flex flex-wrap gap-4 mt-2 text-xs text-neutral-400">

                            {message.phone && (
                              <span>
                                Ø§Ù�Ù�Ø§ØªÙ: {message.phone}
                              </span>
                            )}

                            {message.email && (
                              <span>
                                Ø§Ù�Ø¨Ø±Ù�Ø¯: {message.email}
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
                              title="ØªØ­Ø¯Ù�Ø¯ Ù�Ù�Ù�Ø±Ù�Ø¡"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  'Ù�Ù� ØªØ±Ù�Ø¯ Ø­Ø°Ù Ù�Ø°Ù� Ø§Ù�Ø±Ø³Ø§Ù�Ø©Ø�'
                                )
                              ) {
                                deleteContactMessage(
                                  message.id
                                );
                              }
                            }}
                            className="p-2 bg-red-500/10 text-red-400 rounded-lg"
                            title="Ø­Ø°Ù"
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
          {activeTab === 'idcards' && (() => {
            const idCardBookings = safeBookings.filter((b: any) => {
              const ref = getBookingIdCardRef(b);
              const q = idCardSearch.trim().toLowerCase();
              const searchable = [b.groomName, b.brideName, b.phone, b.id, ref.name].join(' ').toLowerCase();
              const type = ref.mime.includes('pdf') || ref.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image';
              return (ref.url || ref.key) && (!q || searchable.includes(q)) && (idCardFilter === 'all' || idCardFilter === type);
            });

            const totalCards = safeBookings.filter((b: any) => {
              const ref = getBookingIdCardRef(b);
              return ref.url || ref.key;
            }).length;
            const pdfCards = safeBookings.filter((b: any) => {
              const ref = getBookingIdCardRef(b);
              return (ref.url || ref.key) && (ref.mime.includes('pdf') || ref.name.toLowerCase().endsWith('.pdf'));
            }).length;

            return (
              <div className="space-y-6">
                <section className="relative overflow-hidden rounded-[28px] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-neutral-900 to-neutral-950 p-5 md:p-7 ibra-idcards-hero">
                  <div className="ibra-idcards-orb ibra-idcards-orb-one" />
                  <div className="ibra-idcards-orb ibra-idcards-orb-two" />
                  <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                    <div>
                      <div className="text-[10px] tracking-[0.28em] text-amber-400 font-black uppercase">IBRA SECURE ARCHIVE</div>
                      <h2 className="text-2xl md:text-4xl font-black text-white mt-2">بطاقات التعريف المؤمّنة</h2>
                      <p className="text-sm text-neutral-400 mt-2 max-w-2xl">عرض آمن، تحميل مباشر، معاينة PDF والصور، وبحث سريع داخل بطاقات الحجوزات.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 min-w-[260px]">
                      <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4">
                        <div className="text-xs text-neutral-500">إجمالي البطاقات</div>
                        <div className="text-2xl font-black text-white mt-1">{totalCards}</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4">
                        <div className="text-xs text-neutral-500">PDF</div>
                        <div className="text-2xl font-black text-amber-300 mt-1">{pdfCards}</div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      value={idCardSearch}
                      onChange={e => setIdCardSearch(e.target.value)}
                      placeholder="ابحث باسم العريس، العروس، الهاتف أو رقم الحجز..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-amber-500/60"
                    />
                  </div>
                  <div className="flex gap-2">
                    {(['all', 'image', 'pdf'] as const).map(filter => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setIdCardFilter(filter)}
                        className={`px-4 py-3 rounded-2xl text-xs font-black transition-all ${idCardFilter === filter ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20' : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-amber-500/30'}`}
                      >
                        {filter === 'all' ? 'الكل' : filter === 'pdf' ? 'PDF' : 'صور'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {idCardBookings.map((b: any) => {
                    const ref = getBookingIdCardRef(b);
                    const isPdf = ref.mime.includes('pdf') || ref.name.toLowerCase().endsWith('.pdf');
                    return (
                      <article key={b.id} className="group relative overflow-hidden rounded-[26px] border border-neutral-800 bg-neutral-900/90 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 ibra-idcard-card">
                        <div className="ibra-idcard-shine" />
                        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl group-hover:bg-amber-500/20 transition-all duration-700" />
                        <div className="relative z-10">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-[10px] font-black tracking-[0.2em] text-amber-400">SECURE FILE</div>
                              <h3 className="font-black text-white mt-1 truncate">{b.groomName || 'عميل'}{b.brideName ? ' & ' + b.brideName : ''}</h3>
                              <p className="text-xs text-neutral-500 mt-1">#{String(b.id || '').slice(-8)}</p>
                            </div>
                            <div className="h-12 w-12 shrink-0 rounded-2xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-center ibra-idcard-icon">
                              {isPdf ? <FileText className="w-6 h-6 text-amber-300" /> : <FileImage className="w-6 h-6 text-amber-300" />}
                            </div>
                          </div>
                          <div className="mt-5 rounded-2xl border border-white/5 bg-black/20 p-4 space-y-2">
                            <div className="flex justify-between gap-3 text-xs"><span className="text-neutral-500">الهاتف</span><span className="text-neutral-200">{b.phone || '—'}</span></div>
                            <div className="flex justify-between gap-3 text-xs"><span className="text-neutral-500">التاريخ</span><span className="text-neutral-200 text-left">{getBookingDates(b).join(' • ') || '—'}</span></div>
                            <div className="flex justify-between gap-3 text-xs"><span className="text-neutral-500">الملف</span><span className="text-neutral-300 truncate max-w-[60%]">{ref.name}</span></div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-4">
                            <button type="button" disabled={idCardLoading} onClick={() => previewIdCard(b)} className="flex items-center justify-center gap-2 px-3 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-2xl text-xs font-black transition-all disabled:opacity-50">
                              <Eye className="w-4 h-4" /> معاينة
                            </button>
                            <button type="button" disabled={idCardLoading} onClick={() => downloadIdCard(b)} className="flex items-center justify-center gap-2 px-3 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-2xl text-xs font-black transition-all disabled:opacity-50">
                              <Download className="w-4 h-4" /> تحميل
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                  {idCardBookings.length === 0 && (
                    <div className="col-span-full rounded-[26px] border border-dashed border-neutral-800 bg-neutral-900/60 p-12 text-center">
                      <FileImage className="w-12 h-12 mx-auto text-neutral-700" />
                      <div className="text-white font-bold mt-4">لا توجد بطاقات مطابقة</div>
                      <div className="text-xs text-neutral-500 mt-2">تأكد من رفع بطاقة التعريف أو غيّر كلمة البحث.</div>
                    </div>
                  )}
                </div>

                {idCardPreview && (
                  <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
                    <div className="w-full max-w-6xl h-[92vh] bg-neutral-900 border border-amber-500/30 rounded-[28px] overflow-hidden flex flex-col shadow-2xl shadow-black/60 ibra-idcard-modal">
                      <div className="flex items-center justify-between gap-3 p-4 md:p-5 border-b border-neutral-800">
                        <div className="min-w-0">
                          <div className="text-[10px] tracking-[0.2em] text-amber-400 font-black">SECURE PREVIEW</div>
                          <div className="text-white font-black mt-1">معاينة بطاقة التعريف</div>
                          <div className="text-xs text-neutral-500 truncate">{idCardPreview.name}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a href={idCardPreview.url} download={idCardPreview.name} className="px-4 py-2.5 bg-amber-500 text-neutral-950 rounded-xl text-xs font-black hover:bg-amber-400 transition-all">
                            <Download className="inline w-4 h-4 mr-1" /> تحميل
                          </a>
                          <button type="button" onClick={() => { URL.revokeObjectURL(idCardPreview.url); setIdCardPreview(null); }} className="p-2.5 bg-neutral-800 text-white rounded-xl hover:bg-neutral-700">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 bg-neutral-950 p-3 md:p-5 overflow-auto flex items-center justify-center">
                        {idCardPreview.type.includes('pdf') ? (
                          <iframe src={idCardPreview.url} title="معاينة بطاقة التعريف" className="w-full h-full rounded-2xl bg-white" />
                        ) : (
                          <img src={idCardPreview.url} alt="بطاقة التعريف" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {activeTab === 'team' && (
            <TeamManagement />
          )}
           {activeTab === 'settings' && (
            <div className="space-y-6">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù�Ù�Ù�Ù�Ø¹
                </h2>
                <p className="text-xs text-neutral-400 mt-2">
                  ØªØ¹Ø¯Ù�Ù� Ù�Ø¹Ù�Ù�Ù�Ø§Øª Ù�Ø¨Ù�Ø§Ù�Ø§Øª Ibra Production.
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-5">

                <div>
                  <label className="block text-xs text-neutral-400 mb-2">
                    Ø§Ø³Ù� Ø§Ù�Ù�Ù�Ø§Ù�Ø©
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
                    Ø§Ù�Ù�Ø§ØªÙ
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
                    Ø§Ù�Ø¨Ø±Ù�Ø¯ Ø§Ù�Ø¥Ù�Ù�ØªØ±Ù�Ù�Ù�
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
                    Ø§Ù�Ø¹Ù�Ù�Ø§Ù� Ø¨Ø§Ù�Ø¹Ø±Ø¨Ù�Ø©
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
                      alert('ØªÙ� Ø­ÙØ¸ Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù�Ù�Ù�Ù�Ø¹ Ø¨Ù�Ø¬Ø§Ø­.');
                    }}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl font-bold text-sm"
                  >
                    Ø­ÙØ¸ Ø§Ù�Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª
                  </button>

                </div>

              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">

                <h3 className="font-bold text-white mb-4">
                  Ø§Ù�Ù�Ø³Ø® Ø§Ù�Ø§Ø­ØªÙ�Ø§Ø·Ù�
                </h3>

                <div className="flex flex-wrap gap-3">

                  <button
                    onClick={handleBackupExport}
                    className="flex items-center gap-2 px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-bold"
                  >
                    <Download className="w-4 h-4" />
                    ØªØµØ¯Ù�Ø± Ù�Ø³Ø®Ø© Ø§Ø­ØªÙ�Ø§Ø·Ù�Ø©
                  </button>

                  <label className="flex items-center gap-2 px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-bold cursor-pointer">

                    <Upload className="w-4 h-4" />

                    Ø§Ø³ØªØ¹Ø§Ø¯Ø© Ù�Ø³Ø®Ø© Ø§Ø­ØªÙ�Ø§Ø·Ù�Ø©

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
                  Ø³Ø¬Ù� Ø§Ù�Ø¹Ù�Ù�Ù�Ø§Øª
                </h2>
                <p className="text-xs text-neutral-400 mt-2">
                  Ø¢Ø®Ø± Ø§Ù�Ø¹Ù�Ù�Ù�Ø§Øª Ø§Ù�ØªÙ� ØªÙ�Øª Ø¯Ø§Ø®Ù� Ù�Ù�Ø­Ø© Ø§Ù�ØªØ­Ù�Ù�.
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
                              'Ø¹Ù�Ù�Ù�Ø©'}
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
                    Ù�Ø§ ØªÙ�Ø¬Ø¯ Ø¹Ù�Ù�Ù�Ø§Øª Ù�Ø³Ø¬Ù�Ø©.
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
                Ø¥Ø±Ø³Ø§Ù� Ø±Ø³Ø§Ù�Ø© ØªØ£Ù�Ù�Ø¯
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
                Ø¥Ù�ØºØ§Ø¡
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
                ÙØªØ­ ØªØ·Ø¨Ù�Ù� SMS
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
                    <div className="text-sm text-neutral-300 mt-1">ØªÙØ§ØµÙ�Ù� Ø§Ù�Ø­Ø¬Ø² Ø§Ù�Ø±Ø³Ù�Ù�Ø©</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-[11px] text-neutral-400">Ø±Ù�Ù� Ø§Ù�Ø­Ø¬Ø²</div>
                  <div className="text-xl font-black text-amber-400">#{String(invoiceModalData.id || '').slice(-8) || '-'}</div>
                  <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-white/10 text-xs font-bold">
                    {invoiceModalData.status === 'new' ? 'Ø¬Ø¯Ù�Ø¯' :
                     invoiceModalData.status === 'confirmed' ? 'Ù�Ø¤Ù�Ø¯' :
                     invoiceModalData.status === 'processing' ? 'Ù�Ù�Ø¯ Ø§Ù�Ù�Ø¹Ø§Ù�Ø¬Ø©' :
                     invoiceModalData.status === 'completed' ? 'Ù�Ù�ØªÙ�Ù�' :
                     invoiceModalData.status === 'cancelled' ? 'Ù�Ù�ØºÙ�' :
                     invoiceModalData.status || '-'}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-7">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-7 bg-amber-500 rounded-full" />
                  <h3 className="text-lg font-black">Ø¨Ù�Ø§Ù�Ø§Øª Ø§Ù�Ø¹Ù�Ù�Ù�</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    ['Ø§Ø³Ù� Ø§Ù�Ø¹Ø±Ù�Ø³', invoiceModalData.groomName],
                    ['Ø§Ø³Ù� Ø§Ù�Ø¹Ø±Ù�Ø³', invoiceModalData.brideName],
                    ['Ø±Ù�Ù� Ø§Ù�Ù�Ø§ØªÙ', invoiceModalData.phone],
                    ['Ø§Ù�Ø¨Ø±Ù�Ø¯ Ø§Ù�Ø¥Ù�Ù�ØªØ±Ù�Ù�Ù�', invoiceModalData.email],
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
                  <h3 className="text-lg font-black">ØªÙØ§ØµÙ�Ù� Ø§Ù�Ù�Ù�Ø§Ø³Ø¨Ø©</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">Ù�Ù�Ø¹ Ø§Ù�Ù�Ù�Ø§Ø³Ø¨Ø©</div>
                    <div className="font-bold">{invoiceModalData.eventType || '-'}</div>
                  </div>
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">Ø§Ù�Ù�Ù�Ø§Ù�Ø©</div>
                    <div className="font-bold">{invoiceModalData.wilaya || '-'}</div>
                  </div>
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">Ø§Ù�Ù�Ù�Ø§Ù� / Ø§Ù�Ù�Ø§Ø¹Ø©</div>
                    <div className="font-bold">{invoiceModalData.venue || '-'}</div>
                  </div>
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">Ø§Ù�Ù�Ù�Øª</div>
                    <div className="font-bold">{invoiceModalData.eventTime || '-'}</div>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="text-xs text-amber-700 mb-2 font-bold">ØªÙ�Ø§Ø±Ù�Ø® Ø§Ù�Ù�Ù�Ø§Ø³Ø¨Ø©</div>
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
                  <h3 className="text-lg font-black">Ø§Ù�Ø®Ø¯Ù�Ø© Ù�Ø§Ù�Ø¨Ø§Ù�Ø§Øª</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">Ø§Ù�Ø®Ø¯Ù�Ø©</div>
                    <div className="font-bold">
                      {services.find((s: any) => s.id === invoiceModalData.serviceId)?.titleAr || invoiceModalData.serviceId || '-'}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1">ID: {invoiceModalData.serviceId || '-'}</div>
                  </div>
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">Ø§Ù�Ø¨Ø§Ù�Ø©</div>
                    <div className="font-bold">
                      {packages.find((p: any) => p.id === invoiceModalData.packageId)?.nameAr || invoiceModalData.packageId || '-'}
                    </div>
                    {invoiceModalData.packageId && (
                      <div className="text-[11px] text-neutral-400 mt-1">
                        ID: {invoiceModalData.packageId}
                        {packages.find((p: any) => p.id === invoiceModalData.packageId)?.price != null
                          ? ` â�¢ ${packages.find((p: any) => p.id === invoiceModalData.packageId)?.price} DA`
                          : ''}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-7 bg-amber-500 rounded-full" />
                  <h3 className="text-lg font-black">Ø§Ù�Ø¬Ø§Ù�Ø¨ Ø§Ù�Ù�Ø§Ù�Ù� Ù�Ø§Ù�Ù�ØªØ§Ø¨Ø¹Ø©</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    ['Ø§Ù�Ø³Ø¹Ø± Ø§Ù�Ø¥Ø¬Ù�Ø§Ù�Ù�', invoiceModalData.totalPrice ?? invoiceModalData.total ?? invoiceModalData.price],
                    ['Ø§Ù�Ù�Ø¨Ù�Øº Ø§Ù�Ù�Ø¯ÙÙ�Ø¹', invoiceModalData.totalPaid ?? invoiceModalData.paidAmount ?? invoiceModalData.paid],
                    ['Ø§Ù�Ù�Ø¨Ù�Øº Ø§Ù�Ù�ØªØ¨Ù�Ù�', invoiceModalData.remainingBalance ?? invoiceModalData.remaining ?? invoiceModalData.balance],
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
                  <h3 className="text-lg font-black">Ù�Ù�Ø§Ø­Ø¸Ø§Øª Ù�Ù�Ù�ÙØ§Øª</h3>
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">Ù�Ù�Ø§Ø­Ø¸Ø§Øª Ø§Ù�Ø¹Ù�Ù�Ù�</div>
                    <div className="font-medium whitespace-pre-wrap break-words">{invoiceModalData.notes || 'Ù�Ø§ ØªÙ�Ø¬Ø¯ Ù�Ù�Ø§Ø­Ø¸Ø§Øª.'}</div>
                  </div>
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">Ø¨Ø·Ø§Ù�Ø© Ø§Ù�ØªØ¹Ø±Ù�Ù Ø§Ù�Ù�Ø·Ù�Ù�Ø©</div>
                    <div className="font-bold break-all">{invoiceModalData.idCardName || 'Ù�Ù�Ù Ø¨Ø·Ø§Ù�Ø© Ø§Ù�ØªØ¹Ø±Ù�Ù'}</div>
                    {invoiceModalData.idCardUrl ? (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button type="button" onClick={() => previewIdCard(invoiceModalData)} disabled={idCardLoading} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 text-sm font-bold disabled:opacity-50">
                          <Eye className="w-4 h-4" /> {idCardLoading ? 'Ø¬Ø§Ø±Ù� Ø§Ù�ØªØ­Ù�Ù�Ù�...' : 'Ù�Ø¹Ø§Ù�Ù�Ø©'}
                        </button>
                        <button type="button" onClick={() => downloadIdCard(invoiceModalData)} disabled={idCardLoading} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-white text-sm font-bold border border-neutral-700 disabled:opacity-50">
                          <Download className="w-4 h-4" /> ØªØ­Ù�Ù�Ù�
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-red-500 mt-1">Ù�Ø§ Ù�Ù�Ø¬Ø¯ Ù�Ù�Ù Ù�Ø±ÙÙ�</div>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-7 bg-amber-500 rounded-full" />
                  <h3 className="text-lg font-black">Ù�Ø¹Ù�Ù�Ù�Ø§Øª Ø§Ù�Ù�Ø¸Ø§Ù�</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">ØªØ§Ø±Ù�Ø® Ø¥Ù�Ø´Ø§Ø¡ Ø§Ù�Ø­Ø¬Ø²</div>
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
                    <div className="text-xs text-neutral-500 mb-1">Ù�Ø¹Ø±Ù�Ù Ø§Ù�Ø­Ø¬Ø² Ø§Ù�Ù�Ø§Ù�Ù�</div>
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
                    <h3 className="text-lg font-black">Ø¨Ù�Ø§Ù�Ø§Øª Ø¥Ø¶Ø§ÙÙ�Ø©</h3>
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
                <span className="text-xs text-neutral-500 self-center">ØªØºÙ�Ù�Ø± Ø§Ù�Ø­Ø§Ù�Ø©:</span>
                {[
                  ['confirmed','ØªØ£Ù�Ù�Ø¯ Ø§Ù�Ø­Ø¬Ø²'],
                  ['processing','Ù�Ù�Ø¯ Ø§Ù�Ù�Ø¹Ø§Ù�Ø¬Ø©'],
                  ['completed','Ù�Ù�ØªÙ�Ù�'],
                  ['cancelled','Ø¥Ù�ØºØ§Ø¡ Ø§Ù�Ø­Ø¬Ø²']
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
                  Ø¥ØºÙ�Ø§Ù�
                </button>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(String(invoiceModalData.id || ''));
                      alert('ØªÙ� Ù�Ø³Ø® Ø±Ù�Ù� Ø§Ù�Ø­Ø¬Ø².');
                    }}
                    className="px-4 py-3 bg-neutral-100 text-neutral-900 rounded-xl font-bold text-sm"
                  >
                    Ù�Ø³Ø® Ø±Ù�Ù� Ø§Ù�Ø­Ø¬Ø²
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
                    ØªØµØ¯Ù�Ø± Ø§Ù�Ø¨Ù�Ø§Ù�Ø§Øª
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-6 py-3 bg-neutral-950 text-white rounded-xl font-bold"
                  >
                    <Download className="w-4 h-4" />
                    Ø·Ø¨Ø§Ø¹Ø© A4
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex flex-wrap justify-between gap-3 text-xs text-neutral-500">
                <span>IBRA PRODUCTION</span>
                <span>{settings.phone || ''}</span>
                <span>{settings.email || ''}</span>
                <span>{settings.addressAr || ''}</span>
                <span>Ø·ÙØ¨Ø¹ ÙÙ�: {new Date().toLocaleString('ar-DZ')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {bookingEditModal && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 my-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-white">ØªØ¹Ø¯Ù�Ù� Ø§Ù�Ø­Ø¬Ø² Ø¨Ø§Ù�Ù�Ø§Ù�Ù�</h3>
                <p className="text-xs text-neutral-500 mt-1">Ø±Ù�Ù� Ø§Ù�Ø­Ø¬Ø²: #{String(bookingEditModal.id || '').slice(-8)}</p>
              </div>
              <button onClick={() => setBookingEditModal(null)} className="p-2 bg-neutral-800 rounded-full text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-1">
              <input value={bookingEditModal.groomName || ''} onChange={e => setBookingEditModal({...bookingEditModal, groomName:e.target.value})} placeholder="Ø§Ø³Ù� Ø§Ù�Ø¹Ø±Ù�Ø³" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input value={bookingEditModal.brideName || ''} onChange={e => setBookingEditModal({...bookingEditModal, brideName:e.target.value})} placeholder="Ø§Ø³Ù� Ø§Ù�Ø¹Ø±Ù�Ø³" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input value={bookingEditModal.phone || ''} onChange={e => setBookingEditModal({...bookingEditModal, phone:e.target.value})} placeholder="Ø±Ù�Ù� Ø§Ù�Ù�Ø§ØªÙ" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input type="email" value={bookingEditModal.email || ''} onChange={e => setBookingEditModal({...bookingEditModal, email:e.target.value})} placeholder="Ø§Ù�Ø¨Ø±Ù�Ø¯ Ø§Ù�Ø¥Ù�Ù�ØªØ±Ù�Ù�Ù�" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input value={bookingEditModal.eventType || ''} onChange={e => setBookingEditModal({...bookingEditModal, eventType:e.target.value})} placeholder="Ù�Ù�Ø¹ Ø§Ù�Ù�Ù�Ø§Ø³Ø¨Ø©" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input value={bookingEditModal.wilaya || ''} onChange={e => setBookingEditModal({...bookingEditModal, wilaya:e.target.value})} placeholder="Ø§Ù�Ù�Ù�Ø§Ù�Ø©" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input value={bookingEditModal.venue || ''} onChange={e => setBookingEditModal({...bookingEditModal, venue:e.target.value})} placeholder="Ø§Ù�Ù�Ø§Ø¹Ø© / Ø§Ù�Ù�Ù�Ø§Ù�" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input value={bookingEditModal.eventTime || ''} onChange={e => setBookingEditModal({...bookingEditModal, eventTime:e.target.value})} placeholder="Ù�Ù�Øª Ø§Ù�Ù�Ù�Ø§Ø³Ø¨Ø©" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input value={bookingEditModal.serviceId || ''} onChange={e => setBookingEditModal({...bookingEditModal, serviceId:e.target.value})} placeholder="Ø§Ù�Ø®Ø¯Ù�Ø©" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input value={bookingEditModal.packageId || ''} onChange={e => setBookingEditModal({...bookingEditModal, packageId:e.target.value})} placeholder="Ø§Ù�Ø¨Ø§Ù�Ø©" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input type="number" value={bookingEditModal.totalPrice ?? ''} onChange={e => setBookingEditModal({...bookingEditModal, totalPrice:e.target.value === '' ? '' : Number(e.target.value)})} placeholder="Ø§Ù�Ù�Ø¨Ù�Øº Ø§Ù�Ø¥Ø¬Ù�Ø§Ù�Ù� (DA)" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input type="number" value={bookingEditModal.totalPaid ?? ''} onChange={e => setBookingEditModal({...bookingEditModal, totalPaid:e.target.value === '' ? '' : Number(e.target.value)})} placeholder="Ø§Ù�Ù�Ø¨Ù�Øº Ø§Ù�Ù�Ø¯ÙÙ�Ø¹ (DA)" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <div className="md:col-span-2">
                <label className="block text-xs text-neutral-400 mb-2">ØªÙ�Ø§Ø±Ù�Ø® Ø§Ù�Ù�Ù�Ø§Ø³Ø¨Ø© â�� ØªØ§Ø±Ù�Ø® ÙÙ� Ù�Ù� Ø³Ø·Ø±</label>
                <textarea rows={4} value={bookingEditModal.eventDates || ''} onChange={e => setBookingEditModal({...bookingEditModal, eventDates:e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" placeholder="2026-09-25&#10;2026-09-26" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-neutral-400 mb-2">Ù�Ù�Ø§Ø­Ø¸Ø§Øª</label>
                <textarea rows={4} value={bookingEditModal.notes || ''} onChange={e => setBookingEditModal({...bookingEditModal, notes:e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              </div>
              <select value={bookingEditModal.status || 'new'} onChange={e => setBookingEditModal({...bookingEditModal, status:e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white">
                <option value="new">Ø¬Ø¯Ù�Ø¯</option><option value="confirmed">Ù�Ø¤Ù�Ø¯</option><option value="processing">Ù�Ù�Ø¯ Ø§Ù�Ù�Ø¹Ø§Ù�Ø¬Ø©</option><option value="completed">Ù�Ù�ØªÙ�Ù�</option><option value="cancelled">Ù�Ù�ØºÙ�</option>
              </select>
              <div className="flex items-center gap-3 rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-neutral-400">
                <FileText className="w-4 h-4 text-amber-400" /><span>Ø¨Ø·Ø§Ù�Ø© Ø§Ù�ØªØ¹Ø±Ù�Ù: {bookingEditModal.idCardName || (bookingEditModal.idCardUrl ? 'Ù�Ø±ÙÙ�Ø¹Ø©' : 'ØºÙ�Ø± Ù�Ø±ÙÙ�Ø¹Ø©')} â�� Ù�Ù�Ù Ø§Ù�Ø¨Ø·Ø§Ù�Ø© Ù�Ø§ Ù�ØªØºÙ�Ø± Ù�Ù� Ù�Ø°Ø§ Ø§Ù�Ù�Ù�Ù�Ø°Ø¬.</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-3 mt-6 pt-5 border-t border-neutral-800">
              <button onClick={() => setBookingEditModal(null)} className="px-5 py-3 bg-neutral-800 text-white rounded-xl font-bold">Ø¥Ù�ØºØ§Ø¡</button>
              <button disabled={bookingEditSaving} onClick={async () => {
                if (!bookingEditModal.groomName?.trim()) { alert('Ø§Ø³Ù� Ø§Ù�Ø¹Ø±Ù�Ø³ Ù�Ø·Ù�Ù�Ø¨.'); return; }
                if (!bookingEditModal.phone?.trim()) { alert('Ø±Ù�Ù� Ø§Ù�Ù�Ø§ØªÙ Ù�Ø·Ù�Ù�Ø¨.'); return; }
                const dates = String(bookingEditModal.eventDates || '').split(/[,\n]+/).map((x:string) => x.trim()).filter(Boolean);
                if (new Set(dates).size !== dates.length) { alert('Ù�Ù�Ø¬Ø¯ ØªØ§Ø±Ù�Ø® Ù�Ù�Ø±Ø± ÙÙ� Ø§Ù�Ø­Ø¬Ø².'); return; }
                try {
                  setBookingEditSaving(true);
                  const { eventDates, ...rest } = bookingEditModal;
                  const payload:any = {...rest, eventDate: dates[0] || '', eventDates: dates, totalPrice: bookingEditModal.totalPrice === '' ? 0 : Number(bookingEditModal.totalPrice || 0), totalPaid: bookingEditModal.totalPaid === '' ? 0 : Number(bookingEditModal.totalPaid || 0)};
                  delete payload.id;
                  delete payload.createdAt;
                  await updateBooking(bookingEditModal.id, payload);
                  setBookingEditModal(null);
                  alert('ØªÙ� Ø­ÙØ¸ ØªØ¹Ø¯Ù�Ù� Ø§Ù�Ø­Ø¬Ø² Ø¨Ù�Ø¬Ø§Ø­.');
                } catch (error) {
                  alert(error instanceof Error ? error.message : 'ØªØ¹Ø°Ø± Ø­ÙØ¸ ØªØ¹Ø¯Ù�Ù� Ø§Ù�Ø­Ø¬Ø².');
                } finally {
                  setBookingEditSaving(false);
                }
              }} className="px-6 py-3 bg-amber-500 text-neutral-950 rounded-xl font-black disabled:opacity-50">
                {bookingEditSaving ? 'Ø¬Ø§Ø±Ù Ø§Ù�Ø­ÙØ¸...' : 'Ø­ÙØ¸ Ø¬Ù�Ù�Ø¹ Ø§Ù�ØªØ¹Ø¯Ù�Ù�Ø§Øª'}
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
                  ? 'ØªØ¹Ø¯Ù�Ù� Ø§Ù�Ø®Ø¯Ù�Ø©'
                  : 'Ø¥Ø¶Ø§ÙØ© Ø®Ø¯Ù�Ø©'}
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
                placeholder="Ø§Ø³Ù� Ø§Ù�Ø®Ø¯Ù�Ø© Ø¨Ø§Ù�Ø¹Ø±Ø¨Ù�Ø©"
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
                placeholder="Ø§Ø³Ù� Ø§Ù�Ø®Ø¯Ù�Ø© Ø¨Ø§Ù�ÙØ±Ù�Ø³Ù�Ø©"
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
                placeholder="Ø§Ø³Ù� Ø§Ù�Ø®Ø¯Ù�Ø© Ø¨Ø§Ù�Ø¥Ù�Ø¬Ù�Ù�Ø²Ù�Ø©"
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
                placeholder="Ù�ØµÙ Ø§Ù�Ø®Ø¯Ù�Ø©"
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
                placeholder="Ø§Ù�Ø³Ø¹Ø±"
                value={serviceModal.price ?? ''}
                onChange={e =>
                  setServiceModal({
                    ...serviceModal,
                    price: Number(e.target.value)
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"
              />

              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-white">ØµÙ�Ø±Ø© Ø§Ù�Ø®Ø¯Ù�Ø©</div>
                    <div className="text-xs text-neutral-500 mt-1">Ø§Ø±ÙØ¹ Ø§Ù�ØµÙ�Ø±Ø© Ù�Ø¨Ø§Ø´Ø±Ø© Ù�Ù� Ø§Ù�Ø­Ø§Ø³Ù�Ø¨ â�� JPG / PNG / WEBPØ� Ø­ØªÙ� 10 MB.</div>
                  </div>
                  <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer ${serviceUploading ? 'bg-neutral-700 text-neutral-400 pointer-events-none' : 'bg-amber-500 text-neutral-950'}`}>
                    <Upload className="w-4 h-4" />
                    {serviceUploading ? 'Ø¬Ø§Ø±Ù� Ø§Ù�Ø±ÙØ¹...' : 'Ø§Ø®ØªÙ�Ø§Ø± ØµÙ�Ø±Ø©'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={serviceUploading}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) void uploadServiceImage(file);
                        e.currentTarget.value = '';
                      }}
                    />
                  </label>
                </div>

                {serviceModal.image && (
                  <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
                    <img src={serviceModal.image} alt={serviceModal.titleAr || 'ØµÙ�Ø±Ø© Ø§Ù�Ø®Ø¯Ù�Ø©'} className="w-full h-48 object-cover" />
                    <button
                      type="button"
                      onClick={() => setServiceModal({ ...serviceModal, image: '', imagePath: '', imageName: '' })}
                      className="absolute top-3 right-3 px-3 py-2 rounded-lg bg-red-500/90 text-white text-xs font-bold"
                    >
                      Ø­Ø°Ù Ø§Ù�ØµÙ�Ø±Ø©
                    </button>
                  </div>
                )}

                {!serviceModal.image && (
                  <div className="rounded-xl border border-dashed border-neutral-700 py-8 text-center text-neutral-500 text-sm">
                    Ù�Ù� Ù�ØªÙ� Ø§Ø®ØªÙ�Ø§Ø± ØµÙ�Ø±Ø© Ø¨Ø¹Ø¯.
                  </div>
                )}
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setServiceModal(null)}
                className="px-5 py-2.5 bg-neutral-800 text-white rounded-xl text-sm"
              >
                Ø¥Ù�ØºØ§Ø¡
              </button>

              <button
                onClick={async () => {
                  if (!serviceModal.titleAr) {
                    alert('Ù�Ø±Ø¬Ù� Ø¥Ø¯Ø®Ø§Ù� Ø§Ø³Ù� Ø§Ù�Ø®Ø¯Ù�Ø©.');
                    return;
                  }
                  if (serviceUploading) return;

                  try {
                    if (serviceModal.id) {
                      await updateService(serviceModal.id, serviceModal);
                    } else {
                      await addService(serviceModal);
                    }
                    setServiceModal(null);
                  } catch (error) {
                    console.error('Service save error:', error);
                    alert('ØªØ¹Ø°Ø± Ø­ÙØ¸ Ø§Ù�Ø®Ø¯Ù�Ø©. ØªØ­Ù�Ù� Ù�Ù� Ø§ØªØµØ§Ù� Firebase Ø«Ù� Ø£Ø¹Ø¯ Ø§Ù�Ù�Ø­Ø§Ù�Ù�Ø©.');
                  }
                }}
                disabled={serviceUploading}
                className="px-6 py-2.5 bg-amber-500 text-neutral-950 rounded-xl text-sm font-bold disabled:opacity-50"
              >
                Ø­ÙØ¸ Ø§Ù�Ø®Ø¯Ù�Ø©
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
                  ? 'ØªØ¹Ø¯Ù�Ù� Ø§Ù�Ø¨Ø§Ù�Ø©'
                  : 'Ø¥Ø¶Ø§ÙØ© Ø¨Ø§Ù�Ø©'}
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
                placeholder="Ø§Ø³Ù� Ø§Ù�Ø¨Ø§Ù�Ø© Ø¨Ø§Ù�Ø¹Ø±Ø¨Ù�Ø©"
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
                placeholder="Ø§Ø³Ù� Ø§Ù�Ø¨Ø§Ù�Ø© Ø¨Ø§Ù�ÙØ±Ù�Ø³Ù�Ø©"
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
                placeholder="Ø§Ø³Ù� Ø§Ù�Ø¨Ø§Ù�Ø© Ø¨Ø§Ù�Ø¥Ù�Ø¬Ù�Ù�Ø²Ù�Ø©"
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
                placeholder="Ù�ØµÙ Ø§Ù�Ø¨Ø§Ù�Ø©"
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
                placeholder="Ø§Ù�Ø³Ø¹Ø±"
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
                placeholder="Ù�Ù�Ù�Ø²Ø§Øª Ø§Ù�Ø¨Ø§Ù�Ø© - Ù�Ù� Ù�Ù�Ø²Ø© ÙÙ� Ø³Ø·Ø±"
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
                Ø¥Ù�ØºØ§Ø¡
              </button>

              <button
                onClick={() => {

                  if (!packageModal.nameAr) {
                    alert('Ù�Ø±Ø¬Ù� Ø¥Ø¯Ø®Ø§Ù� Ø§Ø³Ù� Ø§Ù�Ø¨Ø§Ù�Ø©.');
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
                Ø­ÙØ¸ Ø§Ù�Ø¨Ø§Ù�Ø©
              </button>

            </div>

          </div>

        </div>
      )}

      {testimonialModal && (
        <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 my-8">
            <div className="flex justify-between items-center mb-5"><h3 className="text-xl font-black text-white">{testimonialModal.id?'ØªØ¹Ø¯Ù�Ù� Ø±Ø£Ù� Ø§Ù�Ø¹Ù�Ù�Ù�':'Ø¥Ø¶Ø§ÙØ© Ø±Ø£Ù� Ø¹Ù�Ù�Ù�'}</h3><button onClick={()=>setTestimonialModal(null)} className="p-2 bg-neutral-800 rounded-full"><X className="w-5 h-5"/></button></div>
            <div className="space-y-3">
              <input value={testimonialModal.clientName||''} onChange={e=>setTestimonialModal({...testimonialModal,clientName:e.target.value})} placeholder="Ø§Ø³Ù� Ø§Ù�Ø¹Ù�Ù�Ù�" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"/>
              <input type="number" min="1" max="5" value={testimonialModal.rating??5} onChange={e=>setTestimonialModal({...testimonialModal,rating:Number(e.target.value)})} placeholder="Ø§Ù�ØªÙ�Ù�Ù�Ù� Ù�Ù� 5" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"/>
              <textarea value={testimonialModal.commentAr||''} onChange={e=>setTestimonialModal({...testimonialModal,commentAr:e.target.value})} placeholder="Ø±Ø£Ù� Ø§Ù�Ø¹Ù�Ù�Ù� Ø¨Ø§Ù�Ø¹Ø±Ø¨Ù�Ø©" rows={4} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"/>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold cursor-pointer"><Upload className="w-4 h-4"/>{testimonialUploading?'Ø¬Ø§Ø±Ù� Ø§Ù�Ø±ÙØ¹...':'Ø±ÙØ¹ ØµÙ�Ø±Ø© Ø§Ù�Ø¹Ù�Ù�Ù�'}<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={testimonialUploading} onChange={e=>{const f=e.target.files?.[0];if(f)void uploadTestimonialImage(f);e.currentTarget.value='';}}/></label>
                {testimonialModal.image&&<div className="relative mt-3 rounded-xl overflow-hidden"><img src={testimonialModal.image} className="w-full h-48 object-cover" alt="ØµÙ�Ø±Ø© Ø§Ù�Ø¹Ù�Ù�Ù�"/><button type="button" onClick={()=>setTestimonialModal({...testimonialModal,image:'',imagePath:'',imageName:''})} className="absolute top-2 right-2 bg-red-500 text-white rounded-lg px-3 py-2 text-xs">Ø­Ø°Ù</button></div>}
              </div>
              <label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" checked={testimonialModal.approved!==false} onChange={e=>setTestimonialModal({...testimonialModal,approved:e.target.checked})}/> Ø§Ø¹ØªÙ�Ø§Ø¯ Ø§Ù�Ø±Ø£Ù� Ù�Ø¹Ø±Ø¶Ù�</label>
              <div className="flex gap-2 pt-2"><button disabled={testimonialUploading} onClick={async()=>{if(!testimonialModal.clientName||!testimonialModal.commentAr)return alert('Ø£Ø¯Ø®Ù� Ø§Ø³Ù� Ø§Ù�Ø¹Ù�Ù�Ù� Ù�Ø§Ù�Ø±Ø£Ù�.');try{if(testimonialModal.id) await updateTestimonial(testimonialModal.id,testimonialModal);else await addTestimonial(testimonialModal);setTestimonialModal(null);}catch(e){alert('ØªØ¹Ø°Ø± Ø­ÙØ¸ Ø±Ø£Ù� Ø§Ù�Ø¹Ù�Ù�Ù�.');}}} className="flex-1 py-3 bg-amber-500 text-neutral-950 rounded-xl font-black">Ø­ÙØ¸</button><button onClick={()=>setTestimonialModal(null)} className="px-5 bg-neutral-800 rounded-xl">Ø¥Ù�ØºØ§Ø¡</button></div>
            </div>
          </div>
        </div>
      )}

      {offerModal && (
        <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 my-8">
            <div className="flex justify-between items-center mb-5"><h3 className="text-xl font-black text-white">{offerModal.id?'ØªØ¹Ø¯Ù�Ù� Ø§Ù�Ø¹Ø±Ø¶':'Ø¥Ø¶Ø§ÙØ© Ø¹Ø±Ø¶'}</h3><button onClick={()=>setOfferModal(null)} className="p-2 bg-neutral-800 rounded-full"><X className="w-5 h-5"/></button></div>
            <div className="space-y-3">
              <input value={offerModal.titleAr||''} onChange={e=>setOfferModal({...offerModal,titleAr:e.target.value})} placeholder="Ø¹Ù�Ù�Ø§Ù� Ø§Ù�Ø¹Ø±Ø¶ Ø¨Ø§Ù�Ø¹Ø±Ø¨Ù�Ø©" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"/>
              <input value={offerModal.titleFr||''} onChange={e=>setOfferModal({...offerModal,titleFr:e.target.value})} placeholder="Ø¹Ù�Ù�Ø§Ù� Ø§Ù�Ø¹Ø±Ø¶ Ø¨Ø§Ù�ÙØ±Ù�Ø³Ù�Ø©" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"/>
              <input value={offerModal.titleEn||''} onChange={e=>setOfferModal({...offerModal,titleEn:e.target.value})} placeholder="Ø¹Ù�Ù�Ø§Ù� Ø§Ù�Ø¹Ø±Ø¶ Ø¨Ø§Ù�Ø¥Ù�Ø¬Ù�Ù�Ø²Ù�Ø©" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"/>
              <textarea value={offerModal.descAr||''} onChange={e=>setOfferModal({...offerModal,descAr:e.target.value})} placeholder="Ù�ØµÙ Ø§Ù�Ø¹Ø±Ø¶" rows={3} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"/>
              <div className="grid grid-cols-2 gap-3"><input value={offerModal.oldPrice||''} onChange={e=>setOfferModal({...offerModal,oldPrice:e.target.value})} placeholder="Ø§Ù�Ø³Ø¹Ø± Ø§Ù�Ù�Ø¯Ù�Ù�" className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"/><input value={offerModal.newPrice||''} onChange={e=>setOfferModal({...offerModal,newPrice:e.target.value})} placeholder="Ø§Ù�Ø³Ø¹Ø± Ø§Ù�Ø¬Ø¯Ù�Ø¯" className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"/></div>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4"><label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold cursor-pointer"><Upload className="w-4 h-4"/>{offerUploading?'Ø¬Ø§Ø±Ù� Ø§Ù�Ø±ÙØ¹...':'Ø±ÙØ¹ ØµÙ�Ø±Ø© Ø§Ù�Ø¹Ø±Ø¶'}<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={offerUploading} onChange={e=>{const f=e.target.files?.[0];if(f)void uploadOfferImage(f);e.currentTarget.value='';}}/></label>{offerModal.image&&<div className="relative mt-3 rounded-xl overflow-hidden"><img src={offerModal.image} className="w-full h-48 object-cover" alt="ØµÙ�Ø±Ø© Ø§Ù�Ø¹Ø±Ø¶"/><button type="button" onClick={()=>setOfferModal({...offerModal,image:'',imagePath:'',imageName:''})} className="absolute top-2 right-2 bg-red-500 text-white rounded-lg px-3 py-2 text-xs">Ø­Ø°Ù</button></div>}</div>
              <label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" checked={offerModal.active!==false} onChange={e=>setOfferModal({...offerModal,active:e.target.checked})}/> Ø§Ù�Ø¹Ø±Ø¶ Ù�Ø´Ø·</label>
              <div className="flex gap-2 pt-2"><button disabled={offerUploading} onClick={async()=>{if(!offerModal.titleAr)return alert('Ø£Ø¯Ø®Ù� Ø¹Ù�Ù�Ø§Ù� Ø§Ù�Ø¹Ø±Ø¶.');try{if(offerModal.id) await updateOffer(offerModal.id,offerModal);else await addOffer(offerModal);setOfferModal(null);}catch(e){alert('ØªØ¹Ø°Ø± Ø­ÙØ¸ Ø§Ù�Ø¹Ø±Ø¶.');}}} className="flex-1 py-3 bg-amber-500 text-neutral-950 rounded-xl font-black">Ø­ÙØ¸</button><button onClick={()=>setOfferModal(null)} className="px-5 bg-neutral-800 rounded-xl">Ø¥Ù�ØºØ§Ø¡</button></div>
            </div>
          </div>
        </div>
      )}

      {workflowBooking && <BookingWorkflowPanel booking={workflowBooking} onClose={() => setWorkflowBooking(null)} />}

      {portfolioModal && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5 overflow-y-auto">

          <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 my-8">

            <div className="flex items-center justify-between mb-6">

              <h3 className="text-xl font-bold text-white">
                {portfolioModal.id
                  ? 'ØªØ¹Ø¯Ù�Ù� Ø§Ù�Ø¹Ù�Ù�'
                  : 'Ø¥Ø¶Ø§ÙØ© Ø¹Ù�Ù�'}
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
                placeholder="Ø¹Ù�Ù�Ø§Ù� Ø§Ù�Ø¹Ù�Ù� Ø¨Ø§Ù�Ø¹Ø±Ø¨Ù�Ø©"
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
                placeholder="Ø¹Ù�Ù�Ø§Ù� Ø§Ù�Ø¹Ù�Ù� Ø¨Ø§Ù�ÙØ±Ù�Ø³Ù�Ø©"
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
                placeholder="Ø¹Ù�Ù�Ø§Ù� Ø§Ù�Ø¹Ù�Ù� Ø¨Ø§Ù�Ø¥Ù�Ø¬Ù�Ù�Ø²Ù�Ø©"
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
                placeholder="Ø£Ø³Ù�Ø§Ø¡ Ø§Ù�Ø¹Ø±Ù�Ø³Ù�Ù�"
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
                placeholder="Ø§Ù�ØªØ§Ø±Ù�Ø®"
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
                placeholder="Ø§Ù�Ù�Ù�Ø§Ù�"
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
                <option value="weddings">Ø£Ø¹Ø±Ø§Ø³</option>
                <option value="graduations">ØªØ®Ø±Ø¬</option>
                <option value="events">Ù�Ù�Ø§Ø³Ø¨Ø§Øª</option>
                <option value="fashion">Ø£Ø²Ù�Ø§Ø¡</option>
                <option value="other">Ø£Ø®Ø±Ù�</option>
              </select>

              <div className="md:col-span-2 space-y-3">
                <label className="flex items-center gap-3 w-full cursor-pointer bg-neutral-950 border border-dashed border-amber-500/40 rounded-xl px-4 py-4">
                  <FileImage className="w-5 h-5 text-amber-400" />
                  <div className="flex-1"><div className="text-sm text-white font-semibold">Ø±ÙØ¹ ØµÙ�Ø± Ù�Ù� Ø§Ù�Ø­Ø§Ø³Ù�Ø¨</div><div className="text-xs text-neutral-500">JPG / PNG / WEBP â�� Ø¹Ø¯Ø© ØµÙ�Ø± Ù�Ø³Ù�Ù�Ø­Ø©</div></div>
                  <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" disabled={portfolioUploading} onChange={async e => {
                    const files = Array.from(e.target.files || []); if (!files.length) return;
                    try { setPortfolioUploading(true); const urls = await uploadPortfolioImages(files); setPortfolioModal((m:any) => ({...m, image: m?.image || urls[0] || '', images: [...(Array.isArray(m?.images) ? m.images : []), ...urls]})); }
                    catch(error){ alert(error instanceof Error ? error.message : 'ÙØ´Ù� Ø±ÙØ¹ Ø§Ù�ØµÙ�Ø±.'); }
                    finally { setPortfolioUploading(false); e.target.value=''; }
                  }} />
                </label>
                {portfolioUploading && <div className="text-xs text-amber-400">Ø¬Ø§Ø±Ù Ø±ÙØ¹ Ø§Ù�ØµÙ�Ø±...</div>}
                {Array.isArray(portfolioModal.images) && portfolioModal.images.length > 0 && <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{portfolioModal.images.map((url:string,i:number)=><div key={url+i} className="relative aspect-square rounded-xl overflow-hidden"><img src={url} className="w-full h-full object-cover" /><button type="button" onClick={()=>{const images=portfolioModal.images.filter((_:string,n:number)=>n!==i);setPortfolioModal({...portfolioModal,images,image:images[0]||''})}} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><X className="w-3 h-3"/></button></div>)}</div>}
                <input placeholder="Ø£Ù� Ø£Ø¯Ø®Ù� Ø±Ø§Ø¨Ø· Ø§Ù�ØµÙ�Ø±Ø© Ù�Ø¯Ù�Ù�Ù�Ø§" value={portfolioModal.image || ''} onChange={e=>setPortfolioModal({...portfolioModal,image:e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              </div>

              <textarea
                placeholder="Ù�ØµÙ Ø§Ù�Ø¹Ù�Ù�"
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
                  Ø¹Ø±Ø¶ Ø§Ù�Ø¹Ù�Ù� ÙÙ� Ø§Ù�Ù�Ø¹Ø±Ø¶ Ø§Ù�Ø¹Ø§Ù�
                </label>

              </div>

            </div>

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-neutral-800">

              <button
                onClick={() => setPortfolioModal(null)}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-sm"
              >
                Ø¥Ù�ØºØ§Ø¡
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
                      'Ù�Ø±Ø¬Ù� Ø¥Ø¯Ø®Ø§Ù� Ø¹Ù�Ù�Ø§Ù� Ø§Ù�Ø¹Ù�Ù� Ù�ØµÙ�Ø±Ø© Ù�Ø§Ø­Ø¯Ø© Ø¹Ù�Ù� Ø§Ù�Ø£Ù�Ù�.'
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
                Ø­ÙØ¸ Ø§Ù�Ø¹Ù�Ù�
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminDashboard;


