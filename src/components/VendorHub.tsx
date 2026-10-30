import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Trash2,
  Phone,
  Mail,
  User,
  Star,
  Sparkles,
  Copy,
  Check,
  Filter,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import {
  VendorStatusLabels,
  VendorStatusColors,
  BudgetCategoryLabels,
  BudgetCategoryEnum,
} from '../types';
import type { VendorStatus, BudgetCategory } from '../types';
import { formatCurrency } from '../utils/budget';

const allStatuses: VendorStatus[] = [
  'identified',
  'contacted',
  'quoted',
  'contracted',
  'deposit_paid',
  'completed',
];

const priorityBadges = {
  high: 'bg-red-500/10 text-red-400 border-red-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export function VendorHub() {
  const {
    getActiveEvent,
    addVendor,
    updateVendor,
    deleteVendor,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
  } = useAppStore();

  const event = getActiveEvent();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'checklist' | 'rfp'>('pipeline');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [copiedRfp, setCopiedRfp] = useState(false);
  const [selectedRfpCategory, setSelectedRfpCategory] = useState<BudgetCategory>('catering');

  // Vendor form
  const [vendorForm, setVendorForm] = useState({
    name: '',
    category: 'catering' as BudgetCategory,
    status: 'identified' as VendorStatus,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    quote: '',
    notes: '',
    rating: 5,
  });

  // Checklist form
  const [newChecklistText, setNewChecklistText] = useState('');
  const [newChecklistPriority, setNewChecklistPriority] = useState<'low' | 'medium' | 'high'>('medium');

  if (!event) return null;

  const filteredVendors = event.vendors.filter(v => {
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchCat = categoryFilter === 'all' || v.category === categoryFilter;
    return matchStatus && matchCat;
  });

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorForm.name.trim()) return;

    addVendor({
      name: vendorForm.name.trim(),
      category: vendorForm.category,
      status: vendorForm.status,
      contactName: vendorForm.contactName.trim() || 'Primary Contact',
      contactEmail: vendorForm.contactEmail.trim(),
      contactPhone: vendorForm.contactPhone.trim(),
      quote: parseFloat(vendorForm.quote) || 0,
      notes: vendorForm.notes.trim(),
      rating: Number(vendorForm.rating) || 5,
    });

    setVendorForm({
      name: '',
      category: 'catering',
      status: 'identified',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      quote: '',
      notes: '',
      rating: 5,
    });
    setShowAddVendor(false);
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;

    addChecklistItem({
      text: newChecklistText.trim(),
      completed: false,
      category: 'Procurement',
      priority: newChecklistPriority,
    });
    setNewChecklistText('');
  };

  // Dynamic AI RFP Generator logic
  const getRfpTemplate = (cat: BudgetCategory) => {
    const catName = BudgetCategoryLabels[cat];
    return `Subject: Request for Proposal (RFP) - ${catName} for ${event.name}

Dear ${catName} Team,

I hope this email finds you well.

We are currently organizing "${event.name}" and are inviting proposals for our ${catName.toLowerCase()} requirements. Below are the key specifications for our celebration:

• Event Type: ${event.type.toUpperCase()}
• Date of Event: ${event.date}
• Location / Venue: ${event.location}
• Expected Guest Count: ${event.guestCount} Guests
• Allocated Budget Range for ${catName}: ${formatCurrency(Math.round(event.totalBudget * 0.2))}
• Specific Aesthetic / Theme Notes: ${event.description}

Key Questions for your proposal:
1. Are you available on the specified date (${event.date})?
2. Could you share a tailored quotation covering standard and premium service packages?
3. What are your payment milestone terms (deposit, interim, and final settlement)?
4. What is your cancellation and contingency policy?
5. Can you provide references or a portfolio of recent events of similar scale?

Please provide your quotation and package breakdown by return email. We look forward to exploring a partnership for this milestone event.

Warm regards,
Event Planning Team
Contact: ${event.name} Planning Office`;
  };

  const copyRfpToClipboard = () => {
    navigator.clipboard.writeText(getRfpTemplate(selectedRfpCategory));
    setCopiedRfp(true);
    setTimeout(() => setCopiedRfp(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="section-title">Vendor & Procurement Hub</h2>
          <p className="text-sm text-white/40 mt-1">
            Manage vendor lifecycles from identification to final delivery, checklists, and RFPs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-surface-200 p-1 border border-white/[0.06]">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-brand-gold text-surface-50 font-semibold shadow-gold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Vendors ({event.vendors.length})
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'checklist'
                  ? 'bg-brand-gold text-surface-50 font-semibold shadow-gold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Procurement Checklist ({event.checklist.filter(c => c.completed).length}/{event.checklist.length})
            </button>
            <button
              onClick={() => setActiveTab('rfp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'rfp'
                  ? 'bg-brand-gold text-surface-50 font-semibold shadow-gold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Sparkles size={12} />
              AI RFP Generator
            </button>
          </div>

          {activeTab === 'pipeline' && (
            <button
              id="add-vendor-button"
              onClick={() => setShowAddVendor(true)}
              className="btn-gold flex items-center gap-2 text-xs py-2"
            >
              <Plus size={14} /> Add Vendor
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Vendors Pipeline */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Status Pipeline Progress Ribbon */}
          <div className="glass-card p-4 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[700px] gap-2">
              {allStatuses.map((st, idx) => {
                const count = event.vendors.filter(v => v.status === st).length;
                return (
                  <div key={st} className="flex-1 flex flex-col items-center relative">
                    <button
                      onClick={() => setStatusFilter(statusFilter === st ? 'all' : st)}
                      className={`w-full py-2 px-3 rounded-xl border text-center transition-all ${
                        statusFilter === st
                          ? 'border-brand-gold bg-brand-gold/15 text-brand-gold font-bold shadow-gold'
                          : 'border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Step {idx + 1}</div>
                      <div className="text-xs font-medium flex items-center justify-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: VendorStatusColors[st] }} />
                        {VendorStatusLabels[st]}
                      </div>
                      <div className="text-lg font-display font-bold mt-1 text-white">{count}</div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 glass-card text-xs">
            <div className="flex items-center gap-3">
              <span className="text-white/40 flex items-center gap-1">
                <Filter size={13} /> Filter:
              </span>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="bg-surface-200 border border-white/[0.08] text-white rounded-lg px-2.5 py-1.5 focus:border-brand-gold focus:outline-none"
              >
                <option value="all">All Categories</option>
                {BudgetCategoryEnum.options.map(cat => (
                  <option key={cat} value={cat}>
                    {BudgetCategoryLabels[cat]}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-surface-200 border border-white/[0.08] text-white rounded-lg px-2.5 py-1.5 focus:border-brand-gold focus:outline-none"
              >
                <option value="all">All Pipeline Stages</option>
                {allStatuses.map(st => (
                  <option key={st} value={st}>
                    {VendorStatusLabels[st]}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-white/40">
              Showing <span className="text-white font-medium">{filteredVendors.length}</span> of {event.vendors.length} vendors
            </div>
          </div>

          {/* Add Vendor Modal */}
          <AnimatePresence>
            {showAddVendor && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-6 border-brand-gold/30 bg-surface-100/90"
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                  <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                    <Users size={18} className="text-brand-gold" /> Add New Vendor
                  </h3>
                  <button onClick={() => setShowAddVendor(false)} className="text-white/40 hover:text-white">
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleAddVendor} className="grid md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-white/50 mb-1">Vendor / Business Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Decorators & Events"
                      value={vendorForm.name}
                      onChange={e => setVendorForm({ ...vendorForm, name: e.target.value })}
                      className="w-full bg-surface-200 border border-white/[0.08] rounded-xl px-3 py-2 text-white placeholder-white/20 focus:border-brand-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/50 mb-1">Category</label>
                    <select
                      value={vendorForm.category}
                      onChange={e => setVendorForm({ ...vendorForm, category: e.target.value as BudgetCategory })}
                      className="w-full bg-surface-200 border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:border-brand-gold focus:outline-none"
                    >
                      {BudgetCategoryEnum.options.map(cat => (
                        <option key={cat} value={cat}>
                          {BudgetCategoryLabels[cat]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/50 mb-1">Pipeline Stage</label>
                    <select
                      value={vendorForm.status}
                      onChange={e => setVendorForm({ ...vendorForm, status: e.target.value as VendorStatus })}
                      className="w-full bg-surface-200 border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:border-brand-gold focus:outline-none"
                    >
                      {allStatuses.map(st => (
                        <option key={st} value={st}>
                          {VendorStatusLabels[st]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/50 mb-1">Contact Person</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Sharma"
                      value={vendorForm.contactName}
                      onChange={e => setVendorForm({ ...vendorForm, contactName: e.target.value })}
                      className="w-full bg-surface-200 border border-white/[0.08] rounded-xl px-3 py-2 text-white placeholder-white/20 focus:border-brand-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/50 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="rajesh@decorator.com"
                      value={vendorForm.contactEmail}
                      onChange={e => setVendorForm({ ...vendorForm, contactEmail: e.target.value })}
                      className="w-full bg-surface-200 border border-white/[0.08] rounded-xl px-3 py-2 text-white placeholder-white/20 focus:border-brand-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/50 mb-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={vendorForm.contactPhone}
                      onChange={e => setVendorForm({ ...vendorForm, contactPhone: e.target.value })}
                      className="w-full bg-surface-200 border border-white/[0.08] rounded-xl px-3 py-2 text-white placeholder-white/20 focus:border-brand-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/50 mb-1">Quoted Price (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 75000"
                      value={vendorForm.quote}
                      onChange={e => setVendorForm({ ...vendorForm, quote: e.target.value })}
                      className="w-full bg-surface-200 border border-white/[0.08] rounded-xl px-3 py-2 text-white placeholder-white/20 focus:border-brand-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/50 mb-1">Rating</label>
                    <select
                      value={vendorForm.rating}
                      onChange={e => setVendorForm({ ...vendorForm, rating: Number(e.target.value) })}
                      className="w-full bg-surface-200 border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:border-brand-gold focus:outline-none"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars)</option>
                      <option value={2}>⭐⭐ (2 Stars)</option>
                      <option value={1}>⭐ (1 Star)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/50 mb-1">Notes / Scope Summary</label>
                    <input
                      type="text"
                      placeholder="Includes lighting, setup, and cleanup"
                      value={vendorForm.notes}
                      onChange={e => setVendorForm({ ...vendorForm, notes: e.target.value })}
                      className="w-full bg-surface-200 border border-white/[0.08] rounded-xl px-3 py-2 text-white placeholder-white/20 focus:border-brand-gold focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddVendor(false)}
                      className="btn-ghost text-xs py-2 px-4"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-gold text-xs py-2 px-5">
                      Save Vendor
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vendors Grid */}
          {filteredVendors.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Users size={36} className="mx-auto text-white/20 mb-3" />
              <p className="text-white/50 text-sm">No vendors found matching this filter.</p>
              <button
                onClick={() => setShowAddVendor(true)}
                className="btn-gold mt-4 text-xs py-2 px-4 inline-flex items-center gap-1.5"
              >
                <Plus size={14} /> Add First Vendor
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVendors.map(vendor => (
                <motion.div
                  key={vendor.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card p-5 relative group flex flex-col justify-between hover:border-brand-gold/30 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.05] text-white/60 border border-white/[0.08]">
                          {BudgetCategoryLabels[vendor.category]}
                        </span>
                        <h4 className="font-display font-bold text-base text-white mt-1.5">{vendor.name}</h4>
                      </div>

                      <button
                        onClick={() => deleteVendor(vendor.id)}
                        className="text-white/20 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Vendor"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Status Dropdown */}
                    <div className="mb-4">
                      <label className="text-[10px] text-white/40 uppercase block mb-1">Status</label>
                      <select
                        value={vendor.status}
                        onChange={e => updateVendor(vendor.id, { status: e.target.value as VendorStatus })}
                        className="w-full text-xs rounded-lg px-2.5 py-1.5 font-medium border border-white/[0.08] focus:outline-none transition-colors"
                        style={{
                          backgroundColor: `${VendorStatusColors[vendor.status]}15`,
                          color: VendorStatusColors[vendor.status],
                        }}
                      >
                        {allStatuses.map(st => (
                          <option key={st} value={st} className="bg-surface-200 text-white">
                            {VendorStatusLabels[st]}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Contact & Quote details */}
                    <div className="space-y-1.5 text-xs text-white/60 mb-4 bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                      {vendor.contactName && (
                        <div className="flex items-center gap-2">
                          <User size={13} className="text-white/30" />
                          <span>{vendor.contactName}</span>
                        </div>
                      )}
                      {vendor.contactEmail && (
                        <div className="flex items-center gap-2">
                          <Mail size={13} className="text-white/30" />
                          <a href={`mailto:${vendor.contactEmail}`} className="hover:text-brand-gold truncate">
                            {vendor.contactEmail}
                          </a>
                        </div>
                      )}
                      {vendor.contactPhone && (
                        <div className="flex items-center gap-2">
                          <Phone size={13} className="text-white/30" />
                          <a href={`tel:${vendor.contactPhone}`} className="hover:text-brand-gold">
                            {vendor.contactPhone}
                          </a>
                        </div>
                      )}
                    </div>

                    {vendor.notes && (
                      <p className="text-xs text-white/40 italic mb-4 line-clamp-2">
                        "{vendor.notes}"
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < vendor.rating ? 'fill-amber-400 text-amber-400' : 'text-white/10'}
                        />
                      ))}
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-white/40 uppercase">Quote</div>
                      <div className="font-display font-bold text-sm text-brand-gold">
                        {vendor.quote > 0 ? formatCurrency(vendor.quote) : 'Pending Quote'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Procurement Checklist */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          {/* Add Checklist Bar */}
          <form onSubmit={handleAddChecklist} className="glass-card p-4 flex flex-col md:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Add new procurement task (e.g. Schedule food tasting, Finalize AV specs, Collect contracts)..."
              value={newChecklistText}
              onChange={e => setNewChecklistText(e.target.value)}
              className="flex-1 bg-surface-200 border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-brand-gold focus:outline-none w-full"
            />
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={newChecklistPriority}
                onChange={e => setNewChecklistPriority(e.target.value as any)}
                className="bg-surface-200 border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white focus:border-brand-gold focus:outline-none"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <button type="submit" className="btn-gold text-xs py-2.5 px-5 flex-shrink-0">
                <Plus size={14} className="inline mr-1" /> Add Task
              </button>
            </div>
          </form>

          {/* Checklist items list */}
          <div className="glass-card divide-y divide-white/[0.06] overflow-hidden">
            {event.checklist.length === 0 ? (
              <div className="p-12 text-center text-white/40 text-sm">
                No checklist items yet. Add tasks above to track procurement deliverables!
              </div>
            ) : (
              event.checklist.map(item => (
                <div
                  key={item.id}
                  className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                    item.completed ? 'bg-white/[0.01] opacity-60' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        item.completed
                          ? 'bg-brand-emerald text-surface-50'
                          : 'border border-white/30 hover:border-brand-gold'
                      }`}
                    >
                      {item.completed && <Check size={12} strokeWidth={3} />}
                    </button>

                    <span
                      className={`text-xs md:text-sm truncate ${
                        item.completed ? 'line-through text-white/40' : 'text-white/90 font-medium'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        priorityBadges[item.priority] || priorityBadges.medium
                      }`}
                    >
                      {item.priority}
                    </span>
                    <button
                      onClick={() => deleteChecklistItem(item.id)}
                      className="text-white/20 hover:text-red-400 p-1 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: AI RFP Generator */}
      {activeTab === 'rfp' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Sparkles size={16} className="text-brand-gold" /> Select Vendor Service
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Generate structured Request for Proposal (RFP) letters and vendor interview questionnaires personalized with your event budget and headcount.
            </p>

            <div className="space-y-2">
              {BudgetCategoryEnum.options.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedRfpCategory(cat)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs text-left transition-all ${
                    selectedRfpCategory === cat
                      ? 'border-brand-gold bg-brand-gold/10 text-brand-gold font-bold'
                      : 'border-white/[0.06] bg-white/[0.02] text-white/70 hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{BudgetCategoryLabels[cat]}</span>
                  {selectedRfpCategory === cat && <Check size={14} className="text-brand-gold" />}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 glass-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    RFP Draft: {BudgetCategoryLabels[selectedRfpCategory]}
                  </h3>
                  <p className="text-xs text-white/40 mt-0.5">Ready to copy and email to prospective vendors</p>
                </div>

                <button
                  onClick={copyRfpToClipboard}
                  className="btn-gold text-xs py-2 px-4 flex items-center gap-1.5 shadow-gold"
                >
                  {copiedRfp ? (
                    <>
                      <Check size={14} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy to Clipboard
                    </>
                  )}
                </button>
              </div>

              <div className="bg-surface-300/80 border border-white/[0.08] rounded-xl p-4 font-mono text-xs text-white/80 whitespace-pre-wrap max-h-[500px] overflow-y-auto leading-relaxed selection:bg-brand-gold selection:text-black">
                {getRfpTemplate(selectedRfpCategory)}
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-brand-gold/5 border border-brand-gold/15 flex items-start gap-2.5">
              <Sparkles size={16} className="text-brand-gold flex-shrink-0 mt-0.5" />
              <p className="text-xs text-white/60">
                <strong className="text-brand-gold">Pro Tip:</strong> Send this RFP to at least 3 reputable vendors per category to establish competitive quotes and leverage vendor bidding.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
