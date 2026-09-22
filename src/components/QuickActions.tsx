import React from 'react';
import { CalendarDays, Camera, Clapperboard, Gem, MapPinned, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface QuickActionsProps { onOpenBooking: () => void; }

export const QuickActions: React.FC<QuickActionsProps> = ({ onOpenBooking }) => {
  const { language } = useApp();
  const ar = language === 'ar';
  const fr = language === 'fr';
  const items = [
    [Camera, ar ? 'تصوير فوتوغرافي' : fr ? 'Photographie' : 'Photography', '#services'],
    [Clapperboard, ar ? 'فيديو وإنتاج' : fr ? 'Vidéo & production' : 'Video & production', '#videos'],
    [Gem, ar ? 'الباقات' : fr ? 'Packs' : 'Packages', '#packages'],
    [MapPinned, ar ? '69 ولاية' : fr ? '69 wilayas' : '69 wilayas', '#contact'],
  ] as const;
  return (
    <section className="ibra-quick-actions">
      <div className="ibra-quick-inner">
        <div className="ibra-quick-intro">
          <span>{ar ? 'IBRA / 01' : 'IBRA / 01'}</span>
          <strong>{ar ? 'كل ما تحتاجه في مكان واحد' : fr ? 'Tout au même endroit' : 'Everything in one place'}</strong>
        </div>
        <div className="ibra-quick-grid">
          {items.map(([Icon, label, href]) => (
            <a href={href} key={label} className="ibra-quick-item"><Icon className="w-5 h-5" /><span>{label}</span></a>
          ))}
          <button onClick={onOpenBooking} className="ibra-quick-book"><CalendarDays className="w-5 h-5" /><span>{ar ? 'ابدأ الحجز' : fr ? 'Réserver' : 'Book now'}</span></button>
        </div>
      </div>
    </section>
  );
};

export const ContactShortcut: React.FC = () => {
  const { language } = useApp();
  const ar = language === 'ar';
  const fr = language === 'fr';
  return (
    <a className="ibra-contact-shortcut" href="https://wa.me/213696967093" target="_blank" rel="noreferrer" aria-label="WhatsApp">
      <MessageCircle className="w-5 h-5" />
      <span>{ar ? 'تواصل معنا' : fr ? 'Nous contacter' : 'Contact us'}</span>
    </a>
  );
};
