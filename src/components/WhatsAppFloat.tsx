import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloat: React.FC = () => {
  const { settings } = useApp();
  const phone = settings.whatsapp.replace(/[^0-9]/g, '');

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp Chat"
      title="WhatsApp — Ibra Production"
      className="group fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 transition-all transform hover:scale-110"
    >
      <span className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-30" />
      <MessageCircle className="relative w-8 h-8 fill-white transition-transform group-hover:rotate-6" />
    </a>
  );
};
