export type Language = 'ar' | 'fr' | 'en';

export interface HeroSlideItem {
  id: string;
  image: string;
  labelAr?: string;
  labelFr?: string;
  labelEn?: string;
}

export interface SiteMediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  posterUrl?: string;
  titleAr?: string;
  titleFr?: string;
  titleEn?: string;
  isActive: boolean; // Toggles whether this media is active in the Hero section
  createdAt?: string;
}

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
  heroVideoUrl?: string; // Direct MP4 or embed link for hero background video
  enableHeroVideo?: boolean; // Toggle hero video on/off
  heroVideoPoster?: string; // Fallback image for hero video
  heroSlides?: HeroSlideItem[]; // Custom background photos list for hero slider
  heroMediaItems?: SiteMediaItem[]; // Master list of image/video URLs with active toggles
  activeHeroMediaType?: 'video' | 'slideshow' | 'single_image' | 'auto';
  activeSingleMediaId?: string;
  visibleSections?: {
    about?: boolean;
    services?: boolean;
    packages?: boolean;
    portfolio?: boolean;
    videos?: boolean;
    offers?: boolean;
    testimonials?: boolean;
    whyUs?: boolean;
    clientExperience?: boolean;
    availabilityChecker?: boolean;
    customizer?: boolean;
  };
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
  descriptionAr?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  isPopular: boolean;
  visible: boolean;
  order: number;
  image?: string;
  imagePath?: string;
  imageName?: string;
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
  idCardKey?: string;
  idCardName?: string;
  idCardMimeType?: string;

  status: 'new' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  eventId?: string;
  barcode?: string;
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
export interface WorkflowQuestion { id: string; question: string; answer: string; required?: boolean; }
export interface WorkflowContract { title: string; body: string; signatureName?: string; signedAt?: string; }
export interface BookingWorkflow { bookingId: string; portalCode?: string; timeline: WorkflowTimelineItem[]; checklist: WorkflowChecklistItem[]; payments: WorkflowPayment[]; automations: { onStatusChange: boolean; onPaymentDue: boolean; onEventReminder: boolean; }; questionnaire?: WorkflowQuestion[]; contract?: WorkflowContract; updatedAt: string; }

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// ================= IBRA EVENT MODELS =================

export type EventStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface EventServiceItem {
  serviceId: string;
  serviceTitle: string;
  price?: number;
  status: EventStatus;
}

export interface EventTimelineItem {
  id: string;
  eventId: string;
  time: string;
  title: string;
  description: string;
  order: number;
  status: 'upcoming' | 'current' | 'done';
}

export interface EventMediaItem {
  id: string;
  eventId: string;
  url: string;
  caption?: string;
  uploadedAt: string;
  isFavorite: boolean;
  downloadsCount: number;
}

export interface GuestUploadItem {
  id: string;
  eventId: string;
  guestName: string;
  fileUrl: string;
  fileType: 'image' | 'video';
  fileSize?: string;
  notes?: string;
  createdAt: string;
}

export interface EventPaymentItem {
  id: string;
  eventId: string;
  amount: number;
  date: string;
  method: 'CASH' | 'BANK' | 'OTHER';
  note?: string;
  receiptNumber?: string;
  createdAt: string;
}

export interface EventDocumentItem {
  id: string;
  eventId: string;
  title: string;
  type: 'contract' | 'invoice' | 'receipt' | 'other';
  fileUrl?: string;
  date: string;
  status: 'signed' | 'official' | 'draft';
}

export interface TeamMemberItem {
  id: string;
  name: string;
  phone: string;
  role: 'Photographer' | 'Videographer' | 'DJ' | 'Decorator' | 'Driver' | 'Assistant' | 'Editor' | 'Other';
  gender: 'male' | 'female';
  active: boolean;
  assignedEventIds: string[];
}

export interface EventReviewItem {
  id: string;
  eventId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface IbraEvent {
  eventId: string; // e.g. "IBRA-2026-1048"
  barcode?: string; // e.g. "87261048001" or numerical barcode
  bookingId?: string; // Reference to existing BookingItem.id for seamless backward compatibility
  clientId: string;
  groomName: string;
  brideName: string;
  phone: string;
  email: string;
  wilaya: string;
  location: string;
  eventDate: string; // YYYY-MM-DD
  eventTime: string;
  status: EventStatus;
  services: EventServiceItem[];
  packageId?: string;
  packageName?: string;
  totalPrice: number;
  totalPaid: number;
  notes?: string;
  smartUsbId?: string;
  createdAt: string;
  updatedAt: string;

  // Associated sub-collections
  timeline?: EventTimelineItem[];
  gallery?: EventMediaItem[];
  guestUploads?: GuestUploadItem[];
  payments?: EventPaymentItem[];
  documents?: EventDocumentItem[];
  assignedTeam?: string[]; // team member IDs
  review?: EventReviewItem;
}

export interface ClientUserSession {
  phone: string;
  name: string;
  eventId: string;
  loggedAt: string;
}
