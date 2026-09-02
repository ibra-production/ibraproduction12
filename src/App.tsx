/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
import { ServiceItem, PackageItem } from './types';

function MainContent() {
  const { currentUser } = useApp();
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

      <main>
        <Hero onOpenBooking={() => setBookingModalOpen(true)} />
        <About />
        <Services onSelectService={handleOpenBookingWithService} />
        <AvailabilityChecker onOpenBooking={() => setBookingModalOpen(true)} />
        <Portfolio />
        <VideosSection />
        <OffersSection onOpenBooking={() => setBookingModalOpen(true)} />
        <PackagesSection onSelectPackage={handleOpenBookingWithPackage} />
        <PackageCustomizer onOpenBooking={() => setBookingModalOpen(true)} />
        <TestimonialsSection />
        <WhyUsSection />
        <ContactSection />
      </main>

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

