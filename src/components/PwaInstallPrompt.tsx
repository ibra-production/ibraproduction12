import React, { useEffect, useState } from 'react';
import { Download, X, Share2 } from 'lucide-react';

export const PwaInstallPrompt: React.FC = () => {
  const [prompt, setPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setPrompt(event);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall as EventListener);
  }, []);

  if (!visible || !prompt) return null;

  return (
    <div className="fixed left-3 right-3 bottom-4 z-[80] md:left-auto md:right-5 md:w-[390px]">
      <div className="rounded-2xl border border-amber-500/30 bg-neutral-950/95 backdrop-blur-xl p-4 shadow-2xl shadow-black/50">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
            <img src="/logo.jpg" alt="Ibra Production" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-white">ثبّت منصة إبرا على جهازك</h3>
            <p className="text-xs text-neutral-400 mt-1 leading-5">وصول أسرع للموقع كتطبيق مستقل على الهاتف أو الكمبيوتر.</p>
          </div>
          <button onClick={() => setVisible(false)} className="text-neutral-500 hover:text-white" aria-label="إغلاق"><X className="w-5 h-5"/></button>
        </div>
        <button
          className="mt-3 w-full min-h-[46px] rounded-xl bg-amber-500 text-neutral-950 font-bold flex items-center justify-center gap-2"
          onClick={async () => {
            await prompt.prompt();
            setVisible(false);
            setPrompt(null);
          }}
        >
          <Download className="w-4 h-4" /> تثبيت التطبيق
        </button>
      </div>
    </div>
  );
};

export const ShareIbraButton: React.FC = () => {
  const share = async () => {
    const data = { title: 'Ibra Production', text: 'منصة إبرا للحجوزات', url: window.location.origin };
    if (navigator.share) {
      try { await navigator.share(data); } catch {}
    } else {
      await navigator.clipboard?.writeText(window.location.origin);
      alert('تم نسخ رابط الموقع.');
    }
  };
  return (
    <button onClick={share} className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 hover:border-amber-500/40">
      <Share2 className="w-4 h-4" /> مشاركة المنصة
    </button>
  );
};
