import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, X, Globe, Lock, Calendar, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenAdmin }) => {
  const { language, setLanguage, settings } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sections = navLinks.map(link => link.href.slice(1));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.05, 0.2, 0.5] });
    sections.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: language === 'ar' ? 'الرئيسية' : language === 'fr' ? 'Accueil' : 'Home' },
    { href: '#about', label: language === 'ar' ? 'من نحن' : language === 'fr' ? 'À propos' : 'About' },
    { href: '#services', label: language === 'ar' ? 'الخدمات' : language === 'fr' ? 'Services' : 'Services' },
    { href: '#experience', label: language === 'ar' ? 'التجربة' : language === 'fr' ? 'Expérience' : 'Experience' },
    { href: '#client-experience', label: language === 'ar' ? 'خدمة العملاء' : language === 'fr' ? 'Espace client' : 'Client' },
    { href: '#portfolio', label: language === 'ar' ? 'أعمالنا' : language === 'fr' ? 'Portfolio' : 'Portfolio' },
    { href: '#videos', label: language === 'ar' ? 'الفيديو' : language === 'fr' ? 'Vidéos' : 'Videos' },
    { href: '#packages', label: language === 'ar' ? 'الباقات' : language === 'fr' ? 'Packs' : 'Packages' },
    { href: '#testimonials', label: language === 'ar' ? 'آراء العملاء' : language === 'fr' ? 'Avis' : 'Reviews' },
    { href: '#contact', label: language === 'ar' ? 'تواصل معنا' : language === 'fr' ? 'Contact' : 'Contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-neutral-950/85 backdrop-blur-2xl py-3 border-b border-amber-500/20 shadow-2xl shadow-black/40' : 'bg-gradient-to-b from-neutral-950/80 to-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full overflow-hidden shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform bg-neutral-900">
              <img src="/logo.jpg" alt="IBRA PRODUCTION Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-widest text-white group-hover:text-amber-400 transition-colors">
                {settings.agencyName}
              </span>
              <span className="block text-[10px] tracking-[0.2em] text-amber-500/80 uppercase">
                Wedding & Media
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-all duration-300 tracking-wide py-2 hover:-translate-y-0.5 ${activeSection === link.href.slice(1) ? 'text-amber-400' : 'text-neutral-300 hover:text-amber-400'}`}
              >
                {link.label}
                <span className={`absolute left-1/2 -bottom-0.5 h-0.5 -translate-x-1/2 bg-amber-400 transition-all duration-500 shadow-[0_0_12px_rgba(212,175,55,.7)] ${activeSection === link.href.slice(1) ? 'w-full' : 'w-0'}`} />
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-full p-1">
              <button
                onClick={() => setLanguage('ar')}
                className={`px-2.5 py-1 text-xs rounded-full transition-all ${language === 'ar' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                AR
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2.5 py-1 text-xs rounded-full transition-all ${language === 'fr' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs rounded-full transition-all ${language === 'en' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>

            {/* Admin Login Icon */}
            <button
              onClick={onOpenAdmin}
              title="لوحة الإدارة (Admin)"
              className="p-2.5 text-neutral-400 hover:text-amber-400 bg-neutral-900/80 border border-neutral-800 rounded-full hover:border-amber-500/50 transition-all"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Book Now Button */}
            <button
              onClick={onOpenBooking}
              className="gold-pulse relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold text-sm tracking-wider uppercase shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:from-amber-400 hover:to-amber-500 transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>{language === 'ar' ? 'احجز الآن' : language === 'fr' ? 'Réserver' : 'Book Now'}</span>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'ar' ? 'fr' : language === 'fr' ? 'en' : 'ar')}
              className="flex items-center gap-1 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-full text-xs text-amber-400 font-semibold"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language.toUpperCase()}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-200 hover:text-amber-400 bg-neutral-900 border border-neutral-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-neutral-950/98 border-b border-neutral-800 px-6 py-6 shadow-2xl backdrop-blur-xl transition-all">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between text-lg font-medium border-b border-neutral-900 pb-3 ${activeSection === link.href.slice(1) ? 'text-amber-400' : 'text-neutral-200 hover:text-amber-400'}`}
              >
                {link.label}
                {activeSection === link.href.slice(1) && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </a>
            ))}

            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }}
                className="w-full py-3 rounded-xl bg-amber-500 text-neutral-950 font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Calendar className="w-5 h-5" />
                <span>{language === 'ar' ? 'احجز موعدك الآن' : language === 'fr' ? 'Réserver maintenant' : 'Book Your Session'}</span>
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
                className="w-full py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium text-center flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-amber-500" />
                <span>{language === 'ar' ? 'لوحة تحكم المالك (Admin)' : language === 'fr' ? 'Admin Dashboard' : 'Admin Dashboard'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
