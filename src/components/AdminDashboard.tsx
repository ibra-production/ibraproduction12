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
    'Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ù…Ù‡Ø§Ù… Ø§Ù„ÙŠÙˆÙ…ÙŠØ©:\n1. ØªØ£ÙƒÙŠØ¯ Ù…ÙˆØ§Ø¹ÙŠØ¯ Ø¹Ø·Ù„Ø© Ù†Ù‡Ø§ÙŠØ© Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹\n2. ØªØ³Ù„ÙŠÙ… Ø£Ù„Ø¨ÙˆÙ…Ø§Øª Ø§Ù„ØµÙˆØ± Ù„Ù„Ø¹Ø±Ø³Ø§Ù†\n3. Ø´Ø­Ù† Ø¨Ø·Ø§Ø±ÙŠØ§Øª ÙƒØ§Ù…ÙŠØ±Ø§Øª 4K'
  );

  const handleEnablePushNotifications = async () => {
    const token = await enablePushNotifications();

    if (token) {
      alert("âœ… ØªÙ… ØªÙØ¹ÙŠÙ„ Ø¥Ø´Ø¹Ø§Ø±Ø§Øª Ibra Production Ø¨Ù†Ø¬Ø§Ø­.");
    } else {
      alert("âš ï¸ Ù„Ù… ÙŠØªÙ… ØªÙØ¹ÙŠÙ„ Ø§Ù„Ø¥Ø´Ø¹Ø§Ø±Ø§Øª. ØªØ£ÙƒØ¯ Ù…Ù† Ø§Ù„Ø³Ù…Ø§Ø­ Ø¨Ø§Ù„Ø¥Ø´Ø¹Ø§Ø±Ø§Øª ÙÙŠ Ø§Ù„Ù…ØªØµÙØ­.");
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
  const [idCardPreview, setIdCardPreview] = useState(null);
  const [idCardLoading, setIdCardLoading] = useState(false);
  const [automationNotifications, setAutomationNotifications] = useState<any[]>([]);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [calendarView, setCalendarView] = useState<'month' | 'list'>('month');
  const [scanCode, setScanCode] = useState('');
  const [scanLogs, setScanLogs] = useState<any[]>([]);
  const [scanMessage, setScanMessage] = useState('Ø¬Ø§Ù‡Ø² Ù„Ù„Ù…Ø³Ø­');
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
    let result = 'Ù„Ù… ÙŠØªÙ… Ø§Ù„ØªØ¹Ø±Ù Ø¹Ù„Ù‰ Ù†ÙˆØ¹ Ø§Ù„ÙƒÙˆØ¯';
    let match: any = null;
    let targetTab = '';

    const suffix = (prefix: string) => code.slice(prefix.length).trim().toLowerCase();

    if (normalized.startsWith('BOOK-')) {
      scanType = 'booking';
      const key = suffix('BOOK-');
      match = safeBookings.find((b: any) => String(b.id).toLowerCase() === key || String(b.id).toLowerCase().endsWith(key));
      result = match ? `ØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ø§Ù„Ø­Ø¬Ø²: ${match.groomName || 'Ø¹Ù…ÙŠÙ„'}` : 'Ø§Ù„ÙƒÙˆØ¯ Ù„Ø§ ÙŠØ·Ø§Ø¨Ù‚ Ø­Ø¬Ø²Ø§Ù‹ Ù…ÙˆØ¬ÙˆØ¯Ø§Ù‹';
      targetTab = 'bookings';
    } else if (normalized.startsWith('CLIENT-')) {
      scanType = 'client';
      const key = suffix('CLIENT-');
      match = safeBookings.find((b: any) => String(b.id).toLowerCase() === key || String(b.id).toLowerCase().endsWith(key));
      result = match ? `ØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ø¹Ù…ÙŠÙ„: ${match.groomName || 'Ø¹Ù…ÙŠÙ„'}` : 'Ø§Ù„ÙƒÙˆØ¯ Ù„Ø§ ÙŠØ·Ø§Ø¨Ù‚ Ø­Ø¬Ø²Ø§Ù‹ Ù…ÙˆØ¬ÙˆØ¯Ø§Ù‹';
      targetTab = 'workflow';
    } else if (normalized.startsWith('USB-')) {
      scanType = 'usb';
      const key = suffix('USB-');
      match = safeBookings.find((b: any) => String(b.id).toLowerCase() === key || String(b.id).toLowerCase().endsWith(key));
      result = match ? `USB Ù…Ø±ØªØ¨Ø· Ø¨Ø§Ù„Ø­Ø¬Ø²: ${match.groomName || 'Ø¹Ù…ÙŠÙ„'}` : 'ØªÙ… Ø§Ù„ØªØ¹Ø±Ù Ø¹Ù„Ù‰ ÙƒÙˆØ¯ USB';
      targetTab = match ? 'workflow' : 'scan';
    } else if (normalized.startsWith('TEAM-')) {
      scanType = 'team';
      result = 'ØªÙ… Ø§Ù„ØªØ¹Ø±Ù Ø¹Ù„Ù‰ ÙƒÙˆØ¯ Ø¹Ø¶Ùˆ Ø§Ù„ÙØ±ÙŠÙ‚';
      targetTab = 'team';
    } else if (normalized.startsWith('PAY-')) {
      scanType = 'payment';
      const key = suffix('PAY-');
      match = safeBookings.find((b: any) => String(b.id).toLowerCase() === key || String(b.id).toLowerCase().endsWith(key));
      result = match ? `ÙØªØ­ Ø§Ù„Ø¯ÙØ¹Ø§Øª: ${match.groomName || 'Ø¹Ù…ÙŠÙ„'}` : 'ØªÙ… Ø§Ù„ØªØ¹Ø±Ù Ø¹Ù„Ù‰ ÙƒÙˆØ¯ Ø§Ù„Ø¯ÙØ¹';
      targetTab = 'workflow';
    } else if (normalized.startsWith('DELIVERY-')) {
      scanType = 'delivery';
      const key = suffix('DELIVERY-');
      match = safeBookings.find((b: any) => String(b.id).toLowerCase() === key || String(b.id).toLowerCase().endsWith(key));
      result = match ? `Ù…Ù„Ù Ø§Ù„ØªØ³Ù„ÙŠÙ…: ${match.groomName || 'Ø¹Ù…ÙŠÙ„'}` : 'ØªÙ… Ø§Ù„ØªØ¹Ø±Ù Ø¹Ù„Ù‰ ÙƒÙˆØ¯ Ø§Ù„ØªØ³Ù„ÙŠÙ…';
      targetTab = 'workflow';
    } else if (normalized.startsWith('ALBUM-')) {
      scanType = 'album';
      const key = suffix('ALBUM-');
      match = safeBookings.find((b: any) => String(b.id).toLowerCase() === key || String(b.id).toLowerCase().endsWith(key));
      result = match ? `Ø£Ù„Ø¨ÙˆÙ… Ø§Ù„Ø¹Ù…ÙŠÙ„: ${match.groomName || 'Ø¹Ù…ÙŠÙ„'}` : 'ØªÙ… Ø§Ù„ØªØ¹Ø±Ù Ø¹Ù„Ù‰ ÙƒÙˆØ¯ Ø§Ù„Ø£Ù„Ø¨ÙˆÙ…';
      targetTab = 'workflow';
    } else {
      const direct = safeBookings.find((b: any) => String(b.id).toLowerCase() === code.toLowerCase());
      if (direct) {
        scanType = 'booking';
        match = direct;
        result = `ØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ø§Ù„Ø­Ø¬Ø²: ${direct.groomName || 'Ø¹Ù…ÙŠÙ„'}`;
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
      setScanMessage('ØªÙ…Øª Ø§Ù„Ù‚Ø±Ø§Ø¡Ø© Ù„ÙƒÙ† ØªØ¹Ø°Ø± Ø­ÙØ¸ Ø§Ù„Ø³Ø¬Ù„');
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
          new Notification('Ibra Production â€” Ø¥Ø´Ø¹Ø§Ø± Ø¬Ø¯ÙŠØ¯', {
            body: item.type === 'status_change'
              ? `ØªØºÙŠÙŠØ± Ø­Ø§Ù„Ø© Ø§Ù„Ø­Ø¬Ø²: ${item.groomName || 'Ø¹Ù…ÙŠÙ„'} â†’ ${item.toStatus || ''}`
              : item.type === 'whatsapp_manual'
                ? `ØªÙ… ØªØ¬Ù‡ÙŠØ² Ø±Ø³Ø§Ù„Ø© WhatsApp Ù„Ù€ ${item.groomName || 'Ø§Ù„Ø¹Ù…ÙŠÙ„'}`
                : 'ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ø¹Ù…Ù„ÙŠØ© Ø£ØªÙ…ØªØ© Ø¬Ø¯ÙŠØ¯Ø©.',
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
    if (!rawPhone) return alert('Ø±Ù‚Ù… Ù‡Ø§ØªÙ Ø§Ù„Ø¹Ù…ÙŠÙ„ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯.');
    const phone = rawPhone.startsWith('213') ? rawPhone : rawPhone.startsWith('0') ? '213' + rawPhone.slice(1) : rawPhone;
    const dateText = getBookingDates(booking).join(' â€¢ ') || booking.eventDate || 'â€”';
    const messages = {
      confirmation: `Ù…Ø±Ø­Ø¨Ø§Ù‹ ${booking.groomName || ''}ØŒ Ù…Ø¹ÙƒÙ… Ibra Production. ØªÙ… ØªØ£ÙƒÙŠØ¯ Ø­Ø¬Ø²ÙƒÙ… Ø±Ù‚Ù… #${String(booking.id).slice(-6)}. Ø§Ù„ØªØ§Ø±ÙŠØ®: ${dateText}. Ø§Ù„ÙˆÙ‚Øª: ${booking.eventTime || 'â€”'}. Ø§Ù„Ù…ÙƒØ§Ù†: ${booking.venue || 'â€”'}. Ø´ÙƒØ±Ø§Ù‹ Ù„Ø«Ù‚ØªÙƒÙ… Ø¨Ù†Ø§.`,
      reminder: `Ù…Ø±Ø­Ø¨Ø§Ù‹ ${booking.groomName || ''}ØŒ ØªØ°ÙƒÙŠØ± Ù…Ù† Ibra Production Ø¨Ø®ØµÙˆØµ Ù…Ù†Ø§Ø³Ø¨ØªÙƒÙ… Ø¨ØªØ§Ø±ÙŠØ® ${dateText} Ø¹Ù„Ù‰ Ø§Ù„Ø³Ø§Ø¹Ø© ${booking.eventTime || 'â€”'} ÙÙŠ ${booking.venue || 'â€”'}.`,
      payment: `Ù…Ø±Ø­Ø¨Ø§Ù‹ ${booking.groomName || ''}ØŒ Ù‡Ø°Ø§ ØªØ°ÙƒÙŠØ± Ù…Ù† Ibra Production Ø¨Ø®ØµÙˆØµ Ø§Ù„Ø¯ÙØ¹Ø© Ø§Ù„Ù…Ø³ØªØ­Ù‚Ø© Ù„Ø­Ø¬Ø²ÙƒÙ… #${String(booking.id).slice(-6)}. ÙŠØ±Ø¬Ù‰ Ø§Ù„ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§ Ù„ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø¯ÙØ¹.`
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
      alert(error instanceof Error ? error.message : 'ØªØ¹Ø°Ø± Ø±ÙØ¹ ØµÙˆØ±Ø© Ø§Ù„Ø®Ø¯Ù…Ø©.');
    } finally {
      setServiceUploading(false);
    }
  };

  const uploadPackageImage = async (file: File) => {
    try {
      setPackageUploading(true);
      const result = await uploadImageToIbraR2(file, 'packages', 15);
      setPackageModal((m: any) => m ? ({ ...m, image: result.url, imagePath: result.key, imageName: result.name }) : m);
    } catch (e) { alert(e instanceof Error ? e.message : 'ÙØ´Ù„ Ø±ÙØ¹ ØµÙˆØ±Ø© Ø§Ù„Ø¨Ø§Ù‚Ø©.'); }
    finally { setPackageUploading(false); }
  };

  const uploadTestimonialImage = async (file: File) => {
    try {
      setTestimonialUploading(true);
      const result = await uploadImageToIbraR2(file, 'testimonials', 15);
      setTestimonialModal((m: any) => m ? ({ ...m, image: result.url, imagePath: result.key, imageName: result.name }) : m);
    } catch (e) { alert(e instanceof Error ? e.message : 'ÙØ´Ù„ Ø±ÙØ¹ ØµÙˆØ±Ø© Ø§Ù„Ø¹Ù…ÙŠÙ„.'); }
    finally { setTestimonialUploading(false); }
  };

  const uploadOfferImage = async (file: File) => {
    try {
      setOfferUploading(true);
      const result = await uploadImageToIbraR2(file, 'offers', 15);
      setOfferModal((m: any) => m ? ({ ...m, image: result.url, imagePath: result.key, imageName: result.name }) : m);
    } catch (e) { alert(e instanceof Error ? e.message : 'ÙØ´Ù„ Ø±ÙØ¹ ØµÙˆØ±Ø© Ø§Ù„Ø¹Ø±Ø¶.'); }
    finally { setOfferUploading(false); }
  };

  const getIdCardBlob = async (value: string) => {
    const raw = String(value || '').trim();
    if (!raw) throw new Error('رابط بطاقة التعريف غير موجود.');

    if (raw.startsWith('data:') || raw.startsWith('blob:')) {
      const response = await fetch(raw);
      if (!response.ok) throw new Error('تعذر قراءة ملف بطاقة التعريف.');
      return response.blob();
    }

    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('يجب تسجيل الدخول كمسؤول.');

    const token = await currentUser.getIdToken(true);
    const requestUrl = raw.startsWith('http://') || raw.startsWith('https://')
      ? raw
      : new URL(raw, window.location.origin).toString();

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

  const previewIdCard = async (booking: any) => {
    if (!booking?.idCardUrl) return;
    try {
      setIdCardLoading(true);
      const blob = await getIdCardBlob(String(booking.idCardUrl));
      const objectUrl = URL.createObjectURL(blob);
      setIdCardPreview({ url: objectUrl, name: booking.idCardName || 'id-card', type: blob.type || 'application/octet-stream' });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'ØªØ¹Ø°Ø± Ù…Ø¹Ø§ÙŠÙ†Ø© Ø¨Ø·Ø§Ù‚Ø© Ø§Ù„ØªØ¹Ø±ÙŠÙ.');
    } finally {
      setIdCardLoading(false);
    }
  };

  const downloadIdCard = async (booking: any) => {
    if (!booking?.idCardUrl) {
      alert('لا توجد بطاقة تعريف مرتبطة بهذا الحجز.');
      return;
    }

    try {
      setIdCardLoading(true);
      const blob = await getIdCardBlob(String(booking.idCardUrl));
      const objectUrl = URL.createObjectURL(blob);

      const originalName = String(booking.idCardName || 'id-card').trim();
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
        `[IBRA PRODUCTION] Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ø§Ù„Ø¹Ø±ÙŠØ³ ${booking.groomName || ''} ÙˆØ§Ù„Ø¹Ø±ÙˆØ³ ${booking.brideName || ''}! ` +
        `ØªÙ… ØªØ£ÙƒÙŠØ¯ Ø­Ø¬Ø²ÙƒÙ… Ø±Ù‚Ù… (#${String(booking.id).slice(-4)}) ` +
        `Ù„Ù…Ù†Ø§Ø³Ø¨Ø© ${booking.eventType || ''} Ø¨ØªØ§Ø±ÙŠØ® ${booking.eventDate || ''}. ` +
        `Ù„Ù„Ø§Ø³ØªÙØ³Ø§Ø±: ${settings.phone}`;

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
        alert('ØªÙ… Ø§Ø³ØªØ¹Ø§Ø¯Ø© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª ÙˆØ¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ù…ÙˆÙ‚Ø¹ Ø¨Ù†Ø¬Ø§Ø­!');
      } else {
        alert('Ø®Ø·Ø£ ÙÙŠ Ø§Ø³ØªØ¹Ø§Ø¯Ø© Ø§Ù„Ù…Ù„Ù.');
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
              IBRA PRODUCTION â€¢ Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ…
            </h1>

            <span className="text-xs text-amber-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              ØµÙ„Ø§Ø­ÙŠØ§Øª Ø§Ù„Ù…Ø³Ø¤ÙˆÙ„ Ù…ÙØ¹Ù„Ø©
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
            ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø®Ø±ÙˆØ¬
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
              label: 'Ù„ÙˆØ­Ø© Ø§Ù„Ù‚ÙŠØ§Ø¯Ø© Ø§Ù„Ø¹Ø§Ù…Ø©',
              icon: <LayoutDashboard className="w-4 h-4" />
            },
            {
              id: 'bookings',
              label: `Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª ÙˆØ§Ù„Ø·Ù„Ø¨Ø§Øª (${newBookingsCount} Ø¬Ø¯ÙŠØ¯Ø©)`,
              icon: <Calendar className="w-4 h-4" />
            },
            {
              id: 'analytics',
              label: 'Ø§Ù„Ø¥Ø­ØµØ§Ø¦ÙŠØ§Øª ÙˆØ§Ù„Ø£Ø±Ø¨Ø§Ø­',
              icon: <BarChart3 className="w-4 h-4" />
            },
            {
              id: 'calendar',
              label: 'ØªÙ‚ÙˆÙŠÙ… Ø§Ù„Ù…ÙˆØ§Ø¹ÙŠØ¯',
              icon: <CalendarDays className="w-4 h-4" />
            },
            {
              id: 'services',
              label: 'Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø®Ø¯Ù…Ø§Øª',
              icon: <Camera className="w-4 h-4" />
            },
            {
              id: 'packages',
              label: 'Ø§Ù„Ø¨Ø§Ù‚Ø§Øª ÙˆØ§Ù„Ø£Ø³Ø¹Ø§Ø±',
              icon: <Package className="w-4 h-4" />
            },
            {
              id: 'portfolio',
              label: 'Ù…Ø¹Ø±Ø¶ Ø§Ù„Ø£Ø¹Ù…Ø§Ù„',
              icon: <ImageIcon className="w-4 h-4" />
            },
            {
              id: 'videos',
              label: 'Ø§Ù„ÙÙŠØ¯ÙŠÙˆÙ‡Ø§Øª',
              icon: <Video className="w-4 h-4" />
            },
            {
              id: 'messages',
              label: `Ø±Ø³Ø§Ø¦Ù„ Ø§Ù„ØªÙˆØ§ØµÙ„ (${unreadMessagesCount})`,
              icon: <Mail className="w-4 h-4" />
            },
            {
              id: 'testimonials',
              label: 'Ø¢Ø±Ø§Ø¡ Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡',
              icon: <MessageSquare className="w-4 h-4" />
            },
            {
              id: 'offers',
              label: 'Ø§Ù„Ø¹Ø±ÙˆØ¶ Ø§Ù„Ø®Ø§ØµØ©',
              icon: <Tag className="w-4 h-4" />
            },
            {
              id: 'idcards',
              label: 'Ø¨Ø·Ø§Ù‚Ø§Øª Ø§Ù„ØªØ¹Ø±ÙŠÙ',
              icon: <FileText className="w-4 h-4" />
            },
            {
              id: 'team',
              label: 'Ø¥Ø¯Ø§Ø±Ø© ÙØ±ÙŠÙ‚ Ø§Ù„Ø¹Ù…Ù„',
              icon: <Users className="w-4 h-4" />
            },
            {
              id: 'workflow',
              label: 'Ø³ÙŠØ± Ø¹Ù…Ù„ Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª',
              icon: <CheckSquare className="w-4 h-4" />
            },
            {
              id: 'notifications',
              label: `Ø§Ù„Ø¥Ø´Ø¹Ø§Ø±Ø§Øª ÙˆØ§Ù„Ø£ØªÙ…ØªØ© (${automationNotifications.length})`,
              icon: <Send className="w-4 h-4" />
            },
            {
              id: 'scan',
              label: `Ibra Scan Center (${scanLogs.length})`,
              icon: <ShieldCheck className="w-4 h-4" />
            },
            {
              id: 'pro',
              label: 'Ù…Ø±ÙƒØ² 50 Ù…ÙŠØ²Ø© Ø§Ø­ØªØ±Ø§ÙÙŠØ©',
              icon: <BarChart3 className="w-4 h-4" />
            },
            {
              id: 'settings',
              label: 'Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ù…ÙˆÙ‚Ø¹',
              icon: <Settings className="w-4 h-4" />
            },
            {
              id: 'logs',
              label: 'Ø³Ø¬Ù„ Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª',
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
              <option value="dash">Ù„ÙˆØ­Ø© Ø§Ù„Ù‚ÙŠØ§Ø¯Ø© Ø§Ù„Ø¹Ø§Ù…Ø©</option>
              <option value="bookings">Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª ÙˆØ§Ù„Ø·Ù„Ø¨Ø§Øª</option>
              <option value="analytics">Ø§Ù„Ø¥Ø­ØµØ§Ø¦ÙŠØ§Øª ÙˆØ§Ù„Ø£Ø±Ø¨Ø§Ø­</option>
              <option value="calendar">ØªÙ‚ÙˆÙŠÙ… Ø§Ù„Ù…ÙˆØ§Ø¹ÙŠØ¯</option>
              <option value="services">Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø®Ø¯Ù…Ø§Øª</option>
              <option value="packages">Ø§Ù„Ø¨Ø§Ù‚Ø§Øª ÙˆØ§Ù„Ø£Ø³Ø¹Ø§Ø±</option>
              <option value="portfolio">Ù…Ø¹Ø±Ø¶ Ø§Ù„Ø£Ø¹Ù…Ø§Ù„</option>
              <option value="videos">Ø§Ù„ÙÙŠØ¯ÙŠÙˆÙ‡Ø§Øª</option>
              <option value="messages">Ø±Ø³Ø§Ø¦Ù„ Ø§Ù„ØªÙˆØ§ØµÙ„</option>
              <option value="testimonials">Ø¢Ø±Ø§Ø¡ Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡</option>
              <option value="offers">Ø§Ù„Ø¹Ø±ÙˆØ¶ Ø§Ù„Ø®Ø§ØµØ©</option>
              <option value="idcards">Ø¨Ø·Ø§Ù‚Ø§Øª Ø§Ù„ØªØ¹Ø±ÙŠÙ</option>
              <option value="team">Ø¥Ø¯Ø§Ø±Ø© ÙØ±ÙŠÙ‚ Ø§Ù„Ø¹Ù…Ù„</option>
              <option value="workflow">Ø³ÙŠØ± Ø¹Ù…Ù„ Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª</option>
              <option value="notifications">Ø§Ù„Ø¥Ø´Ø¹Ø§Ø±Ø§Øª ÙˆØ§Ù„Ø£ØªÙ…ØªØ©</option>
              <option value="pro">Ù…Ø±ÙƒØ² 50 Ù…ÙŠØ²Ø© Ø§Ø­ØªØ±Ø§ÙÙŠØ©</option>
              <option value="settings">Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ù…ÙˆÙ‚Ø¹</option>
              <option value="logs">Ø³Ø¬Ù„ Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª</option>
            </select>
          </div>

          {activeTab === 'pro' && (
            <ProFeaturesCenter onNavigate={(tab) => setActiveTab(tab as any)} bookings={safeBookings} notifications={automationNotifications.length} />
          )}

          {activeTab === 'operations' && (
            <OperationsCenter bookings={safeBookings} teamMembers={teamMembers} />
          )}

          {activeTab === 'dash' && (
            <div className="space-y-8">

              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ Ù…Ø¬Ø¯Ø¯Ø§Ù‹ ÙÙŠ Ù„ÙˆØ­Ø© ØªØ­ÙƒÙ… IBRA PRODUCTION
                </h2>

                <p className="text-sm text-neutral-400">
                  Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª ÙˆØ§Ù„Ø®Ø¯Ù…Ø§Øª ÙˆÙ…Ø­ØªÙˆÙ‰ Ø§Ù„Ù…ÙˆÙ‚Ø¹.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                <div className="glass-card p-6 rounded-2xl border border-neutral-800 hover:border-amber-500/30 hover:-translate-y-1 transition-all duration-300">
                  <span className="text-xs text-neutral-400">
                    Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª
                  </span>
                  <div className="text-3xl font-bold text-white mt-3">
                    {safeBookings.length}
                  </div>
                  <span className="text-xs text-amber-400">
                    {newBookingsCount} Ø·Ù„Ø¨ Ø¬Ø¯ÙŠØ¯
                  </span>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-neutral-800">
                  <span className="text-xs text-neutral-400">
                    Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª Ø§Ù„Ù…Ø¤ÙƒØ¯Ø©
                  </span>
                  <div className="text-3xl font-bold text-white mt-3">
                    {confirmedBookingsCount}
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-neutral-800">
                  <span className="text-xs text-neutral-400">
                    Ø§Ù„Ø®Ø¯Ù…Ø§Øª
                  </span>
                  <div className="text-3xl font-bold text-white mt-3">
                    {services.length}
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-neutral-800">
                  <span className="text-xs text-neutral-400">
                    Ø±Ø³Ø§Ø¦Ù„ ØºÙŠØ± Ù…Ù‚Ø±ÙˆØ¡Ø©
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
                      Ù…ÙÙƒØ±Ø© Ø§Ù„Ù…Ù‡Ø§Ù…
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      localStorage.setItem(
                        'ibra_admin_notes',
                        adminNotes
                      );
                      alert('ØªÙ… Ø­ÙØ¸ Ø§Ù„Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ø¨Ù†Ø¬Ø§Ø­!');
                    }}
                    className="px-4 py-2 bg-amber-500 text-neutral-950 rounded-xl font-bold text-xs"
                  >
                    Ø­ÙØ¸
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
                  Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª ÙˆØ§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„ÙˆØ§Ø±Ø¯Ø©
                </h2>

                <p className="text-xs text-neutral-400 mt-2">
                  Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª Ø§Ù„Ù‚Ø§Ø¯Ù…Ø© Ù…Ù† Ø§Ù„Ù…ÙˆÙ‚Ø¹.
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    value={bookingSearch}
                    onChange={e => setBookingSearch(e.target.value)}
                    placeholder="Ø¨Ø­Ø« Ø¨Ø§Ù„Ø§Ø³Ù…ØŒ Ø§Ù„Ù‡Ø§ØªÙØŒ Ø§Ù„Ø¨Ø±ÙŠØ¯ØŒ Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø©ØŒ Ø§Ù„Ù…ÙƒØ§Ù† Ø£Ùˆ Ø±Ù‚Ù… Ø§Ù„Ø­Ø¬Ø²..."
                    className="md:col-span-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-500"
                  />
                  <select
                    value={bookingStatusFilter}
                    onChange={e => setBookingStatusFilter(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                  >
                    <option value="all">ÙƒÙ„ Ø§Ù„Ø­Ø§Ù„Ø§Øª</option>
                    <option value="new">Ø¬Ø¯ÙŠØ¯</option>
                    <option value="confirmed">Ù…Ø¤ÙƒØ¯</option>
                    <option value="processing">Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©</option>
                    <option value="completed">Ù…ÙƒØªÙ…Ù„</option>
                    <option value="cancelled">Ù…Ù„ØºÙŠ</option>
                  </select>
                  <select
                    value={bookingWilayaFilter}
                    onChange={e => setBookingWilayaFilter(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm"
                  >
                    <option value="all">ÙƒÙ„ Ø§Ù„ÙˆÙ„Ø§ÙŠØ§Øª</option>
                    {bookingWilayas.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 mt-3 text-xs text-neutral-500">
                  <span>Ø¹Ø±Ø¶ {filteredBookings.length} Ù…Ù† {safeBookings.length} Ø­Ø¬Ø²</span>
                  <button
                    onClick={() => { setBookingSearch(''); setBookingStatusFilter('all'); setBookingWilayaFilter('all'); }}
                    className="px-3 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
                  >
                    Ø¥Ø¹Ø§Ø¯Ø© Ø¶Ø¨Ø· Ø§Ù„Ø¨Ø­Ø«
                  </button>
                </div>
              </div>

              <div className="md:hidden space-y-3">
                {filteredBookings.map((booking: any) => (
                  <div key={booking.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 hover:border-amber-500/30 transition-all">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="font-bold text-white">{booking.groomName || 'Ø¨Ø¯ÙˆÙ† Ø§Ø³Ù…'}</div>
                        <div className="text-xs text-neutral-500 mt-1">{booking.brideName || 'â€”'} â€¢ #{String(booking.id || '').slice(-6)}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-800 text-amber-400 border border-amber-500/20">
                        {booking.status === 'new' ? 'Ø¬Ø¯ÙŠØ¯' : booking.status === 'confirmed' ? 'Ù…Ø¤ÙƒØ¯' : booking.status === 'processing' ? 'Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©' : booking.status === 'completed' ? 'Ù…ÙƒØªÙ…Ù„' : 'Ù…Ù„ØºÙŠ'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                      <div className="bg-neutral-950 rounded-xl p-3"><span className="text-neutral-500 block mb-1">Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø©</span><span className="text-neutral-200">{booking.eventType || 'â€”'}</span></div>
                      <div className="bg-neutral-950 rounded-xl p-3"><span className="text-neutral-500 block mb-1">Ø§Ù„ØªØ§Ø±ÙŠØ®</span><span className="text-neutral-200">{Array.isArray(booking.eventDates) && booking.eventDates.length ? booking.eventDates.join(' â€¢ ') : booking.eventDate || 'â€”'}</span></div>
                      <div className="bg-neutral-950 rounded-xl p-3"><span className="text-neutral-500 block mb-1">Ø§Ù„ÙˆÙ„Ø§ÙŠØ©</span><span className="text-neutral-200">{booking.wilaya || 'â€”'}</span></div>
                      <div className="bg-neutral-950 rounded-xl p-3"><span className="text-neutral-500 block mb-1">Ø§Ù„Ù‡Ø§ØªÙ</span><a href={`tel:${booking.phone || ''}`} className="text-amber-400">{booking.phone || 'â€”'}</a></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setInvoiceModalData(booking)} className="flex-1 min-w-[110px] px-3 py-2.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs">Ø¹Ø±Ø¶ Ø§Ù„ØªÙØ§ØµÙŠÙ„</button>
                      <button onClick={() => setBookingEditModal({
                        ...booking,
                        eventDates: Array.isArray(booking.eventDates) && booking.eventDates.length ? booking.eventDates.join("\n") : (booking.eventDate || ''),
                        totalPrice: booking.totalPrice ?? booking.total ?? booking.price ?? '',
                        totalPaid: booking.totalPaid ?? booking.paidAmount ?? booking.paid ?? ''
                      })} className="px-3 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold">ØªØ¹Ø¯ÙŠÙ„</button>
                      {booking.phone && <a href={`https://wa.me/${String(booking.phone).replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer" className="px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">ÙˆØ§ØªØ³Ø§Ø¨</a>}
                    </div>
                  </div>
                ))}
                {!filteredBookings.length && <div className="text-center py-12 text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-2xl">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø­Ø¬ÙˆØ²Ø§Øª Ù…Ø·Ø§Ø¨Ù‚Ø© Ù„Ù„Ø¨Ø­Ø«.</div>}
              </div>

              <div className="hidden md:block bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">

                <div className="overflow-x-auto">

                  <table className="w-full text-right text-sm">

                    <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                      <tr>
                        <th className="p-4">Ø§Ù„Ø¹Ø±ÙŠØ³ ÙˆØ§Ù„Ø¹Ø±ÙˆØ³</th>
                        <th className="p-4">Ø§Ù„Ù‡Ø§ØªÙ</th>
                        <th className="p-4">Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø© ÙˆØ§Ù„ØªØ§Ø±ÙŠØ®</th>
                        <th className="p-4">Ø§Ù„Ù…ÙƒØ§Ù†</th>
                        <th className="p-4">Ø§Ù„Ø­Ø§Ù„Ø©</th>
                        <th className="p-4">Ø§Ù„Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-800">

                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-10 text-center text-neutral-500"
                          >
                            {safeBookings.length === 0 ? 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ø­Ø¬ÙˆØ²Ø§Øª Ø­ØªÙ‰ Ø§Ù„Ø¢Ù†.' : 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ù†ØªØ§Ø¦Ø¬ Ù…Ø·Ø§Ø¨Ù‚Ø© Ù„Ù„Ø¨Ø­Ø«.'}
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
                                  ? 'Ø¬Ø¯ÙŠØ¯'
                                  : b.status === 'confirmed'
                                  ? 'Ù…Ø¤ÙƒØ¯'
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
                                  <option value="new">Ø¬Ø¯ÙŠØ¯</option>
                                  <option value="confirmed">
                                    ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø­Ø¬Ø²
                                  </option>
                                  <option value="processing">
                                    Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©
                                  </option>
                                  <option value="completed">
                                    Ù…ÙƒØªÙ…Ù„
                                  </option>
                                  <option value="cancelled">
                                    Ù…Ù„ØºÙŠ
                                  </option>
                                </select>

                                <button
                                  onClick={() =>
                                    setInvoiceModalData(b)
                                  }
                                  className="p-2 bg-neutral-800 text-amber-400 rounded-lg"
                                  title="Ø¹Ø±Ø¶ ÙƒÙ„ ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø­Ø¬Ø²"
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
                                  title="ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ø­Ø¬Ø² Ø¨Ø§Ù„ÙƒØ§Ù…Ù„"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setWorkflowBooking(b)}
                                  className="p-2 bg-neutral-800 text-amber-400 rounded-lg"
                                  title="Ø³ÙŠØ± Ø¹Ù…Ù„ Ø§Ù„Ø­Ø¬Ø²"
                                >
                                  <CheckSquare className="w-4 h-4" />
                                </button>

                                <a
                                  href={b.phone ? `tel:${b.phone}` : '#'}
                                  className="p-2 bg-neutral-800 text-green-400 rounded-lg"
                                  title="Ø§ØªØµØ§Ù„"
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
              <div>
                <h2 className="text-2xl font-bold text-white">Ø³ÙŠØ± Ø¹Ù…Ù„ Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª</h2>
                <p className="text-xs text-neutral-400 mt-2">Ø§Ø®ØªØ± Ø­Ø¬Ø²Ø§Ù‹ Ù„Ø¥Ø¯Ø§Ø±Ø© Timeline Ùˆ Checklist Ùˆ Payment Schedule Ùˆ Automation.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {safeBookings.filter((b:any)=>b.status!=='cancelled').map((b:any)=>(
                  <button key={b.id} onClick={()=>setWorkflowBooking(b)} className="text-right bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-amber-500/40 transition-all">
                    <div className="font-bold text-white">{b.groomName || 'Ø¨Ø¯ÙˆÙ† Ø§Ø³Ù…'} {b.brideName ? 'Ã— '+b.brideName : ''}</div>
                    <div className="text-xs text-neutral-500 mt-2">#{b.id} â€¢ {b.eventDate || 'Ø¨Ø¯ÙˆÙ† ØªØ§Ø±ÙŠØ®'}</div>
                    <div className="text-xs text-amber-400 mt-3">ÙØªØ­ Ø³ÙŠØ± Ø§Ù„Ø¹Ù…Ù„ â†</div>
                  </button>
                ))}
                {!safeBookings.filter((b:any)=>b.status!=='cancelled').length && <div className="text-neutral-500">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø­Ø¬ÙˆØ²Ø§Øª Ù†Ø´Ø·Ø©.</div>}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Ø§Ù„Ø¥Ø­ØµØ§Ø¦ÙŠØ§Øª ÙˆØ§Ù„Ø£Ø±Ø¨Ø§Ø­
                </h2>
                <p className="text-xs text-neutral-400 mt-2">
                  Ù†Ø¸Ø±Ø© Ø¹Ø§Ù…Ø© Ø¹Ù„Ù‰ Ø£Ø¯Ø§Ø¡ Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª ÙˆØ§Ù„Ø®Ø¯Ù…Ø§Øª.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  ['Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª', safeBookings.length, ''],
                  ['Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª Ø§Ù„Ù†Ø´Ø·Ø©', activeBookings.length, ''],
                  ['Ø§Ù„Ø¥ÙŠØ±Ø§Ø¯ Ø§Ù„Ù…ØªÙˆÙ‚Ø¹', analyticsRevenue.toLocaleString('ar-DZ') + ' DA', ''],
                  ['Ø§Ù„Ù…Ø¨Ù„Øº Ø§Ù„Ù…Ø­ØµÙ„', analyticsPaid.toLocaleString('ar-DZ') + ' DA', ''],
                ].map(([label,value]) => (
                  <div key={String(label)} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-amber-500/30 transition-all">
                    <div className="text-xs text-neutral-400">{label}</div>
                    <div className="text-2xl font-black text-white mt-3">{value}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-amber-500/20 transition-all">
                  <h3 className="font-bold text-white mb-4">ØªÙˆØ²ÙŠØ¹ Ø§Ù„Ø­Ø§Ù„Ø§Øª</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(statusCounts).map(([key,value]) => (
                      <div key={key} className="bg-neutral-950 rounded-xl p-4">
                        <div className="text-xs text-neutral-500">{key === 'new' ? 'Ø¬Ø¯ÙŠØ¯' : key === 'confirmed' ? 'Ù…Ø¤ÙƒØ¯' : key === 'processing' ? 'Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©' : 'Ù…ÙƒØªÙ…Ù„'}</div>
                        <div className="text-xl font-black text-amber-400 mt-1">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                  <h3 className="font-bold text-white mb-4">Ø§Ù„ÙˆØ¶Ø¹ Ø§Ù„Ù…Ø§Ù„ÙŠ</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-neutral-950 rounded-xl p-4"><div className="text-xs text-neutral-500">Ø§Ù„Ù…ØªØ¨Ù‚ÙŠ</div><div className="text-xl font-black text-white mt-1">{analyticsRemaining.toLocaleString('ar-DZ')} DA</div></div>
                    <div className="bg-neutral-950 rounded-xl p-4"><div className="text-xs text-neutral-500">Ù†Ø³Ø¨Ø© Ø§Ù„ØªØ­ØµÙŠÙ„</div><div className="text-xl font-black text-amber-400 mt-1">{analyticsRevenue > 0 ? Math.round((analyticsPaid / analyticsRevenue) * 100) : 0}%</div></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-amber-500/20 transition-all">
                  <div className="text-sm text-neutral-400">
                    Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª
                  </div>
                  <div className="text-3xl font-bold text-white mt-3">
                    {safeBookings.length}
                  </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                  <div className="text-sm text-neutral-400">
                    Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª Ø§Ù„Ù…Ø¤ÙƒØ¯Ø©
                  </div>
                  <div className="text-3xl font-bold text-amber-400 mt-3">
                    {confirmedBookingsCount}
                  </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                  <div className="text-sm text-neutral-400">
                    Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©
                  </div>
                  <div className="text-3xl font-bold text-white mt-3">
                    {newBookingsCount}
                  </div>
                </div>

              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">

                <div className="p-5 border-b border-neutral-800">
                  <h3 className="font-bold text-white">
                    Ù…Ù„Ø®Øµ Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">

                    <thead className="bg-neutral-950 text-neutral-400">
                      <tr>
                        <th className="p-4">Ø§Ù„Ø¹Ù…ÙŠÙ„</th>
                        <th className="p-4">Ø§Ù„Ø®Ø¯Ù…Ø©</th>
                        <th className="p-4">Ø§Ù„ØªØ§Ø±ÙŠØ®</th>
                        <th className="p-4">Ø§Ù„Ø­Ø§Ù„Ø©</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-800">

                      {safeBookings.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-8 text-center text-neutral-500"
                          >
                            Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¨ÙŠØ§Ù†Ø§Øª.
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
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">ØªÙ‚ÙˆÙŠÙ… Ø§Ù„Ù…ÙˆØ§Ø¹ÙŠØ¯ Ø§Ù„Ù…ØªØ·ÙˆØ±</h2>
                  <p className="text-xs text-neutral-400 mt-2">Ø¹Ø±Ø¶ Ø´Ù‡Ø±ÙŠ Ù„Ù„Ù…ÙˆØ§Ø¹ÙŠØ¯ØŒ ØªØ¹Ø¯Ø¯ ØªÙˆØ§Ø±ÙŠØ® Ø§Ù„Ø­Ø¬Ø²ØŒ Ø§Ù„Ø­Ø§Ù„Ø§Øª ÙˆØ§Ù„ØªØ¹Ø§Ø±Ø¶Ø§Øª.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCalendarView('month')} className={`px-3 py-2 rounded-xl text-xs font-bold ${calendarView==='month'?'bg-amber-500 text-black':'bg-neutral-900 text-neutral-300'}`}>Ø´Ù‡Ø±ÙŠ</button>
                  <button onClick={() => setCalendarView('list')} className={`px-3 py-2 rounded-xl text-xs font-bold ${calendarView==='list'?'bg-amber-500 text-black':'bg-neutral-900 text-neutral-300'}`}>Ù‚Ø§Ø¦Ù…Ø©</button>
                </div>
              </div>

              {calendarView === 'month' ? (() => {
                const year = calendarMonth.getFullYear();
                const month = calendarMonth.getMonth();
                const firstDay = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1);
                const dayBookings = (day: number) => calendarBookings.filter((b:any) =>
                  getBookingDates(b).some((d:string) => d === `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`)
                );
                return (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={() => setCalendarMonth(new Date(year, month - 1, 1))} className="px-3 py-2 bg-neutral-800 rounded-xl">â€¹</button>
                      <h3 className="font-bold text-white">{calendarMonth.toLocaleDateString('ar-DZ',{month:'long',year:'numeric'})}</h3>
                      <button onClick={() => setCalendarMonth(new Date(year, month + 1, 1))} className="px-3 py-2 bg-neutral-800 rounded-xl">â€º</button>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center text-xs text-neutral-500 mb-2">
                      {['Ø§Ù„Ø£Ø­Ø¯','Ø§Ù„Ø§Ø«Ù†ÙŠÙ†','Ø§Ù„Ø«Ù„Ø§Ø«Ø§Ø¡','Ø§Ù„Ø£Ø±Ø¨Ø¹Ø§Ø¡','Ø§Ù„Ø®Ù…ÙŠØ³','Ø§Ù„Ø¬Ù…Ø¹Ø©','Ø§Ù„Ø³Ø¨Øª'].map(d=><div key={d}>{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {cells.map((day, i) => {
                        if (!day) return <div key={i} className="min-h-28 bg-neutral-950/40 rounded-xl" />;
                        const items = dayBookings(day);
                        return <div key={day} className="min-h-28 bg-neutral-950 border border-neutral-800 rounded-xl p-2 text-right">
                          <div className="text-xs font-bold text-neutral-400 mb-2">{day}</div>
                          <div className="space-y-1">
                            {items.slice(0,3).map((b:any)=><button key={b.id} onClick={()=>setWorkflowBooking(b)} className="w-full text-right truncate px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300">{b.eventTime || 'â€”'} â€¢ {b.groomName || 'Ø­Ø¬Ø²'}</button>)}
                            {items.length>3 && <div className="text-[10px] text-neutral-500">+{items.length-3} Ø­Ø¬ÙˆØ²Ø§Øª</div>}
                          </div>
                        </div>;
                      })}
                    </div>
                  </div>
                );
              })() : (
                <div className="space-y-3">
                  {calendarBookings.map((b:any)=><div key={b.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                    <div><div className="font-bold">{b.groomName || 'â€”'} Ã— {b.brideName || 'â€”'}</div><div className="text-xs text-neutral-500 mt-1">{getBookingDates(b).join(' â€¢ ')} â€¢ {b.eventTime || 'â€”'} â€¢ {b.venue || 'â€”'}</div></div>
                    <div className="flex items-center gap-2"><span className="text-xs text-amber-400">{b.status || 'new'}</span><button onClick={()=>setWorkflowBooking(b)} className="px-3 py-2 bg-neutral-800 rounded-xl text-xs">Ø³ÙŠØ± Ø§Ù„Ø¹Ù…Ù„</button><button onClick={()=>openWhatsAppAutomation(b,'reminder')} className="px-3 py-2 bg-emerald-600/20 text-emerald-300 rounded-xl text-xs">WhatsApp</button></div>
                  </div>)}
                </div>
              )}
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                <h2 className="text-2xl font-bold">Automation Center</h2>
                <p className="text-xs text-neutral-400 mt-2">Ø·Ø§Ø¨ÙˆØ± Ø§Ù„Ø£ØªÙ…ØªØ© ÙˆØ§Ù„Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª Ø§Ù„ØªÙŠ ØªÙ… Ø¥Ù†Ø´Ø§Ø¤Ù‡Ø§ Ù„Ù„Ø­Ø¬ÙˆØ²Ø§Øª.</p>
              </div>
              <div className="grid gap-3">
                {automationNotifications.length === 0 ? (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-500">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¹Ù…Ù„ÙŠØ§Øª Ø£ØªÙ…ØªØ© Ø¨Ø¹Ø¯.</div>
                ) : automationNotifications.map((item:any) => (
                  <div key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-bold">{item.type === 'whatsapp_manual' ? 'WhatsApp' : item.type === 'status_change' ? 'ØªØºÙŠÙŠØ± Ø­Ø§Ù„Ø©' : item.type}</div>
                      <div className="text-xs text-neutral-400 mt-1">{item.groomName || 'â€”'} â€¢ {item.phone || 'â€”'} â€¢ {item.toStatus ? `${item.fromStatus} â†’ ${item.toStatus}` : item.action || ''}</div>
                    </div>
                    {item.message && <button onClick={() => { navigator.clipboard?.writeText(item.message); alert('ØªÙ… Ù†Ø³Ø® Ø§Ù„Ø±Ø³Ø§Ù„Ø©.'); }} className="px-3 py-2 bg-neutral-800 rounded-xl text-xs">Ù†Ø³Ø® Ø§Ù„Ø±Ø³Ø§Ù„Ø©</button>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'scan' && (
          <section className="space-y-5" data-admin-dashboard>
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Ibra Scan Center</h2>
                  <p className="text-xs text-neutral-400 mt-1">USB Barcode / QR â€” Ø§Ù…Ø³Ø­ Ø«Ù… Enter.</p>
                </div>
                <span className="text-xs px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400">{scanMessage}</span>
              </div>
              <input autoFocus value={scanCode} onChange={e=>setScanCode(e.target.value)}
                onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();void handleScan(scanCode)}}}
                placeholder="ÙˆØ¬Ù‘Ù‡ Ø§Ù„Ù‚Ø§Ø±Ø¦ Ù„Ù„ÙƒÙˆØ¯..." className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-4 text-lg text-white outline-none focus:border-amber-500" />
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={()=>void handleScan(scanCode)} className="px-5 py-3 rounded-xl bg-amber-500 text-neutral-950 font-bold">Ù…Ø³Ø­ Ø§Ù„ÙƒÙˆØ¯</button>
                <button onClick={()=>{setScanCode('');setScanResult(null)}} className="px-5 py-3 rounded-xl bg-neutral-800 text-white">Ù…Ø³Ø­ Ø§Ù„Ø­Ù‚Ù„</button>
              </div>
            </div>

            {scanResult && (
              <div className="bg-neutral-900 border border-amber-500/30 rounded-2xl p-5">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h3 className="font-bold text-white">Ù†ØªÙŠØ¬Ø© Ø¢Ø®Ø± Scan</h3>
                  <span className="text-xs text-amber-400">{scanResult.scanType}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="bg-neutral-950 rounded-xl p-3"><span className="text-neutral-500 block">Ø§Ù„ÙƒÙˆØ¯</span><b className="font-mono text-amber-300 break-all">{scanResult.code}</b></div>
                  <div className="bg-neutral-950 rounded-xl p-3"><span className="text-neutral-500 block">Ø§Ù„Ø¹Ù…ÙŠÙ„</span><b>{scanResult.groomName || 'â€”'}</b></div>
                  <div className="bg-neutral-950 rounded-xl p-3"><span className="text-neutral-500 block">Ø§Ù„Ù‡Ø§ØªÙ</span><b>{scanResult.phone || 'â€”'}</b></div>
                  <div className="bg-neutral-950 rounded-xl p-3"><span className="text-neutral-500 block">Ø§Ù„Ø­Ø§Ù„Ø©</span><b>{scanResult.status || 'â€”'}</b></div>
                </div>
                {scanResult.bookingId && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button onClick={()=>setWorkflowBooking(safeBookings.find((b:any)=>b.id===scanResult.bookingId)||null)} className="px-4 py-2.5 bg-amber-500 text-black rounded-xl font-bold">ÙØªØ­ Ù…Ù„Ù Ø§Ù„Ø¹Ù…Ù„</button>
                    <button onClick={()=>setActiveTab('bookings')} className="px-4 py-2.5 bg-neutral-800 rounded-xl">ÙØªØ­ Ø§Ù„Ø­Ø¬Ø²</button>
                  </div>
                )}
              </div>
            )}

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-neutral-800 flex items-center justify-between"><h3 className="font-bold text-white">Ø³Ø¬Ù„ Ø¹Ù…Ù„ÙŠØ§Øª Scan</h3><span className="text-xs text-neutral-500">Ø¢Ø®Ø± 100 Ø¹Ù…Ù„ÙŠØ©</span></div>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-neutral-950 text-neutral-400"><tr><th className="p-3 text-right">Ø§Ù„ÙƒÙˆØ¯</th><th className="p-3 text-right">Ø§Ù„Ù†ÙˆØ¹</th><th className="p-3 text-right">Ø§Ù„Ù†ØªÙŠØ¬Ø©</th><th className="p-3 text-right">Ø§Ù„Ø¹Ù…ÙŠÙ„</th><th className="p-3 text-right">Ø§Ù„Ù…Ø´ØºÙ„</th><th className="p-3 text-right">Ø§Ù„ÙˆÙ‚Øª</th></tr></thead>
                <tbody>{scanLogs.map((log:any)=><tr key={log.id} className="border-t border-neutral-800"><td className="p-3 font-mono text-amber-300">{log.code}</td><td className="p-3">{log.scanType}</td><td className="p-3 text-neutral-300">{log.result}</td><td className="p-3">{log.groomName||'â€”'}</td><td className="p-3 text-neutral-400">{log.operator||'â€”'}</td><td className="p-3 text-neutral-500">{log.createdAt?.toDate?log.createdAt.toDate().toLocaleString('ar-DZ'):'Ø§Ù„Ø¢Ù†'}</td></tr>)}
                {!scanLogs.length&&<tr><td colSpan={6} className="p-8 text-center text-neutral-500">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¹Ù…Ù„ÙŠØ§Øª Scan Ø¨Ø¹Ø¯.</td></tr>}</tbody>
              </table></div>
            </div>
          </section>
        )}


        {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                <h2 className="text-2xl font-bold">Ø§Ù„Ø¥Ø´Ø¹Ø§Ø±Ø§Øª ÙˆØ§Ù„Ø£ØªÙ…ØªØ©</h2>
                <p className="text-xs text-neutral-400 mt-2">ØªÙ†Ø¨ÙŠÙ‡Ø§Øª Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ… ÙˆÙ‚Ø§Ø¦Ù…Ø© Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„Ø£ØªÙ…ØªØ© Ø§Ù„Ø£Ø®ÙŠØ±Ø©.</p>
                <button
                  onClick={handleEnablePushNotifications}
                  className="mt-4 px-4 py-2.5 bg-amber-500 text-black rounded-xl text-xs font-bold"
                >
                  ØªÙØ¹ÙŠÙ„ Ø¥Ø´Ø¹Ø§Ø±Ø§Øª Ø§Ù„Ù…ØªØµÙØ­
                </button>
              </div>
              <div className="grid gap-3">
                {automationNotifications.map((item:any) => (
                  <div key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-bold">{item.type === 'status_change' ? 'ØªØºÙŠÙŠØ± Ø­Ø§Ù„Ø© Ø§Ù„Ø­Ø¬Ø²' : item.type === 'whatsapp_manual' ? 'WhatsApp' : 'Automation'}</div>
                      <span className="text-[11px] text-neutral-500">{item.status || 'queued'}</span>
                    </div>
                    <div className="text-sm text-neutral-300 mt-2">{item.groomName || 'â€”'} {item.toStatus ? `â€¢ ${item.fromStatus || ''} â†’ ${item.toStatus}` : ''}</div>
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
                    Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø®Ø¯Ù…Ø§Øª
                  </h2>
                  <p className="text-xs text-neutral-400 mt-2">
                    Ø¥Ø¶Ø§ÙØ© ÙˆØªØ¹Ø¯ÙŠÙ„ ÙˆØ­Ø°Ù Ø§Ù„Ø®Ø¯Ù…Ø§Øª.
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
                  Ø¥Ø¶Ø§ÙØ© Ø®Ø¯Ù…Ø©
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
                              : 'Ø­Ø³Ø¨ Ø§Ù„Ø·Ù„Ø¨'}
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
                                    'Ù‡Ù„ ØªØ±ÙŠØ¯ Ø­Ø°Ù Ù‡Ø°Ù‡ Ø§Ù„Ø®Ø¯Ù…Ø©ØŸ'
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
                    Ù„Ø§ ØªÙˆØ¬Ø¯ Ø®Ø¯Ù…Ø§Øª Ø­Ø§Ù„ÙŠØ§Ù‹.
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
                    Ø§Ù„Ø¨Ø§Ù‚Ø§Øª ÙˆØ§Ù„Ø£Ø³Ø¹Ø§Ø±
                  </h2>
                  <p className="text-xs text-neutral-400 mt-2">
                    Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø¨Ø§Ù‚Ø§Øª Ø§Ù„Ø®Ø§ØµØ© Ø¨Ù€ Ibra Production.
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
                  Ø¥Ø¶Ø§ÙØ© Ø¨Ø§Ù‚Ø©
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
                          : 'Ø­Ø³Ø¨ Ø§Ù„Ø·Ù„Ø¨'}
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
                                'Ù‡Ù„ ØªØ±ÙŠØ¯ Ø­Ø°Ù Ù‡Ø°Ù‡ Ø§Ù„Ø¨Ø§Ù‚Ø©ØŸ'
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
                    Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¨Ø§Ù‚Ø§Øª Ø­Ø§Ù„ÙŠØ§Ù‹.
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
                    Ù…Ø¹Ø±Ø¶ Ø§Ù„Ø£Ø¹Ù…Ø§Ù„
                  </h2>
                  <p className="text-xs text-neutral-400 mt-2">
                    Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„ØµÙˆØ± ÙˆØ§Ù„Ø£Ø¹Ù…Ø§Ù„ Ø§Ù„Ù…Ù†Ø´ÙˆØ±Ø© ÙÙŠ Ø§Ù„Ù…ÙˆÙ‚Ø¹.
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
                  Ø¥Ø¶Ø§ÙØ© Ø¹Ù…Ù„
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
                          {item.location || ''} â€¢ {item.date || ''}
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
                              ? 'Ø¸Ø§Ù‡Ø±'
                              : 'Ù…Ø®ÙÙŠ'}
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
                                    'Ù‡Ù„ ØªØ±ÙŠØ¯ Ø­Ø°Ù Ù‡Ø°Ø§ Ø§Ù„Ø¹Ù…Ù„ØŸ'
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
                    Ù„Ø§ ØªÙˆØ¬Ø¯ Ø£Ø¹Ù…Ø§Ù„ ÙÙŠ Ø§Ù„Ù…Ø¹Ø±Ø¶ Ø­Ø§Ù„ÙŠØ§Ù‹.
                  </div>
                )}

              </div>

            </div>
          )}

          {activeTab === 'videos' && (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold font-cinzel text-white">
        Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„ÙÙŠØ¯ÙŠÙˆÙ‡Ø§Øª
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
        Ø¥Ø¶Ø§ÙØ© ÙÙŠØ¯ÙŠÙˆ
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
              ØªØ¹Ø¯ÙŠÙ„
            </button>

            <button
              onClick={() => {
                if (confirm('Ù‡Ù„ Ø£Ù†Øª Ù…ØªØ£ÙƒØ¯ Ù…Ù† Ø­Ø°Ù Ù‡Ø°Ø§ Ø§Ù„ÙÙŠØ¯ÙŠÙˆØŸ')) {
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
              {videoModal.id ? 'ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„ÙÙŠØ¯ÙŠÙˆ' : 'Ø¥Ø¶Ø§ÙØ© ÙÙŠØ¯ÙŠÙˆ Ø¬Ø¯ÙŠØ¯'}
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
            placeholder="Ø¹Ù†ÙˆØ§Ù† Ø§Ù„ÙÙŠØ¯ÙŠÙˆ Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©"
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
              <div className="flex-1"><div className="text-sm text-white font-semibold">Ø±ÙØ¹ ÙÙŠØ¯ÙŠÙˆ Ù…Ù† Ø§Ù„Ø­Ø§Ø³ÙˆØ¨</div><div className="text-xs text-neutral-500">MP4 / WEBM / MOV â€” Ø­ØªÙ‰ 500MB</div></div>
              <input type="file" accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska" className="hidden" disabled={videoUploading} onChange={async e=>{const file=e.target.files?.[0];if(!file)return;try{setVideoUploading(true);const url=await uploadVideoFile(file);setVideoModal((m:any)=>({...m,videoUrl:url}));}catch(error){alert(error instanceof Error?error.message:'ÙØ´Ù„ Ø±ÙØ¹ Ø§Ù„ÙÙŠØ¯ÙŠÙˆ.');}finally{setVideoUploading(false);e.target.value='';}}}/>
            </label>
            {videoUploading && <div className="text-xs text-amber-400">Ø¬Ø§Ø±Ù Ø±ÙØ¹ Ø§Ù„ÙÙŠØ¯ÙŠÙˆ...</div>}
            <input value={videoModal.videoUrl || ''} onChange={e=>setVideoModal({...videoModal,videoUrl:e.target.value})} placeholder="Ø£Ùˆ Ø£Ø¯Ø®Ù„ Ø±Ø§Ø¨Ø· Ø§Ù„ÙÙŠØ¯ÙŠÙˆ" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
          </div>

          <input
            value={videoModal.thumbnail || ''}
            onChange={e =>
              setVideoModal({
                ...videoModal,
                thumbnail: e.target.value
              })
            }
            placeholder="Ø±Ø§Ø¨Ø· Ø§Ù„ØµÙˆØ±Ø© Ø§Ù„Ù…ØµØºØ±Ø©"
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
            placeholder="Ø§Ù„Ù…Ø¯Ø© Ù…Ø«Ø§Ù„: 01:25"
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
              Ø¥Ù„ØºØ§Ø¡
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
                  Ø¢Ø±Ø§Ø¡ Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡
                </h2>
                <p className="text-xs text-neutral-400 mt-2">
                  Ø¥Ø¯Ø§Ø±Ø© Ø´Ù‡Ø§Ø¯Ø§Øª ÙˆØ¢Ø±Ø§Ø¡ Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ ÙˆØµÙˆØ±Ù‡Ù….
                </p>
                <button onClick={()=>setTestimonialModal({clientName:'',rating:5,commentAr:'',commentFr:'',commentEn:'',date:new Date().toISOString().slice(0,10),approved:true,image:''})} className="mt-4 px-5 py-2.5 bg-amber-500 text-neutral-950 rounded-xl font-bold">+ Ø¥Ø¶Ø§ÙØ© Ø±Ø£ÙŠ Ø¹Ù…ÙŠÙ„</button>
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
                        <button onClick={()=>setTestimonialModal({...item})} className="px-3 py-2 bg-neutral-800 rounded-xl text-xs font-bold"><Edit className="w-4 h-4 inline ml-1"/>ØªØ¹Ø¯ÙŠÙ„</button>
                        <div>
                          <h3 className="font-bold text-white">
                            {item.name ||
                              item.clientName ||
                              'Ø¹Ù…ÙŠÙ„'}
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
                            â˜… {item.rating}
                          </span>
                        )}

                      </div>

                    </div>
                  ))
                ) : (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-500">
                    Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¢Ø±Ø§Ø¡ Ø­Ø§Ù„ÙŠØ§Ù‹.
                  </div>
                )}

              </div>

            </div>
          )}

          {activeTab === 'offers' && (
            <div className="space-y-6">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Ø§Ù„Ø¹Ø±ÙˆØ¶ Ø§Ù„Ø®Ø§ØµØ©
                </h2>
                <p className="text-xs text-neutral-400 mt-2">
                  Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø¹Ø±ÙˆØ¶ Ø§Ù„ØªÙŠ ØªØ¸Ù‡Ø± Ù„Ù„Ø¹Ù…Ù„Ø§Ø¡.
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
                        <div className="flex gap-2"><button onClick={()=>setOfferModal({...offer})} className="px-3 py-2 bg-neutral-800 rounded-xl text-xs font-bold"><Edit className="w-4 h-4 inline ml-1"/>ØªØ¹Ø¯ÙŠÙ„</button></div>
                        <Tag className="w-6 h-6 text-amber-400" />

                        <span className="text-xs text-neutral-500">
                          {offer.visible !== false
                            ? 'Ù†Ø´Ø·'
                            : 'Ù…Ø®ÙÙŠ'}
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
                    Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¹Ø±ÙˆØ¶ Ø­Ø§Ù„ÙŠØ§Ù‹.
                  </div>
                )}

              </div>

            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Ø±Ø³Ø§Ø¦Ù„ Ø§Ù„ØªÙˆØ§ØµÙ„
                </h2>

                <p className="text-xs text-neutral-400 mt-2">
                  Ø§Ù„Ø±Ø³Ø§Ø¦Ù„ Ø§Ù„Ù…Ø±Ø³Ù„Ø© Ù…Ù† Ø²ÙˆØ§Ø± Ø§Ù„Ù…ÙˆÙ‚Ø¹.
                </p>
              </div>

              <div className="space-y-4">

                {safeMessages.length === 0 ? (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-500">
                    Ù„Ø§ ØªÙˆØ¬Ø¯ Ø±Ø³Ø§Ø¦Ù„.
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
                                Ø¬Ø¯ÙŠØ¯
                              </span>
                            )}

                          </div>

                          <div className="flex flex-wrap gap-4 mt-2 text-xs text-neutral-400">

                            {message.phone && (
                              <span>
                                Ø§Ù„Ù‡Ø§ØªÙ: {message.phone}
                              </span>
                            )}

                            {message.email && (
                              <span>
                                Ø§Ù„Ø¨Ø±ÙŠØ¯: {message.email}
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
                              title="ØªØ­Ø¯ÙŠØ¯ ÙƒÙ…Ù‚Ø±ÙˆØ¡"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  'Ù‡Ù„ ØªØ±ÙŠØ¯ Ø­Ø°Ù Ù‡Ø°Ù‡ Ø§Ù„Ø±Ø³Ø§Ù„Ø©ØŸ'
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
          {activeTab === 'idcards' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Ø¨Ø·Ø§Ù‚Ø§Øª Ø§Ù„ØªØ¹Ø±ÙŠÙ Ø§Ù„Ù…Ø³Ø¬Ù„Ø©</h2>
                <p className="text-xs text-neutral-400 mt-2">Ù…Ø¹Ø§ÙŠÙ†Ø© ÙˆØªØ­Ù…ÙŠÙ„ Ø¢Ù…Ù† Ù„Ø¨Ø·Ø§Ù‚Ø§Øª Ø§Ù„ØªØ¹Ø±ÙŠÙ Ø§Ù„Ù…Ø±ÙÙˆØ¹Ø© Ù…Ø¹ Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª.</p>
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
                      <div>Ø§Ù„Ù‡Ø§ØªÙ: {b.phone || '-'}</div>
                      <div>Ø§Ù„ØªØ§Ø±ÙŠØ®: {Array.isArray(b.eventDates) && b.eventDates.length ? b.eventDates.join('ØŒ ') : (b.eventDate || '-')}</div>
                      <div className="break-all">Ø§Ù„Ù…Ù„Ù: {b.idCardName || 'Ø¨Ø·Ø§Ù‚Ø© Ø§Ù„ØªØ¹Ø±ÙŠÙ'}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <button type="button" disabled={idCardLoading} onClick={() => previewIdCard(b)} className="flex items-center justify-center gap-2 px-3 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold disabled:opacity-50">
                        <Eye className="w-4 h-4" /> Ù…Ø¹Ø§ÙŠÙ†Ø©
                      </button>
                      <button type="button" disabled={idCardLoading} onClick={() => downloadIdCard(b)} className="flex items-center justify-center gap-2 px-3 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl text-xs font-bold disabled:opacity-50">
                        <Download className="w-4 h-4" /> ØªØ­Ù…ÙŠÙ„
                      </button>
                    </div>
                  </div>
                ))}
                {safeBookings.filter((b:any) => b.idCardUrl).length === 0 && (
                  <div className="col-span-full bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center text-neutral-500">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¨Ø·Ø§Ù‚Ø§Øª ØªØ¹Ø±ÙŠÙ Ù…Ø³Ø¬Ù„Ø©.</div>
                )}
              </div>

              {idCardPreview && (
                <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="w-full max-w-5xl h-[90vh] bg-neutral-900 border border-amber-500/30 rounded-3xl overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between gap-3 p-4 border-b border-neutral-800">
                      <div className="min-w-0">
                        <div className="text-white font-bold">Ù…Ø¹Ø§ÙŠÙ†Ø© Ø¨Ø·Ø§Ù‚Ø© Ø§Ù„ØªØ¹Ø±ÙŠÙ</div>
                        <div className="text-xs text-neutral-500 truncate">{idCardPreview.name}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={idCardPreview.url} download={idCardPreview.name} className="px-4 py-2 bg-amber-500 text-neutral-950 rounded-xl text-xs font-bold">ØªØ­Ù…ÙŠÙ„</a>
                        <button type="button" onClick={() => { URL.revokeObjectURL(idCardPreview.url); setIdCardPreview(null); }} className="p-2 bg-neutral-800 text-white rounded-xl">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 bg-neutral-950 p-4 overflow-auto flex items-center justify-center">
                      {idCardPreview.type.includes('pdf') ? (
                        <iframe src={idCardPreview.url} title="Ù…Ø¹Ø§ÙŠÙ†Ø© Ø¨Ø·Ø§Ù‚Ø© Ø§Ù„ØªØ¹Ø±ÙŠÙ" className="w-full h-full rounded-xl bg-white" />
                      ) : (
                        <img src={idCardPreview.url} alt="Ø¨Ø·Ø§Ù‚Ø© Ø§Ù„ØªØ¹Ø±ÙŠÙ" className="max-w-full max-h-full object-contain rounded-xl" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'team' && (
            <TeamManagement />
          )}
           {activeTab === 'settings' && (
            <div className="space-y-6">

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ù…ÙˆÙ‚Ø¹
                </h2>
                <p className="text-xs text-neutral-400 mt-2">
                  ØªØ¹Ø¯ÙŠÙ„ Ù…Ø¹Ù„ÙˆÙ…Ø§Øª ÙˆØ¨ÙŠØ§Ù†Ø§Øª Ibra Production.
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-5">

                <div>
                  <label className="block text-xs text-neutral-400 mb-2">
                    Ø§Ø³Ù… Ø§Ù„ÙˆÙƒØ§Ù„Ø©
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
                    Ø§Ù„Ù‡Ø§ØªÙ
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
                    Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ
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
                    Ø§Ù„Ø¹Ù†ÙˆØ§Ù† Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©
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
                      alert('ØªÙ… Ø­ÙØ¸ Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ù…ÙˆÙ‚Ø¹ Ø¨Ù†Ø¬Ø§Ø­.');
                    }}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl font-bold text-sm"
                  >
                    Ø­ÙØ¸ Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª
                  </button>

                </div>

              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">

                <h3 className="font-bold text-white mb-4">
                  Ø§Ù„Ù†Ø³Ø® Ø§Ù„Ø§Ø­ØªÙŠØ§Ø·ÙŠ
                </h3>

                <div className="flex flex-wrap gap-3">

                  <button
                    onClick={handleBackupExport}
                    className="flex items-center gap-2 px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-bold"
                  >
                    <Download className="w-4 h-4" />
                    ØªØµØ¯ÙŠØ± Ù†Ø³Ø®Ø© Ø§Ø­ØªÙŠØ§Ø·ÙŠØ©
                  </button>

                  <label className="flex items-center gap-2 px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-bold cursor-pointer">

                    <Upload className="w-4 h-4" />

                    Ø§Ø³ØªØ¹Ø§Ø¯Ø© Ù†Ø³Ø®Ø© Ø§Ø­ØªÙŠØ§Ø·ÙŠØ©

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
                  Ø³Ø¬Ù„ Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª
                </h2>
                <p className="text-xs text-neutral-400 mt-2">
                  Ø¢Ø®Ø± Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„ØªÙŠ ØªÙ…Øª Ø¯Ø§Ø®Ù„ Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ….
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
                              'Ø¹Ù…Ù„ÙŠØ©'}
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
                    Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¹Ù…Ù„ÙŠØ§Øª Ù…Ø³Ø¬Ù„Ø©.
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
                Ø¥Ø±Ø³Ø§Ù„ Ø±Ø³Ø§Ù„Ø© ØªØ£ÙƒÙŠØ¯
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
                Ø¥Ù„ØºØ§Ø¡
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
                ÙØªØ­ ØªØ·Ø¨ÙŠÙ‚ SMS
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
                    <div className="text-sm text-neutral-300 mt-1">ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø­Ø¬Ø² Ø§Ù„Ø±Ø³Ù…ÙŠØ©</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-[11px] text-neutral-400">Ø±Ù‚Ù… Ø§Ù„Ø­Ø¬Ø²</div>
                  <div className="text-xl font-black text-amber-400">#{String(invoiceModalData.id || '').slice(-8) || '-'}</div>
                  <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-white/10 text-xs font-bold">
                    {invoiceModalData.status === 'new' ? 'Ø¬Ø¯ÙŠØ¯' :
                     invoiceModalData.status === 'confirmed' ? 'Ù…Ø¤ÙƒØ¯' :
                     invoiceModalData.status === 'processing' ? 'Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©' :
                     invoiceModalData.status === 'completed' ? 'Ù…ÙƒØªÙ…Ù„' :
                     invoiceModalData.status === 'cancelled' ? 'Ù…Ù„ØºÙŠ' :
                     invoiceModalData.status || '-'}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-7">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-7 bg-amber-500 rounded-full" />
                  <h3 className="text-lg font-black">Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¹Ù…ÙŠÙ„</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    ['Ø§Ø³Ù… Ø§Ù„Ø¹Ø±ÙŠØ³', invoiceModalData.groomName],
                    ['Ø§Ø³Ù… Ø§Ù„Ø¹Ø±ÙˆØ³', invoiceModalData.brideName],
                    ['Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ', invoiceModalData.phone],
                    ['Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ', invoiceModalData.email],
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
                  <h3 className="text-lg font-black">ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø©</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">Ù†ÙˆØ¹ Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø©</div>
                    <div className="font-bold">{invoiceModalData.eventType || '-'}</div>
                  </div>
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">Ø§Ù„ÙˆÙ„Ø§ÙŠØ©</div>
                    <div className="font-bold">{invoiceModalData.wilaya || '-'}</div>
                  </div>
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">Ø§Ù„Ù…ÙƒØ§Ù† / Ø§Ù„Ù‚Ø§Ø¹Ø©</div>
                    <div className="font-bold">{invoiceModalData.venue || '-'}</div>
                  </div>
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">Ø§Ù„ÙˆÙ‚Øª</div>
                    <div className="font-bold">{invoiceModalData.eventTime || '-'}</div>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="text-xs text-amber-700 mb-2 font-bold">ØªÙˆØ§Ø±ÙŠØ® Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø©</div>
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
                  <h3 className="text-lg font-black">Ø§Ù„Ø®Ø¯Ù…Ø© ÙˆØ§Ù„Ø¨Ø§Ù‚Ø§Øª</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">Ø§Ù„Ø®Ø¯Ù…Ø©</div>
                    <div className="font-bold">
                      {services.find((s: any) => s.id === invoiceModalData.serviceId)?.titleAr || invoiceModalData.serviceId || '-'}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1">ID: {invoiceModalData.serviceId || '-'}</div>
                  </div>
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">Ø§Ù„Ø¨Ø§Ù‚Ø©</div>
                    <div className="font-bold">
                      {packages.find((p: any) => p.id === invoiceModalData.packageId)?.nameAr || invoiceModalData.packageId || '-'}
                    </div>
                    {invoiceModalData.packageId && (
                      <div className="text-[11px] text-neutral-400 mt-1">
                        ID: {invoiceModalData.packageId}
                        {packages.find((p: any) => p.id === invoiceModalData.packageId)?.price != null
                          ? ` â€¢ ${packages.find((p: any) => p.id === invoiceModalData.packageId)?.price} DA`
                          : ''}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-7 bg-amber-500 rounded-full" />
                  <h3 className="text-lg font-black">Ø§Ù„Ø¬Ø§Ù†Ø¨ Ø§Ù„Ù…Ø§Ù„ÙŠ ÙˆØ§Ù„Ù…ØªØ§Ø¨Ø¹Ø©</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    ['Ø§Ù„Ø³Ø¹Ø± Ø§Ù„Ø¥Ø¬Ù…Ø§Ù„ÙŠ', invoiceModalData.totalPrice ?? invoiceModalData.total ?? invoiceModalData.price],
                    ['Ø§Ù„Ù…Ø¨Ù„Øº Ø§Ù„Ù…Ø¯ÙÙˆØ¹', invoiceModalData.totalPaid ?? invoiceModalData.paidAmount ?? invoiceModalData.paid],
                    ['Ø§Ù„Ù…Ø¨Ù„Øº Ø§Ù„Ù…ØªØ¨Ù‚ÙŠ', invoiceModalData.remainingBalance ?? invoiceModalData.remaining ?? invoiceModalData.balance],
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
                  <h3 className="text-lg font-black">Ù…Ù„Ø§Ø­Ø¸Ø§Øª ÙˆÙ…Ù„ÙØ§Øª</h3>
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ø§Ù„Ø¹Ù…ÙŠÙ„</div>
                    <div className="font-medium whitespace-pre-wrap break-words">{invoiceModalData.notes || 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ù„Ø§Ø­Ø¸Ø§Øª.'}</div>
                  </div>
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">Ø¨Ø·Ø§Ù‚Ø© Ø§Ù„ØªØ¹Ø±ÙŠÙ Ø§Ù„ÙˆØ·Ù†ÙŠØ©</div>
                    <div className="font-bold break-all">{invoiceModalData.idCardName || 'Ù…Ù„Ù Ø¨Ø·Ø§Ù‚Ø© Ø§Ù„ØªØ¹Ø±ÙŠÙ'}</div>
                    {invoiceModalData.idCardUrl ? (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button type="button" onClick={() => previewIdCard(invoiceModalData)} disabled={idCardLoading} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 text-sm font-bold disabled:opacity-50">
                          <Eye className="w-4 h-4" /> {idCardLoading ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ­Ù…ÙŠÙ„...' : 'Ù…Ø¹Ø§ÙŠÙ†Ø©'}
                        </button>
                        <button type="button" onClick={() => downloadIdCard(invoiceModalData)} disabled={idCardLoading} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-white text-sm font-bold border border-neutral-700 disabled:opacity-50">
                          <Download className="w-4 h-4" /> ØªØ­Ù…ÙŠÙ„
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-red-500 mt-1">Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…Ù„Ù Ù…Ø±ÙÙ‚</div>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-7 bg-amber-500 rounded-full" />
                  <h3 className="text-lg font-black">Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ù†Ø¸Ø§Ù…</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                    <div className="text-xs text-neutral-500 mb-1">ØªØ§Ø±ÙŠØ® Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø­Ø¬Ø²</div>
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
                    <div className="text-xs text-neutral-500 mb-1">Ù…Ø¹Ø±Ù‘Ù Ø§Ù„Ø­Ø¬Ø² Ø§Ù„ÙƒØ§Ù…Ù„</div>
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
                    <h3 className="text-lg font-black">Ø¨ÙŠØ§Ù†Ø§Øª Ø¥Ø¶Ø§ÙÙŠØ©</h3>
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
                <span className="text-xs text-neutral-500 self-center">ØªØºÙŠÙŠØ± Ø§Ù„Ø­Ø§Ù„Ø©:</span>
                {[
                  ['confirmed','ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø­Ø¬Ø²'],
                  ['processing','Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©'],
                  ['completed','Ù…ÙƒØªÙ…Ù„'],
                  ['cancelled','Ø¥Ù„ØºØ§Ø¡ Ø§Ù„Ø­Ø¬Ø²']
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
                  Ø¥ØºÙ„Ø§Ù‚
                </button>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(String(invoiceModalData.id || ''));
                      alert('ØªÙ… Ù†Ø³Ø® Ø±Ù‚Ù… Ø§Ù„Ø­Ø¬Ø².');
                    }}
                    className="px-4 py-3 bg-neutral-100 text-neutral-900 rounded-xl font-bold text-sm"
                  >
                    Ù†Ø³Ø® Ø±Ù‚Ù… Ø§Ù„Ø­Ø¬Ø²
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
                    ØªØµØ¯ÙŠØ± Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª
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
                <span>Ø·ÙØ¨Ø¹ ÙÙŠ: {new Date().toLocaleString('ar-DZ')}</span>
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
                <h3 className="text-xl font-black text-white">ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ø­Ø¬Ø² Ø¨Ø§Ù„ÙƒØ§Ù…Ù„</h3>
                <p className="text-xs text-neutral-500 mt-1">Ø±Ù‚Ù… Ø§Ù„Ø­Ø¬Ø²: #{String(bookingEditModal.id || '').slice(-8)}</p>
              </div>
              <button onClick={() => setBookingEditModal(null)} className="p-2 bg-neutral-800 rounded-full text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-1">
              <input value={bookingEditModal.groomName || ''} onChange={e => setBookingEditModal({...bookingEditModal, groomName:e.target.value})} placeholder="Ø§Ø³Ù… Ø§Ù„Ø¹Ø±ÙŠØ³" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input value={bookingEditModal.brideName || ''} onChange={e => setBookingEditModal({...bookingEditModal, brideName:e.target.value})} placeholder="Ø§Ø³Ù… Ø§Ù„Ø¹Ø±ÙˆØ³" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input value={bookingEditModal.phone || ''} onChange={e => setBookingEditModal({...bookingEditModal, phone:e.target.value})} placeholder="Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input type="email" value={bookingEditModal.email || ''} onChange={e => setBookingEditModal({...bookingEditModal, email:e.target.value})} placeholder="Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input value={bookingEditModal.eventType || ''} onChange={e => setBookingEditModal({...bookingEditModal, eventType:e.target.value})} placeholder="Ù†ÙˆØ¹ Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø©" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input value={bookingEditModal.wilaya || ''} onChange={e => setBookingEditModal({...bookingEditModal, wilaya:e.target.value})} placeholder="Ø§Ù„ÙˆÙ„Ø§ÙŠØ©" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input value={bookingEditModal.venue || ''} onChange={e => setBookingEditModal({...bookingEditModal, venue:e.target.value})} placeholder="Ø§Ù„Ù‚Ø§Ø¹Ø© / Ø§Ù„Ù…ÙƒØ§Ù†" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input value={bookingEditModal.eventTime || ''} onChange={e => setBookingEditModal({...bookingEditModal, eventTime:e.target.value})} placeholder="ÙˆÙ‚Øª Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø©" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input value={bookingEditModal.serviceId || ''} onChange={e => setBookingEditModal({...bookingEditModal, serviceId:e.target.value})} placeholder="Ø§Ù„Ø®Ø¯Ù…Ø©" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input value={bookingEditModal.packageId || ''} onChange={e => setBookingEditModal({...bookingEditModal, packageId:e.target.value})} placeholder="Ø§Ù„Ø¨Ø§Ù‚Ø©" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input type="number" value={bookingEditModal.totalPrice ?? ''} onChange={e => setBookingEditModal({...bookingEditModal, totalPrice:e.target.value === '' ? '' : Number(e.target.value)})} placeholder="Ø§Ù„Ù…Ø¨Ù„Øº Ø§Ù„Ø¥Ø¬Ù…Ø§Ù„ÙŠ (DA)" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <input type="number" value={bookingEditModal.totalPaid ?? ''} onChange={e => setBookingEditModal({...bookingEditModal, totalPaid:e.target.value === '' ? '' : Number(e.target.value)})} placeholder="Ø§Ù„Ù…Ø¨Ù„Øº Ø§Ù„Ù…Ø¯ÙÙˆØ¹ (DA)" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              <div className="md:col-span-2">
                <label className="block text-xs text-neutral-400 mb-2">ØªÙˆØ§Ø±ÙŠØ® Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø© â€” ØªØ§Ø±ÙŠØ® ÙÙŠ ÙƒÙ„ Ø³Ø·Ø±</label>
                <textarea rows={4} value={bookingEditModal.eventDates || ''} onChange={e => setBookingEditModal({...bookingEditModal, eventDates:e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" placeholder="2026-09-25&#10;2026-09-26" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-neutral-400 mb-2">Ù…Ù„Ø§Ø­Ø¸Ø§Øª</label>
                <textarea rows={4} value={bookingEditModal.notes || ''} onChange={e => setBookingEditModal({...bookingEditModal, notes:e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              </div>
              <select value={bookingEditModal.status || 'new'} onChange={e => setBookingEditModal({...bookingEditModal, status:e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white">
                <option value="new">Ø¬Ø¯ÙŠØ¯</option><option value="confirmed">Ù…Ø¤ÙƒØ¯</option><option value="processing">Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©</option><option value="completed">Ù…ÙƒØªÙ…Ù„</option><option value="cancelled">Ù…Ù„ØºÙŠ</option>
              </select>
              <div className="flex items-center gap-3 rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-neutral-400">
                <FileText className="w-4 h-4 text-amber-400" /><span>Ø¨Ø·Ø§Ù‚Ø© Ø§Ù„ØªØ¹Ø±ÙŠÙ: {bookingEditModal.idCardName || (bookingEditModal.idCardUrl ? 'Ù…Ø±ÙÙˆØ¹Ø©' : 'ØºÙŠØ± Ù…Ø±ÙÙˆØ¹Ø©')} â€” Ù…Ù„Ù Ø§Ù„Ø¨Ø·Ø§Ù‚Ø© Ù„Ø§ ÙŠØªØºÙŠØ± Ù…Ù† Ù‡Ø°Ø§ Ø§Ù„Ù†Ù…ÙˆØ°Ø¬.</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-3 mt-6 pt-5 border-t border-neutral-800">
              <button onClick={() => setBookingEditModal(null)} className="px-5 py-3 bg-neutral-800 text-white rounded-xl font-bold">Ø¥Ù„ØºØ§Ø¡</button>
              <button disabled={bookingEditSaving} onClick={async () => {
                if (!bookingEditModal.groomName?.trim()) { alert('Ø§Ø³Ù… Ø§Ù„Ø¹Ø±ÙŠØ³ Ù…Ø·Ù„ÙˆØ¨.'); return; }
                if (!bookingEditModal.phone?.trim()) { alert('Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ Ù…Ø·Ù„ÙˆØ¨.'); return; }
                const dates = String(bookingEditModal.eventDates || '').split(/[,\n]+/).map((x:string) => x.trim()).filter(Boolean);
                if (new Set(dates).size !== dates.length) { alert('ÙŠÙˆØ¬Ø¯ ØªØ§Ø±ÙŠØ® Ù…ÙƒØ±Ø± ÙÙŠ Ø§Ù„Ø­Ø¬Ø².'); return; }
                try {
                  setBookingEditSaving(true);
                  const { eventDates, ...rest } = bookingEditModal;
                  const payload:any = {...rest, eventDate: dates[0] || '', eventDates: dates, totalPrice: bookingEditModal.totalPrice === '' ? 0 : Number(bookingEditModal.totalPrice || 0), totalPaid: bookingEditModal.totalPaid === '' ? 0 : Number(bookingEditModal.totalPaid || 0)};
                  delete payload.id;
                  delete payload.createdAt;
                  await updateBooking(bookingEditModal.id, payload);
                  setBookingEditModal(null);
                  alert('ØªÙ… Ø­ÙØ¸ ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ø­Ø¬Ø² Ø¨Ù†Ø¬Ø§Ø­.');
                } catch (error) {
                  alert(error instanceof Error ? error.message : 'ØªØ¹Ø°Ø± Ø­ÙØ¸ ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ø­Ø¬Ø².');
                } finally {
                  setBookingEditSaving(false);
                }
              }} className="px-6 py-3 bg-amber-500 text-neutral-950 rounded-xl font-black disabled:opacity-50">
                {bookingEditSaving ? 'Ø¬Ø§Ø±Ù Ø§Ù„Ø­ÙØ¸...' : 'Ø­ÙØ¸ Ø¬Ù…ÙŠØ¹ Ø§Ù„ØªØ¹Ø¯ÙŠÙ„Ø§Øª'}
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
                  ? 'ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ø®Ø¯Ù…Ø©'
                  : 'Ø¥Ø¶Ø§ÙØ© Ø®Ø¯Ù…Ø©'}
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
                placeholder="Ø§Ø³Ù… Ø§Ù„Ø®Ø¯Ù…Ø© Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©"
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
                placeholder="Ø§Ø³Ù… Ø§Ù„Ø®Ø¯Ù…Ø© Ø¨Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©"
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
                placeholder="Ø§Ø³Ù… Ø§Ù„Ø®Ø¯Ù…Ø© Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©"
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
                placeholder="ÙˆØµÙ Ø§Ù„Ø®Ø¯Ù…Ø©"
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
                placeholder="Ø§Ù„Ø³Ø¹Ø±"
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
                    <div className="text-sm font-bold text-white">ØµÙˆØ±Ø© Ø§Ù„Ø®Ø¯Ù…Ø©</div>
                    <div className="text-xs text-neutral-500 mt-1">Ø§Ø±ÙØ¹ Ø§Ù„ØµÙˆØ±Ø© Ù…Ø¨Ø§Ø´Ø±Ø© Ù…Ù† Ø§Ù„Ø­Ø§Ø³ÙˆØ¨ â€” JPG / PNG / WEBPØŒ Ø­ØªÙ‰ 10 MB.</div>
                  </div>
                  <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer ${serviceUploading ? 'bg-neutral-700 text-neutral-400 pointer-events-none' : 'bg-amber-500 text-neutral-950'}`}>
                    <Upload className="w-4 h-4" />
                    {serviceUploading ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø±ÙØ¹...' : 'Ø§Ø®ØªÙŠØ§Ø± ØµÙˆØ±Ø©'}
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
                    <img src={serviceModal.image} alt={serviceModal.titleAr || 'ØµÙˆØ±Ø© Ø§Ù„Ø®Ø¯Ù…Ø©'} className="w-full h-48 object-cover" />
                    <button
                      type="button"
                      onClick={() => setServiceModal({ ...serviceModal, image: '', imagePath: '', imageName: '' })}
                      className="absolute top-3 right-3 px-3 py-2 rounded-lg bg-red-500/90 text-white text-xs font-bold"
                    >
                      Ø­Ø°Ù Ø§Ù„ØµÙˆØ±Ø©
                    </button>
                  </div>
                )}

                {!serviceModal.image && (
                  <div className="rounded-xl border border-dashed border-neutral-700 py-8 text-center text-neutral-500 text-sm">
                    Ù„Ù… ÙŠØªÙ… Ø§Ø®ØªÙŠØ§Ø± ØµÙˆØ±Ø© Ø¨Ø¹Ø¯.
                  </div>
                )}
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setServiceModal(null)}
                className="px-5 py-2.5 bg-neutral-800 text-white rounded-xl text-sm"
              >
                Ø¥Ù„ØºØ§Ø¡
              </button>

              <button
                onClick={async () => {
                  if (!serviceModal.titleAr) {
                    alert('ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø§Ø³Ù… Ø§Ù„Ø®Ø¯Ù…Ø©.');
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
                    alert('ØªØ¹Ø°Ø± Ø­ÙØ¸ Ø§Ù„Ø®Ø¯Ù…Ø©. ØªØ­Ù‚Ù‚ Ù…Ù† Ø§ØªØµØ§Ù„ Firebase Ø«Ù… Ø£Ø¹Ø¯ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø©.');
                  }
                }}
                disabled={serviceUploading}
                className="px-6 py-2.5 bg-amber-500 text-neutral-950 rounded-xl text-sm font-bold disabled:opacity-50"
              >
                Ø­ÙØ¸ Ø§Ù„Ø®Ø¯Ù…Ø©
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
                  ? 'ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ø¨Ø§Ù‚Ø©'
                  : 'Ø¥Ø¶Ø§ÙØ© Ø¨Ø§Ù‚Ø©'}
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
                placeholder="Ø§Ø³Ù… Ø§Ù„Ø¨Ø§Ù‚Ø© Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©"
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
                placeholder="Ø§Ø³Ù… Ø§Ù„Ø¨Ø§Ù‚Ø© Ø¨Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©"
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
                placeholder="Ø§Ø³Ù… Ø§Ù„Ø¨Ø§Ù‚Ø© Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©"
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
                placeholder="ÙˆØµÙ Ø§Ù„Ø¨Ø§Ù‚Ø©"
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
                placeholder="Ø§Ù„Ø³Ø¹Ø±"
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
                placeholder="Ù…Ù…ÙŠØ²Ø§Øª Ø§Ù„Ø¨Ø§Ù‚Ø© - ÙƒÙ„ Ù…ÙŠØ²Ø© ÙÙŠ Ø³Ø·Ø±"
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
                Ø¥Ù„ØºØ§Ø¡
              </button>

              <button
                onClick={() => {

                  if (!packageModal.nameAr) {
                    alert('ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø§Ø³Ù… Ø§Ù„Ø¨Ø§Ù‚Ø©.');
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
                Ø­ÙØ¸ Ø§Ù„Ø¨Ø§Ù‚Ø©
              </button>

            </div>

          </div>

        </div>
      )}

      {testimonialModal && (
        <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 my-8">
            <div className="flex justify-between items-center mb-5"><h3 className="text-xl font-black text-white">{testimonialModal.id?'ØªØ¹Ø¯ÙŠÙ„ Ø±Ø£ÙŠ Ø§Ù„Ø¹Ù…ÙŠÙ„':'Ø¥Ø¶Ø§ÙØ© Ø±Ø£ÙŠ Ø¹Ù…ÙŠÙ„'}</h3><button onClick={()=>setTestimonialModal(null)} className="p-2 bg-neutral-800 rounded-full"><X className="w-5 h-5"/></button></div>
            <div className="space-y-3">
              <input value={testimonialModal.clientName||''} onChange={e=>setTestimonialModal({...testimonialModal,clientName:e.target.value})} placeholder="Ø§Ø³Ù… Ø§Ù„Ø¹Ù…ÙŠÙ„" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"/>
              <input type="number" min="1" max="5" value={testimonialModal.rating??5} onChange={e=>setTestimonialModal({...testimonialModal,rating:Number(e.target.value)})} placeholder="Ø§Ù„ØªÙ‚ÙŠÙŠÙ… Ù…Ù† 5" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"/>
              <textarea value={testimonialModal.commentAr||''} onChange={e=>setTestimonialModal({...testimonialModal,commentAr:e.target.value})} placeholder="Ø±Ø£ÙŠ Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©" rows={4} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"/>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold cursor-pointer"><Upload className="w-4 h-4"/>{testimonialUploading?'Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø±ÙØ¹...':'Ø±ÙØ¹ ØµÙˆØ±Ø© Ø§Ù„Ø¹Ù…ÙŠÙ„'}<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={testimonialUploading} onChange={e=>{const f=e.target.files?.[0];if(f)void uploadTestimonialImage(f);e.currentTarget.value='';}}/></label>
                {testimonialModal.image&&<div className="relative mt-3 rounded-xl overflow-hidden"><img src={testimonialModal.image} className="w-full h-48 object-cover" alt="ØµÙˆØ±Ø© Ø§Ù„Ø¹Ù…ÙŠÙ„"/><button type="button" onClick={()=>setTestimonialModal({...testimonialModal,image:'',imagePath:'',imageName:''})} className="absolute top-2 right-2 bg-red-500 text-white rounded-lg px-3 py-2 text-xs">Ø­Ø°Ù</button></div>}
              </div>
              <label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" checked={testimonialModal.approved!==false} onChange={e=>setTestimonialModal({...testimonialModal,approved:e.target.checked})}/> Ø§Ø¹ØªÙ…Ø§Ø¯ Ø§Ù„Ø±Ø£ÙŠ ÙˆØ¹Ø±Ø¶Ù‡</label>
              <div className="flex gap-2 pt-2"><button disabled={testimonialUploading} onClick={async()=>{if(!testimonialModal.clientName||!testimonialModal.commentAr)return alert('Ø£Ø¯Ø®Ù„ Ø§Ø³Ù… Ø§Ù„Ø¹Ù…ÙŠÙ„ ÙˆØ§Ù„Ø±Ø£ÙŠ.');try{if(testimonialModal.id) await updateTestimonial(testimonialModal.id,testimonialModal);else await addTestimonial(testimonialModal);setTestimonialModal(null);}catch(e){alert('ØªØ¹Ø°Ø± Ø­ÙØ¸ Ø±Ø£ÙŠ Ø§Ù„Ø¹Ù…ÙŠÙ„.');}}} className="flex-1 py-3 bg-amber-500 text-neutral-950 rounded-xl font-black">Ø­ÙØ¸</button><button onClick={()=>setTestimonialModal(null)} className="px-5 bg-neutral-800 rounded-xl">Ø¥Ù„ØºØ§Ø¡</button></div>
            </div>
          </div>
        </div>
      )}

      {offerModal && (
        <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 my-8">
            <div className="flex justify-between items-center mb-5"><h3 className="text-xl font-black text-white">{offerModal.id?'ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ø¹Ø±Ø¶':'Ø¥Ø¶Ø§ÙØ© Ø¹Ø±Ø¶'}</h3><button onClick={()=>setOfferModal(null)} className="p-2 bg-neutral-800 rounded-full"><X className="w-5 h-5"/></button></div>
            <div className="space-y-3">
              <input value={offerModal.titleAr||''} onChange={e=>setOfferModal({...offerModal,titleAr:e.target.value})} placeholder="Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø¹Ø±Ø¶ Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"/>
              <input value={offerModal.titleFr||''} onChange={e=>setOfferModal({...offerModal,titleFr:e.target.value})} placeholder="Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø¹Ø±Ø¶ Ø¨Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"/>
              <input value={offerModal.titleEn||''} onChange={e=>setOfferModal({...offerModal,titleEn:e.target.value})} placeholder="Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø¹Ø±Ø¶ Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"/>
              <textarea value={offerModal.descAr||''} onChange={e=>setOfferModal({...offerModal,descAr:e.target.value})} placeholder="ÙˆØµÙ Ø§Ù„Ø¹Ø±Ø¶" rows={3} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"/>
              <div className="grid grid-cols-2 gap-3"><input value={offerModal.oldPrice||''} onChange={e=>setOfferModal({...offerModal,oldPrice:e.target.value})} placeholder="Ø§Ù„Ø³Ø¹Ø± Ø§Ù„Ù‚Ø¯ÙŠÙ…" className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"/><input value={offerModal.newPrice||''} onChange={e=>setOfferModal({...offerModal,newPrice:e.target.value})} placeholder="Ø§Ù„Ø³Ø¹Ø± Ø§Ù„Ø¬Ø¯ÙŠØ¯" className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white"/></div>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4"><label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold cursor-pointer"><Upload className="w-4 h-4"/>{offerUploading?'Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø±ÙØ¹...':'Ø±ÙØ¹ ØµÙˆØ±Ø© Ø§Ù„Ø¹Ø±Ø¶'}<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={offerUploading} onChange={e=>{const f=e.target.files?.[0];if(f)void uploadOfferImage(f);e.currentTarget.value='';}}/></label>{offerModal.image&&<div className="relative mt-3 rounded-xl overflow-hidden"><img src={offerModal.image} className="w-full h-48 object-cover" alt="ØµÙˆØ±Ø© Ø§Ù„Ø¹Ø±Ø¶"/><button type="button" onClick={()=>setOfferModal({...offerModal,image:'',imagePath:'',imageName:''})} className="absolute top-2 right-2 bg-red-500 text-white rounded-lg px-3 py-2 text-xs">Ø­Ø°Ù</button></div>}</div>
              <label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" checked={offerModal.active!==false} onChange={e=>setOfferModal({...offerModal,active:e.target.checked})}/> Ø§Ù„Ø¹Ø±Ø¶ Ù†Ø´Ø·</label>
              <div className="flex gap-2 pt-2"><button disabled={offerUploading} onClick={async()=>{if(!offerModal.titleAr)return alert('Ø£Ø¯Ø®Ù„ Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø¹Ø±Ø¶.');try{if(offerModal.id) await updateOffer(offerModal.id,offerModal);else await addOffer(offerModal);setOfferModal(null);}catch(e){alert('ØªØ¹Ø°Ø± Ø­ÙØ¸ Ø§Ù„Ø¹Ø±Ø¶.');}}} className="flex-1 py-3 bg-amber-500 text-neutral-950 rounded-xl font-black">Ø­ÙØ¸</button><button onClick={()=>setOfferModal(null)} className="px-5 bg-neutral-800 rounded-xl">Ø¥Ù„ØºØ§Ø¡</button></div>
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
                  ? 'ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ø¹Ù…Ù„'
                  : 'Ø¥Ø¶Ø§ÙØ© Ø¹Ù…Ù„'}
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
                placeholder="Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø¹Ù…Ù„ Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©"
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
                placeholder="Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø¹Ù…Ù„ Ø¨Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©"
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
                placeholder="Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø¹Ù…Ù„ Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©"
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
                placeholder="Ø£Ø³Ù…Ø§Ø¡ Ø§Ù„Ø¹Ø±ÙˆØ³ÙŠÙ†"
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
                placeholder="Ø§Ù„ØªØ§Ø±ÙŠØ®"
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
                placeholder="Ø§Ù„Ù…ÙƒØ§Ù†"
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
                <option value="events">Ù…Ù†Ø§Ø³Ø¨Ø§Øª</option>
                <option value="fashion">Ø£Ø²ÙŠØ§Ø¡</option>
                <option value="other">Ø£Ø®Ø±Ù‰</option>
              </select>

              <div className="md:col-span-2 space-y-3">
                <label className="flex items-center gap-3 w-full cursor-pointer bg-neutral-950 border border-dashed border-amber-500/40 rounded-xl px-4 py-4">
                  <FileImage className="w-5 h-5 text-amber-400" />
                  <div className="flex-1"><div className="text-sm text-white font-semibold">Ø±ÙØ¹ ØµÙˆØ± Ù…Ù† Ø§Ù„Ø­Ø§Ø³ÙˆØ¨</div><div className="text-xs text-neutral-500">JPG / PNG / WEBP â€” Ø¹Ø¯Ø© ØµÙˆØ± Ù…Ø³Ù…ÙˆØ­Ø©</div></div>
                  <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" disabled={portfolioUploading} onChange={async e => {
                    const files = Array.from(e.target.files || []); if (!files.length) return;
                    try { setPortfolioUploading(true); const urls = await uploadPortfolioImages(files); setPortfolioModal((m:any) => ({...m, image: m?.image || urls[0] || '', images: [...(Array.isArray(m?.images) ? m.images : []), ...urls]})); }
                    catch(error){ alert(error instanceof Error ? error.message : 'ÙØ´Ù„ Ø±ÙØ¹ Ø§Ù„ØµÙˆØ±.'); }
                    finally { setPortfolioUploading(false); e.target.value=''; }
                  }} />
                </label>
                {portfolioUploading && <div className="text-xs text-amber-400">Ø¬Ø§Ø±Ù Ø±ÙØ¹ Ø§Ù„ØµÙˆØ±...</div>}
                {Array.isArray(portfolioModal.images) && portfolioModal.images.length > 0 && <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{portfolioModal.images.map((url:string,i:number)=><div key={url+i} className="relative aspect-square rounded-xl overflow-hidden"><img src={url} className="w-full h-full object-cover" /><button type="button" onClick={()=>{const images=portfolioModal.images.filter((_:string,n:number)=>n!==i);setPortfolioModal({...portfolioModal,images,image:images[0]||''})}} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><X className="w-3 h-3"/></button></div>)}</div>}
                <input placeholder="Ø£Ùˆ Ø£Ø¯Ø®Ù„ Ø±Ø§Ø¨Ø· Ø§Ù„ØµÙˆØ±Ø© ÙŠØ¯ÙˆÙŠÙ‹Ø§" value={portfolioModal.image || ''} onChange={e=>setPortfolioModal({...portfolioModal,image:e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white" />
              </div>

              <textarea
                placeholder="ÙˆØµÙ Ø§Ù„Ø¹Ù…Ù„"
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
                  Ø¹Ø±Ø¶ Ø§Ù„Ø¹Ù…Ù„ ÙÙŠ Ø§Ù„Ù…Ø¹Ø±Ø¶ Ø§Ù„Ø¹Ø§Ù…
                </label>

              </div>

            </div>

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-neutral-800">

              <button
                onClick={() => setPortfolioModal(null)}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-sm"
              >
                Ø¥Ù„ØºØ§Ø¡
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
                      'ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø¹Ù…Ù„ ÙˆØµÙˆØ±Ø© ÙˆØ§Ø­Ø¯Ø© Ø¹Ù„Ù‰ Ø§Ù„Ø£Ù‚Ù„.'
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
                Ø­ÙØ¸ Ø§Ù„Ø¹Ù…Ù„
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminDashboard;


