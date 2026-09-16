import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  SiteSettings,
  StatItem,
  ServiceItem,
  PackageItem,
  PortfolioItem,
  VideoItem,
  TestimonialItem,
  BookingItem,
  OfferItem,
  AdminUser,
  Language,
  ActivityLog,
  ContactMessage,
} from "../types";

import {
  initialSiteSettings,
  initialStats,
  initialServices,
  initialPackages,
  initialPortfolio,
  initialVideos,
  initialTestimonials,
  initialOffers,
  initialUsers,
} from "../data/initialData";

import { db, auth } from "../firebase";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "rtl" | "ltr";

  settings: SiteSettings;
  updateSettings: (
    newSettings: Partial<SiteSettings>
  ) => void;

  stats: StatItem[];
  services: ServiceItem[];
  packages: PackageItem[];
  portfolio: PortfolioItem[];
  videos: VideoItem[];
  testimonials: TestimonialItem[];
  bookings: BookingItem[];
  offers: OfferItem[];
  activityLogs: ActivityLog[];
  users: AdminUser[];

  currentUser: AdminUser | null;

  login: (
    email: string,
    pass: string
  ) => Promise<boolean>;

  logout: () => Promise<void>;

  addService: (
    service: Omit<ServiceItem, "id">
  ) => void;

  updateService: (
    id: string,
    service: Partial<ServiceItem>
  ) => void;

  deleteService: (
    id: string
  ) => void;

  addPackage: (
    pkg: Omit<PackageItem, "id">
  ) => void;

  updatePackage: (
    id: string,
    pkg: Partial<PackageItem>
  ) => void;

  deletePackage: (
    id: string
  ) => void;

  addPortfolioItem: (
    item: Omit<PortfolioItem, "id">
  ) => void;

  updatePortfolioItem: (
    id: string,
    item: Partial<PortfolioItem>
  ) => void;

  deletePortfolioItem: (
    id: string
  ) => void;

  addVideoItem: (
    item: Omit<VideoItem, "id">
  ) => void;

  updateVideoItem: (
    id: string,
    item: Partial<VideoItem>
  ) => void;

  deleteVideoItem: (
    id: string
  ) => void;

  addTestimonial: (
    item: Omit<TestimonialItem, "id">
  ) => void;

  updateTestimonial: (
    id: string,
    item: Partial<TestimonialItem>
  ) => void;

  deleteTestimonial: (
    id: string
  ) => void;

  addBooking: (
    booking: Omit<
      BookingItem,
      "id" | "createdAt" | "status"
    >
  ) => Promise<void>;

  updateBookingStatus: (
    id: string,
    status: BookingItem["status"]
  ) => Promise<void>;

  deleteBooking: (
    id: string
  ) => Promise<void>;

  addOffer: (
    offer: Omit<OfferItem, "id">
  ) => void;

  updateOffer: (
    id: string,
    offer: Partial<OfferItem>
  ) => void;

  deleteOffer: (
    id: string
  ) => void;

  contactMessages: ContactMessage[];

  addContactMessage: (msg: {
    name: string;
    phone: string;
    message: string;
  }) => void;

  markContactMessageAsRead: (
    id: string
  ) => void;

  deleteContactMessage: (
    id: string
  ) => void;

  backupData: () => string;

  restoreData: (
    jsonData: string
  ) => boolean;
}

const AppContext =
  createContext<AppContextType | undefined>(
    undefined
  );

