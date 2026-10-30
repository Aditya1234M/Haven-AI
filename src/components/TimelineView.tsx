import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, X, Trash2, Clock, CalendarDays, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { TimelinePhase, TimelineTask } from '../types';

const priorityConfig = {
  critical: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', dot: 'bg-red-400', label: 'Critical' },
  high: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', dot: 'bg-amber-400', label: 'High' },
  medium: { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', dot: 'bg-blue-400', label: 'Medium' },
  low: { color: 'text-white/40', bg: 'bg-white/[0.04]', border: 'border-white/[0.08]', dot: 'bg-white/30', label: 'Low' },
};

export function TimelineView() {
  const { getActiveEvent, addTimelineTask, toggleTimelineTask, deleteTimelineTask } = useAppStore();
  const event = getActiveEvent();
  const [activePhase, setActivePhase] = useState<TimelinePhase>('pre-event');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    dueLabel: '',
    assignee: '',
    priority: 'medium' as TimelineTask['priority'],
  });

  if (!event) return null;

  const phaseTasks = event.timeline.filter(t => t.phase === activePhase);
  const preCount = event.timeline.filter(t => t.phase === 'pre-event').length;
  const dayOfCount = event.timeline.filter(t => t.phase === 'day-of').length;
  const preCompleted = event.timeline.filter(t => t.phase === 'pre-event' && t.completed).length;
  const dayOfCompleted = event.timeline.filter(t => t.phase === 'day-of' && t.completed).length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    addTimelineTask({
      phase: activePhase,
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: formData.date,
      dueLabel: formData.dueLabel.trim() || formData.date,
      assignee: formData.assignee.trim() || 'Unassigned',
      completed: false,
      priority: formData.priority,
    });
    setFormData({ title: '', description: '', date: '', dueLabel: '', assignee: '', priority: 'medium' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Timeline & Run of Show</h2>
          <p className="text-sm text-white/40 mt-1">Plan milestones and day-of schedule</p>
        </div>
        <button id="add-timeline-task" onClick={() => setShowAddForm(true)} className="gold-button text-sm">
          <Plus size={16} /> Add Task
        </button>
      </div>

      {/* Phase Tabs */}
      <div className="flex gap-2">
        <button
          id="phase-pre-event"
          onClick={() => setActivePhase('pre-event')}
          className={activePhase === 'pre-event' ? 'tab-button-active' : 'tab-button'}
        >
          <CalendarDays size={14} className="inline mr-1.5" />
          Pre-Event Countdown
          <span className="ml-2 text-[10px] opacity-60">({preCompleted}/{preCount})</span>
        </button>
        <button
          id="phase-day-of"
          onClick={() => setActivePhase('day-of')}
          className={activePhase === 'day-of' ? 'tab-button-active' : 'tab-button'}
        >
          <Clock size={14} className="inline mr-1.5" />
          Day-Of Run of Show
          <span className="ml-2 text-[10px] opacity-60">({dayOfCompleted}/{dayOfCount})</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/60">
            {activePhase === 'pre-event' ? 'Pre-Event Progress' : 'Day-Of Completion'}
          </span>
          <span className="text-sm font-bold text-brand-gold">
            {activePhase === 'pre-event'
              ? `${preCount > 0 ? Math.round((preCompleted / preCount) * 100) : 0}%`
              : `${dayOfCount > 0 ? Math.round((dayOfCompleted / dayOfCount) * 100) : 0}%`
            }
          </span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill bg-gradient-gold"
            initial={{ width: 0 }}
            animate={{
              width: `${activePhase === 'pre-event'
                ? (preCount > 0 ? (preCompleted / preCount) * 100 : 0)
                : (dayOfCount > 0 ? (dayOfCompleted / dayOfCount) * 100 : 0)
              }%`
            }}
            transition={{ duration: 0.7 }}
          />
        </div>
      </div>

      {/* Timeline Items */}
      <div className="space-y-3">
        <AnimatePresence>
          {phaseTasks.length > 0 ? phaseTasks.map((task, idx) => {
            const config = priorityConfig[task.priority];
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
                className={`glass-card p-4 flex items-start gap-4 group ${task.completed ? 'opacity-60' : ''}`}
              >
                {/* Timeline dot */}
                <div className="flex flex-col items-center pt-1 gap-1">
                  <button
                    onClick={() => toggleTimelineTask(task.id)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 border ${
                      task.completed
                        ? 'bg-brand-emerald/20 border-brand-emerald/40 text-brand-emerald'
                        : `${config.bg} ${config.border} ${config.color}`
                    }`}
                    aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                  >
                    {task.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                  </button>
                  {idx < phaseTasks.length - 1 && (
                    <div className="w-px h-8 bg-white/[0.08]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className={`text-sm font-semibold ${task.completed ? 'line-through text-white/40' : 'text-white/90'}`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-xs text-white/40 mt-0.5">{task.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteTimelineTask(task.id)}
                      className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                      aria-label={`Delete "${task.title}"`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[11px] text-white/50">
                      <Clock size={11} /> {task.dueLabel}
                    </span>
                    <span className="text-[11px] text-white/35">• {task.assignee}</span>
                    <span className={`badge text-[9px] ${config.bg} ${config.color} border ${config.border}`}>
                      {task.priority === 'critical' && <AlertCircle size={9} className="mr-0.5" />}
                      {config.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          }) : (
            <div className="glass-card p-12 text-center">
              <Clock size={32} className="mx-auto text-white/20 mb-3" />
              <p className="text-sm text-white/30">No {activePhase === 'pre-event' ? 'pre-event' : 'day-of'} tasks yet.</p>
              <p className="text-xs text-white/20 mt-1">Click "Add Task" to create your first milestone.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-display text-lg font-semibold text-white mb-4">
                Add {activePhase === 'pre-event' ? 'Pre-Event' : 'Day-Of'} Task
              </h3>
              <form onSubmit={handleAdd} className="space-y-3">
                <div>
                  <label htmlFor="task-title" className="label-text">Task Title</label>
                  <input id="task-title" type="text" className="input-field" placeholder="e.g., Book venue" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} required />
                </div>
                <div>
                  <label htmlFor="task-desc" className="label-text">Description</label>
                  <input id="task-desc" type="text" className="input-field" placeholder="Optional details" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="task-date" className="label-text">
                      {activePhase === 'pre-event' ? 'Due Date' : 'Time'}
                    </label>
                    <input
                      id="task-date"
                      type={activePhase === 'pre-event' ? 'date' : 'time'}
                      className="input-field"
                      value={formData.date}
                      onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="task-label" className="label-text">Due Label</label>
                    <input id="task-label" type="text" className="input-field" placeholder={activePhase === 'pre-event' ? '3 months out' : '2:00 PM'} value={formData.dueLabel} onChange={e => setFormData(p => ({ ...p, dueLabel: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="task-assignee" className="label-text">Assignee</label>
                    <input id="task-assignee" type="text" className="input-field" placeholder="Who's responsible?" value={formData.assignee} onChange={e => setFormData(p => ({ ...p, assignee: e.target.value }))} />
                  </div>
                  <div>
                    <label htmlFor="task-priority" className="label-text">Priority</label>
                    <select id="task-priority" className="select-field" value={formData.priority} onChange={e => setFormData(p => ({ ...p, priority: e.target.value as TimelineTask['priority'] }))}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="gold-button flex-1 text-sm"><Check size={14} /> Add Task</button>
                  <button type="button" onClick={() => setShowAddForm(false)} className="ghost-button text-sm"><X size={14} /> Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
