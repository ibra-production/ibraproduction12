export type Language = 'ar' | 'fr' | 'en';

export interface SiteSettings {
  agencyName: string;
  taglineAr: string;
  taglineFr: string;
  taglineEn: string;
  phone: string;
  whatsapp: string;
  email: string;
  addressAr: string;
  addressFr: string;
  addressEn: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  googleMapsUrl: string;
  primaryColor: string;
  secondaryColor: string;
  currency: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  maintenanceMode: boolean;
}

export interface StatItem {
  id: string;
  value: string;
  labelAr: string;
  labelFr: string;
  labelEn: string;
}

export interface ServiceItem {
  id: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  descAr: string;
  descFr: string;
  descEn: string;
  image: string;
  price: string;
  duration: string;
  features: string[];
  visible: boolean;
  order: number;
}

export interface PackageItem {
  id: string;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  durationAr: string;
  durationFr: string;
  durationEn: string;
  featuresAr: string[];
  featuresFr: string[];
  featuresEn: string[];
  isPopular: boolean;
  visible: boolean;
  order: number;
}

export interface PortfolioItem {
  id: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  category: 'weddings' | 'video' | 'portraits' | 'events' | 'content';
  coupleNames?: string;
  date: string;
  location: string;
  image: string;
  images?: string[];
  videoUrl?: string;
  descriptionAr: string;
  descriptionFr: string;
  descriptionEn: string;
  visible: boolean;
  order: number;
}

export interface VideoItem {
  id: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  category: string;
  thumbnail: string;
  videoUrl: string; // YouTube/Vimeo embed or MP4
  duration: string;
  visible: boolean;
  order: number;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  rating: number;
  commentAr: string;
  commentFr: string;
  commentEn: string;
  image?: string;
  date: string;
  approved: boolean;
}

export interface BookingItem {
  id: string;
  groomName: string;
  brideName: string;
  phone: string;
  email: string;
  eventType: string;

  // Main/legacy event date kept for compatibility with old bookings
  eventDate: string;

  // New multiple-event-dates support
  eventDates?: string[];

  // Event location
  wilaya?: string;
  venue: string;

  // Event time must remain unchanged
  eventTime: string;

  serviceId: string;
  packageId?: string;
  notes?: string;

  // Mandatory national ID card copy for new bookings
  idCardUrl?: string;
  idCardName?: string;

  status: 'new' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface OfferItem {
  id: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  descAr: string;
  descFr: string;
  descEn: string;
  oldPrice: string;
  newPrice: string;
  discountPercentage: string;
  startDate: string;
  endDate: string;
  image: string;
  active: boolean;
}

export interface ActivityLog {
  id: string;
  user: string;
  actionAr: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'settings';
}

export interface TeamMember {
  id: string;
  fullName: string;
  role: string;
  phone: string;
  email: string;
  photoUrl?: string;
  bioAr: string;
  bioFr: string;
  bioEn: string;
  skills: string[];
  wilaya: string;
  joinedAt: string;
  instagram?: string;
  facebook?: string;
  active: boolean;
  order: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'Owner' | 'Admin' | 'Editor' | 'Photographer' | 'Manager';
  active: boolean;
}


export interface WorkflowTimelineItem { id: string; title: string; status: 'pending' | 'done'; date?: string; note?: string; }
export interface WorkflowChecklistItem { id: string; title: string; completed: boolean; dueDate?: string; assignee?: string; }
export interface WorkflowPayment { id: string; title: string; amount: number; paidAmount: number; dueDate?: string; status: 'pending' | 'paid'; note?: string; }
export interface BookingWorkflow { bookingId: string; portalCode?: string; timeline: WorkflowTimelineItem[]; checklist: WorkflowChecklistItem[]; payments: WorkflowPayment[]; automations: { onStatusChange: boolean; onPaymentDue: boolean; onEventReminder: boolean; }; updatedAt: string; }

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
  read: boolean;
}
