import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloat: React.FC = () => {
  const { settings } = useApp();

  return (
    <a
      href={`https://wa.me/${settings.whatsapp.replace('+', '')}`}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp Chat"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 transition-all transform hover:scale-110"
    >
      <MessageCircle className="w-8 h-8 fill-white" />
    </a>
  );
};
