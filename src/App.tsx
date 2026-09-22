/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { VideosSection } from './components/VideosSection';
import { PackagesSection } from './components/PackagesSection';
import { OffersSection } from './components/OffersSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { WhyUsSection } from './components/WhyUsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { BookingModal } from './components/BookingModal';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { AvailabilityChecker } from './components/AvailabilityChecker';
import { PackageCustomizer } from './components/PackageCustomizer';
import { ClientExperience } from './components/ClientExperience';
import { ClientPortal } from './components/ClientPortal';
import { ClientTrackingButton } from './components/ClientTrackingButton';
import { MotionFX } from './components/MotionFX';
import { AgencyExperience } from './components/AgencyExperience';
import { QuickActions, ContactShortcut } from './components/QuickActions';
import { ServiceItem, PackageItem } from './types';

function MainContent() {
  const { currentUser, settings, language } = useApp();
  const maintenance = settings.maintenanceMode === true;

  useEffect(() => {
    const title =
      language === 'ar'
        ? 'منصة إبرا للحجوزات | Ibra Production'
        : language === 'fr'
          ? 'Plateforme de réservation Ibra | Ibra Production'
          : 'Ibra Booking Platform | Ibra Production';
    document.title = title;
    const description =
      language === 'ar'
        ? 'منصة إبرا للحجوزات الرسمية — احجز خدمات التصوير والفيديو وتنظيم الأعراس والمناسبات مع Ibra Production في الجزائر.'
        : language === 'fr'
          ? 'Plateforme officielle de réservation Ibra Production pour la photographie, la vidéo et l’organisation des mariages et événements en Algérie.'
          : 'Official Ibra Production booking platform for photography, videography, weddings and events in Algeria.';
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = description;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [settings, language]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);

  const handleOpenBookingWithService = (service: ServiceItem) => {
    setSelectedService(service);
    setSelectedPackage(null);
    setBookingModalOpen(true);
  };

  const handleOpenBookingWithPackage = (pkg: PackageItem) => {
    setSelectedPackage(pkg);
    setSelectedService(null);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
      <MotionFX />
      <ClientPortal />
      <ClientTrackingButton />
      <Navbar
        onOpenBooking={() => {
          setSelectedService(null);
          setSelectedPackage(null);
          setBookingModalOpen(true);
        }}
        onOpenAdmin={() => {
          if (currentUser) {
            setAdminDashboardOpen(true);
          } else {
            setAdminLoginOpen(true);
          }
        }}
      />

      {maintenance ? (
        <main className="min-h-screen flex items-center justify-center px-6 bg-neutral-950">
          <div className="max-w-xl text-center">
            <div className="w-20 h-20 mx-auto mb-7 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-3xl font-bold">I</div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white font-cinzel mb-5">
              {language === 'ar' ? 'الموقع قيد الصيانة' : language === 'fr' ? 'Site en maintenance' : 'Website under maintenance'}
            </h1>
            <p className="text-neutral-400 leading-8">
              {language === 'ar' ? 'نعمل على تطوير الموقع وتحسين تجربة العملاء. سنعود قريباً.' : language === 'fr' ? 'Nous améliorons actuellement le site et l’expérience client. À bientôt.' : 'We are improving the website and client experience. We will be back soon.'}
            </p>
          </div>
        </main>
      ) : (
        <main>
          <Hero onOpenBooking={() => setBookingModalOpen(true)} />
          <QuickActions onOpenBooking={() => setBookingModalOpen(true)} />
          <About />
          <Services onSelectService={handleOpenBookingWithService} />
          <AvailabilityChecker onOpenBooking={() => setBookingModalOpen(true)} />
          <AgencyExperience onOpenBooking={() => setBookingModalOpen(true)} />
          <Portfolio />
          <VideosSection />
          <OffersSection onOpenBooking={() => setBookingModalOpen(true)} />
          <PackagesSection onSelectPackage={handleOpenBookingWithPackage} />
          <PackageCustomizer onOpenBooking={() => setBookingModalOpen(true)} />
          <TestimonialsSection />
          <WhyUsSection />
          <ClientExperience onOpenBooking={() => setBookingModalOpen(true)} />
          <ContactSection />
        </main>
      )}

      <Footer
        onOpenAdmin={() => {
          if (currentUser) {
            setAdminDashboardOpen(true);
          } else {
            setAdminLoginOpen(true);
          }
        }}
      />
      <WhatsAppFloat />
      <ContactShortcut />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedService={selectedService}
        preselectedPackage={selectedPackage}
      />

      <AdminLogin
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={() => setAdminDashboardOpen(true)}
      />

      {adminDashboardOpen && (
        <AdminDashboard onClose={() => setAdminDashboardOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

