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
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
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
  TeamMember,
  Language,
  ActivityLog,
  ContactMessage,
  IbraEvent,
  EventPaymentItem,
  EventReviewItem,
  GuestUploadItem,
  ClientUserSession,
} from "../types";

import {
  initialSiteSettings,
  initialStats,
  initialUsers,
  initialServices,
  initialPackages,
  initialPortfolio,
  initialVideos,
  initialTestimonials,
  initialOffers,
  initialEvents,
} from "../data/initialData";

import { db, auth } from "../firebase";
import { uploadImageToIbraR2 } from "../r2Upload";

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
  teamMembers: TeamMember[];

  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;

  // Events & Groom Management
  events: IbraEvent[];
  addEvent: (event: IbraEvent) => void;
  updateEvent: (eventId: string, data: Partial<IbraEvent>) => void;
  addPaymentToEvent: (eventId: string, payment: EventPaymentItem) => void;
  clientUser: ClientUserSession | null;
  clientLogin: (phone: string, eventId: string) => Promise<boolean>;
  clientLogout: () => void;
  togglePhotoFavorite: (eventId: string, photoId: string) => void;
  addGuestUpload: (eventId: string, upload: Omit<GuestUploadItem, 'id' | 'createdAt'>) => void;
  addEventReview: (eventId: string, review: Omit<EventReviewItem, 'id' | 'date'>) => void;

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

  uploadPortfolioImages: (
    files: File[]
  ) => Promise<string[]>;

  uploadVideoFile: (
    file: File
  ) => Promise<string>;

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

  updateBooking: (
    id: string,
    booking: Partial<BookingItem> & Record<string, unknown>
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
  // =========================================================
  // Language
  // =========================================================

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

  // =========================================================
  // Settings
  // Firestore is the source of truth.
  // =========================================================

  const [settings, setSettings] =
    useState<SiteSettings>(
      initialSiteSettings
    );

  // =========================================================
  // Static Stats / Users
  // =========================================================

  const [stats] =
    useState<StatItem[]>(
      initialStats
    );

  const [users] =
    useState<AdminUser[]>(
      initialUsers
    );

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // =========================================================
  // Restored Original Studio Data (with Firestore Realtime Sync)
  // =========================================================

  const [services, setServices] =
    useState<ServiceItem[]>(initialServices);

  const [packages, setPackages] =
    useState<PackageItem[]>(initialPackages);

  const [portfolio, setPortfolio] =
    useState<PortfolioItem[]>(initialPortfolio);

  const [videos, setVideos] =
    useState<VideoItem[]>(initialVideos);

  const [
    testimonials,
    setTestimonials,
  ] = useState<TestimonialItem[]>(initialTestimonials);

  const [bookings, setBookings] =
    useState<BookingItem[]>([]);

  const [offers, setOffers] =
    useState<OfferItem[]>(initialOffers);

  // Events & Groom Dossiers
  const [events, setEvents] = useState<IbraEvent[]>(() => {
    try {
      const saved = localStorage.getItem("ibra_events");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not load cached events:", e);
    }
    return initialEvents;
  });

  const [clientUser, setClientUser] = useState<ClientUserSession | null>(() => {
    try {
      const saved = localStorage.getItem("ibra_client_session");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load cached client session:", e);
    }
    return null;
  });

  // =========================================================
  // Local-only UI data
  // =========================================================

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
      : [];
  });

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

  // =========================================================
  // Current User
  // =========================================================

  const [currentUser, setCurrentUser] =
    useState<AdminUser | null>(null);

  // =========================================================
  // Local logs only
  // =========================================================

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

  // =========================================================
  // Activity Log
  // =========================================================

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

  // =========================================================
  // Contact Messages
  // =========================================================

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

  // =========================================================
  // Settings - Firestore
  // =========================================================

  const updateSettings = (
    newSettings: Partial<SiteSettings>
  ) => {
    const updatedSettings: SiteSettings = {
      ...settings,
      ...newSettings,
    };

    setSettings(updatedSettings);

    setDoc(
      doc(
        db,
        "siteSettings",
        "main"
      ),
      updatedSettings,
      { merge: true }
    )
      .then(() => {
        console.log(
          "✅ Settings saved to Firestore"
        );
      })
      .catch((error) => {
        console.error(
          "❌ Firestore settings update error:",
          error
        );

        alert(
          "فشل حفظ إعدادات الموقع في Firestore. تحقق من الاتصال والصلاحيات."
        );
      });

    logActivity(
      "تم تحديث إعدادات الموقع الأساسية",
      "settings"
    );
  };

  // =========================================================
  // Firebase Authentication
  // =========================================================

  const login = async (
    email: string,
    pass: string
  ): Promise<boolean> => {
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        pass
      );

      const signedInEmail = (credential.user.email || "").trim().toLowerCase();
      if (signedInEmail !== "admin@ibraprod.online") {
        await signOut(auth);
        alert("هذا الحساب غير مخول للوصول إلى لوحة الإدارة.");
        return false;
      }

      return true;
    } catch (error) {
      console.error(
        "Firebase login error:",
        error
      );

      alert(
        "فشل تسجيل الدخول: " +
          String(
            error instanceof Error
              ? error.message
              : error
          )
      );

      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(
        "Firebase logout error:",
        error
      );

      alert(
        "حدث خطأ أثناء تسجيل الخروج"
      );
    }
  };

  // =========================================================
  // Firebase Auth State
  // =========================================================

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (firebaseUser) => {
          if (firebaseUser) {
            const signedInEmail = (firebaseUser.email || "").trim().toLowerCase();
            if (signedInEmail !== "admin@ibraprod.online") {
              signOut(auth).catch(() => undefined);
              setCurrentUser(null);
              return;
            }

            const adminUser = users[0];
            setCurrentUser(adminUser);
          } else {
            setCurrentUser(null);
          }
        }
      );

    return () => {
      unsubscribe();
    };
  }, [users]);

  // =========================================================
  // FIRESTORE REALTIME - SETTINGS
  // =========================================================

  useEffect(() => {
    const settingsRef = doc(
      db,
      "siteSettings",
      "main"
    );

    const unsubscribe =
      onSnapshot(
        settingsRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            console.warn(
              "⚠️ siteSettings/main does not exist in Firestore"
            );
            return;
          }

          const data =
            snapshot.data() as Partial<SiteSettings>;

          setSettings((prev) => ({
            ...prev,
            ...data,
            heroVideoUrl: (data.heroVideoUrl && typeof data.heroVideoUrl === 'string' && data.heroVideoUrl.trim() !== '')
              ? data.heroVideoUrl.trim()
              : prev.heroVideoUrl,
            heroVideoPoster: (data.heroVideoPoster && typeof data.heroVideoPoster === 'string' && data.heroVideoPoster.trim() !== '')
              ? data.heroVideoPoster.trim()
              : prev.heroVideoPoster,
          }));

          console.log(
            "🔥 Settings loaded from Firestore"
          );
        },
        (error) => {
          console.warn(
            "Firestore settings listener notice:",
            error?.message || error
          );
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);

  // =========================================================
  // FIRESTORE REALTIME - TEAM
  // =========================================================

  useEffect(() => {
    // Only subscribe to teamMembers in Firestore if admin is authenticated
    if (!currentUser && !auth.currentUser) {
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, "teamMembers"),
      (snapshot) => {
        const items = snapshot.docs.map((teamDoc) => ({
          id: teamDoc.id,
          ...teamDoc.data(),
        }) as TeamMember);

        items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setTeamMembers(items);
      },
      (error: any) => {
        if (error?.code === "permission-denied") {
          console.warn("Firestore teamMembers access requires admin permission");
        } else {
          console.warn("Firestore team listener notice:", error?.message || error);
        }
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // =========================================================
  // TEAM - CRUD
  // =========================================================

  const addTeamMember = async (member: Omit<TeamMember, "id">): Promise<void> => {
    const id = "team_" + Date.now();
    const item: TeamMember = { ...member, id };
    await setDoc(doc(db, "teamMembers", id), item);
    logActivity(`تمت إضافة عضو للفريق: ${member.fullName}`, "create");
  };

  const updateTeamMember = async (id: string, member: Partial<TeamMember>): Promise<void> => {
    const current = teamMembers.find((item) => item.id === id);
    if (!current) throw new Error("Team member not found");
    const updated = { ...current, ...member, id };
    await setDoc(doc(db, "teamMembers", id), updated);
    logActivity(`تم تحديث ملف عضو الفريق: ${id}`, "update");
  };

  const deleteTeamMember = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, "teamMembers", id));
    logActivity(`تم حذف عضو الفريق: ${id}`, "delete");
  };

  // =========================================================
  // FIRESTORE REALTIME - SERVICES
  // =========================================================

  useEffect(() => {
    const unsubscribe =
      onSnapshot(
        collection(db, "services"),
        (snapshot) => {
          const items =
            snapshot.docs.map(
              (itemDoc) => {
                const data = itemDoc.data() as any;
                const img = (data.image && typeof data.image === 'string' && data.image.trim() !== '') ? data.image.trim() : '/img1.jpg';
                return {
                  id: itemDoc.id,
                  ...data,
                  image: img,
                } as ServiceItem;
              }
            );

          if (items.length > 0) {
            items.sort(
              (a, b) =>
                (a.order ?? 0) -
                (b.order ?? 0)
            );
            setServices(items);
          } else {
            setServices(initialServices);
          }

          console.log(
            "🔥 Services loaded:",
            items.length
          );
        },
        (error) => {
          console.warn(
            "Firestore services listener notice:",
            error?.message || error
          );
          setServices(initialServices);
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);

  // =========================================================
  // FIRESTORE REALTIME - PACKAGES
  // =========================================================

  useEffect(() => {
    const unsubscribe =
      onSnapshot(
        collection(db, "packages"),
        (snapshot) => {
          const items =
            snapshot.docs.map(
              (itemDoc) =>
                ({
                  id: itemDoc.id,
                  ...itemDoc.data(),
                }) as PackageItem
            );

          if (items.length > 0) {
            items.sort(
              (a, b) =>
                (a.order ?? 0) -
                (b.order ?? 0)
            );
            setPackages(items);
          } else {
            setPackages(initialPackages);
          }

          console.log(
            "🔥 Packages loaded:",
            items.length
          );
        },
        (error) => {
          console.warn(
            "Firestore packages listener notice:",
            error?.message || error
          );
          setPackages(initialPackages);
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);

  // =========================================================
  // FIRESTORE REALTIME - PORTFOLIO
  // =========================================================

  useEffect(() => {
    const unsubscribe =
      onSnapshot(
        collection(db, "portfolio"),
        (snapshot) => {
          const items =
            snapshot.docs.map(
              (itemDoc) => {
                const data = itemDoc.data() as any;
                const img = (data.image && typeof data.image === 'string' && data.image.trim() !== '')
                  ? data.image.trim()
                  : (Array.isArray(data.images) && data.images[0] && typeof data.images[0] === 'string' && data.images[0].trim() !== '')
                    ? data.images[0].trim()
                    : '/img1.jpg';
                return {
                  id: itemDoc.id,
                  ...data,
                  image: img,
                  images: Array.isArray(data.images) && data.images.length > 0 ? data.images.filter((x: any) => typeof x === 'string' && x.trim() !== '') : [img],
                } as PortfolioItem;
              }
            );

          let deletedIds: string[] = [];
          try {
            deletedIds = JSON.parse(localStorage.getItem('ibra_deleted_portfolio_ids') || '[]');
          } catch {}

          // Combine Firestore user uploads with authentic studio portfolio photos, omitting deleted items
          const combined = items.filter(p => !deletedIds.includes(p.id));
          for (const orig of initialPortfolio) {
            if (!deletedIds.includes(orig.id) && !combined.some(p => p.id === orig.id)) {
              combined.push(orig);
            }
          }

          combined.sort(
            (a, b) =>
              (a.order ?? 0) -
              (b.order ?? 0)
          );

          setPortfolio(combined);

          console.log(
            "🔥 Portfolio loaded:",
            combined.length
          );
        },
        (error) => {
          console.warn(
            "Firestore portfolio listener notice:",
            error?.message || error
          );
          setPortfolio(initialPortfolio);
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);

  // =========================================================
  // FIRESTORE REALTIME - VIDEOS
  // =========================================================

  useEffect(() => {
    const unsubscribe =
      onSnapshot(
        collection(db, "videos"),
        (snapshot) => {
          const items =
            snapshot.docs.map(
              (itemDoc) => {
                const data = itemDoc.data() as any;
                const thumb = (data.thumbnail && typeof data.thumbnail === 'string' && data.thumbnail.trim() !== '') ? data.thumbnail.trim() : '/img2.jpg';
                return {
                  id: itemDoc.id,
                  ...data,
                  thumbnail: thumb,
                } as VideoItem;
              }
            );

          let deletedVideoIds: string[] = [];
          try {
            deletedVideoIds = JSON.parse(localStorage.getItem('ibra_deleted_video_ids') || '[]');
          } catch {}

          const filtered = items.filter(v => !deletedVideoIds.includes(v.id));
          filtered.sort(
            (a, b) =>
              (a.order ?? 0) -
              (b.order ?? 0)
          );

          setVideos(filtered);

          console.log(
            "🔥 Videos:",
            items.length
          );
        },
        (error) => {
          console.warn(
            "Firestore videos listener notice:",
            error?.message || error
          );
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);

  // =========================================================
  // FIRESTORE REALTIME - TESTIMONIALS
  // =========================================================

  useEffect(() => {
    const unsubscribe =
      onSnapshot(
        collection(db, "testimonials"),
        (snapshot) => {
          const items =
            snapshot.docs.map(
              (itemDoc) => {
                const data = itemDoc.data() as any;
                const img = (data.image && typeof data.image === 'string' && data.image.trim() !== '') ? data.image.trim() : undefined;
                return {
                  id: itemDoc.id,
                  ...data,
                  image: img,
                } as TestimonialItem;
              }
            );

          setTestimonials(items);

          console.log(
            "🔥 Testimonials:",
            items.length
          );
        },
        (error) => {
          console.warn(
            "Firestore testimonials listener notice:",
            error?.message || error
          );
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);

  // =========================================================
  // FIRESTORE REALTIME - OFFERS
  // =========================================================

  useEffect(() => {
    const unsubscribe =
      onSnapshot(
        collection(db, "offers"),
        (snapshot) => {
          const items =
            snapshot.docs.map(
              (itemDoc) => {
                const data = itemDoc.data() as any;
                const img = (data.image && typeof data.image === 'string' && data.image.trim() !== '') ? data.image.trim() : '/img1.jpg';
                return {
                  id: itemDoc.id,
                  ...data,
                  image: img,
                } as OfferItem;
              }
            );

          setOffers(items);

          console.log(
            "🔥 Offers:",
            items.length
          );
        },
        (error) => {
          console.warn(
            "Firestore offers listener notice:",
            error?.message || error
          );
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);

  // =========================================================
  // SERVICES - CRUD
  // =========================================================

  const addService = (
    service: Omit<ServiceItem, "id">
  ) => {
    const newItem: ServiceItem = {
      ...service,
      id: "s_" + Date.now(),
    };

    setDoc(
      doc(
        db,
        "services",
        newItem.id
      ),
      newItem
    )
      .then(() => {
        console.log(
          "✅ Service added to Firestore"
        );
        logActivity(
          `تمت إضافة خدمة جديدة: ${service.titleAr}`,
          "create"
        );
      })
      .catch((error) => {
        console.error(
          "❌ Firestore add service error:",
          error
        );

        alert(
          "فشل حفظ الخدمة في Firestore."
        );
      });
  };

  const updateService = (
    id: string,
    data: Partial<ServiceItem>
  ) => {
    const current =
      services.find(
        (item) => item.id === id
      );

    if (!current) {
      return;
    }

    const updated: ServiceItem = {
      ...current,
      ...data,
      id,
    };

    setDoc(
      doc(
        db,
        "services",
        id
      ),
      updated
    )
      .then(() => {
        console.log(
          "✅ Service updated in Firestore"
        );
        logActivity(
          `تم تحديث الخدمة ID: ${id}`,
          "update"
        );
      })
      .catch((error) => {
        console.error(
          "❌ Firestore update service error:",
          error
        );

        alert(
          "فشل حفظ تعديل الخدمة في Firestore."
        );
      });
  };

  const deleteService = (
    id: string
  ) => {
    deleteDoc(
      doc(
        db,
        "services",
        id
      )
    )
      .then(() => {
        console.log(
          "✅ Service deleted from Firestore"
        );
        logActivity(
          `تم حذف الخدمة ID: ${id}`,
          "delete"
        );
      })
      .catch((error) => {
        console.error(
          "❌ Firestore delete service error:",
          error
        );

        alert(
          "فشل حذف الخدمة من Firestore."
        );
      });
  };

  // =========================================================
  // PACKAGES - CRUD
  // =========================================================

  const addPackage = (
    pkg: Omit<PackageItem, "id">
  ) => {
    const newItem: PackageItem = {
      ...pkg,
      id: "p_" + Date.now(),
    };

    setDoc(
      doc(
        db,
        "packages",
        newItem.id
      ),
      newItem
    )
      .then(() => {
        console.log(
          "✅ Package added to Firestore"
        );
        logActivity(
          `تمت إضافة باقة جديدة: ${pkg.nameAr}`,
          "create"
        );
      })
      .catch((error) => {
        console.error(
          "❌ Firestore add package error:",
          error
        );

        alert(
          "فشل حفظ الباقة في Firestore."
        );
      });
  };

  const updatePackage = (
    id: string,
    data: Partial<PackageItem>
  ) => {
    const current =
      packages.find(
        (item) => item.id === id
      );

    if (!current) {
      return;
    }

    const updated: PackageItem = {
      ...current,
      ...data,
      id,
    };

    setDoc(
      doc(
        db,
        "packages",
        id
      ),
      updated
    )
      .then(() => {
        console.log(
          "✅ Package updated in Firestore"
        );
        logActivity(
          `تم تحديث الباقة ID: ${id}`,
          "update"
        );
      })
      .catch((error) => {
        console.error(
          "❌ Firestore update package error:",
          error
        );

        alert(
          "فشل حفظ تعديل الباقة في Firestore."
        );
      });
  };

  const deletePackage = (
    id: string
  ) => {
    deleteDoc(
      doc(
        db,
        "packages",
        id
      )
    )
      .then(() => {
        console.log(
          "✅ Package deleted from Firestore"
        );
        logActivity(
          `تم حذف الباقة ID: ${id}`,
          "delete"
        );
      })
      .catch((error) => {
        console.error(
          "❌ Firestore delete package error:",
          error
        );

        alert(
          "فشل حذف الباقة من Firestore."
        );
      });
  };

  // =========================================================
  // PORTFOLIO - IMAGE UPLOAD
  // =========================================================

  const uploadPortfolioImages = async (files: File[]): Promise<string[]> => {
    if (!files.length) return [];
    if (!auth.currentUser) {
      throw new Error("انتهت جلسة الإدارة. أعد تسجيل الدخول.");
    }

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 15 * 1024 * 1024;
    const workerUrl =
      "https://yellow-bar-9020ibra-id-card-upload.bahibarhouma15.workers.dev";

    const uploadOne = async (file: File): Promise<string> => {
      if (!allowed.includes(file.type)) {
        throw new Error("الصورة يجب أن تكون JPG أو PNG أو WEBP.");
      }

      if (file.size > maxSize) {
        throw new Error("حجم الصورة يتجاوز 15MB.");
      }

      try {
        const token = await auth.currentUser?.getIdToken();
        if (token) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("type", "portfolio");

          const response = await fetch(workerUrl, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          const data = await response.json().catch(() => null);

          if (response.ok && data?.success && data?.key) {
            return `${workerUrl}/?key=${encodeURIComponent(data.key)}`;
          }
        }
      } catch (workerErr) {
        console.warn("R2 Worker upload notice, falling back to direct Firebase Storage:", workerErr);
      }

      // High-reliability fallback: direct upload
      const res = await uploadImageToIbraR2(file, "portfolio");
      return res.url;
    };

    return Promise.all(files.map(uploadOne));
  };

  // =========================================================
  // PORTFOLIO - CRUD
  // =========================================================

  const addPortfolioItem = async (
    item: Omit<PortfolioItem, "id">
  ): Promise<void> => {
    const newItem: PortfolioItem = {
      ...item,
      id: "port_" + Date.now(),
      image:
        item.image ||
        (Array.isArray(item.images) ? item.images[0] : ""),
      images:
        Array.isArray(item.images) && item.images.length > 0
          ? item.images
          : item.image
            ? [item.image]
            : [],
    };

    try {
      await setDoc(
        doc(db, "portfolio", newItem.id),
        newItem
      );

      console.log(
        "✅ Portfolio item added to Firestore"
      );

      logActivity(
        `تمت إضافة مشروع جديد للمعرض: ${item.titleAr}`,
        "create"
      );
    } catch (error) {
      console.error(
        "❌ Firestore add portfolio error:",
        error
      );

      alert(
        "فشل حفظ المشروع في Firestore."
      );

      throw error;
    }
  };

  const updatePortfolioItem = async (
    id: string,
    data: Partial<PortfolioItem>
  ): Promise<void> => {
    const current =
      portfolio.find(
        (item) => item.id === id
      );

    if (!current) {
      throw new Error("Portfolio item not found");
    }

    const merged: any = {
      ...current,
      ...data,
      id,
    };

    if (
      (!merged.image || merged.image === "") &&
      Array.isArray(merged.images) &&
      merged.images.length > 0
    ) {
      merged.image = merged.images[0];
    }

    if (
      !Array.isArray(merged.images) ||
      merged.images.length === 0
    ) {
      merged.images = merged.image
        ? [merged.image]
        : [];
    }

    try {
      await setDoc(
        doc(db, "portfolio", id),
        merged
      );

      console.log(
        "✅ Portfolio item updated in Firestore"
      );

      logActivity(
        `تم تحديث المشروع ID: ${id}`,
        "update"
      );
    } catch (error) {
      console.error(
        "❌ Firestore update portfolio error:",
        error
      );

      alert(
        "فشل حفظ تعديل المشروع في Firestore."
      );

      throw error;
    }
  };

  const deletePortfolioItem = (
    id: string
  ) => {
    // 1. Optimistic removal from UI immediately
    setPortfolio((prev) => prev.filter((item) => item.id !== id));

    // 2. Persist deleted ID in localStorage so it never comes back
    try {
      const stored: string[] = JSON.parse(localStorage.getItem('ibra_deleted_portfolio_ids') || '[]');
      if (!stored.includes(id)) {
        stored.push(id);
        localStorage.setItem('ibra_deleted_portfolio_ids', JSON.stringify(stored));
      }
    } catch {}

    // 3. Delete from Firestore
    deleteDoc(
      doc(
        db,
        "portfolio",
        id
      )
    )
      .then(() => {
        console.log(
          "✅ Portfolio item deleted from Firestore:",
          id
        );
        logActivity(
          `تم حذف المشروع ID: ${id}`,
          "delete"
        );
      })
      .catch((error) => {
        console.warn(
          "Firestore delete portfolio notice:",
          error
        );
      });
  };

  // =========================================================
  // VIDEO - FILE UPLOAD
  // =========================================================

  const uploadVideoFile = async (
    file: File
  ): Promise<string> => {
    if (!file) throw new Error("لم يتم اختيار فيديو.");

    if (!auth.currentUser) {
      throw new Error("انتهت جلسة الإدارة. أعد تسجيل الدخول.");
    }

    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error("صيغة الفيديو غير مدعومة. استعمل MP4 أو WEBM أو MOV.");
    }

    if (file.size > 500 * 1024 * 1024) {
      throw new Error("حجم الفيديو يتجاوز 500MB.");
    }

    const workerUrl =
      "https://yellow-bar-9020ibra-id-card-upload.bahibarhouma15.workers.dev";

    const token = await auth.currentUser.getIdToken();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "video");

    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.success || !data?.key) {
      throw new Error(
        data?.message || "فشل رفع الفيديو إلى التخزين."
      );
    }

    return `${workerUrl}/?key=${encodeURIComponent(data.key)}`;
  };

  // =========================================================
  // VIDEOS - CRUD
  // =========================================================

  const addVideoItem = (
    item: Omit<VideoItem, "id">
  ) => {
    const newItem: VideoItem = {
      ...item,
      id: "v_" + Date.now(),
      visible:
        item.visible !== false,
    };

    setDoc(
      doc(
        db,
        "videos",
        newItem.id
      ),
      newItem
    )
      .then(() => {
        console.log(
          "✅ Video added to Firestore"
        );
        logActivity(
          `تمت إضافة فيديو جديد: ${item.titleAr}`,
          "create"
        );
      })
      .catch((error) => {
        console.error(
          "❌ Firestore add video error:",
          error
        );

        alert(
          "فشل حفظ الفيديو في Firestore."
        );
      });
  };

  const updateVideoItem = (
    id: string,
    data: Partial<VideoItem>
  ) => {
    const current =
      videos.find(
        (item) => item.id === id
      );

    if (!current) {
      return;
    }

    const updated: VideoItem = {
      ...current,
      ...data,
      id,
    };

    setDoc(
      doc(
        db,
        "videos",
        id
      ),
      updated
    )
      .then(() => {
        console.log(
          "✅ Video updated in Firestore"
        );
        logActivity(
          `تم تحديث الفيديو ID: ${id}`,
          "update"
        );
      })
      .catch((error) => {
        console.error(
          "❌ Firestore update video error:",
          error
        );

        alert(
          "فشل حفظ تعديل الفيديو في Firestore."
        );
      });
  };

  const deleteVideoItem = (
    id: string
  ) => {
    // 1. Optimistic removal from UI immediately
    setVideos((prev) => prev.filter((item) => item.id !== id));

    // 2. Persist deleted ID in localStorage
    try {
      const stored: string[] = JSON.parse(localStorage.getItem('ibra_deleted_video_ids') || '[]');
      if (!stored.includes(id)) {
        stored.push(id);
        localStorage.setItem('ibra_deleted_video_ids', JSON.stringify(stored));
      }
    } catch {}

    // 3. Delete from Firestore
    deleteDoc(
      doc(
        db,
        "videos",
        id
      )
    )
      .then(() => {
        console.log(
          "✅ Video deleted from Firestore:",
          id
        );
        logActivity(
          `تم حذف الفيديو ID: ${id}`,
          "delete"
        );
      })
      .catch((error) => {
        console.warn(
          "Firestore delete video notice:",
          error
        );
      });
  };

  // =========================================================
  // TESTIMONIALS - CRUD
  // =========================================================

  const addTestimonial = (
    item: Omit<TestimonialItem, "id">
  ) => {
    const newItem: TestimonialItem = {
      ...item,
      id: "t_" + Date.now(),
    };

    setDoc(
      doc(
        db,
        "testimonials",
        newItem.id
      ),
      newItem
    )
      .then(() => {
        console.log(
          "✅ Testimonial added to Firestore"
        );
        logActivity(
          `تمت إضافة تقييم للعميل: ${item.clientName}`,
          "create"
        );
      })
      .catch((error) => {
        console.error(
          "❌ Firestore add testimonial error:",
          error
        );

        alert(
          "فشل حفظ التقييم في Firestore."
        );
      });
  };

  const updateTestimonial = (
    id: string,
    data: Partial<TestimonialItem>
  ) => {
    const current =
      testimonials.find(
        (item) => item.id === id
      );

    if (!current) {
      return;
    }

    const updated: TestimonialItem = {
      ...current,
      ...data,
      id,
    };

    setDoc(
      doc(
        db,
        "testimonials",
        id
      ),
      updated
    )
      .then(() => {
        console.log(
          "✅ Testimonial updated in Firestore"
        );
        logActivity(
          `تم تحديث التقييم ID: ${id}`,
          "update"
        );
      })
      .catch((error) => {
        console.error(
          "❌ Firestore update testimonial error:",
          error
        );

        alert(
          "فشل حفظ تعديل التقييم في Firestore."
        );
      });
  };

  const deleteTestimonial = (
    id: string
  ) => {
    deleteDoc(
      doc(
        db,
        "testimonials",
        id
      )
    )
      .then(() => {
        console.log(
          "✅ Testimonial deleted from Firestore"
        );
        logActivity(
          `تم حذف التقييم ID: ${id}`,
          "delete"
        );
      })
      .catch((error) => {
        console.error(
          "❌ Firestore delete testimonial error:",
          error
        );

        alert(
          "فشل حذف التقييم من Firestore."
        );
      });
  };

  // =========================================================
  // BOOKINGS - FIRESTORE
  // =========================================================

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

      // Create/reuse one permanent client file and attach its stable barcode ID to the booking.
      const phoneKey = String(bookingData.phone || "").trim();
      let clientDoc: any = null;
      if (phoneKey) {
        const existing = await getDocs(
          query(collection(db, "clients"), where("phone", "==", phoneKey))
        );
        if (!existing.empty) {
          clientDoc = existing.docs[0];
        }
      }

      const clientId = clientDoc?.id || doc(collection(db, "clients")).id;
      const existingClient = clientDoc?.data() || {};
      const clientCode =
        String(existingClient.clientCode || existingClient.barcode || "").trim() ||
        `IBRA-C-${bookingRef.id.slice(-8).toUpperCase()}`;

      await setDoc(
        doc(db, "clients", clientId),
        {
          clientCode,
          barcode: clientCode,
          fullName: bookingData.groomName || "",
          groomName: bookingData.groomName || "",
          brideName: bookingData.brideName || "",
          phone: phoneKey,
          email: bookingData.email || "",
          address: bookingData.venue || "",
          active: true,
          totalProjects: Number(existingClient.totalProjects || 0) + 1,
          lastBookingId: bookingRef.id,
          lastEventDates: bookingData.eventDates || [bookingData.eventDate].filter(Boolean),
          lastStatus: "new",
          updatedAt: serverTimestamp(),
          createdAt: existingClient.createdAt || serverTimestamp(),
          source: "booking",
        },
        { merge: true }
      );

      await updateDoc(doc(db, "bookings", bookingRef.id), {
        clientId,
        clientCode,
      });

      console.log(
        "2️⃣ تم الحفظ في Firestore بنجاح:",
        bookingRef.id,
        "Client:",
        clientCode
      );

      logActivity(
        `حجز جديد: ${bookingData.groomName} والعروس: ${bookingData.brideName}`,
        "create"
      );
    } catch (error: any) {
      console.error(
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

  // =========================================================
  // AUTOMATION ENGINE
  // =========================================================
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(
      collection(db, "bookingWorkflows"),
      async (snapshot) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        for (const workflowDoc of snapshot.docs) {
          const workflow = workflowDoc.data() as any;
          const booking = bookings.find((item) => item.id === workflow.bookingId);
          if (!booking || booking.status === "cancelled") continue;

          const dates = Array.isArray(booking.eventDates) && booking.eventDates.length
            ? booking.eventDates
            : booking.eventDate
              ? [booking.eventDate]
              : [];

          if (workflow.automations?.onEventReminder) {
            for (const eventDate of dates) {
              const event = new Date(eventDate + "T00:00:00");
              if (Number.isNaN(event.getTime())) continue;

              const diffDays = Math.round(
                (event.getTime() - today.getTime()) / 86400000
              );

              if ([7, 3, 1, 0].includes(diffDays)) {
                const queueId = `event_reminder_${workflow.bookingId}_${eventDate}_${diffDays}`;
                await setDoc(
                  doc(db, "automationQueue", queueId),
                  {
                    bookingId: workflow.bookingId,
                    type: "event_reminder",
                    action: "reminder",
                    daysBefore: diffDays,
                    phone: booking.phone || "",
                    groomName: booking.groomName || "",
                    eventDate,
                    eventTime: booking.eventTime || "",
                    venue: booking.venue || "",
                    message: diffDays === 0
                      ? `اليوم موعد مناسبتكم مع Ibra Production بتاريخ ${eventDate} على الساعة ${booking.eventTime || "—"} في ${booking.venue || "—"}.`
                      : `تذكير من Ibra Production: تبقى ${diffDays} أيام على مناسبتكم بتاريخ ${eventDate} على الساعة ${booking.eventTime || "—"}.`,
                    createdAt: serverTimestamp(),
                    status: "queued"
                  },
                  { merge: true }
                );
              }
            }
          }

          if (workflow.automations?.onPaymentDue && Array.isArray(workflow.payments)) {
            for (const payment of workflow.payments) {
              if (payment.status === "paid" || !payment.dueDate) continue;
              const due = new Date(payment.dueDate + "T00:00:00");
              if (Number.isNaN(due.getTime())) continue;

              const diffDays = Math.round(
                (due.getTime() - today.getTime()) / 86400000
              );

              if ([3, 1, 0, -1].includes(diffDays)) {
                const queueId = `payment_due_${workflow.bookingId}_${payment.id}_${payment.dueDate}`;
                await setDoc(
                  doc(db, "automationQueue", queueId),
                  {
                    bookingId: workflow.bookingId,
                    type: "payment_due",
                    action: "payment",
                    phone: booking.phone || "",
                    groomName: booking.groomName || "",
                    paymentId: payment.id,
                    paymentTitle: payment.title || "دفعة",
                    amount: Number(payment.amount || 0),
                    paidAmount: Number(payment.paidAmount || 0),
                    dueDate: payment.dueDate,
                    daysUntilDue: diffDays,
                    message: diffDays < 0
                      ? `تنبيه من Ibra Production: الدفعة "${payment.title || "دفعة"}" مستحقة منذ ${Math.abs(diffDays)} يوم.`
                      : diffDays === 0
                        ? `تنبيه من Ibra Production: الدفعة "${payment.title || "دفعة"}" مستحقة اليوم.`
                        : `تذكير من Ibra Production: الدفعة "${payment.title || "دفعة"}" تستحق بعد ${diffDays} أيام.`,
                    createdAt: serverTimestamp(),
                    status: "queued"
                  },
                  { merge: true }
                );
              }
            }
          }
        }
      },
      (error) => console.warn("Automation engine notice:", (error as any)?.message || error)
    );

    return () => unsubscribe();
  }, [currentUser, bookings]);

  // =========================================================
  // BOOKINGS - REALTIME
  // =========================================================

  useEffect(() => {
    // Only subscribe to bookings in Firestore if admin is authenticated
    if (!currentUser && !auth.currentUser) {
      return;
    }

    const unsubscribe =
      onSnapshot(
        collection(
          db,
          "bookings"
        ),
        (snapshot) => {
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

                  eventDates:
                    Array.isArray(data.eventDates)
                      ? data.eventDates
                      : (
                          data.eventDate
                            ? [data.eventDate]
                            : []
                        ),

                  wilaya:
                    data.wilaya ||
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

                  idCardUrl:
                    data.idCardUrl ||
                    data.idCardFileUrl ||
                    data.idCard?.url ||
                    "",

                  idCardKey:
                    data.idCardKey ||
                    data.idCard?.key ||
                    "",

                  idCardName:
                    data.idCardName ||
                    data.idCard?.name ||
                    "",

                  idCardMimeType:
                    data.idCardMimeType ||
                    data.idCard?.mimeType ||
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

          console.log(
            "🔥 Firestore bookings:",
            firestoreBookings.length
          );
        },
        (error: any) => {
          if (error?.code === "permission-denied") {
            console.warn("Firestore bookings access requires admin permission");
          } else {
            console.warn("Firestore bookings listener notice:", error?.message || error);
          }
        }
      );

    return () => {
      unsubscribe();
    };
  }, [currentUser]);


  const syncClientPortal = async (bookingId: string, patch: Record<string, unknown>) => {
    try {
      const workflowSnap = await getDoc(doc(db, "bookingWorkflows", bookingId));
      const portalCode = workflowSnap.exists() ? workflowSnap.data()?.portalCode : null;
      if (!portalCode) return;
      await setDoc(doc(db, "clientPortals", portalCode), patch, { merge: true });
    } catch (error) {
      console.error("❌ Client portal sync error:", error);
    }
  };

  // =========================================================
  // UPDATE BOOKING STATUS
  // =========================================================

  const updateBookingStatus =
    async (
      id: string,
      status: BookingItem["status"]
    ): Promise<void> => {
      try {
        const previousBooking = bookings.find((item) => item.id === id);
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

        await syncClientPortal(id, { status });

        if (
          previousBooking &&
          previousBooking.status !== status
        ) {
          await addDoc(collection(db, "automationQueue"), {
            bookingId: id,
            type: "status_change",
            action: "status_change",
            phone: previousBooking.phone || "",
            groomName: previousBooking.groomName || "",
            fromStatus: previousBooking.status,
            toStatus: status,
            createdAt: serverTimestamp(),
            status: "queued"
          });
        }

        logActivity(
          `تم تحديث حالة الحجز ID: ${id} إلى ${status}`,
          "update"
        );
      } catch (error) {
        console.error(
          "❌ Firestore update booking error:",
          error
        );

        throw error;
      }
    };

  // =========================================================
  // UPDATE BOOKING - FULL EDIT
  // =========================================================

  const updateBooking = async (
    id: string,
    booking: Partial<BookingItem> & Record<string, unknown>
  ): Promise<void> => {
    try {
      const cleanBooking = Object.fromEntries(
        Object.entries(booking).filter(([, value]) => value !== undefined)
      );

      await updateDoc(doc(db, "bookings", id), cleanBooking);

      const previous = bookings.find(item => item.id === id);
      const hasClientChanges = ["groomName", "brideName", "phone", "email"].some(key => cleanBooking[key] !== undefined);
      const hasEventChanges = ["eventDates", "eventDate", "eventTime", "venue", "wilaya", "eventType", "serviceId", "packageId"].some(key => cleanBooking[key] !== undefined);
      const portalPatch: Record<string, unknown> = {};

      if (cleanBooking.status !== undefined) {
        portalPatch.status = cleanBooking.status;
      }

      if (hasClientChanges) {
        portalPatch.client = {
          groomName: cleanBooking.groomName ?? previous?.groomName ?? "",
          brideName: cleanBooking.brideName ?? previous?.brideName ?? "",
          phone: cleanBooking.phone ?? previous?.phone ?? "",
          email: cleanBooking.email ?? previous?.email ?? ""
        };
      }

      if (hasEventChanges) {
        const eventDates = Array.isArray(cleanBooking.eventDates)
          ? cleanBooking.eventDates
          : cleanBooking.eventDate
            ? [cleanBooking.eventDate]
            : previous?.eventDates?.length
              ? previous.eventDates
              : previous?.eventDate
                ? [previous.eventDate]
                : [];

        portalPatch.event = {
          eventDates,
          eventTime: cleanBooking.eventTime ?? previous?.eventTime ?? "",
          venue: cleanBooking.venue ?? previous?.venue ?? "",
          wilaya: cleanBooking.wilaya ?? previous?.wilaya ?? "",
          eventType: cleanBooking.eventType ?? previous?.eventType ?? "",
          serviceId: cleanBooking.serviceId ?? previous?.serviceId ?? "",
          packageId: cleanBooking.packageId ?? previous?.packageId ?? ""
        };
      }

      if (Object.keys(portalPatch).length) {
        await syncClientPortal(id, portalPatch);
      }

      logActivity(
        "تم تعديل بيانات الحجز ID: " + id,
        "update"
      );
    } catch (error) {
      console.error("❌ Firestore full booking update error:", error);
      throw error;
    }
  };

  // =========================================================
  // DELETE BOOKING
  // =========================================================

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

        logActivity(
          `تم حذف الحجز ID: ${id}`,
          "delete"
        );
      } catch (error) {
        console.error(
          "❌ Firestore delete booking error:",
          error
        );

        throw error;
      }
    };

  // =========================================================
  // OFFERS - CRUD
  // =========================================================

  const addOffer = (
    offer: Omit<OfferItem, "id">
  ) => {
    const newItem: OfferItem = {
      ...offer,
      id: "off_" + Date.now(),
    };

    setDoc(
      doc(
        db,
        "offers",
        newItem.id
      ),
      newItem
    )
      .then(() => {
        console.log(
          "✅ Offer added to Firestore"
        );
        logActivity(
          `تمت إضافة عرض جديد: ${offer.titleAr}`,
          "create"
        );
      })
      .catch((error) => {
        console.error(
          "❌ Firestore add offer error:",
          error
        );

        alert(
          "فشل حفظ العرض في Firestore."
        );
      });
  };

  const updateOffer = (
    id: string,
    data: Partial<OfferItem>
  ) => {
    const current =
      offers.find(
        (item) => item.id === id
      );

    if (!current) {
      return;
    }

    const updated: OfferItem = {
      ...current,
      ...data,
      id,
    };

    setDoc(
      doc(
        db,
        "offers",
        id
      ),
      updated
    )
      .then(() => {
        console.log(
          "✅ Offer updated in Firestore"
        );
        logActivity(
          `تم تحديث العرض ID: ${id}`,
          "update"
        );
      })
      .catch((error) => {
        console.error(
          "❌ Firestore update offer error:",
          error
        );

        alert(
          "فشل حفظ تعديل العرض في Firestore."
        );
      });
  };

  const deleteOffer = (
    id: string
  ) => {
    deleteDoc(
      doc(
        db,
        "offers",
        id
      )
    )
      .then(() => {
        console.log(
          "✅ Offer deleted from Firestore"
        );
        logActivity(
          `تم حذف العرض ID: ${id}`,
          "delete"
        );
      })
      .catch((error) => {
        console.error(
          "❌ Firestore delete offer error:",
          error
        );

        alert(
          "فشل حذف العرض من Firestore."
        );
      });
  };

  // =========================================================
  // BACKUP
  // =========================================================

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

  // =========================================================
  // RESTORE
  // =========================================================

  const restoreData = (
    jsonData: string
  ) => {
    try {
      const data =
        JSON.parse(jsonData);

      const promises: Promise<unknown>[] =
        [];

      if (data.settings) {
        promises.push(
          setDoc(
            doc(
              db,
              "siteSettings",
              "main"
            ),
            data.settings,
            { merge: true }
          )
        );
      }

      if (Array.isArray(data.services)) {
        data.services.forEach(
          (item: ServiceItem) => {
            promises.push(
              setDoc(
                doc(
                  db,
                  "services",
                  item.id
                ),
                item
              )
            );
          }
        );
      }

      if (Array.isArray(data.packages)) {
        data.packages.forEach(
          (item: PackageItem) => {
            promises.push(
              setDoc(
                doc(
                  db,
                  "packages",
                  item.id
                ),
                item
              )
            );
          }
        );
      }

      if (Array.isArray(data.portfolio)) {
        data.portfolio.forEach(
          (item: PortfolioItem) => {
            promises.push(
              setDoc(
                doc(
                  db,
                  "portfolio",
                  item.id
                ),
                item
              )
            );
          }
        );
      }

      if (Array.isArray(data.videos)) {
        data.videos.forEach(
          (item: VideoItem) => {
            promises.push(
              setDoc(
                doc(
                  db,
                  "videos",
                  item.id
                ),
                item
              )
            );
          }
        );
      }

      if (
        Array.isArray(
          data.testimonials
        )
      ) {
        data.testimonials.forEach(
          (item: TestimonialItem) => {
            promises.push(
              setDoc(
                doc(
                  db,
                  "testimonials",
                  item.id
                ),
                item
              )
            );
          }
        );
      }

      if (Array.isArray(data.offers)) {
        data.offers.forEach(
          (item: OfferItem) => {
            promises.push(
              setDoc(
                doc(
                  db,
                  "offers",
                  item.id
                ),
                item
              )
            );
          }
        );
      }

      Promise.all(promises)
        .then(() => {
          console.log(
            "✅ Backup restored to Firestore"
          );

          logActivity(
            "تمت استعادة النسخة الاحتياطية بنجاح",
            "settings"
          );
        })
        .catch((error) => {
          console.error(
            "❌ Restore Firestore error:",
            error
          );

          alert(
            "فشل استعادة النسخة الاحتياطية إلى Firestore."
          );
        });

      return true;
    } catch (error) {
      console.error(
        "❌ Restore error:",
        error
      );

      return false;
    }
  };

  // =========================================================
  // EVENTS & GROOM DOSSIERS
  // =========================================================

  useEffect(() => {
    try {
      localStorage.setItem("ibra_events", JSON.stringify(events));
    } catch (e) {
      console.warn("Could not persist events to localStorage:", e);
    }
  }, [events]);

  useEffect(() => {
    try {
      if (clientUser) {
        localStorage.setItem("ibra_client_session", JSON.stringify(clientUser));
      } else {
        localStorage.removeItem("ibra_client_session");
      }
    } catch (e) {
      console.warn("Could not persist client session:", e);
    }
  }, [clientUser]);

  const addEvent = (event: IbraEvent) => {
    setEvents((prev) => [event, ...prev]);
    logActivity(`تم إنشاء ملف مناسبة جديد للعريس ${event.groomName}`, "create");
  };

  const updateEvent = (eventId: string, data: Partial<IbraEvent>) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.eventId === eventId
          ? { ...e, ...data, updatedAt: new Date().toISOString() }
          : e
      )
    );
    logActivity(`تم تحديث ملف المناسبة ${eventId}`, "update");
  };

  const addPaymentToEvent = (eventId: string, payment: EventPaymentItem) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.eventId === eventId) {
          const payments = [payment, ...(e.payments || [])];
          const totalPaid = (e.totalPaid || 0) + Number(payment.amount);
          return {
            ...e,
            payments,
            totalPaid,
            updatedAt: new Date().toISOString(),
          };
        }
        return e;
      })
    );
    logActivity(`تم تسجيل دفعة بقيمة ${payment.amount} دج للمناسبة ${eventId}`, "update");
  };

  const clientLogin = async (phone: string, eventId: string): Promise<boolean> => {
    const cleanPhone = phone.trim().replace(/[^0-9]/g, "");
    const cleanId = eventId.trim().toUpperCase();

    const ev = events.find(
      (e) =>
        e.eventId.toUpperCase() === cleanId &&
        e.phone.replace(/[^0-9]/g, "") === cleanPhone
    );

    if (ev) {
      const session: ClientUserSession = {
        phone: ev.phone,
        name: ev.groomName,
        eventId: ev.eventId,
        loggedAt: new Date().toISOString(),
      };
      setClientUser(session);
      return true;
    }
    return false;
  };

  const clientLogout = () => {
    setClientUser(null);
  };

  const togglePhotoFavorite = (eventId: string, photoId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.eventId === eventId && e.gallery) {
          const gallery = e.gallery.map((p) =>
            p.id === photoId ? { ...p, isFavorite: !p.isFavorite } : p
          );
          return { ...e, gallery };
        }
        return e;
      })
    );
  };

  const addGuestUpload = (
    eventId: string,
    upload: Omit<GuestUploadItem, "id" | "createdAt">
  ) => {
    const item: GuestUploadItem = {
      ...upload,
      id: "gu_" + Date.now(),
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    setEvents((prev) =>
      prev.map((e) => {
        if (e.eventId === eventId) {
          return {
            ...e,
            guestUploads: [item, ...(e.guestUploads || [])],
          };
        }
        return e;
      })
    );
    logActivity(`صورة جديدة مرفوعة من ضيف في المناسبة ${eventId}`, "create");
  };

  const addEventReview = (
    eventId: string,
    review: Omit<EventReviewItem, "id" | "date">
  ) => {
    const item: EventReviewItem = {
      ...review,
      id: "rev_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
    };

    setEvents((prev) =>
      prev.map((e) => {
        if (e.eventId === eventId) {
          return { ...e, review: item };
        }
        return e;
      })
    );
    logActivity(`تقييم جديد للمناسبة ${eventId}`, "create");
  };

  // =========================================================
  // PROVIDER
  // =========================================================

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
        teamMembers,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,

        // Events & Groom Management
        events,
        addEvent,
        updateEvent,
        addPaymentToEvent,
        clientUser,
        clientLogin,
        clientLogout,
        togglePhotoFavorite,
        addGuestUpload,
        addEventReview,

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
        uploadPortfolioImages,
        deletePortfolioItem,

        addVideoItem,
        uploadVideoFile,
        updateVideoItem,
        deleteVideoItem,

        addTestimonial,
        updateTestimonial,
        deleteTestimonial,

        addBooking,
        updateBookingStatus,
        updateBooking,
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

// =========================================================
// useApp Hook
// =========================================================

export const useApp = () => {
  const context =
    useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used within AppProvider"
    );
  }

  return context;
};
