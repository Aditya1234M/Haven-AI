import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type {
  CelebrationEvent,
  EventType,
  BudgetItem,
  TimelineTask,
  Vendor,
  ChecklistItem,
  ThemeIdea,
  InvitationDraft,
  ActivityIdea,
  ChatMessage,
  AIConfig,
} from '../types';
import { getEventPresets } from '../data/presets';

// ─── Tab Navigation ──────────────────────────────────────────
export type AppTab = 'dashboard' | 'budget' | 'timeline' | 'vendors' | 'ideas' | 'chat';

// ─── Store Interface ─────────────────────────────────────────
interface AppState {
  // Navigation
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;

  // Events
  events: CelebrationEvent[];
  activeEventId: string | null;
  getActiveEvent: () => CelebrationEvent | null;
  createEvent: (name: string, type: EventType, date: string, guestCount: number, totalBudget: number, description: string, location: string) => void;
  loadPreset: (type: EventType) => void;
  deleteEvent: (id: string) => void;
  setActiveEventId: (id: string) => void;
  updateEvent: (id: string, updates: Partial<CelebrationEvent>) => void;

  // Budget Items
  addBudgetItem: (item: Omit<BudgetItem, 'id'>) => void;
  updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void;
  deleteBudgetItem: (id: string) => void;

  // Timeline
  addTimelineTask: (task: Omit<TimelineTask, 'id'>) => void;
  updateTimelineTask: (id: string, updates: Partial<TimelineTask>) => void;
  deleteTimelineTask: (id: string) => void;
  toggleTimelineTask: (id: string) => void;

  // Vendors
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;

  // Checklist
  addChecklistItem: (item: Omit<ChecklistItem, 'id'>) => void;
  toggleChecklistItem: (id: string) => void;
  deleteChecklistItem: (id: string) => void;

  // AI Ideas
  addTheme: (theme: Omit<ThemeIdea, 'id'>) => void;
  addInvitation: (draft: Omit<InvitationDraft, 'id'>) => void;
  addActivity: (activity: Omit<ActivityIdea, 'id'>) => void;
  clearThemes: () => void;
  clearInvitations: () => void;
  clearActivities: () => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (role: 'user' | 'assistant', content: string) => void;
  clearChat: () => void;

  // AI Config
  aiConfig: AIConfig;
  setAIConfig: (config: Partial<AIConfig>) => void;

  // Onboarding
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
}

// ─── Helper ──────────────────────────────────────────────────
function updateActiveEvent(state: AppState, updater: (event: CelebrationEvent) => CelebrationEvent): Partial<AppState> {
  if (!state.activeEventId) return {};
  return {
    events: state.events.map(e =>
      e.id === state.activeEventId ? updater(e) : e
    ),
  };
}

