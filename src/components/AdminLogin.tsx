import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, KeyRound, X, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { login, language } = useApp();
  const [email, setEmail] = useState('admin@ibraprod.online');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      setError(false);
      onLoginSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-md animate-fade-in">
      <div className="bg-neutral-900 border border-amber-500/30 rounded-3xl max-w-md w-full p-8 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-xl shadow-amber-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold font-cinzel text-white mb-2">
            {language === 'ar' ? 'لوحة تحكم المالك' : 'Owner CMS Login'}
          </h3>
          <p className="text-xs text-neutral-400">
            {language === 'ar' ? 'أدخل بيانات الاعتماد الخاصة بالمالك' : 'Enter credentials for master admin access'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl mb-6 text-center">
            {language === 'ar' ? 'بيانات الدخول غير صحيحة. جرب: admin123' : 'Invalid credentials. Try admin123'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute top-3.5 right-3.5 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none pr-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              {language === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <KeyRound className="absolute top-3.5 right-3.5 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none pr-10"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold text-sm tracking-wider uppercase shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 transition-all mt-6"
          >
            {language === 'ar' ? 'تسجيل الدخول للإدارة' : 'Login to Dashboard'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-neutral-500">
          IBRA PRODUCTION • Owner CMS v2.6
        </div>
      </div>
    </div>
  );
};
