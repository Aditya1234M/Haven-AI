import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Check, X, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { BudgetCategoryLabels, BudgetCategoryColors, BudgetCategoryEnum } from '../types';
import type { BudgetCategory, BudgetItem } from '../types';
import { formatCurrency, getTotalEstimated, getTotalActual, getTotalPaid, getBudgetUtilization, getRemainingBudget, getVariance, getCategoryBreakdown } from '../utils/budget';

export function BudgetTracker() {
  const { getActiveEvent, addBudgetItem, updateBudgetItem, deleteBudgetItem } = useAppStore();
  const event = getActiveEvent();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: 'venue' as BudgetCategory,
    name: '',
    estimated: '',
    actual: '',
    paid: '',
    notes: '',
  });

  if (!event) return null;

  const utilization = getBudgetUtilization(event);
  const remaining = getRemainingBudget(event);
  const totalEstimated = getTotalEstimated(event.budgetItems);
  const totalActual = getTotalActual(event.budgetItems);
  const totalPaid = getTotalPaid(event.budgetItems);
  const breakdown = getCategoryBreakdown(event.budgetItems);

  const resetForm = () => {
    setFormData({ category: 'venue', name: '', estimated: '', actual: '', paid: '', notes: '' });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addBudgetItem({
      category: formData.category,
      name: formData.name.trim(),
      estimated: parseFloat(formData.estimated) || 0,
      actual: parseFloat(formData.actual) || 0,
      paid: parseFloat(formData.paid) || 0,
      notes: formData.notes.trim(),
    });
    resetForm();
  };

  const handleEdit = (item: BudgetItem) => {
    setEditingId(item.id);
    setFormData({
      category: item.category,
      name: item.name,
      estimated: item.estimated.toString(),
      actual: item.actual.toString(),
      paid: item.paid.toString(),
      notes: item.notes,
    });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    updateBudgetItem(editingId, {
      category: formData.category,
      name: formData.name.trim(),
      estimated: parseFloat(formData.estimated) || 0,
      actual: parseFloat(formData.actual) || 0,
      paid: parseFloat(formData.paid) || 0,
      notes: formData.notes.trim(),
    });
    resetForm();
  };

  // Donut chart calculations
  const activeCategories = Object.entries(breakdown)
    .filter(([, data]) => data.actual > 0)
    .sort(([, a], [, b]) => b.actual - a.actual);

  const donutSegments: { category: BudgetCategory; percent: number; offset: number }[] = [];
  let cumulativeOffset = 0;
  for (const [category, data] of activeCategories) {
    const percent = totalActual > 0 ? (data.actual / totalActual) * 100 : 0;
    donutSegments.push({ category: category as BudgetCategory, percent, offset: cumulativeOffset });
    cumulativeOffset += percent;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Budget Intelligence</h2>
          <p className="text-sm text-white/40 mt-1">Track, allocate, and optimize your event spending</p>
        </div>
        <button
          id="add-budget-item"
          onClick={() => setShowAddForm(true)}
          className="gold-button text-sm"
        >
          <Plus size={16} /> Add Expense
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="stat-card">
          <div className="text-xs text-white/40">Total Budget</div>
          <div className="font-display text-lg font-bold text-white">{formatCurrency(event.totalBudget)}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-white/40">Estimated</div>
          <div className="font-display text-lg font-bold text-white/80">{formatCurrency(totalEstimated)}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-white/40">Actual Spend</div>
          <div className="font-display text-lg font-bold text-brand-gold">{formatCurrency(totalActual)}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-white/40">Paid So Far</div>
          <div className="font-display text-lg font-bold text-brand-emerald">{formatCurrency(totalPaid)}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-white/40">Remaining</div>
          <div className={`font-display text-lg font-bold flex items-center gap-1 ${remaining >= 0 ? 'text-brand-gold' : 'text-red-400'}`}>
            {remaining < 0 && <AlertTriangle size={14} />}
            {formatCurrency(Math.abs(remaining))}
          </div>
        </div>
      </div>

      {/* Utilization Bar */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-white/70">Budget Utilization</span>
          <span className={`text-sm font-bold ${utilization > 100 ? 'text-red-400' : utilization > 80 ? 'text-amber-400' : 'text-brand-gold'}`}>
            {utilization}%
          </span>
        </div>
        <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(utilization, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${utilization > 100 ? 'bg-gradient-to-r from-red-500 to-red-400' : utilization > 80 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-gold'}`}
          />
        </div>
        {utilization > 90 && (
          <p className="text-xs text-amber-400/80 mt-2 flex items-center gap-1">
            <AlertTriangle size={12} /> {utilization > 100 ? 'Over budget! Consider rebalancing your categories.' : 'Approaching budget limit. Monitor closely.'}
          </p>
        )}
      </div>

      {/* Category Breakdown Visual */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="glass-card p-5">
          <h3 className="font-display text-base font-semibold text-white mb-4">Category Allocation</h3>
          {donutSegments.length > 0 ? (
            <div className="flex items-center gap-6">
              <div className="relative w-40 h-40 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  {donutSegments.map(seg => (
                    <circle
                      key={seg.category}
                      cx="18" cy="18" r="14"
                      fill="none"
                      stroke={BudgetCategoryColors[seg.category]}
                      strokeWidth="4"
                      strokeDasharray={`${seg.percent * 0.88} ${88 - seg.percent * 0.88}`}
                      strokeDashoffset={`${-seg.offset * 0.88}`}
                      className="transition-all duration-700"
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-lg font-bold text-white">{utilization}%</span>
                  <span className="text-[9px] text-white/30">used</span>
                </div>
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                {activeCategories.slice(0, 6).map(([category, data]) => (
                  <div key={category} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: BudgetCategoryColors[category as BudgetCategory] }} />
                    <span className="text-xs text-white/60 truncate flex-1">{BudgetCategoryLabels[category as BudgetCategory]}</span>
                    <span className="text-xs font-medium text-white/80">{formatCurrency(data.actual)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/30 text-center py-8">Add budget items to see breakdown</p>
          )}
        </div>

        {/* Variance Analysis */}
        <div className="glass-card p-5">
          <h3 className="font-display text-base font-semibold text-white mb-4">Variance Analysis</h3>
          {event.budgetItems.length > 0 ? (
            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
              {event.budgetItems.map(item => {
                const variance = getVariance(item);
                return (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-white/70 truncate">{item.name}</div>
                      <div className="text-[10px] text-white/30">{BudgetCategoryLabels[item.category]}</div>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${variance > 0 ? 'text-red-400' : variance < 0 ? 'text-brand-emerald' : 'text-white/40'}`}>
                      {variance > 0 ? <TrendingUp size={11} /> : variance < 0 ? <TrendingDown size={11} /> : null}
                      {variance !== 0 ? `${variance > 0 ? '+' : ''}${formatCurrency(variance)}` : 'On target'}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-white/30 text-center py-8">Add items to see variance analysis</p>
          )}
        </div>
      </div>

      {/* Add Form Modal */}
      <AnimatePresence>
        {(showAddForm || editingId) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => resetForm()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-display text-lg font-semibold text-white mb-4">
                {editingId ? 'Edit Budget Item' : 'Add Budget Item'}
              </h3>
              <form onSubmit={editingId ? (e) => { e.preventDefault(); handleSaveEdit(); } : handleAdd} className="space-y-3">
                <div>
                  <label htmlFor="budget-category" className="label-text">Category</label>
                  <select
                    id="budget-category"
                    className="select-field"
                    value={formData.category}
                    onChange={e => setFormData(p => ({ ...p, category: e.target.value as BudgetCategory }))}
                  >
                    {BudgetCategoryEnum.options.map(cat => (
                      <option key={cat} value={cat}>{BudgetCategoryLabels[cat]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="budget-name" className="label-text">Item Name</label>
                  <input id="budget-name" type="text" className="input-field" placeholder="e.g., Venue Rental" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="budget-estimated" className="label-text">Estimated (₹)</label>
                    <input id="budget-estimated" type="number" className="input-field" placeholder="0" value={formData.estimated} onChange={e => setFormData(p => ({ ...p, estimated: e.target.value }))} />
                  </div>
                  <div>
                    <label htmlFor="budget-actual" className="label-text">Actual (₹)</label>
                    <input id="budget-actual" type="number" className="input-field" placeholder="0" value={formData.actual} onChange={e => setFormData(p => ({ ...p, actual: e.target.value }))} />
                  </div>
                  <div>
                    <label htmlFor="budget-paid" className="label-text">Paid (₹)</label>
                    <input id="budget-paid" type="number" className="input-field" placeholder="0" value={formData.paid} onChange={e => setFormData(p => ({ ...p, paid: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label htmlFor="budget-notes" className="label-text">Notes</label>
                  <input id="budget-notes" type="text" className="input-field" placeholder="Optional notes" value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="gold-button flex-1 text-sm">
                    {editingId ? <><Check size={14} /> Save</> : <><Plus size={14} /> Add Item</>}
                  </button>
                  <button type="button" onClick={resetForm} className="ghost-button text-sm">
                    <X size={14} /> Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budget Items Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Item</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Category</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Estimated</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Actual</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Paid</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Variance</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {event.budgetItems.map(item => {
                const variance = getVariance(item);
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-white/80">{item.name}</div>
                      {item.notes && <div className="text-[10px] text-white/30 mt-0.5">{item.notes}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge text-[10px]" style={{ backgroundColor: `${BudgetCategoryColors[item.category]}15`, color: BudgetCategoryColors[item.category], borderColor: `${BudgetCategoryColors[item.category]}30`, borderWidth: '1px', borderStyle: 'solid' }}>
                        {BudgetCategoryLabels[item.category]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-white/60">{formatCurrency(item.estimated)}</td>
                    <td className="px-4 py-3 text-right text-white/80 font-medium">{formatCurrency(item.actual)}</td>
                    <td className="px-4 py-3 text-right text-brand-emerald">{formatCurrency(item.paid)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${variance > 0 ? 'text-red-400' : variance < 0 ? 'text-brand-emerald' : 'text-white/40'}`}>
                      {variance > 0 ? '+' : ''}{formatCurrency(variance)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-all"
                          aria-label={`Edit ${item.name}`}
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => deleteBudgetItem(item.id)}
                          className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                          aria-label={`Delete ${item.name}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {event.budgetItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-white/30">
                    No budget items yet. Click "Add Expense" to start tracking.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
