import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  Film,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Clock,
  HardDrive,
  Database,
  CheckCircle2,
  AlertTriangle,
  Camera,
  ChevronLeft
} from 'lucide-react';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { login, authError, clearAuthError, language } = useApp();
  const [email, setEmail] = useState('admin@ibraprod.online');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  // Live Algiers Studio Time (GMT+1)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('ar-DZ', {
          timeZone: 'Africa/Algiers',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen for CapsLock on password field
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockActive(e.getModifierState('CapsLock'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      return;
    }
    clearAuthError();
    setIsSubmitting(true);
    try {
      const success = await login(email, password);
      if (success) {
        onLoginSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="min-h-screen w-full bg-[#070709] text-neutral-100 flex flex-col justify-between relative overflow-hidden select-none font-sans" dir="rtl">
      {/* Background Ambient Lighting & Studio Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.4) 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />
      </div>

      {/* Top Studio Executive Bar */}
      <header className="relative z-10 border-b border-neutral-800/80 bg-neutral-950/70 backdrop-blur-md px-6 lg:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 font-black shadow-md shadow-amber-500/20">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel font-black tracking-wider text-sm text-white">IBRA PRODUCTION</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                PRO CMS
              </span>
            </div>
            <p className="text-[10px] text-neutral-400">بوابة الإدارة التنفيذية والتحكم الشامل</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          {/* Live Clock */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-[11px] font-bold text-amber-300">{currentTime || '00:00:00'}</span>
            <span className="text-[10px] text-neutral-500">• توقيت الجزائر</span>
          </div>

          {/* Return to Public Website */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-amber-500/40 text-neutral-300 hover:text-white transition-all text-xs font-bold cursor-pointer"
            title="الانتقال إلى موقع الزبائن"
          >
            <span>موقع الزبائن</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </header>

      {/* Main Content: Split Desktop Showcase & Master Terminal */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Studio Brand & Heritage Showcase (Visible on lg+) */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-between space-y-8 pr-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Command Suite • v2.8</span>
              </div>
              
              <h1 className="text-3xl xl:text-4xl font-black text-white leading-tight font-cinzel">
                IBRA PRODUCTION
                <span className="block text-xl xl:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 font-sans font-bold mt-2">
                  مركز القيادة والإنتاج السينمائي الفاخر
                </span>
              </h1>
              
              <p className="text-sm text-neutral-400 mt-4 max-w-xl leading-relaxed">
                منصة الإدارة الحصرية لمالك الاستوديو: تحكم شامل في عقود الأعراس الفاخرة، رفع وسائط وخلفيات الهيرو الحقيقية، تسعير الباقات والخدمات، ومتابعة طاقم التصوير لحظة بلحظة.
              </p>
            </div>

            {/* 4 Feature Pillars */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-amber-500/30 transition-all">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">إدارة العقود والحجوزات</h4>
                <p className="text-[11px] text-neutral-400 leading-normal">
                  تأكيد مواعيد الأعراس، قاعات الحفلات، وبطاقات تتبع العرسان الذكية.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-amber-500/30 transition-all">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2.5">
                  <Film className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">مركز وسائط الموقع (Site Media)</h4>
                <p className="text-[11px] text-neutral-400 leading-normal">
                  رفع فيديوهات سينمائية وصور بدقة 4K من الحاسوب وتفعيلها فوراً في الهيرو.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-amber-500/30 transition-all">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2.5">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">الباقات والخدمات والعروض</h4>
                <p className="text-[11px] text-neutral-400 leading-normal">
                  تحكم فوري في الأسعار ومميزات الباقات الملكية والتخفيضات.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-amber-500/30 transition-all">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2.5">
                  <Camera className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">الطاقم والأسطول السينمائي</h4>
                <p className="text-[11px] text-neutral-400 leading-normal">
                  توزيع المصورين والمساعدين ومتابعة تسليم المشاريع.
                </p>
              </div>
            </div>

            {/* Live Infrastructure Status */}
            <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 flex items-center justify-between text-[11px] font-semibold text-neutral-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Database className="w-3.5 h-3.5" />
                Firestore Realtime
              </span>
              <span className="text-neutral-700">•</span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <HardDrive className="w-3.5 h-3.5" />
                Cloudflare R2 Ready
              </span>
              <span className="text-neutral-700">•</span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                256-Bit SSL Encrypted
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Luxury Master Terminal Card */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <div className="w-full max-w-md bg-neutral-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
              {/* Golden Top Edge Highlight */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              
              <div className="text-center mb-7">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-neutral-900 border border-amber-500/40 flex items-center justify-center mx-auto mb-3.5 text-amber-400 shadow-xl shadow-amber-500/10">
                  <Lock className="w-7 h-7" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-cinzel">
                  تسجيل دخول الإدارة
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  أدخل بيانات اعتماد المالك للوصول إلى لوحة التحكم
                </p>
              </div>

              {/* Error Notice */}
              {authError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 mb-5 animate-shake">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{authError}</div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-neutral-300">
                      البريد الإلكتروني للإدارة
                    </label>
                    <button
                      type="button"
                      onClick={() => setEmail('admin@ibraprod.online')}
                      className="text-[10px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                    >
                      الحساب الرسمي
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@ibraprod.online"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl py-3 pr-10 pl-4 text-sm text-white placeholder-neutral-600 outline-none transition-all"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-neutral-300">
                      كلمة المرور
                    </label>
                    {capsLockActive && (
                      <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Caps Lock مفعّل
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-neutral-500">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onKeyUp={handleKeyDown}
                      placeholder="••••••••••••"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl py-3 pr-10 pl-10 text-sm text-white placeholder-neutral-600 outline-none transition-all"
                      dir="ltr"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                      title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Security Info */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 accent-amber-500 rounded cursor-pointer"
                    />
                    <span>تذكر جلسة الدخول</span>
                  </label>
                  <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400/80" />
                    وصول مشفر 256-Bit
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-neutral-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                      <span>جارٍ التحقق وتأكيد الهوية...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>دخول لوحة التحكم الشاملة</span>
                      <ChevronLeft className="w-4 h-4 mr-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Back to Client Site Link */}
              <div className="mt-6 pt-5 border-t border-neutral-800 text-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>العودة إلى موقع الزبائن الرئيسي (ibraprod.online)</span>
                </button>
              </div>

              {/* Watermark */}
              <div className="mt-4 text-center text-[10px] font-mono text-neutral-600 tracking-wider">
                IBRA PRODUCTION • STUDIO CMS v2.8 PRO
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-900 bg-neutral-950/80 px-6 py-3 text-center text-[11px] text-neutral-500">
        جميع الحقوق محفوظة © {new Date().getFullYear()} استوديو إبرا للإنتاج والتصوير السينمائي (Ibra Production) • الجزائر
      </footer>
    </div>
  );
};
