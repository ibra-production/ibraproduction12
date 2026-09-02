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
  eventDate: string;
  eventTime: string;
  venue: string;
  serviceId: string;
  packageId?: string;
  notes?: string;
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

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'Owner' | 'Admin' | 'Editor' | 'Photographer' | 'Manager';
  active: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
  read: boolean;
}
