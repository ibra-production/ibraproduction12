import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  Phone,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  Fingerprint,
  Radio,
  CheckCircle2,
  RefreshCw,
  Server
} from 'lucide-react';

interface AdminLoginProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: () => void;
}

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { adminLoginWithPhone, authError, clearAuthError } = useApp();
  
  const [phone, setPhone] = useState('0558948485');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('ibra_admin_attempts');
      return stored ? parseInt(stored, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(() => {
    try {
      const stored = localStorage.getItem('ibra_admin_lockout_until');
      return stored ? parseInt(stored, 10) || null : null;
    } catch {
      return null;
    }
  });
  const [remainingTimeText, setRemainingTimeText] = useState<string>('');

  // Live Algiers Time & Lockout countdown
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      
      // Update Algiers live time
      setCurrentTime(
        new Date().toLocaleTimeString('ar-DZ', {
          timeZone: 'Africa/Algiers',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );

      // Check lockout status
      if (lockoutUntil) {
        const diff = lockoutUntil - now;
        if (diff <= 0) {
          // Lockout expired
          setLockoutUntil(null);
          setFailedAttempts(0);
          try {
            localStorage.removeItem('ibra_admin_lockout_until');
            localStorage.setItem('ibra_admin_attempts', '0');
          } catch {}
          setRemainingTimeText('');
        } else {
          const totalSeconds = Math.floor(diff / 1000);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          setRemainingTimeText(
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
          );
        }
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const isLocked = useMemo(() => {
    if (!lockoutUntil) return false;
    return Date.now() < lockoutUntil;
  }, [lockoutUntil]);

  const attemptsLeft = useMemo(() => {
    return Math.max(0, MAX_ATTEMPTS - failedAttempts);
  }, [failedAttempts]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockActive(e.getModifierState('CapsLock'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    if (!phone.trim() || !password) {
      return;
    }

    clearAuthError();
    setIsSubmitting(true);

    try {
      const success = await adminLoginWithPhone(phone, password);
      if (success) {
        // Reset attempts upon success
        setFailedAttempts(0);
        setLockoutUntil(null);
        try {
          localStorage.removeItem('ibra_admin_attempts');
          localStorage.removeItem('ibra_admin_lockout_until');
        } catch {}
        onLoginSuccess();
      } else {
        // Handle failed attempt
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        try {
          localStorage.setItem('ibra_admin_attempts', String(newAttempts));
        } catch {}

        if (newAttempts >= MAX_ATTEMPTS) {
          const lockTime = Date.now() + LOCKOUT_DURATION_MS;
          setLockoutUntil(lockTime);
          try {
            localStorage.setItem('ibra_admin_lockout_until', String(lockTime));
          } catch {}
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="min-h-screen w-full bg-[#050508] text-neutral-100 flex flex-col justify-between relative overflow-hidden select-none font-sans"
      dir="rtl"
    >
      {/* Dynamic Cyber Gold Background FX */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 right-1/4 w-[650px] h-[650px] bg-gradient-to-br from-amber-500/15 via-amber-600/5 to-transparent rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 left-1/4 w-[550px] h-[550px] bg-gradient-to-tr from-amber-700/10 via-yellow-600/5 to-transparent rounded-full blur-[130px]" />
        
        {/* Subtle Luxury Technical Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(rgba(245, 158, 11, 0.45) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Ambient Top Light Beam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      </div>

      {/* Top Neutral Status Header */}
      <header className="relative z-10 border-b border-neutral-900 bg-[#08080c]/80 backdrop-blur-xl px-5 sm:px-10 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-neutral-950 font-black shadow-lg shadow-amber-500/20">
            <Radio className="w-4 h-4 text-neutral-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel font-black tracking-wider text-sm text-white">
                IBRA PRODUCTION
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-widest">
                CMS KERNEL
              </span>
            </div>
            <p className="text-[10px] text-neutral-400">بوابة الدخول الإدارية التنفيذية الحصرية</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          {/* Live Time */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-[11px] font-bold text-amber-300">
              {currentTime || '00:00:00'}
            </span>
            <span className="text-[10px] text-neutral-500">• الجزائر</span>
          </div>

          {/* Secure SSL indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">اتصال آمن ومشفّر</span>
          </div>

          {/* Return to public site */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-amber-500/40 text-neutral-300 hover:text-white transition-all text-xs font-bold cursor-pointer"
              title="العودة إلى الواجهة العامة"
            >
              <span>الموقع العام</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}
        </div>
      </header>

      {/* Main Terminal Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Terminal Box */}
          <div className="bg-[#0b0c10]/95 border border-amber-500/30 rounded-3xl p-6 sm:p-9 shadow-2xl shadow-black/80 backdrop-blur-2xl relative overflow-hidden">
            {/* Top Glowing Edge */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

            {/* Header Badge & Title */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-neutral-900 to-[#0b0c10] border border-amber-500/40 flex items-center justify-center mx-auto mb-3.5 text-amber-400 shadow-xl shadow-amber-500/10">
                <Fingerprint className="w-7 h-7 text-amber-400" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[10px] font-mono font-bold mb-2">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>EXECUTIVE GATEWAY</span>
              </div>

              <h1 className="text-2xl font-black text-white font-cinzel">
                لوحة التحكم الإدارية
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                تسجيل دخول المالك والمدير العام الرسمي
              </p>
            </div>

            {/* Locked Warning Screen if Max Attempts Exceeded */}
            {isLocked ? (
              <div className="p-5 rounded-2xl bg-red-950/40 border border-red-500/50 text-red-200 text-center space-y-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-red-300">
                    تم قفل لوحة الإدارة مؤقتاً لحماية النظام
                  </h3>
                  <p className="text-xs text-red-300/80 mt-1 leading-relaxed">
                    تم استنفاد الحد الأقصى للمحاولات (3 محاولات غير صحيحة). وفقاً لبروتوكول الأمان، تم إغلاق باب الدخول لمدة 24 ساعة كاملة.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-red-500/30">
                  <span className="text-[11px] text-neutral-400 block mb-1">
                    الوقت المتبقي لفتح المحاولة مجدداً:
                  </span>
                  <span className="font-mono text-2xl font-black text-amber-400 tracking-wider">
                    {remainingTimeText || '24:00:00'}
                  </span>
                </div>

                <div className="text-[11px] text-neutral-400">
                  يرجى التواصل المباشر مع الدعم الفني أو الانتظار حتى انتهاء العد التنازلي.
                </div>
              </div>
            ) : (
              <>
                {/* Security Attempts Counter Status */}
                <div className="mb-5 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-neutral-300 font-bold">
                    <Server className="w-3.5 h-3.5 text-amber-400" />
                    <span>نظام الحماية:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-neutral-400">المحاولات المتبقية:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((num) => {
                        const isUsed = num > attemptsLeft;
                        return (
                          <div
                            key={num}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              isUsed
                                ? 'bg-red-500 shadow-sm shadow-red-500/50'
                                : 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                            }`}
                            title={isUsed ? 'محاولة مستنفذة' : 'محاولة متاحة'}
                          />
                        );
                      })}
                    </div>
                    <span className="font-mono text-xs font-black text-amber-400 mr-1">
                      {attemptsLeft}/3
                    </span>
                  </div>
                </div>

                {/* Auth Error Banner */}
                {authError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 mb-5">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div className="flex-1 leading-relaxed">
                      {authError}
                      <span className="block mt-1 font-bold text-red-300">
                        تنبيه: متبقي لديك {attemptsLeft} {attemptsLeft === 1 ? 'محاولة وحيدة' : 'محاولات'} قبل قفل النظام لمدة 24 ساعة.
                      </span>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Phone Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                        <span>رقم هاتف المالك المعتمد</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setPhone('0558948485')}
                        className="text-[10px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                      >
                        رقم المالك الافتراضي
                      </button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-neutral-500">
                        <span className="text-xs font-mono font-bold text-amber-400/90 pl-1 border-l border-neutral-800 ml-1">
                          +213
                        </span>
                      </div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0558948485"
                        className="w-full bg-[#050508] border border-neutral-800 focus:border-amber-500 rounded-xl py-3 pr-16 pl-4 text-sm text-white font-mono placeholder-neutral-600 outline-none transition-all shadow-inner"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                        <span>كلمة السر السرية</span>
                      </label>
                      {capsLockActive && (
                        <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Caps Lock مفعّل
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-neutral-500">
                        <Lock className="w-4 h-4 text-neutral-500" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyDown}
                        placeholder="أدخل كلمة السر الخاصة بالمالك"
                        className="w-full bg-[#050508] border border-neutral-800 focus:border-amber-500 rounded-xl py-3 pr-10 pl-10 text-sm text-white font-mono placeholder-neutral-600 outline-none transition-all shadow-inner"
                        dir="ltr"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                        title={showPassword ? 'إخفاء كلمة السر' : 'إظهار كلمة السر'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-neutral-500" />}
                      </button>
                    </div>
                  </div>

                  {/* Security Policy Note */}
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] text-neutral-400 leading-normal">
                    <span className="font-bold text-amber-300">سياسة أمان الدخول: </span>
                    يُسمح بـ 3 محاولات دخول فقط. عند إدخال بيانات خاطئة 3 مرات متتالية يتم تشفير القفل تلقائياً لـ 24 ساعة.
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || isLocked}
                    className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-neutral-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                        <span>جارٍ التحقق وتوثيق الاتصال...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-neutral-950" />
                        <span>تسجيل الدخول إلى لوحة الإدارة</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* Back to Client Site link if onClose provided */}
            {onClose && (
              <div className="mt-6 pt-4 border-t border-neutral-900 text-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-neutral-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>العودة إلى الموقع العام (ibraprod.online)</span>
                </button>
              </div>
            )}

            {/* Watermark & Version */}
            <div className="mt-4 text-center text-[10px] font-mono text-neutral-600 tracking-wider">
              IBRA PRODUCTION CMS • KERNEL SECURITY v3.0
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-900 bg-[#060609]/90 px-6 py-3 text-center text-[11px] text-neutral-500">
        جميع الحقوق محفوظة © {new Date().getFullYear()} استوديو إبرا للإنتاج السينمائي والتصوير الفوتوغرافي (Ibra Production) • الجزائر
      </footer>
    </div>
  );
};
