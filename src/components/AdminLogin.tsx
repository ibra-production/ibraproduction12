import React, { useEffect, useRef, useState } from 'react';
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber, signOut } from 'firebase/auth';
import { X, Smartphone, ShieldCheck, ArrowLeft, Fingerprint } from 'lucide-react';
import { auth } from '../firebase';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const OWNER_PHONES = new Set([
  '+213556967093',
  '+213779000833',
  '+213558948485',
]);

const normalizeAlgerianPhone = (value: string) => {
  const raw = value.replace(/[\s()-]/g, '');
  if (raw.startsWith('+213')) return raw;
  if (raw.startsWith('00213')) return '+' + raw.slice(2);
  if (/^0[5-7]\d{8}$/.test(raw)) return '+213' + raw.slice(1);
  return raw;
};

export const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code' | 'unlock'>('phone');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const holdStartedRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
      confirmationRef.current = null;
      if (holdTimerRef.current) window.clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
      holdStartedRef.current = null;
      setPhone('');
      setCode('');
      setStep('phone');
      setError('');
      setBusy(false);
      setHoldProgress(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const createRecaptcha = () => {
    if (recaptchaRef.current) return recaptchaRef.current;
    auth.languageCode = 'ar';
    recaptchaRef.current = new RecaptchaVerifier(auth, 'ibra-recaptcha', {
      size: 'invisible',
      'expired-callback': () => {
        recaptchaRef.current?.clear();
        recaptchaRef.current = null;
      },
    });
    return recaptchaRef.current;
  };

  const sendCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const normalized = normalizeAlgerianPhone(phone);

    if (!OWNER_PHONES.has(normalized)) {
      setError('هذا الرقم غير مخول للدخول إلى لوحة Ibra Production.');
      return;
    }

    setBusy(true);
    try {
      const verifier = createRecaptcha();
      confirmationRef.current = await signInWithPhoneNumber(auth, normalized, verifier);
      setPhone(normalized);
      setStep('code');
    } catch (err: any) {
      console.error('Ibra phone auth error:', err);
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
      const codeName = String(err?.code || '');
      const messages: Record<string, string> = {
        'auth/invalid-phone-number': 'رقم الهاتف غير صالح.',
        'auth/too-many-requests': 'تم تجاوز عدد المحاولات مؤقتاً. حاول لاحقاً.',
        'auth/quota-exceeded': 'تم تجاوز حد رسائل SMS في Firebase. حاول لاحقاً.',
        'auth/captcha-check-failed': 'تعذر إكمال التحقق الأمني. أعد المحاولة.',
        'auth/network-request-failed': 'تعذر الاتصال بخدمة المصادقة.',
        'auth/operation-not-allowed': 'تسجيل الدخول برقم الهاتف غير مفعّل في Firebase.',
      };
      setError(messages[codeName] || 'تعذر إرسال رمز التحقق. أعد المحاولة.');
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!confirmationRef.current || code.trim().length < 6) {
      setError('أدخل رمز التحقق المكوّن من 6 أرقام.');
      return;
    }

    setBusy(true);
    setError('');
    try {
      const credential = await confirmationRef.current.confirm(code.trim());
      const verifiedPhone = credential.user.phoneNumber || '';
      if (!OWNER_PHONES.has(verifiedPhone)) {
        await signOut(auth);
        throw new Error('UNAUTHORIZED_PHONE');
      }
      setStep('unlock');
    } catch (err: any) {
      console.error('Ibra verification error:', err);
      const codeName = String(err?.code || '');
      setError(
        err?.message === 'UNAUTHORIZED_PHONE'
          ? 'هذا الرقم غير مخول.'
          : codeName === 'auth/invalid-verification-code'
            ? 'رمز التحقق غير صحيح.'
            : codeName === 'auth/code-expired'
              ? 'انتهت صلاحية الرمز. اطلب رمزاً جديداً.'
              : 'تعذر التحقق من الرمز.'
      );
      setCode('');
    } finally {
      setBusy(false);
    }
  };

  const startHold = () => {
    if (step !== 'unlock' || busy) return;
    holdStartedRef.current = Date.now();
    setHoldProgress(0);
    holdTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - (holdStartedRef.current || Date.now());
      const progress = Math.min(100, Math.round((elapsed / 1200) * 100));
      setHoldProgress(progress);
      if (progress >= 100) {
        if (holdTimerRef.current) window.clearInterval(holdTimerRef.current);
        holdTimerRef.current = null;
        onLoginSuccess();
        onClose();
      }
    }, 30);
  };

  const stopHold = () => {
    if (holdTimerRef.current) window.clearInterval(holdTimerRef.current);
    holdTimerRef.current = null;
    holdStartedRef.current = null;
    setHoldProgress(0);
  };

  const back = () => {
    stopHold();
    if (step === 'unlock') setStep('code');
    else setStep('phone');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/95 backdrop-blur-xl animate-fade-in">
      <div className="bg-neutral-900 border border-amber-500/25 rounded-[2rem] max-w-md w-full p-7 sm:p-9 relative shadow-2xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 text-neutral-400 hover:text-white bg-neutral-800 rounded-full transition"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-7">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto mb-4 text-amber-400">
            {step === 'unlock' ? <Fingerprint className="w-8 h-8" /> : <Smartphone className="w-8 h-8" />}
          </div>
          <p className="text-[10px] tracking-[0.28em] text-amber-500 font-bold mb-2">IBRA ACCESS</p>
          <h3 className="text-2xl font-bold font-cinzel text-white">
            {step === 'phone' ? 'الدخول الذكي' : step === 'code' ? 'تأكيد الهاتف' : 'افتح لوحة Ibra'}
          </h3>
          <p className="text-xs text-neutral-400 mt-2">
            {step === 'phone'
              ? 'رقم هاتفك هو مفتاح الدخول — بدون بريد أو كلمة مرور'
              : step === 'code'
                ? 'أرسلنا رمزاً سرياً إلى هاتف المالك'
                : 'تحقق ناجح. اضغط باستمرار لفتح لوحة الإدارة'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/25 text-red-300 text-xs p-3 rounded-xl mb-5 text-center">
            {error}
          </div>
        )}

        {step === 'phone' && (
          <form onSubmit={sendCode} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-2">رقم هاتف المالك</label>
              <div className="relative">
                <Smartphone className="absolute top-3.5 right-3.5 w-4 h-4 text-neutral-500" />
                <input
                  type="tel"
                  inputMode="tel"
                  dir="ltr"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  autoComplete="tel"
                  placeholder="05 XX XX XX XX"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 text-white text-sm focus:border-amber-500 focus:outline-none pr-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 transition"
            >
              {busy ? 'جارٍ التحقق وإرسال الرمز...' : 'إرسال مفتاح الدخول'}
            </button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={verifyCode} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-2">رمز SMS</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                autoFocus
                required
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="••••••"
                dir="ltr"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={busy || code.length !== 6}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold text-sm disabled:opacity-50"
            >
              {busy ? 'جارٍ التحقق...' : 'تأكيد الرمز'}
            </button>

            <button type="button" onClick={back} className="w-full text-xs text-neutral-400 hover:text-white flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> تغيير الرقم
            </button>
          </form>
        )}

        {step === 'unlock' && (
          <div className="space-y-5">
            <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-4 text-center">
              <ShieldCheck className="w-7 h-7 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-emerald-300 font-semibold">تم توثيق الهاتف بنجاح</p>
              <p className="text-[11px] text-neutral-500 mt-1">اضغط باستمرار على الزر لمدة ثانية واحدة</p>
            </div>

            <button
              type="button"
              onPointerDown={startHold}
              onPointerUp={stopHold}
              onPointerLeave={stopHold}
              onPointerCancel={stopHold}
              className="relative w-full h-24 overflow-hidden rounded-2xl border border-amber-500/30 bg-neutral-950 text-white select-none touch-none"
            >
              <div
                className="absolute inset-y-0 left-0 bg-amber-500/15 transition-none"
                style={{ width: `${holdProgress}%` }}
              />
              <span className="relative z-10 font-bold tracking-wide">
                {holdProgress > 0 ? `فتح اللوحة… ${holdProgress}%` : 'اضغط باستمرار لفتح لوحة Ibra'}
              </span>
            </button>

            <button type="button" onClick={back} className="w-full text-xs text-neutral-400 hover:text-white">
              رجوع
            </button>
          </div>
        )}

        <div id="ibra-recaptcha" />
        <div className="mt-6 text-center text-[10px] text-neutral-600">
          IBRA PRODUCTION • IBRA ACCESS
        </div>
      </div>
    </div>
  );
};
