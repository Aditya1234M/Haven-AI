import { z } from 'zod';

// ─── Event Types ──────────────────────────────────────────────
export const EventTypeEnum = z.enum(['wedding', 'birthday', 'community']);
export type EventType = z.infer<typeof EventTypeEnum>;

export const EventTypeLabels: Record<EventType, string> = {
  wedding: '💍 Wedding & Reception',
  birthday: '🎂 Birthday & Celebration',
  community: '🎪 Community Event & Gala',
};

export const EventTypeIcons: Record<EventType, string> = {
  wedding: '💍',
  birthday: '🎂',
  community: '🎪',
};

// ─── Budget ──────────────────────────────────────────────────
export const BudgetCategoryEnum = z.enum([
  'venue',
  'catering',
  'decor',
  'entertainment',
  'photography',
  'attire',
  'logistics',
  'stationery',
  'favors',
  'contingency',
  'other',
]);
export type BudgetCategory = z.infer<typeof BudgetCategoryEnum>;

export const BudgetCategoryLabels: Record<BudgetCategory, string> = {
  venue: 'Venue & Rentals',
  catering: 'Catering & Bar',
  decor: 'Decor & Florals',
  entertainment: 'Entertainment & Music',
  photography: 'Photography & Video',
  attire: 'Attire & Beauty',
  logistics: 'Transport & Logistics',
  stationery: 'Invitations & Stationery',
  favors: 'Gifts & Favors',
  contingency: 'Contingency Reserve',
  other: 'Miscellaneous',
};

export const BudgetCategoryColors: Record<BudgetCategory, string> = {
  venue: '#D4A853',
  catering: '#50C878',
  decor: '#E8A0BF',
  entertainment: '#818CF8',
  photography: '#F59E0B',
  attire: '#EC4899',
  logistics: '#06B6D4',
  stationery: '#A78BFA',
  favors: '#FB923C',
  contingency: '#6B7280',
  other: '#94A3B8',
};

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  name: string;
  estimated: number;
  actual: number;
  paid: number;
  notes: string;
}

// ─── Timeline ────────────────────────────────────────────────
export type TimelinePhase = 'pre-event' | 'day-of';

export interface TimelineTask {
  id: string;
  phase: TimelinePhase;
  title: string;
  description: string;
  date: string;          // ISO date string for pre-event, or time like "14:00" for day-of
  dueLabel: string;      // human-friendly "3 months out", "2:00 PM" etc.
  assignee: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// ─── Vendors ─────────────────────────────────────────────────
export const VendorStatusEnum = z.enum([
  'identified',
  'contacted',
  'quoted',
  'contracted',
  'deposit_paid',
  'completed',
]);
export type VendorStatus = z.infer<typeof VendorStatusEnum>;

export const VendorStatusLabels: Record<VendorStatus, string> = {
  identified: 'Identified',
  contacted: 'Contacted',
  quoted: 'Quoted',
  contracted: 'Contract Signed',
  deposit_paid: 'Deposit Paid',
  completed: 'Completed',
};

export const VendorStatusColors: Record<VendorStatus, string> = {
  identified: '#94A3B8',
  contacted: '#818CF8',
  quoted: '#F59E0B',
  contracted: '#D4A853',
  deposit_paid: '#50C878',
  completed: '#22C55E',
};

export interface Vendor {
  id: string;
  name: string;
  category: BudgetCategory;
  status: VendorStatus;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  quote: number;
  notes: string;
  rating: number; // 1-5
}

// ─── Checklist ───────────────────────────────────────────────
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

// ─── AI Ideas ────────────────────────────────────────────────
export interface ThemeIdea {
  id: string;
  name: string;
  description: string;
  colorPalette: string[];
  keywords: string[];
  aestheticVibe: string;
}

export interface InvitationDraft {
  id: string;
  tone: 'formal' | 'whimsical' | 'poetic' | 'casual' | 'rsvp_text';
  content: string;
}

export interface ActivityIdea {
  id: string;
  name: string;
  description: string;
  timeSlot: string;
  demographic: string;
}

// ─── Main Event ──────────────────────────────────────────────
export interface CelebrationEvent {
  id: string;
  name: string;
  type: EventType;
  date: string;
  guestCount: number;
  totalBudget: number;
  description: string;
  location: string;
  createdAt: string;
  budgetItems: BudgetItem[];
  timeline: TimelineTask[];
  vendors: Vendor[];
  checklist: ChecklistItem[];
  themes: ThemeIdea[];
  invitations: InvitationDraft[];
  activities: ActivityIdea[];
}

// ─── AI Chat ─────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ─── AI Service Types ────────────────────────────────────────
export type AIMode = 'live' | 'simulated';

export interface AIConfig {
  mode: AIMode;
  apiKey: string;
}
