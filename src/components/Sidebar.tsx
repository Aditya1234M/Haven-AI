import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Wallet,
  CalendarClock,
  Users,
  Sparkles,
  MessageCircle,
  Plus,
  ChevronDown,
  Settings,
  Trash2,
} from 'lucide-react';
import { useAppStore, type AppTab } from '../store/useAppStore';
import { EventTypeIcons } from '../types';

const navItems: { id: AppTab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'budget', label: 'Budget', icon: <Wallet size={18} /> },
  { id: 'timeline', label: 'Timeline', icon: <CalendarClock size={18} /> },
  { id: 'vendors', label: 'Vendors', icon: <Users size={18} /> },
  { id: 'ideas', label: 'Ideas Studio', icon: <Sparkles size={18} /> },
  { id: 'chat', label: 'AI Co-Pilot', icon: <MessageCircle size={18} /> },
];

export function Sidebar() {
  const {
    activeTab, setActiveTab,
    events, activeEventId, setActiveEventId,
    setShowOnboarding, deleteEvent,
  } = useAppStore();

  const [eventMenuOpen, setEventMenuOpen] = React.useState(false);
  const activeEvent = events.find(e => e.id === activeEventId);

  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/[0.06] bg-surface-100/80 backdrop-blur-2xl"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-gold shadow-gold">
          <Sparkles size={18} className="text-surface-50" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold gold-gradient-text">Haven AI</h1>
          <p className="text-[10px] font-medium text-white/30 tracking-wider uppercase">Celebration & Event Planner</p>
        </div>
      </div>

      {/* Event Selector */}
      <div className="px-3 py-3 border-b border-white/[0.06]">
        <div className="relative">
          <button
            id="event-selector-button"
            onClick={() => setEventMenuOpen(!eventMenuOpen)}
            className="w-full flex items-center justify-between gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-left transition-all duration-300 hover:border-brand-gold/30 hover:bg-white/[0.05]"
            aria-expanded={eventMenuOpen}
            aria-haspopup="listbox"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base flex-shrink-0">{activeEvent ? EventTypeIcons[activeEvent.type] : '📋'}</span>
              <span className="text-sm font-medium text-white/80 truncate">
                {activeEvent?.name ?? 'Select Event'}
              </span>
            </div>
            <ChevronDown size={14} className={`text-white/40 transition-transform duration-200 flex-shrink-0 ${eventMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {eventMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-white/[0.08] bg-surface-200/95 backdrop-blur-xl shadow-glass-lg overflow-hidden"
              role="listbox"
              aria-label="Select event"
            >
              {events.map(ev => (
                <div key={ev.id} className="flex items-center group">
                  <button
                    onClick={() => { setActiveEventId(ev.id); setEventMenuOpen(false); }}
                    className={`flex-1 flex items-center gap-2 px-3 py-2.5 text-sm text-left transition-all duration-200 hover:bg-white/[0.06] ${ev.id === activeEventId ? 'bg-brand-gold/10 text-brand-gold' : 'text-white/70'}`}
                    role="option"
                    aria-selected={ev.id === activeEventId}
                  >
                    <span>{EventTypeIcons[ev.type]}</span>
                    <span className="truncate">{ev.name}</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteEvent(ev.id); }}
                    className="p-2 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label={`Delete ${ev.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                id="new-event-button"
                onClick={() => { setShowOnboarding(true); setEventMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-brand-gold/70 hover:bg-brand-gold/5 transition-all border-t border-white/[0.06]"
              >
                <Plus size={14} />
                <span>New Event</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto" aria-label="Module navigation">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`group relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04] border border-transparent'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-brand-gold"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className={isActive ? 'text-brand-gold' : 'text-white/40 group-hover:text-white/60'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* AI Config */}
      <div className="px-3 py-3 border-t border-white/[0.06]">
        <button
          id="settings-button"
          onClick={() => setActiveTab('chat')}
          className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-white/30 hover:text-white/50 transition-colors"
        >
          <Settings size={14} />
          <span>AI Settings</span>
        </button>
      </div>
    </aside>
  );
}
