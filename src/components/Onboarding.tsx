import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Calendar, Users, MapPin, IndianRupee, FileText } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { EventType } from '../types';
import { EventTypeLabels } from '../types';

const eventTypes: { type: EventType; emoji: string; label: string; desc: string; gradient: string }[] = [
  { type: 'wedding', emoji: '💍', label: 'Wedding & Reception', desc: 'Multi-ceremony celebrations with vendor management and seating', gradient: 'from-pink-500/20 to-amber-500/20' },
  { type: 'birthday', emoji: '🎂', label: 'Birthday & Celebration', desc: 'Milestone birthdays with themes, activities, and entertainment', gradient: 'from-purple-500/20 to-cyan-500/20' },
  { type: 'community', emoji: '🎪', label: 'Community Event & Gala', desc: 'Festivals, charity galas, and volunteer coordination', gradient: 'from-emerald-500/20 to-blue-500/20' },
];

export function Onboarding() {
  const { createEvent, loadPreset } = useAppStore();
  const [step, setStep] = useState<'choose' | 'form'>('choose');
  const [selectedType, setSelectedType] = useState<EventType>('wedding');
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    guestCount: '',
    totalBudget: '',
    description: '',
    location: '',
  });

  const handleLoadPreset = (type: EventType) => {
    loadPreset(type);
  };

  const handleStartCustom = (type: EventType) => {
    setSelectedType(type);
    setStep('form');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createEvent(
      formData.name || `My ${EventTypeLabels[selectedType]}`,
      selectedType,
      formData.date || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]!,
      parseInt(formData.guestCount) || 100,
      parseInt(formData.totalBudget) || 500000,
      formData.description || `A beautiful ${selectedType} celebration`,
      formData.location || 'To be decided',
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-50/95 backdrop-blur-xl">
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-rose/5 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-3s' }} />

      <AnimatePresence mode="wait">
        {step === 'choose' ? (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 max-w-4xl w-full px-6"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-gold shadow-gold mb-6"
              >
                <Sparkles size={28} className="text-surface-50" />
              </motion.div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome to <span className="gold-gradient-text">Haven AI</span>
              </h1>
              <p className="text-lg text-white/50 max-w-2xl mx-auto">
                Your GenAI-powered celebration planner. Create unforgettable events with intelligent budgets, timelines, vendor management, and personalized creative ideas.
              </p>
            </div>

            {/* Event Type Cards */}
            <div className="grid md:grid-cols-3 gap-5 mb-8">
              {eventTypes.map((et, i) => (
                <motion.div
                  key={et.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="glass-card-hover group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${et.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                  <div className="relative p-6">
                    <span className="text-4xl mb-4 block">{et.emoji}</span>
                    <h3 className="font-display text-lg font-bold text-white mb-2">{et.label}</h3>
                    <p className="text-sm text-white/40 mb-6 leading-relaxed">{et.desc}</p>
                    <div className="flex flex-col gap-2">
                      <button
                        id={`preset-${et.type}`}
                        onClick={() => handleLoadPreset(et.type)}
                        className="gold-button text-sm py-2"
                      >
                        <Sparkles size={14} /> Load Demo
                      </button>
                      <button
                        id={`custom-${et.type}`}
                        onClick={() => handleStartCustom(et.type)}
                        className="ghost-button text-sm py-2"
                      >
                        Create Custom <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 max-w-lg w-full px-6"
          >
            <button
              onClick={() => setStep('choose')}
              className="text-sm text-white/40 hover:text-white/70 mb-4 transition-colors"
            >
              ← Back to event types
            </button>

            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{eventTypes.find(e => e.type === selectedType)?.emoji}</span>
                <div>
                  <h2 className="font-display text-xl font-bold text-white">Create Your Event</h2>
                  <p className="text-sm text-white/40">{EventTypeLabels[selectedType]}</p>
                </div>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label htmlFor="event-name" className="label-text"><FileText size={12} className="inline mr-1" />Event Name</label>
                  <input
                    id="event-name"
                    type="text"
                    className="input-field"
                    placeholder="e.g., Sarah & John's Wedding"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="event-date" className="label-text"><Calendar size={12} className="inline mr-1" />Event Date</label>
                    <input
                      id="event-date"
                      type="date"
                      className="input-field"
                      value={formData.date}
                      onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="guest-count" className="label-text"><Users size={12} className="inline mr-1" />Guest Count</label>
                    <input
                      id="guest-count"
                      type="number"
                      className="input-field"
                      placeholder="e.g., 200"
                      value={formData.guestCount}
                      onChange={e => setFormData(p => ({ ...p, guestCount: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="total-budget" className="label-text"><IndianRupee size={12} className="inline mr-1" />Total Budget (₹)</label>
                  <input
                    id="total-budget"
                    type="number"
                    className="input-field"
                    placeholder="e.g., 2500000"
                    value={formData.totalBudget}
                    onChange={e => setFormData(p => ({ ...p, totalBudget: e.target.value }))}
                  />
                </div>

                <div>
                  <label htmlFor="event-location" className="label-text"><MapPin size={12} className="inline mr-1" />Location</label>
                  <input
                    id="event-location"
                    type="text"
                    className="input-field"
                    placeholder="e.g., Grand Palace, Mumbai"
                    value={formData.location}
                    onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                  />
                </div>

                <div>
                  <label htmlFor="event-description" className="label-text">Description (optional)</label>
                  <textarea
                    id="event-description"
                    className="input-field min-h-[80px] resize-none"
                    placeholder="Describe your dream event..."
                    value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  />
                </div>

                <button type="submit" id="create-event-submit" className="gold-button w-full mt-2">
                  <Sparkles size={16} /> Create Event & Start Planning
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
