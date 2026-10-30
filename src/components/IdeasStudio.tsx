import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Palette,
  Mail,
  Music,
  Copy,
  Check,
  RefreshCw,
  Plus,
  Clock,
  Users,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { simulateThemeIdeas, simulateInvitations, simulateActivities } from '../services/simulatedAI';
import type { InvitationDraft, ActivityIdea } from '../types';

export function IdeasStudio() {
  const {
    getActiveEvent,
    addTheme,
    addInvitation,
    addTimelineTask,
  } = useAppStore();

  const event = getActiveEvent();
  const [activeTab, setActiveTab] = useState<'themes' | 'invitations' | 'activities'>('themes');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  // Invitation state
  const [selectedTone, setSelectedTone] = useState<InvitationDraft['tone']>('formal');
  const [customInviteText, setCustomInviteText] = useState('');

  if (!event) return null;

  // Initial loaded sets
  const availableThemes = event.themes.length > 0 ? event.themes : simulateThemeIdeas(event);
  const availableInvitations = simulateInvitations(event);
  const availableActivities = event.activities.length > 0 ? event.activities : simulateActivities(event);

  const fallbackInvite: InvitationDraft = {
    id: 'default',
    tone: 'formal',
    content: `You are cordially invited to ${event.name}.\nDate: ${event.date}\nLocation: ${event.location}`,
  };
  const activeInvite = availableInvitations.find(inv => inv.tone === selectedTone) ?? availableInvitations[0] ?? fallbackInvite;

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const handleAddActivityToTimeline = (act: ActivityIdea) => {
    addTimelineTask({
      phase: 'day-of',
      title: act.name,
      description: act.description,
      date: '18:00',
      dueLabel: act.timeSlot || 'Day of event',
      assignee: 'Activity Lead',
      completed: false,
      priority: 'medium',
    });
    setCopiedItem(`act-${act.name}`);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleRegenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="section-title flex items-center gap-2">
            <Sparkles size={20} className="text-brand-gold" /> GenAI Personalized Ideas Studio
          </h2>
          <p className="text-sm text-white/40 mt-1">
            Personalized themes, invitation copy, and timeline-synchronized activities generated for {event.name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-surface-200 p-1 border border-white/[0.06]">
            <button
              onClick={() => setActiveTab('themes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'themes'
                  ? 'bg-brand-gold text-surface-50 font-semibold shadow-gold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Palette size={13} />
              Themes & Aesthetics
            </button>
            <button
              onClick={() => setActiveTab('invitations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'invitations'
                  ? 'bg-brand-gold text-surface-50 font-semibold shadow-gold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Mail size={13} />
              Invitation Copywriter
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'activities'
                  ? 'bg-brand-gold text-surface-50 font-semibold shadow-gold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Music size={13} />
              Activities & Music
            </button>
          </div>

          <button
            onClick={handleRegenerate}
            disabled={generating}
            className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5 border border-white/[0.08]"
          >
            <RefreshCw size={12} className={generating ? 'animate-spin text-brand-gold' : ''} />
            Refresh Ideas
          </button>
        </div>
      </div>

      {/* Tab 1: Themes & Aesthetics */}
      {activeTab === 'themes' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableThemes.map((theme, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 flex flex-col justify-between hover:border-brand-gold/40 transition-all duration-300 relative group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-brand-gold transition-colors">
                    {theme.name}
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
                    Concept 0{index + 1}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] mb-4">
                  <div className="text-[10px] text-brand-gold uppercase tracking-wider mb-1 font-semibold">The Vibe</div>
                  <p className="text-xs text-white/80 italic font-serif">"{theme.aestheticVibe}"</p>
                </div>

                <p className="text-xs text-white/50 leading-relaxed mb-5">{theme.description}</p>

                {/* Color Swatches */}
                <div className="mb-5">
                  <div className="text-[10px] uppercase tracking-wider text-white/40 mb-2 font-medium">
                    Curated Color Palette (Click to copy Hex)
                  </div>
                  <div className="flex items-center gap-2">
                    {theme.colorPalette.map((hex, i) => (
                      <button
                        key={i}
                        onClick={() => handleCopyColor(hex)}
                        title={`Copy ${hex}`}
                        className="group/color relative flex-1 h-10 rounded-lg border border-white/10 transition-transform hover:scale-105 active:scale-95"
                        style={{ backgroundColor: hex }}
                      >
                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/color:opacity-100 bg-black/40 rounded-lg text-[9px] font-mono text-white transition-opacity">
                          {copiedColor === hex ? '✓' : hex}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aesthetic Keywords */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {theme.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-surface-200 border border-white/[0.06] text-white/60 font-medium"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <button
                  onClick={() =>
                    handleCopyText(
                      `prompt-${index}`,
                      `Generate a high-end celebration concept design: ${theme.name}. Aesthetic vibe: ${theme.aestheticVibe}. Color palette: ${theme.colorPalette.join(', ')}. Keywords: ${theme.keywords.join(', ')}.`
                    )
                  }
                  className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  {copiedItem === `prompt-${index}` ? (
                    <>
                      <Check size={12} className="text-brand-emerald" /> Copied Prompt
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> Copy AI Image Prompt
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    addTheme(theme);
                    setCopiedItem(`saved-${index}`);
                    setTimeout(() => setCopiedItem(null), 2000);
                  }}
                  className="btn-gold text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  {copiedItem === `saved-${index}` ? <Check size={12} /> : <Plus size={12} />}
                  Save to Event
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Tab 2: Custom Invitation Copywriter */}
      {activeTab === 'invitations' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tone Selector */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Mail size={16} className="text-brand-gold" /> Select Invitation Tone
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Choose the emotional resonance of your message. Our copywriter formats it with dates, times, and RSVP calls to action.
            </p>

            <div className="space-y-2 pt-2">
              {[
                { tone: 'formal', label: '🎩 Formal & Royal', desc: 'Traditional, gracious, and dignified' },
                { tone: 'whimsical', label: '✨ Whimsical & Fun', desc: 'Sparkling, enthusiastic, and festive' },
                { tone: 'poetic', label: '📜 Poetic & Sentimental', desc: 'Lyrical, heartfelt, and memorable' },
                { tone: 'casual', label: '🎉 Casual & Warm', desc: 'Relaxed, modern, and friendly' },
                { tone: 'rsvp_text', label: '📱 WhatsApp & SMS RSVP', desc: 'Concise mobile blast with quick replies' },
              ].map(item => (
                <button
                  key={item.tone}
                  onClick={() => {
                    setSelectedTone(item.tone as any);
                    setCustomInviteText('');
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedTone === item.tone
                      ? 'border-brand-gold bg-brand-gold/10 text-white font-medium shadow-gold'
                      : 'border-white/[0.06] bg-white/[0.02] text-white/70 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="text-xs font-semibold">{item.label}</div>
                  <div className="text-[11px] text-white/40 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Invitation Preview & Editor */}
          <div className="lg:col-span-2 glass-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Generated Copy ({selectedTone.replace('_', ' ').toUpperCase()})
                  </h3>
                  <p className="text-xs text-white/40 mt-0.5">Edit in real-time or copy for print / digital send</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const text = customInviteText || activeInvite.content;
                      handleCopyText('invite-copy', text);
                    }}
                    className="btn-gold text-xs py-2 px-4 flex items-center gap-1.5 shadow-gold"
                  >
                    {copiedItem === 'invite-copy' ? (
                      <>
                        <Check size={14} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy Copywriting
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Editable Textbox with luxury stationery styling */}
              <div className="relative rounded-2xl border border-brand-gold/20 bg-surface-200/90 p-6 shadow-inner font-serif">
                <textarea
                  rows={10}
                  value={customInviteText || activeInvite.content}
                  onChange={e => setCustomInviteText(e.target.value)}
                  className="w-full bg-transparent text-sm md:text-base text-white/90 leading-relaxed focus:outline-none resize-none font-serif selection:bg-brand-gold selection:text-black"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-white/40 pt-3 border-t border-white/[0.06]">
              <span>💡 Ready for print cards, digital invites, or messaging apps.</span>
              <button
                onClick={() => {
                  addInvitation({
                    tone: selectedTone,
                    content: customInviteText || activeInvite.content,
                  });
                  setCopiedItem('saved-invite');
                  setTimeout(() => setCopiedItem(null), 2000);
                }}
                className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1 text-brand-gold"
              >
                {copiedItem === 'saved-invite' ? <Check size={12} /> : <Plus size={12} />} Save to Event Records
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Activities & Music */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {availableActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 flex flex-col justify-between hover:border-brand-gold/30 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                      <Music size={16} className="text-brand-gold" /> {activity.name}
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/[0.05] text-white/70 border border-white/[0.08]">
                      {activity.demographic}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-brand-gold/80 mb-3 font-medium">
                    <Clock size={13} />
                    <span>Suggested Timing: {activity.timeSlot}</span>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed mb-4">{activity.description}</p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] text-white/40 flex items-center gap-1">
                    <Users size={12} /> Audience: {activity.demographic}
                  </span>

                  <button
                    onClick={() => handleAddActivityToTimeline(activity)}
                    className="btn-gold text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-gold"
                  >
                    {copiedItem === `act-${activity.name}` ? (
                      <>
                        <Check size={12} /> Added to Timeline!
                      </>
                    ) : (
                      <>
                        <Plus size={12} /> Add to Run-of-Show
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