export const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // =========================
  // Language
  // =========================

  const [language, setLanguageState] =
    useState<Language>(() => {
      const saved =
        localStorage.getItem("ibra_lang");

      return (
        (saved as Language) || "ar"
      );
    });

  const dir =
    language === "ar"
      ? "rtl"
      : "ltr";

  const setLanguage = (
    lang: Language
  ) => {
    setLanguageState(lang);

    localStorage.setItem(
      "ibra_lang",
      lang
    );

    document.documentElement.lang =
      lang;

    document.documentElement.dir =
      lang === "ar"
        ? "rtl"
        : "ltr";
  };

  useEffect(() => {
    document.documentElement.lang =
      language;

    document.documentElement.dir =
      dir;
  }, [language, dir]);

  // =========================
  // Settings
  // =========================

  const [settings, setSettings] =
    useState<SiteSettings>(() => {
      const saved =
        localStorage.getItem(
          "ibra_settings"
        );

      const parsed = saved
        ? JSON.parse(saved)
        : initialSiteSettings;

      return {
        ...parsed,
        facebookUrl:
          "https://www.facebook.com/share/1HpLYTDQYR/?mibextid=wwXIfr",
        instagramUrl:
          "https://www.instagram.com/ibrahim_journalist?igsi=N2M4d2NvYmY1Z2Fp&utm_source=qr",
      };
    });

  // =========================
  // Stats
  // =========================

  const [stats] =
    useState<StatItem[]>(
      initialStats
    );

  // =========================
  // Services
  // =========================

  const [services, setServices] =
    useState<ServiceItem[]>(() => {
      const saved =
        localStorage.getItem(
          "ibra_services"
        );

      return saved
        ? JSON.parse(saved)
        : initialServices;
    });

  // =========================
  // Packages
  // =========================

  const [packages, setPackages] =
    useState<PackageItem[]>(() => {
      const saved =
        localStorage.getItem(
          "ibra_packages"
        );

      return saved
        ? JSON.parse(saved)
        : initialPackages;
    });

  // =========================
  // Portfolio
  // =========================

  const [portfolio, setPortfolio] =
    useState<PortfolioItem[]>(() => {
      const saved =
        localStorage.getItem(
          "ibra_portfolio"
        );

      return saved
        ? JSON.parse(saved)
        : initialPortfolio;
    });

  // =========================
  // Videos
  // =========================

  const [videos, setVideos] =
    useState<VideoItem[]>(() => {
      const saved =
        localStorage.getItem(
          "ibra_videos"
        );

      return saved
        ? JSON.parse(saved)
        : initialVideos;
    });

  // =========================
  // Testimonials
  // =========================

  const [
    testimonials,
    setTestimonials,
  ] = useState<TestimonialItem[]>(() => {
    const saved =
      localStorage.getItem(
        "ibra_testimonials"
      );

    return saved
      ? JSON.parse(saved)
      : initialTestimonials;
  });

  // =========================
  // Bookings
  // =========================

  const [bookings, setBookings] =
    useState<BookingItem[]>(() => {
      const saved =
        localStorage.getItem(
          "ibra_bookings"
        );

      return saved
        ? JSON.parse(saved)
        : [];
    });

  // =========================
  // Offers
  // =========================

  const [offers, setOffers] =
    useState<OfferItem[]>(() => {
      const saved =
        localStorage.getItem(
          "ibra_offers"
        );

      return saved
        ? JSON.parse(saved)
        : initialOffers;
    });

  // =========================
  // Contact Messages
  // =========================

  const [
    contactMessages,
    setContactMessages,
  ] = useState<ContactMessage[]>(() => {
    const saved =
      localStorage.getItem(
        "ibra_contact_messages"
      );

    return saved
      ? JSON.parse(saved)
      : [];
  });

  // =========================
  // Activity Logs
  // =========================

  const [
    activityLogs,
    setActivityLogs,
  ] = useState<ActivityLog[]>(() => {
    const saved =
      localStorage.getItem(
        "ibra_logs"
      );

    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "l1",
            user: "Ibrahim (Owner)",
            actionAr:
              "تم تسجيل دخول النظام وإطلاق الموقع",
            timestamp:
              "2026-08-31 12:00",
            type: "settings",
          },
        ];
  });

  // =========================
  // Users
  // =========================

  const [users] =
    useState<AdminUser[]>(
      initialUsers
    );

  // =========================
  // Current User
  // =========================

  const [currentUser, setCurrentUser] =
    useState<AdminUser | null>(null);

  // =========================
  // LocalStorage
  // =========================

  useEffect(() => {
    localStorage.setItem(
      "ibra_settings",
      JSON.stringify(settings)
    );
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(
      "ibra_services",
      JSON.stringify(services)
    );
  }, [services]);

  useEffect(() => {
    localStorage.setItem(
      "ibra_packages",
      JSON.stringify(packages)
    );
  }, [packages]);

  useEffect(() => {
    localStorage.setItem(
      "ibra_portfolio",
      JSON.stringify(portfolio)
    );
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem(
      "ibra_videos",
      JSON.stringify(videos)
    );
  }, [videos]);

  useEffect(() => {
    localStorage.setItem(
      "ibra_testimonials",
      JSON.stringify(testimonials)
    );
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem(
      "ibra_bookings",
      JSON.stringify(bookings)
    );
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(
      "ibra_offers",
      JSON.stringify(offers)
    );
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(
      "ibra_logs",
      JSON.stringify(activityLogs)
    );
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem(
      "ibra_contact_messages",
      JSON.stringify(contactMessages)
    );
  }, [contactMessages]);

  // =========================
  // Activity Log
  // =========================

  const logActivity = (
    actionAr: string,
    type: ActivityLog["type"]
  ) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      user:
        currentUser?.name ||
        "Owner",
      actionAr,
      timestamp:
        new Date()
          .toISOString()
          .replace("T", " ")
          .substring(0, 16),
      type,
    };

    setActivityLogs((prev) => [
      newLog,
      ...prev,
    ]);
  };

  // =========================
  // Contact Messages
  // =========================

  const addContactMessage = (msg: {
    name: string;
    phone: string;
    message: string;
  }) => {
    const newMsg: ContactMessage = {
      id: Date.now().toString(),
      name: msg.name,
      phone: msg.phone,
      message: msg.message,
      createdAt:
        new Date()
          .toISOString()
          .replace("T", " ")
          .substring(0, 16),
      read: false,
    };

    setContactMessages((prev) => [
      newMsg,
      ...prev,
    ]);

    logActivity(
      `رسالة تواصل جديدة من ${msg.name}`,
      "create"
    );
  };

  const markContactMessageAsRead = (
    id: string
  ) => {
    setContactMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              read: true,
            }
          : m
      )
    );
  };

  const deleteContactMessage = (
    id: string
  ) => {
    setContactMessages((prev) =>
      prev.filter(
        (m) => m.id !== id
      )
    );

    logActivity(
      "حذف رسالة تواصل",
      "delete"
    );
  };

  // =========================
  // Settings
  // =========================

  const updateSettings = (
    newSettings: Partial<SiteSettings>
  ) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));

    logActivity(
      "تم تحديث إعدادات الموقع الأساسية",
      "settings"
    );
  };

  // =========================
  // Firebase Authentication
  // =========================

  const login = async (
    email: string,
    pass: string
  ): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        pass
      );

      return true;
    } catch (error) {
      alert(String(error)); console.error(
        "Firebase login error:",
        error
      );

      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      alert(String(error)); console.error(
        "Firebase logout error:",
        error
      );
    }
  };

  // =========================
  // Firebase Auth State
  // =========================

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (firebaseUser) => {
          if (firebaseUser) {
            const adminUser =
              users[0];

            setCurrentUser(
              adminUser
            );

            logActivity(
              "تم تسجيل الدخول إلى لوحة الإدارة",
              "settings"
            );
          } else {
            setCurrentUser(null);
          }
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);

  // =========================
  // Services
  // =========================

  const addService = (
    service: Omit<ServiceItem, "id">
  ) => {
    const newItem = {
      ...service,
      id: "s_" + Date.now(),
    };

    setServices((prev) => [
      ...prev,
      newItem,
    ]);

    logActivity(
      `تمت إضافة خدمة جديدة: ${service.titleAr}`,
      "create"
    );
  };

  const updateService = (
    id: string,
    data: Partial<ServiceItem>
  ) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              ...data,
            }
          : s
      )
    );

    logActivity(
      `تم تحديث الخدمة ID: ${id}`,
      "update"
    );
  };

  const deleteService = (
    id: string
  ) => {
    setServices((prev) =>
      prev.filter(
        (s) => s.id !== id
      )
    );

    logActivity(
      `تم حذف الخدمة ID: ${id}`,
      "delete"
    );
  };

  // =========================
  // Packages
  // =========================

  const addPackage = (
    pkg: Omit<PackageItem, "id">
  ) => {
    const newItem = {
      ...pkg,
      id: "p_" + Date.now(),
    };

    setPackages((prev) => [
      ...prev,
      newItem,
    ]);

    logActivity(
      `تمت إضافة باقة جديدة: ${pkg.nameAr}`,
      "create"
    );
  };

  const updatePackage = (
    id: string,
    data: Partial<PackageItem>
  ) => {
    setPackages((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...data,
            }
          : p
      )
    );

    logActivity(
      `تم تحديث الباقة ID: ${id}`,
      "update"
    );
  };

  const deletePackage = (
    id: string
  ) => {
    setPackages((prev) =>
      prev.filter(
        (p) => p.id !== id
      )
    );

    logActivity(
      `تم حذف الباقة ID: ${id}`,
      "delete"
    );
  };

  // =========================
  // Portfolio
  // =========================

  const addPortfolioItem = (
    item: Omit<PortfolioItem, "id">
  ) => {
    const newItem = {
      ...item,
      id: "port_" + Date.now(),
    };

    setPortfolio((prev) => [
      ...prev,
      newItem,
    ]);

    logActivity(
      `تمت إضافة مشروع جديد للمعرض: ${item.titleAr}`,
      "create"
    );
  };

  const updatePortfolioItem = (
    id: string,
    data: Partial<PortfolioItem>
  ) => {
    setPortfolio((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...data,
            }
          : p
      )
    );

    logActivity(
      `تم تحديث المشروع ID: ${id}`,
      "update"
    );
  };

  const deletePortfolioItem = (
    id: string
  ) => {
    setPortfolio((prev) =>
      prev.filter(
        (p) => p.id !== id
      )
    );

    logActivity(
      `تم حذف المشروع ID: ${id}`,
      "delete"
    );
  };

  // =========================
  // Videos
  // =========================

  const addVideoItem = (
    item: Omit<VideoItem, "id">
  ) => {
    const newItem = {
      ...item,
      id: "v_" + Date.now(),
    };

    setVideos((prev) => [
      ...prev,
      newItem,
    ]);

    logActivity(
      `تمت إضافة فيديو جديد: ${item.titleAr}`,
      "create"
    );
  };

  const updateVideoItem = (
    id: string,
    data: Partial<VideoItem>
  ) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              ...data,
            }
          : v
      )
    );

    logActivity(
      `تم تحديث الفيديو ID: ${id}`,
      "update"
    );
  };

  const deleteVideoItem = (
    id: string
  ) => {
    setVideos((prev) =>
      prev.filter(
        (v) => v.id !== id
      )
    );

    logActivity(
      `تم حذف الفيديو ID: ${id}`,
      "delete"
    );
  };

  // =========================
  // Testimonials
  // =========================

  const addTestimonial = (
    item: Omit<TestimonialItem, "id">
  ) => {
    const newItem = {
      ...item,
      id: "t_" + Date.now(),
    };

    setTestimonials((prev) => [
      ...prev,
      newItem,
    ]);

    logActivity(
      `تمت إضافة تقييم للعميل: ${item.clientName}`,
      "create"
    );
  };

  const updateTestimonial = (
    id: string,
    data: Partial<TestimonialItem>
  ) => {
    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...data,
            }
          : t
      )
    );

    logActivity(
      `تم تحديث التقييم ID: ${id}`,
      "update"
    );
  };

  const deleteTestimonial = (
    id: string
  ) => {
    setTestimonials((prev) =>
      prev.filter(
        (t) => t.id !== id
      )
    );

    logActivity(
      `تم حذف التقييم ID: ${id}`,
      "delete"
    );
  };

  // =========================
  // Bookings - Firestore
  // =========================

  const addBooking = async (
    bookingData: Omit<
      BookingItem,
      "id" | "createdAt" | "status"
    >
  ): Promise<void> => {
    try {
      console.log(
        "1️⃣ إرسال الحجز إلى Firestore:",
        bookingData
      );

      const cleanBookingData =
        Object.fromEntries(
          Object.entries(
            bookingData
          ).filter(
            ([, value]) =>
              value !== undefined &&
              value !== null
          )
        );

      const bookingRef =
        await addDoc(
          collection(
            db,
            "bookings"
          ),
          {
            ...cleanBookingData,
            status: "new",
            createdAt:
              serverTimestamp(),
          }
        );

      console.log(
        "2️⃣ تم الحفظ في Firestore بنجاح:",
        bookingRef.id
      );

      const newBooking: BookingItem = {
        ...bookingData,
        id: bookingRef.id,
        status: "new",
        createdAt:
          new Date().toISOString(),
      };

      setBookings((prev) => [
        newBooking,
        ...prev,
      ]);

      logActivity(
        `حجز جديد: ${bookingData.groomName} والعروس: ${bookingData.brideName}`,
        "create"
      );
    } catch (error: any) {
      alert(String(error)); console.error(
        "❌ FIRESTORE BOOKING ERROR:",
        error
      );

      alert(
        "خطأ Firestore: " +
          (error?.message ||
            "خطأ غير معروف")
      );

      throw error;
    }
  };

  // =========================
  // Update Booking Status
  // =========================

  const updateBookingStatus =
    async (
      id: string,
      status: BookingItem["status"]
    ): Promise<void> => {
      try {
        await updateDoc(
          doc(
            db,
            "bookings",
            id
          ),
          {
            status,
          }
        );

        setBookings((prev) =>
          prev.map(
            (booking) =>
              booking.id === id
                ? {
                    ...booking,
                    status,
                  }
                : booking
          )
        );

        logActivity(
          `تم تحديث حالة الحجز ID: ${id} إلى ${status}`,
          "update"
        );
      } catch (error) {
        alert(String(error)); console.error(
          "Firestore update booking error:",
          error
        );

        throw error;
      }
    };

  // =========================
  // Delete Booking
  // =========================

  const deleteBooking =
    async (
      id: string
    ): Promise<void> => {
      try {
        await deleteDoc(
          doc(
            db,
            "bookings",
            id
          )
        );

        setBookings((prev) =>
          prev.filter(
            (booking) =>
              booking.id !== id
          )
        );

        logActivity(
          `تم حذف الحجز ID: ${id}`,
          "delete"
        );
      } catch (error) {
        alert(String(error)); console.error(
          "Firestore delete booking error:",
          error
        );

        throw error;
      }
    };

  // =========================
  // Firestore Realtime Listener
  // =========================

  useEffect(() => {
    const unsubscribe =
      onSnapshot(
        collection(
          db,
          "bookings"
        ),
        (snapshot) => {
          console.log(
            "🔥 Firestore bookings:",
            snapshot.docs.length
          );

          const firestoreBookings: BookingItem[] =
            snapshot.docs.map(
              (bookingDoc) => {
                const data =
                  bookingDoc.data();

                return {
                  id: bookingDoc.id,

                  groomName:
                    data.groomName ||
                    "",

                  brideName:
                    data.brideName ||
                    "",

                  phone:
                    data.phone ||
                    "",

                  email:
                    data.email ||
                    "",

                  eventType:
                    data.eventType ||
                    "",

                  eventDate:
                    data.eventDate ||
                    "",

                  eventTime:
                    data.eventTime ||
                    "",

                  venue:
                    data.venue ||
                    "",

                  serviceId:
                    data.serviceId ||
                    "",

                  packageId:
                    data.packageId ||
                    undefined,

                  notes:
                    data.notes ||
                    "",

                  status:
                    data.status ||
                    "new",

                  createdAt:
                    data.createdAt?.toDate
                      ? data.createdAt
                          .toDate()
                          .toISOString()
                      : new Date().toISOString(),
                };
              }
            );

          firestoreBookings.sort(
            (a, b) =>
              new Date(
                b.createdAt
              ).getTime() -
              new Date(
                a.createdAt
              ).getTime()
          );

          setBookings(
            firestoreBookings
          );
        },
        (error) => {
          alert(String(error)); console.error(
            "❌ Firestore bookings listener error:",
            error
          );
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);

  // =========================
  // Offers
  // =========================

  const addOffer = (
    offer: Omit<OfferItem, "id">
  ) => {
    const newItem = {
      ...offer,
      id: "off_" + Date.now(),
    };

    setOffers((prev) => [
      ...prev,
      newItem,
    ]);

    logActivity(
      `تمت إضافة عرض جديد: ${offer.titleAr}`,
      "create"
    );
  };

  const updateOffer = (
    id: string,
    data: Partial<OfferItem>
  ) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              ...data,
            }
          : o
      )
    );

    logActivity(
      `تم تحديث العرض ID: ${id}`,
      "update"
    );
  };

  const deleteOffer = (
    id: string
  ) => {
    setOffers((prev) =>
      prev.filter(
        (o) => o.id !== id
      )
    );

    logActivity(
      `تم حذف العرض ID: ${id}`,
      "delete"
    );
  };

  // =========================
  // Backup
  // =========================

  const backupData = () => {
    const state = {
      settings,
      services,
      packages,
      portfolio,
      videos,
      testimonials,
      bookings,
      offers,
    };

    return JSON.stringify(
      state,
      null,
      2
    );
  };

  // =========================
  // Restore
  // =========================

  const restoreData = (
    jsonData: string
  ) => {
    try {
      const data =
        JSON.parse(jsonData);

      if (data.settings) {
        setSettings(
          data.settings
        );
      }

      if (data.services) {
        setServices(
          data.services
        );
      }

      if (data.packages) {
        setPackages(
          data.packages
        );
      }

      if (data.portfolio) {
        setPortfolio(
          data.portfolio
        );
      }

      if (data.videos) {
        setVideos(
          data.videos
        );
      }

      if (data.testimonials) {
        setTestimonials(
          data.testimonials
        );
      }

      if (data.bookings) {
        setBookings(
          data.bookings
        );
      }

      if (data.offers) {
        setOffers(
          data.offers
        );
      }

      logActivity(
        "تمت استعادة النسخة الاحتياطية بنجاح",
        "settings"
      );

      return true;
    } catch (error) {
      alert(String(error)); console.error(
        "Restore error:",
        error
      );

      return false;
    }
  };
 // =========================
  // Provider
   // =========================
  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        dir,

        settings,
        updateSettings,

        stats,
        services,
        packages,
        portfolio,
        videos,
        testimonials,
        bookings,
        offers,
        activityLogs,
        users,

        currentUser,
        login,
        logout,

        addService,
        updateService,
        deleteService,

        addPackage,
        updatePackage,
        deletePackage,

        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,

        addVideoItem,
        updateVideoItem,
        deleteVideoItem,

        addTestimonial,
        updateTestimonial,
        deleteTestimonial,

        addBooking,
        updateBookingStatus,
        deleteBooking,

        addOffer,
        updateOffer,
        deleteOffer,

        contactMessages,
        addContactMessage,
        markContactMessageAsRead,
        deleteContactMessage,

        backupData,
        restoreData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};


// =========================
// useApp Hook
// =========================

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used within AppProvider"
    );
  }

  return context;
};
