/**
 * IBRA PRODUCTION — Complete TypeScript Data Models
 * Synchronized with Firestore schema and Android Room Database
 */

export type UserRole = 'superadmin' | 'admin' | 'staff' | 'client';

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

export interface SiteSettings {
  id?: string;
  studioNameAr: string;
  studioNameFr: string;
  studioNameEn: string;
  phone: string;
  secondaryPhone?: string;
  email: string;
  address: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  logoUrl?: string;
  maintenanceMode: boolean;
}

export interface Service {
  id: string;
  titleAr: string;
  titleFr?: string;
  titleEn?: string;
  category: 'photography' | 'videography' | 'drone' | 'dj' | 'decor' | 'cars' | 'catering' | 'beauty';
  descriptionAr: string;
  priceDZD: number;
  imageUrl?: string;
  isPopular?: boolean;
}

export interface Package {
  id: string;
  titleAr: string;
  titleFr?: string;
  tier: 'bronze' | 'silver' | 'gold' | 'royal_vip';
  priceDZD: number;
  features: string[];
  isPopular?: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  weddingDate?: string;
  tags?: string[];
}

export interface VideoItem {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  comment: string;
  rating: number; // 1 to 5
  weddingDate: string;
  status: 'pending' | 'approved';
  createdAt: string;
}

export interface Offer {
  id: string;
  titleAr: string;
  discountPercentage: number;
  originalPriceDZD: number;
  discountedPriceDZD: number;
  validUntil: string;
  isActive: boolean;
}

export interface Booking {
  id: string;
  orderNumber: string; // e.g. "IBRA-2027-0842"
  clientName: string;
  phone: string;
  email?: string;
  userId?: string;
  weddingDate: string;
  city: string;
  packageId?: string;
  packageName?: string;
  selectedServices: string[];
  totalAmountDZD: number;
  paidAmountDZD: number;
  remainingAmountDZD: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
}

export interface Client {
  uid: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  isAdmin?: boolean;
  activeOrderNumber?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface ClientPortal {
  orderNumber: string;
  clientName: string;
  weddingDate: string;
  currentStep: number; // 1: Preparation, 2: Shooting, 3: Editing, 4: Delivery
  stepDescriptions: string[];
  galleryUrls?: string[];
  downloadLink?: string;
  assignedStaff: string[];
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  specialtyAr: string;
  specialtyCode: string; // 'photo_men', 'photo_women', 'cavalier', 'karabila', 'dj_men', etc.
  phone: string;
  experienceYears: number;
  rating: number;
  status: 'active' | 'busy' | 'vacation';
  notes?: string;
}

export interface ContactMessage {
  id: string;
  senderName: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminUid: string;
  adminEmail: string;
  action: string;
  targetCollection: string;
  targetId?: string;
  timestamp: string;
}
