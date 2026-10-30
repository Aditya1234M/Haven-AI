import { motion } from 'framer-motion';
import {
  Wallet,
  CalendarClock,
  Users,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  MapPin,
  Calendar,
  User,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency, getBudgetUtilization, getRemainingBudget, getTotalActual, getTotalPaid, getPerGuestCost, getTopCategories } from '../utils/budget';
import { BudgetCategoryLabels, BudgetCategoryColors, VendorStatusLabels, EventTypeIcons } from '../types';
import type { BudgetCategory } from '../types';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export function Dashboard() {
  const { getActiveEvent, setActiveTab } = useAppStore();
  const event = getActiveEvent();

  if (!event) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white/40">No event selected. Create or load an event to get started.</p>
      </div>
    );
  }

  const utilization = getBudgetUtilization(event);
  const remaining = getRemainingBudget(event);
  const totalActual = getTotalActual(event.budgetItems);
  const totalPaid = getTotalPaid(event.budgetItems);
  const perGuest = getPerGuestCost(event);
  const topCategories = getTopCategories(event.budgetItems, 5);

  const preEventTasks = event.timeline.filter(t => t.phase === 'pre-event');
  const dayOfTasks = event.timeline.filter(t => t.phase === 'day-of');
  const completedTasks = event.timeline.filter(t => t.completed).length;
  const totalTasks = event.timeline.length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const checklistDone = event.checklist.filter(c => c.completed).length;
  const checklistTotal = event.checklist.length;

  const daysUntilEvent = Math.max(0, Math.ceil((new Date(event.date).getTime() - Date.now()) / 86400000));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Event Header */}
      <motion.div {...fadeUp} className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-[80px]" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{EventTypeIcons[event.type]}</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white">{event.name}</h2>
            </div>
            <p className="text-sm text-white/40 max-w-xl mb-3">{event.description}</p>
            <div className="flex flex-wrap gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
              <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
              <span className="flex items-center gap-1"><User size={12} /> {event.guestCount} guests</span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-center p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <div className="font-display text-3xl font-bold gold-gradient-text">{daysUntilEvent}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Days to Go</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="stat-card cursor-pointer" onClick={() => setActiveTab('budget')}>
          <div className="flex items-center justify-between">
            <Wallet size={16} className="text-brand-gold" />
            {remaining >= 0
              ? <TrendingUp size={14} className="text-brand-emerald" />
              : <TrendingDown size={14} className="text-red-400" />
            }
          </div>
          <div className="font-display text-xl font-bold text-white">{formatCurrency(totalActual)}</div>
          <div className="text-xs text-white/40">of {formatCurrency(event.totalBudget)}</div>
          <div className="progress-bar mt-2">
            <div
              className={`progress-fill ${utilization > 100 ? 'bg-red-500' : utilization > 80 ? 'bg-amber-500' : 'bg-brand-gold'}`}
              style={{ width: `${Math.min(utilization, 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-white/30 mt-1">{utilization}% utilized</div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="stat-card cursor-pointer" onClick={() => setActiveTab('timeline')}>
          <div className="flex items-center justify-between">
            <CalendarClock size={16} className="text-brand-indigo-light" />
            <span className="badge-indigo text-[10px]">{completedTasks}/{totalTasks}</span>
          </div>
          <div className="font-display text-xl font-bold text-white">{taskProgress}%</div>
          <div className="text-xs text-white/40">Tasks Complete</div>
          <div className="progress-bar mt-2">
            <div className="progress-fill bg-brand-indigo-light" style={{ width: `${taskProgress}%` }} />
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="stat-card cursor-pointer" onClick={() => setActiveTab('vendors')}>
          <div className="flex items-center justify-between">
            <Users size={16} className="text-brand-emerald" />
            <span className="badge-emerald text-[10px]">{event.vendors.length}</span>
          </div>
          <div className="font-display text-xl font-bold text-white">{event.vendors.filter(v => v.status === 'contracted' || v.status === 'deposit_paid' || v.status === 'completed').length}</div>
          <div className="text-xs text-white/40">Vendors Secured</div>
          <div className="text-[10px] text-white/30 mt-2">
            {event.vendors.filter(v => v.status === 'quoted').length} awaiting decision
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.25 }} className="stat-card">
          <div className="flex items-center justify-between">
            <CheckCircle2 size={16} className="text-brand-rose" />
            <span className="badge-rose text-[10px]">{checklistDone}/{checklistTotal}</span>
          </div>
          <div className="font-display text-xl font-bold text-white">{checklistTotal > 0 ? Math.round((checklistDone / checklistTotal) * 100) : 0}%</div>
          <div className="text-xs text-white/40">Checklist Done</div>
          <div className="progress-bar mt-2">
            <div className="progress-fill bg-brand-rose" style={{ width: `${checklistTotal > 0 ? (checklistDone / checklistTotal) * 100 : 0}%` }} />
          </div>
        </motion.div>
      </div>

      {/* Budget Breakdown & Timeline */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Budget Category Breakdown */}
        <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-white">Budget Breakdown</h3>
            <button onClick={() => setActiveTab('budget')} className="text-xs text-brand-gold hover:text-brand-gold-light transition-colors">View All →</button>
          </div>
          {topCategories.length > 0 ? (
            <div className="space-y-3">
              {topCategories.map(({ category, total }) => {
                const pct = event.totalBudget > 0 ? Math.round((total / event.totalBudget) * 100) : 0;
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white/60">{BudgetCategoryLabels[category]}</span>
                      <span className="text-xs font-medium text-white/80">{formatCurrency(total)} ({pct}%)</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${pct}%`, backgroundColor: BudgetCategoryColors[category as BudgetCategory] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-white/30 text-center py-6">No budget items yet. Add some in the Budget tab.</p>
          )}
          <div className="mt-4 pt-3 border-t border-white/[0.06] grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xs text-white/40">Per Guest</div>
              <div className="text-sm font-semibold text-white">{formatCurrency(perGuest)}</div>
            </div>
            <div>
              <div className="text-xs text-white/40">Paid</div>
              <div className="text-sm font-semibold text-brand-emerald">{formatCurrency(totalPaid)}</div>
            </div>
            <div>
              <div className="text-xs text-white/40">Remaining</div>
              <div className={`text-sm font-semibold ${remaining >= 0 ? 'text-brand-gold' : 'text-red-400'}`}>
                {formatCurrency(Math.abs(remaining))}
                {remaining < 0 && <AlertTriangle size={10} className="inline ml-1" />}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Timeline */}
        <motion.div {...fadeUp} transition={{ delay: 0.35 }} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-white">Upcoming Tasks</h3>
            <button onClick={() => setActiveTab('timeline')} className="text-xs text-brand-gold hover:text-brand-gold-light transition-colors">View All →</button>
          </div>
          {event.timeline.length > 0 ? (
            <div className="space-y-2.5">
              {[...preEventTasks.filter(t => !t.completed).slice(0, 3), ...dayOfTasks.slice(0, 3)].map(task => (
                <div key={task.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    task.priority === 'critical' ? 'bg-red-400' :
                    task.priority === 'high' ? 'bg-amber-400' :
                    task.priority === 'medium' ? 'bg-blue-400' : 'bg-white/30'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-white/80 truncate">{task.title}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-white/40 flex items-center gap-1">
                        <Clock size={10} /> {task.dueLabel}
                      </span>
                      <span className="text-[10px] text-white/30">• {task.assignee}</span>
                    </div>
                  </div>
                  <span className={`badge text-[9px] ${
                    task.phase === 'pre-event' ? 'bg-brand-indigo/10 text-brand-indigo-light border border-brand-indigo/20' : 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                  }`}>
                    {task.phase === 'pre-event' ? 'Pre' : 'Day'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/30 text-center py-6">No timeline tasks yet. Add some in the Timeline tab.</p>
          )}
        </motion.div>
      </div>

      {/* Vendor Pipeline + Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Vendor Pipeline */}
        <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-white">Vendor Pipeline</h3>
            <button onClick={() => setActiveTab('vendors')} className="text-xs text-brand-gold hover:text-brand-gold-light transition-colors">Manage →</button>
          </div>
          {event.vendors.length > 0 ? (
            <div className="space-y-2.5">
              {event.vendors.slice(0, 5).map(vendor => (
                <div key={vendor.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-white/80 truncate">{vendor.name}</div>
                    <div className="text-[10px] text-white/40">{BudgetCategoryLabels[vendor.category]}</div>
                  </div>
                  <span
                    className="badge text-[9px]"
                    style={{
                      backgroundColor: `${vendor.status in VendorStatusLabels ? 'rgba(255,255,255,0.05)' : 'transparent'}`,
                      color: vendor.status === 'completed' ? '#22C55E' : vendor.status === 'deposit_paid' ? '#50C878' : vendor.status === 'contracted' ? '#D4A853' : '#94A3B8',
                      borderColor: vendor.status === 'completed' ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.1)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                    }}
                  >
                    {VendorStatusLabels[vendor.status]}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/30 text-center py-6">No vendors yet. Add some in the Vendors tab.</p>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div {...fadeUp} transition={{ delay: 0.45 }} className="glass-card p-5">
          <h3 className="font-display text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setActiveTab('ideas')} className="glass-card-hover p-4 text-left group">
              <Sparkles size={20} className="text-brand-gold mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-medium text-white/80">Generate Themes</div>
              <div className="text-[10px] text-white/30 mt-0.5">AI-powered ideas</div>
            </button>
            <button onClick={() => setActiveTab('chat')} className="glass-card-hover p-4 text-left group">
              <Sparkles size={20} className="text-brand-indigo-light mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-medium text-white/80">Ask AI Co-Pilot</div>
              <div className="text-[10px] text-white/30 mt-0.5">Budget & plan help</div>
            </button>
            <button onClick={() => setActiveTab('budget')} className="glass-card-hover p-4 text-left group">
              <Wallet size={20} className="text-brand-emerald mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-medium text-white/80">Add Expense</div>
              <div className="text-[10px] text-white/30 mt-0.5">Track spending</div>
            </button>
            <button onClick={() => setActiveTab('vendors')} className="glass-card-hover p-4 text-left group">
              <Users size={20} className="text-brand-rose mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-medium text-white/80">Add Vendor</div>
              <div className="text-[10px] text-white/30 mt-0.5">Manage pipeline</div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
