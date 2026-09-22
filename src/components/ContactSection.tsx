import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, Facebook, Instagram, Youtube, Sparkles } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { language, settings, addContactMessage } = useApp();
  const [sentMessage, setSentMessage] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;
    setIsSending(true);
    addContactMessage({ name: name.trim(), phone: phone.trim(), message: message.trim() });
    setTimeout(() => setIsSending(false), 500);
    setSentMessage(true);
    setTimeout(() => setSentMessage(false), 5000);
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <section id="contact" className="py-24 bg-neutral-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-widest">
              {language === 'ar' ? 'تواصل معنا' : language === 'fr' ? 'Contactez-nous' : 'Get In Touch'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-cinzel text-white mb-6">
            {language === 'ar' ? 'نحن هنا لإجابتكم وتحويل أفكاركم لحقيقة' : language === 'fr' ? 'Parlons de Votre Projet' : 'Let’s Discuss Your Project'}
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg">
            {language === 'ar'
              ? 'تواصلوا معنا عبر الهاتف، الواتساب، أو زيارة استوديو الوكالة.'
              : language === 'fr'
              ? 'Contactez-nous par téléphone, WhatsApp ou visitez notre studio.'
              : 'Contact us via phone, WhatsApp, or visit our studio.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Details & Info */}
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-3xl border border-neutral-800 space-y-6 hover:border-amber-500/40">
              <h3 className="text-2xl font-bold font-cinzel text-white mb-4">
                {settings.agencyName}
              </h3>

              <div className="flex items-center gap-4 group hover:translate-x-1 transition-transform">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover/contact:bg-amber-500/20 transition-colors duration-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-neutral-400 mb-1">
                    {language === 'ar' ? 'أرقام الهاتف' : 'Phone Numbers'}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <a href="tel:0696967093" className="text-base font-bold text-white hover:text-amber-400 transition-colors">
                      0696967093
                    </a>
                    <a href="tel:0558948485" className="text-base font-bold text-white hover:text-amber-400 transition-colors">
                      0558948485
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 group/contact hover:translate-x-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-neutral-400 mb-1">
                    {language === 'ar' ? 'واتساب مباشر' : 'WhatsApp'}
                  </span>
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace('+', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-lg font-bold text-white hover:text-amber-400 transition-colors"
                  >
                    {settings.whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-neutral-400 mb-1">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </span>
                  <a href={`mailto:${settings.email}`} className="text-base font-semibold text-white hover:text-amber-400 transition-colors">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-neutral-400 mb-1">
                    {language === 'ar' ? 'العنوان' : 'Address'}
                  </span>
                  <span className="text-sm text-neutral-200 font-medium">
                    {language === 'fr' ? settings.addressFr : language === 'en' ? settings.addressEn : settings.addressAr}
                  </span>
                </div>
              </div>

              {/* Social Media links */}
              <div className="pt-6 border-t border-neutral-800 flex items-center gap-4">
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-amber-400 hover:border-amber-500 transition-all"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-amber-400 hover:border-amber-500 transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-amber-400 hover:border-amber-500 transition-all"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-8 sm:p-10 rounded-3xl border border-neutral-800 flex flex-col justify-between hover:border-amber-500/40">
            <div>
              <h3 className="text-2xl font-bold font-cinzel text-white mb-2">
                {language === 'ar' ? 'أرسل لنا رسالة مباشرة' : language === 'fr' ? 'Envoyez-nous un Message' : 'Send Us a Message'}
              </h3>
              <p className="text-sm text-neutral-400 mb-6">
                {language === 'ar' ? 'سنقوم بالرد عليكم في أقرب وقت ممكن.' : 'We will reply as soon as possible.'}
              </p>

              {sentMessage ? (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center my-8">
                  <CheckCircle2 className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                  <h4 className="font-bold text-white text-lg mb-1">
                    {language === 'ar' ? 'تم إرسال رسالتكم بنجاح!' : 'Message Sent Successfully!'}
                  </h4>
                  <p className="text-xs text-neutral-300">
                    {language === 'ar' ? 'شكراً لتواصلكم معنا. سنتصل بكم قريبًا.' : 'Thank you. We will contact you soon.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="اسمك الكريم"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      {language === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      inputMode="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="0779000833"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      {language === 'ar' ? 'الرسالة أو الاستفسار *' : 'Message *'}
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder={language === 'ar' ? 'اكتب تفاصيل استفسارك هنا...' : 'Write your inquiry here...'}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="group/submit w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <Send className={`w-4 h-4 transition-transform ${isSending ? 'animate-pulse' : 'group-hover/submit:translate-x-1'}`} />
                    <span>{language === 'ar' ? 'إرسال الرسالة' : language === 'fr' ? 'Envoyer le Message' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