// ─── Store ───────────────────────────────────────────────────
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      activeTab: 'dashboard',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Events
      events: [],
      activeEventId: null,
      getActiveEvent: () => {
        const state = get();
        return state.events.find(e => e.id === state.activeEventId) ?? null;
      },

      createEvent: (name, type, date, guestCount, totalBudget, description, location) => {
        const newEvent: CelebrationEvent = {
          id: uuid(),
          name,
          type,
          date,
          guestCount,
          totalBudget,
          description,
          location,
          createdAt: new Date().toISOString(),
          budgetItems: [],
          timeline: [],
          vendors: [],
          checklist: [],
          themes: [],
          invitations: [],
          activities: [],
        };
        set(state => ({
          events: [...state.events, newEvent],
          activeEventId: newEvent.id,
          activeTab: 'dashboard',
          showOnboarding: false,
        }));
      },

      loadPreset: (type) => {
        const presets = getEventPresets();
        const preset = presets.find(p => p.type === type);
        if (!preset) return;
        // Generate fresh IDs for the preset
        const freshPreset = { ...preset, id: uuid(), createdAt: new Date().toISOString() };
        set(state => ({
          events: [...state.events, freshPreset],
          activeEventId: freshPreset.id,
          activeTab: 'dashboard',
          showOnboarding: false,
        }));
      },

      deleteEvent: (id) => set(state => {
        const filtered = state.events.filter(e => e.id !== id);
        return {
          events: filtered,
          activeEventId: state.activeEventId === id ? (filtered[0]?.id ?? null) : state.activeEventId,
          showOnboarding: filtered.length === 0,
        };
      }),

      setActiveEventId: (id) => set({ activeEventId: id, activeTab: 'dashboard' }),

      updateEvent: (id, updates) => set(state => ({
        events: state.events.map(e => e.id === id ? { ...e, ...updates } : e),
      })),

      // Budget Items
      addBudgetItem: (item) => set(state => updateActiveEvent(state, e => ({
        ...e,
        budgetItems: [...e.budgetItems, { ...item, id: uuid() }],
      }))),

      updateBudgetItem: (id, updates) => set(state => updateActiveEvent(state, e => ({
        ...e,
        budgetItems: e.budgetItems.map(b => b.id === id ? { ...b, ...updates } : b),
      }))),

      deleteBudgetItem: (id) => set(state => updateActiveEvent(state, e => ({
        ...e,
        budgetItems: e.budgetItems.filter(b => b.id !== id),
      }))),

      // Timeline
      addTimelineTask: (task) => set(state => updateActiveEvent(state, e => ({
        ...e,
        timeline: [...e.timeline, { ...task, id: uuid() }],
      }))),

      updateTimelineTask: (id, updates) => set(state => updateActiveEvent(state, e => ({
        ...e,
        timeline: e.timeline.map(t => t.id === id ? { ...t, ...updates } : t),
      }))),

      deleteTimelineTask: (id) => set(state => updateActiveEvent(state, e => ({
        ...e,
        timeline: e.timeline.filter(t => t.id !== id),
      }))),

      toggleTimelineTask: (id) => set(state => updateActiveEvent(state, e => ({
        ...e,
        timeline: e.timeline.map(t => t.id === id ? { ...t, completed: !t.completed } : t),
      }))),

      // Vendors
      addVendor: (vendor) => set(state => updateActiveEvent(state, e => ({
        ...e,
        vendors: [...e.vendors, { ...vendor, id: uuid() }],
      }))),

      updateVendor: (id, updates) => set(state => updateActiveEvent(state, e => ({
        ...e,
        vendors: e.vendors.map(v => v.id === id ? { ...v, ...updates } : v),
      }))),

      deleteVendor: (id) => set(state => updateActiveEvent(state, e => ({
        ...e,
        vendors: e.vendors.filter(v => v.id !== id),
      }))),

      // Checklist
      addChecklistItem: (item) => set(state => updateActiveEvent(state, e => ({
        ...e,
        checklist: [...e.checklist, { ...item, id: uuid() }],
      }))),

      toggleChecklistItem: (id) => set(state => updateActiveEvent(state, e => ({
        ...e,
        checklist: e.checklist.map(c => c.id === id ? { ...c, completed: !c.completed } : c),
      }))),

      deleteChecklistItem: (id) => set(state => updateActiveEvent(state, e => ({
        ...e,
        checklist: e.checklist.filter(c => c.id !== id),
      }))),

      // AI Ideas
      addTheme: (theme) => set(state => updateActiveEvent(state, e => ({
        ...e,
        themes: [...e.themes, { ...theme, id: uuid() }],
      }))),

      addInvitation: (draft) => set(state => updateActiveEvent(state, e => ({
        ...e,
        invitations: [...e.invitations, { ...draft, id: uuid() }],
      }))),

      addActivity: (activity) => set(state => updateActiveEvent(state, e => ({
        ...e,
        activities: [...e.activities, { ...activity, id: uuid() }],
      }))),

      clearThemes: () => set(state => updateActiveEvent(state, e => ({ ...e, themes: [] }))),
      clearInvitations: () => set(state => updateActiveEvent(state, e => ({ ...e, invitations: [] }))),
      clearActivities: () => set(state => updateActiveEvent(state, e => ({ ...e, activities: [] }))),

      // Chat
      chatMessages: [],
      addChatMessage: (role, content) => set(state => ({
        chatMessages: [...state.chatMessages, {
          id: uuid(),
          role,
          content,
          timestamp: new Date().toISOString(),
        }],
      })),
      clearChat: () => set({ chatMessages: [] }),

      // AI Config (auto-enables Live Gemini if an environment key is provided)
      aiConfig: {
        mode: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ? 'live' : 'simulated',
        apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || '',
      },
      setAIConfig: (config) => set(state => ({
        aiConfig: { ...state.aiConfig, ...config },
      })),

      // Onboarding
      showOnboarding: true,
      setShowOnboarding: (show) => set({ showOnboarding: show }),
    }),
    {
      name: 'haven-ai-storage',
      partialize: (state) => ({
        events: state.events,
        activeEventId: state.activeEventId,
        aiConfig: { ...state.aiConfig, apiKey: '' }, // Never persist API key
        chatMessages: state.chatMessages,
        showOnboarding: state.showOnboarding,
      }),
    }
  )
);
