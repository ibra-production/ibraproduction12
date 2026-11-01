import React, { useState } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { useApp, ADMIN_EMAIL } from '../context/AppContext';

interface AdminLoginProps {
  onSuccess?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const { refreshAdminStatus } = useApp();
  const auth = getAuth();

  const [email, setEmail] = useState<string>(ADMIN_EMAIL);
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const isConfirmedAdmin = await refreshAdminStatus();

      if (!isConfirmedAdmin) {
        setErrorMessage('تم تسجيل الدخول لكن الحساب ليس لديه صلاحيات الإدارة المعتمدة.');
        setLoading(false);
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = '/admin';
      }
    } catch (err: any) {
      console.error('[AdminLogin] Error:', err);
      let msg = 'تعذر تسجيل الدخول. يرجى التحقق من صحة البريد وكلمة المرور.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'تم حظر المحاولات مؤقتاً بسبب تكرار المحاولات الخاطئة. يرجى الانتظار قليلاً.';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      const isConfirmedAdmin = await refreshAdminStatus();

      if (!isConfirmedAdmin) {
        setErrorMessage('الحساب المحدد لا يملك صلاحيات المدير الرسمية (v6CIpSmqqEWOFMvGu9ZxIapl4Ln1).');
        setLoading(false);
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = '/admin';
      }
    } catch (err: any) {
      console.error('[AdminLogin Google] Error:', err);
      setErrorMessage(err.message || 'فشل تسجيل الدخول بواسطة Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      dir="rtl" 
      style={{
        minHeight: '100vh',
        backgroundColor: '#050B14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#F4F6FB',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#0E172A',
          border: '1px solid #C29B38',
          borderRadius: '16px',
          padding: '36px 30px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          textAlign: 'center'
        }}
      >
        {/* Luxury Gold Monogram */}
        <div style={{
          width: '72px',
          height: '72px',
          margin: '0 auto 20px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFE58F 0%, #E5C158 50%, #C29B38 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#050B14',
          fontSize: '28px',
          fontWeight: '900',
          boxShadow: '0 4px 15px rgba(229,193,88,0.35)'
        }}>
          IB
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px', color: '#FFE58F' }}>
          IBRA PRODUCTION
        </h1>
        <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 28px' }}>
          بوابة الإدارة المركزية والتحكم السيادي
        </p>

        {errorMessage && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #EF4444',
            color: '#FCA5A5',
            padding: '12px 14px',
            borderRadius: '10px',
            fontSize: '13px',
            marginBottom: '20px',
            lineHeight: '1.5'
          }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleEmailLogin} style={{ textAlign: 'right' }}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#CBD5E1', marginBottom: '6px' }}>
              البريد الإلكتروني المعتمد
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="bahibarhouma56@gmail.com"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                color: '#FFFFFF',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#CBD5E1', marginBottom: '6px' }}>
              كلمة المرور
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                color: '#FFFFFF',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #FFE58F 0%, #E5C158 50%, #C29B38 100%)',
              color: '#050B14',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s',
              marginBottom: '14px'
            }}
          >
            {loading ? 'جارٍ التحقق وتوثيق الصلاحيات...' : 'تسجيل دخول الإدارة'}
          </button>
        </form>

        <div style={{ margin: '16px 0', display: 'flex', alignItems: 'center', color: '#475569', fontSize: '12px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }}></div>
          <span style={{ padding: '0 10px' }}>أو عبر Google</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }}></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #475569',
            backgroundColor: '#1E293B',
            color: '#F8FAFC',
            fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          الدخول بحساب Google الرسمي
        </button>
      </div>
    </div>
  );
};
