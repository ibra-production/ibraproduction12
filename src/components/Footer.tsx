import React from 'react';
import { useApp } from '../context/AppContext';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { language, settings } = useApp();

  return (
    <footer className="bg-neutral-950 border-t border-amber-500/10 pt-16 pb-12 text-neutral-400 text-sm relative overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[36rem] h-64 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-full overflow-hidden shadow-lg shadow-amber-500/20 bg-neutral-900">
                <img src="/logo.jpg" alt="IBRA PRODUCTION Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-cinzel text-xl font-bold tracking-widest text-white">
                  {settings.agencyName}
                </span>
                <span className="block text-[10px] tracking-[0.2em] text-amber-500 uppercase">
                  Wedding & Media Production
                </span>
              </div>
            </div>

            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6 font-light">
              {language === 'ar'
                ? 'وكالة رائدة في تصوير الأعراس والإنتاج الإعلامي بمعايير سينمائية فاخرة.'
                : 'Leading agency in wedding photography and cinematic media production.'}
            </p>

            <div className="flex items-center gap-3 mb-6">
              <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-amber-400 hover:border-amber-500 hover:-translate-y-1 transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-amber-400 hover:border-amber-500 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={settings.youtubeUrl} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-amber-400 hover:border-amber-500 transition-all">
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            {/* Owner CMS Access Button */}
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500 hover:text-neutral-950 transition-all shadow-lg"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'لوحة تحكم المسؤول (Owner CMS)' : 'Admin Control Panel'}</span>
            </button>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-cinzel font-bold text-base mb-6 tracking-wide">
              {language === 'ar' ? 'روابط الموقع' : language === 'fr' ? 'Liens Rapides' : 'Quick Links'}
            </h4>
            <ul className="space-y-3">
              <li><a href="#home" className="hover:text-amber-400 transition-colors">{language === 'ar' ? 'الرئيسية' : 'Home'}</a></li>
              <li><a href="#about" className="hover:text-amber-400 transition-colors">{language === 'ar' ? 'من نحن' : 'About Us'}</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">{language === 'ar' ? 'خدماتنا' : 'Services'}</a></li>
              <li><a href="#portfolio" className="hover:text-amber-400 transition-colors">{language === 'ar' ? 'معرض الأعمال' : 'Portfolio'}</a></li>
              <li><a href="#packages" className="hover:text-amber-400 transition-colors">{language === 'ar' ? 'الباقات والأسعار' : 'Packages'}</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-cinzel font-bold text-base mb-6 tracking-wide">
              {language === 'ar' ? 'الخدمات' : language === 'fr' ? 'Services' : 'Services'}
            </h4>
            <ul className="space-y-3">
              <li><a href="#services" className="hover:text-amber-400 transition-colors">{language === 'ar' ? 'تصوير الأعراس الفاخر' : 'Luxury Weddings'}</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">{language === 'ar' ? 'تصوير الفيديو السينمائي' : 'Cinematic Videography'}</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">{language === 'ar' ? 'مونتاج وإنتاج الفيديو' : 'Video Editing'}</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">{language === 'ar' ? 'صناعة المحتوى الرقمي' : 'Content Creation'}</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">{language === 'ar' ? 'تصوير البورتريه والمنتجات' : 'Portrait & Products'}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-cinzel font-bold text-base mb-6 tracking-wide">
              {language === 'ar' ? 'التواصل' : language === 'fr' ? 'Contact' : 'Contact'}
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <a href="tel:0696967093" className="hover:text-amber-400">0696967093</a>
                  <a href="tel:0558948485" className="hover:text-amber-400">0558948485</a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-amber-400">{settings.email}</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === 'fr' ? settings.addressFr : settings.addressAr}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500">
          <p>© 2026 IBRA PRODUCTION. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#home" className="hover:text-amber-400">Privacy Policy</a>
            <a href="#home" className="hover:text-amber-400">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
