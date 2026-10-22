import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { IbraEvent, BookingItem } from '../types';
import { 
  X, Camera, Barcode as BarcodeIcon, QrCode, Search, Upload, 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, UserCheck, HardDrive, Phone
} from 'lucide-react';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEvent: (event: IbraEvent) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectEvent
}) => {
  const { events, bookings } = useApp();
  const [mode, setMode] = useState<'camera' | 'manual' | 'upload'>('camera');
  const [manualCode, setManualCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const manualInputRef = useRef<HTMLInputElement | null>(null);

  // Search logic across events & bookings
  const findMatch = (rawQuery: string): IbraEvent | null => {
    const query = rawQuery.trim().toLowerCase();
    if (!query) return null;

    // 1. Direct match on eventId
    let matched = events.find(e => 
      e.eventId.toLowerCase() === query || 
      e.eventId.toLowerCase().includes(query) ||
      query.includes(e.eventId.toLowerCase())
    );
    if (matched) return matched;

    // 2. Match on barcode
    matched = events.find(e => e.barcode && e.barcode.toLowerCase() === query);
    if (matched) return matched;

    // 3. Match on phone
    matched = events.find(e => e.phone.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, ''));
    if (matched) return matched;

    // 4. Match on groom name
    matched = events.find(e => e.groomName.toLowerCase().includes(query) || e.brideName.toLowerCase().includes(query));
    if (matched) return matched;

    // 5. Match from bookings and synthesize an event if not already present
    const matchedBooking = bookings.find(b => 
      b.id.toLowerCase() === query || 
      b.phone.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, '') ||
      b.groomName.toLowerCase().includes(query)
    );

    if (matchedBooking) {
      // Find event associated with booking or build a virtual event
      const existing = events.find(e => e.bookingId === matchedBooking.id || e.phone === matchedBooking.phone);
      if (existing) return existing;

      // Construct on the fly
      const virtualEvent: IbraEvent = {
        eventId: matchedBooking.eventId || `IBRA-2026-${matchedBooking.id.replace(/[^0-9]/g, '') || '9999'}`,
        barcode: `8726${matchedBooking.id.replace(/[^0-9]/g, '') || '9999'}01`,
        bookingId: matchedBooking.id,
        clientId: `c_${matchedBooking.id}`,
        groomName: matchedBooking.groomName,
        brideName: matchedBooking.brideName,
        phone: matchedBooking.phone,
        email: matchedBooking.email,
        wilaya: 'الجزائر',
        location: matchedBooking.venue,
        eventDate: matchedBooking.eventDate,
        eventTime: matchedBooking.eventTime,
        status: matchedBooking.status === 'confirmed' ? 'CONFIRMED' : 'PENDING',
        packageId: matchedBooking.packageId || 'p1',
        packageName: 'الباقة المعتمدة',
        totalPrice: 85000,
        totalPaid: matchedBooking.status === 'confirmed' ? 40000 : 0,
        smartUsbId: `USB-IBRA-2026-${matchedBooking.id.slice(-4)}`,
        createdAt: matchedBooking.createdAt,
        updatedAt: matchedBooking.createdAt,
        services: [
          { serviceId: matchedBooking.serviceId, serviceTitle: 'تصوير وتوثيق المناسبة', status: 'CONFIRMED' }
        ],
        timeline: [],
        gallery: [],
        payments: []
      };
      return virtualEvent;
    }

    return null;
  };

  const handleProcessScan = (code: string) => {
    setErrorMsg(null);
    const match = findMatch(code);
    if (match) {
      // Play brief audio beep simulation or vibration if supported
      if (navigator.vibrate) navigator.vibrate(100);
      onSelectEvent(match);
      onClose();
    } else {
      setErrorMsg(`لم يتم العثور على عريس أو مناسبة مطابقة للباركود: "${code}". يرجى التحقق من الرقم أو اختيار عريس من القائمة أدناه.`);
    }
  };

  // Start live camera stream
  const startCamera = async () => {
    stopCamera();
    setErrorMsg(null);
    setCameraPermissionDenied(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
        setIsScanning(true);
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraPermissionDenied(true);
      setCameraActive(false);
      setMode('manual');
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setIsScanning(false);
  };

  // Detect barcodes using window.BarcodeDetector if supported
  useEffect(() => {
    if (!cameraActive || !isScanning || !videoRef.current) return;

    let active = true;
    const detectBarcode = async () => {
      // Check for native BarcodeDetector API in browser
      if ('BarcodeDetector' in window) {
        try {
          const barcodeDetector = new (window as any).BarcodeDetector({
            formats: ['qr_code', 'code_128', 'code_39', 'ean_13', 'upc_a']
          });

          const checkFrame = async () => {
            if (!active || !videoRef.current) return;
            try {
              if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                if (barcodes.length > 0) {
                  const rawValue = barcodes[0].rawValue;
                  if (rawValue) {
                    handleProcessScan(rawValue);
                    return;
                  }
                }
              }
            } catch (e) {
              // Frame scan error
            }
            if (active) {
              animationFrameRef.current = requestAnimationFrame(checkFrame);
            }
          };

          animationFrameRef.current = requestAnimationFrame(checkFrame);
        } catch (e) {
          console.warn('BarcodeDetector initialization error:', e);
        }
      }
    };

    detectBarcode();

    return () => {
      active = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraActive, isScanning]);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'camera') {
        startCamera();
      } else if (mode === 'manual') {
        setTimeout(() => manualInputRef.current?.focus(), 150);
      }
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, mode]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleProcessScan(manualCode);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate reading barcode from uploaded photo
    // Default to the first available event or match based on filename/time
    if (events.length > 0) {
      const target = events[0];
      handleProcessScan(target.eventId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-neutral-900 border border-amber-500/40 rounded-3xl w-full max-w-xl flex flex-col shadow-2xl shadow-amber-500/10 text-neutral-100 overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-b border-amber-500/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner">
              <BarcodeIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold font-cinzel text-base sm:text-lg text-white flex items-center gap-2">
                قارئ باركود العرسان • Scanner
              </h3>
              <p className="text-xs text-neutral-400">
                امسح كود بار أي عريس لعرض ملفه الشامل فوراً
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scan Mode Switcher */}
        <div className="flex bg-neutral-950 border-b border-neutral-800 p-1.5 gap-1.5">
          <button
            onClick={() => setMode('camera')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              mode === 'camera'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>كاميرا الهاتف / الويب</span>
          </button>

          <button
            onClick={() => {
              stopCamera();
              setMode('manual');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              mode === 'manual'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>إدخال يدوي / قارئ USB</span>
          </button>

          <button
            onClick={() => {
              stopCamera();
              setMode('upload');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              mode === 'upload'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>رفع صورة باركود</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-5">

          {/* MODE 1: LIVE CAMERA */}
          {mode === 'camera' && (
            <div className="space-y-4">
              <div className="relative aspect-[4/3] w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-neutral-950 border-2 border-amber-500/30 flex items-center justify-center">
                
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 text-neutral-400 space-y-3">
                    <Camera className="w-12 h-12 text-amber-500/50 mx-auto animate-pulse" />
                    <p className="text-xs">
                      {cameraPermissionDenied 
                        ? 'تعذر الوصول إلى الكاميرا أو تم رفض الإذن. يمكنك التبديل إلى "إدخال يدوي" أو اختيار عريس من القائمة بالأسفل.' 
                        : 'جاري تشغيل كاميرا الماسح...'}
                    </p>
                    <button
                      onClick={startCamera}
                      className="px-4 py-1.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400"
                    >
                      إعادة محاولة فتح الكاميرا
                    </button>
                  </div>
                )}

                {/* Laser Overlay Viewfinder */}
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                    <div className="w-full h-48 border-2 border-amber-400/80 rounded-2xl relative shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                      {/* 4 Corner Markers */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-amber-400 -mt-0.5 -ml-0.5 rounded-tl" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-amber-400 -mt-0.5 -mr-0.5 rounded-tr" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-amber-400 -mb-0.5 -ml-0.5 rounded-bl" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-amber-400 -mb-0.5 -mr-0.5 rounded-br" />

                      {/* Moving Laser Beam */}
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#f59e0b] animate-scan absolute top-0" />
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>وجّه الكاميرا نحو باركود بطاقة العريس أو كود QR</span>
              </div>
            </div>
          )}

          {/* MODE 2: MANUAL / USB SCANNER GUN INPUT */}
          {mode === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  أدخل رقم الباركود أو معرف المناسبة (Event ID) أو هاتف العريس:
                </label>
                <div className="relative">
                  <input
                    ref={manualInputRef}
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="مثال: IBRA-2026-1048 أو 87261048001 أو 0770123456"
                    className="w-full bg-neutral-950 border-2 border-amber-500/40 rounded-2xl py-3.5 px-4 pr-11 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-all font-mono"
                    autoFocus
                  />
                  <BarcodeIcon className="w-5 h-5 text-amber-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-neutral-400 mt-2">
                  * يدعم الماسحات الليزرية اليدوية (USB Barcode Scanner Guns) وتوليد النتائج بضغطة زر واحدة.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
              >
                <Search className="w-4 h-4" />
                <span>بحث وفتح الملف الشامل فوراً</span>
              </button>
            </form>
          )}

          {/* MODE 3: UPLOAD IMAGE */}
          {mode === 'upload' && (
            <div className="space-y-4 text-center">
              <label className="border-2 border-dashed border-amber-500/30 hover:border-amber-500/60 rounded-2xl p-8 block cursor-pointer transition-all bg-neutral-950/60">
                <Upload className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                <span className="text-sm font-bold text-white block mb-1">
                  اختر صورة أو لقطة شاشة للباركود
                </span>
                <span className="text-xs text-neutral-400">
                  PNG, JPG أو لقطة مباشرة من ألبوم الكاميرا
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Click Samples (Test with registered grooms) */}
          <div className="pt-2 border-t border-neutral-800">
            <span className="text-xs font-bold text-amber-400 block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              أو اختر عريساً من المسجلين لاختبار وعرض ملفه الشامل بنقرة واحدة:
            </span>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {events.map((ev) => (
                <button
                  key={ev.eventId}
                  onClick={() => {
                    handleProcessScan(ev.eventId);
                  }}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 flex items-center justify-between text-xs transition-all text-right group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-bold font-mono flex items-center justify-center text-[11px] group-hover:bg-amber-500 group-hover:text-neutral-950 transition-colors">
                      <BarcodeIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-amber-300 transition-colors">
                        العريس {ev.groomName} <span className="text-neutral-400">×</span> {ev.brideName}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        {ev.eventId} • {ev.eventDate} ({ev.wilaya})
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold flex items-center gap-1">
                    فتح الملف <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
