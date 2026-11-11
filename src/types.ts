export type PlayerRole = 'IGL' | 'Primary Rusher' | 'Secondary Rusher' | 'Rusher' | 'Sniper' | 'Support' | 'Flex';

export interface Player {
  id: string;
  ign: string;
  name: string;
  role: PlayerRole;
  jerseyNumber: string;
  image: string;
  isSub: boolean;
  bio: string;
  achievements: string[];
  gameplayHighlight: string;
  signatureWeapons: string[];
  device: string;
  kdr?: string;
  clutchRate?: string;
  headshotRate?: string;
  category?: 'IGL' | 'PRIMARY RUSHERS' | 'SECONDARY RUSHERS' | 'SNIPER';
  socials: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
  isDemo?: boolean;
}

export type MatchStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED';

export interface Match {
  id: string;
  tournament: string;
  stage: string;
  dateIST: string;
  timeIST: string;
  status: MatchStatus;
  game: string;
  placement?: string;
  kills?: number;
  totalPoints?: number;
  opponents?: string[];
  streamUrl?: string;
  isDemo?: boolean;
}

export interface MerchItem {
  id: string;
  name: string;
  category: string;
  priceINR: number;
  priceUSD: number;
  image: string;
  badge: string;
  description: string;
  features: string[];
  sizes: string[];
  availability: 'UPCOMING DROP' | 'PRE-ORDER' | 'PREVIEW' | 'SOLD OUT';
}

export interface MediaItem {
  id: string;
  title: string;
  category: 'HIGHLIGHTS' | 'REELS & SHORTS' | 'ANNOUNCEMENTS' | 'SPOTLIGHTS';
  thumbnail: string;
  videoUrl: string;
  duration: string;
  date: string;
  views?: string;
}

export interface InstagramPost {
  id: string;
  caption: string;
  date: string;
  image: string;
  url: string;
  likes: string;
  comments: string;
}

export interface StatMetric {
  id: string;
  label: string;
  value: string;
  description: string;
  isDemo?: boolean;
}

export interface RecruitmentApplication {
  id: string;
  fullName: string;
  ign: string;
  uid: string;
  preferredRole: PlayerRole;
  competitiveExperience: string;
  previousTeams: string;
  gameplayVideoUrl: string;
  contactEmail: string;
  contactPhone: string;
  discordId?: string;
  timestamp: string;
  status: 'PENDING REVIEW' | 'SHORTLISTED' | 'CONTACTED' | 'ARCHIVED';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  category: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  replied?: boolean;
}

