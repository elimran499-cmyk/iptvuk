export type MediaType = 'movie' | 'series' | 'live';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  posterUrl: string;
  backdropUrl: string;
  genre: string[];
  rating: string; // e.g. "PG-13", "18+"
  score: number;  // e.g. 8.7, 9.2
  duration: string; // e.g. "2h 41m", "10 Episodes"
  year: number;
  description: string;
  cast: string[];
  videoUrl?: string;
  isFeatured?: boolean;
  category: string; // e.g. "Sci-Fi", "Action", "Sports Live", "News Live"
  authorLogo?: string; // hulu, disney, etc.
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  periodMonths: number;
  discountPercent: number;
  features: string[];
  isPopular?: boolean;
}

export interface Subscription {
  id: string;
  planId: string;
  planName: string;
  price: number;
  periodMonths: number;
  status: 'active' | 'pending' | 'expired';
  startDate: string;
  nextBillingDate: string;
  paymentMethod: 'card' | 'paypal' | 'crypto';
  transactionId: string;
  devicesConnected: number;
  maxDevices: number;
}

export interface PlaylistChannel {
  id: string;
  name: string;
  logo: string;
  category: string;
  streamUrl: string;
  quality: '4K' | '1080p' | '720p';
  online: boolean;
}

export type PaymentMethod = 'card' | 'paypal' | 'crypto';
