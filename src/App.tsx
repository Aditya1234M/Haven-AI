import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Upload,
  Printer,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import { useAppStore } from './store/useAppStore';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { BudgetTracker } from './components/BudgetTracker';
import { TimelineView } from './components/TimelineView';
import { VendorHub } from './components/VendorHub';
import { IdeasStudio } from './components/IdeasStudio';
import { AICoPilot } from './components/AICoPilot';
import { Onboarding } from './components/Onboarding';
import { EventTypeIcons, EventTypeLabels } from './types';

export function App() {
  const {
    activeTab,
    events,
    getActiveEvent,
    loadPreset,
    showOnboarding,
    aiConfig,
  } = useAppStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeEvent = getActiveEvent();

  // Export event as JSON file
  const handleExportJson = () => {
    if (!activeEvent) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeEvent, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeEvent.name.replace(/\s+/g, '_')}_HavenAI.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import event from JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = event => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.name && parsed.type) {
            useAppStore.setState(state => ({
              events: [...state.events, parsed],
              activeEventId: parsed.id,
              activeTab: 'dashboard',
            }));
          }
        } catch (err) {
          alert('Invalid JSON event file format.');
        }
      };
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-surface-50 text-white font-body selection:bg-brand-gold selection:text-black">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-64 right-0 h-96 bg-brand-gold/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-brand-indigo/[0.05] rounded-full blur-[140px] pointer-events-none" />

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-surface-100/80 backdrop-blur-xl px-6 py-3.5 print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/60 hover:text-white"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {activeEvent ? (
              <div className="flex items-center gap-2">
                <span className="text-xl">{EventTypeIcons[activeEvent.type]}</span>
                <div>
                  <h1 className="font-display font-bold text-sm text-white flex items-center gap-2">
                    {activeEvent.name}
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
                      {EventTypeLabels[activeEvent.type]}
                    </span>
                  </h1>
                </div>
              </div>
            ) : (
              <h1 className="font-display font-bold text-sm text-white/50">No Event Selected</h1>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {/* AI Status Badge */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                aiConfig.mode === 'live'
                  ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/20'
                  : 'bg-brand-gold/10 text-brand-gold border-brand-gold/20'
              }`}
            >
              <Zap size={12} />
              <span>{aiConfig.mode === 'live' ? 'Live Gemini 3.8' : 'Evaluator AI'}</span>
            </div>

            {/* Presets Quick Switcher */}
            <div className="hidden lg:flex items-center gap-1 bg-surface-200 p-1 rounded-xl border border-white/[0.06] text-xs">
              <span className="text-white/40 px-2 text-[10px] uppercase tracking-wider font-semibold">Load Preset:</span>
              <button
                onClick={() => loadPreset('wedding')}
                className="px-2 py-0.5 rounded-lg hover:bg-white/[0.06] text-white/80 transition-colors"
                title="Load Luxury Wedding Preset"
              >
                💍 Wedding
              </button>
              <button
                onClick={() => loadPreset('birthday')}
                className="px-2 py-0.5 rounded-lg hover:bg-white/[0.06] text-white/80 transition-colors"
                title="Load Neon 30th Birthday Preset"
              >
                🎂 Birthday
              </button>
              <button
                onClick={() => loadPreset('community')}
                className="px-2 py-0.5 rounded-lg hover:bg-white/[0.06] text-white/80 transition-colors"
                title="Load Community Festival Preset"
              >
                🎪 Festival
              </button>
            </div>

            {/* JSON Export/Import */}
            <button
              onClick={handleExportJson}
              className="btn-ghost text-xs py-1.5 px-3 border border-white/[0.06] hidden sm:flex items-center gap-1.5"
              title="Export event data to JSON"
            >
              <Download size={13} />
              <span>Export</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJson}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-ghost text-xs py-1.5 px-3 border border-white/[0.06] hidden sm:flex items-center gap-1.5"
              title="Import event data from JSON"
            >
              <Upload size={13} />
              <span>Import</span>
            </button>

            {/* Print / PDF Export */}
            <button
              onClick={handlePrint}
              className="btn-ghost text-xs py-1.5 px-3 border border-white/[0.06] flex items-center gap-1.5"
              title="Print Summary / Save PDF"
            >
              <Printer size={13} />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden border-b border-white/[0.08] bg-surface-100 p-4 space-y-2 z-40 sticky top-14"
            >
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['dashboard', 'budget', 'timeline', 'vendors', 'ideas', 'chat'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => {
                      useAppStore.getState().setActiveTab(tab);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left capitalize font-medium ${
                      activeTab === tab
                        ? 'border-brand-gold bg-brand-gold/15 text-brand-gold'
                        : 'border-white/[0.06] text-white/70'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic View Container */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'budget' && <BudgetTracker />}
              {activeTab === 'timeline' && <TimelineView />}
              {activeTab === 'vendors' && <VendorHub />}
              {activeTab === 'ideas' && <IdeasStudio />}
              {activeTab === 'chat' && <AICoPilot />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Onboarding Modal Overlay */}
      <AnimatePresence>
        {(showOnboarding || events.length === 0) && <Onboarding />}
      </AnimatePresence>
    </div>
  );
}
export default App;
