import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Key,
  ShieldCheck,
  Zap,
  Check,
  Copy,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAppStore } from '../store/useAppStore';
import { createAIService } from '../services/aiService';
import { maskApiKey } from '../utils/security';

const quickPrompts = [
  'Audit my current budget and suggest cost savings',
  'Recommend 3 unique guest activities for this event',
  'Help me structure a day-of run of show schedule',
  'What key vendor questions should I ask before signing?',
  'Suggest surprise moments or memorable exit ideas',
];

export function AICoPilot() {
  const {
    getActiveEvent,
    chatMessages,
    addChatMessage,
    clearChat,
    aiConfig,
    setAIConfig,
  } = useAppStore();

  const event = getActiveEvent();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(aiConfig.apiKey || '');
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, loading]);

  if (!event) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    setInputText('');
    addChatMessage('user', text);
    setLoading(true);

    try {
      const aiService = createAIService(aiConfig.mode, aiConfig.apiKey);
      const response = await aiService.chat(event, text);
      addChatMessage('assistant', response);
    } catch (err: any) {
      addChatMessage(
        'assistant',
        `⚠️ **Error communicating with AI service:** ${err.message || 'Unknown error'}. You can switch to **Evaluator Mode** for instant, offline simulated responses.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setAIConfig({ apiKey: tempApiKey.trim(), mode: tempApiKey.trim() ? 'live' : 'simulated' });
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2000);
  };

  const handleCopyMessage = (idx: number, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="section-title flex items-center gap-2">
            <Bot size={22} className="text-brand-gold" /> Haven AI Co-Pilot
          </h2>
          <p className="text-sm text-white/40 mt-1">
            Context-aware event strategist with live budget, vendor, and timeline intelligence
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Mode Selector */}
          <div className="flex rounded-xl bg-surface-200 p-1 border border-white/[0.06]">
            <button
              onClick={() => setAIConfig({ mode: 'simulated' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                aiConfig.mode === 'simulated'
                  ? 'bg-brand-gold text-surface-50 font-semibold shadow-gold'
                  : 'text-white/50 hover:text-white'
              }`}
              title="Deterministic offline engine for fast evaluation without external API keys"
            >
              <Zap size={13} /> Evaluator Mode (Offline)
            </button>

            <button
              onClick={() => setAIConfig({ mode: 'live' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                aiConfig.mode === 'live'
                  ? 'bg-brand-gold text-surface-50 font-semibold shadow-gold'
                  : 'text-white/50 hover:text-white'
              }`}
              title="Connect client-side Gemini 2.0 Flash API"
            >
              <Key size={13} /> Live Gemini Mode
            </button>
          </div>

          {chatMessages.length > 0 && (
            <button
              onClick={clearChat}
              className="btn-ghost text-xs py-2 px-3 border border-white/[0.06] flex items-center gap-1.5 text-white/50 hover:text-red-400"
              title="Clear Conversation"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Live API Key Vault Drawer (if Live Mode) */}
      {aiConfig.mode === 'live' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card p-4 border-brand-gold/30 bg-surface-200/90"
        >
          <form onSubmit={handleSaveApiKey} className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-brand-gold flex-shrink-0">
              <ShieldCheck size={16} />
              <span className="font-semibold">Gemini API Key Vault:</span>
            </div>

            <input
              type="password"
              placeholder="Paste your Google Gemini API key (AIzaSy...)"
              value={tempApiKey}
              onChange={e => setTempApiKey(e.target.value)}
              className="flex-1 bg-surface-300 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/20 focus:border-brand-gold focus:outline-none w-full"
            />

            <button type="submit" className="btn-gold text-xs py-1.5 px-4 flex-shrink-0 flex items-center gap-1">
              {apiKeySaved ? <Check size={12} /> : null}
              {apiKeySaved ? 'Saved in Memory' : 'Activate Live Key'}
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-white/40 mt-2 px-1">
            <span>🔒 Key remains strictly client-side in RAM and is never logged or saved to server.</span>
            {aiConfig.apiKey && <span>Active: {maskApiKey(aiConfig.apiKey)}</span>}
          </div>
        </motion.div>
      )}

      {/* Main Chat Frame */}
      <div className="glass-card h-[600px] flex flex-col justify-between overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {chatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-gold mb-4">
                <Sparkles size={24} className="text-surface-50" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                How can I assist your {event.type} planning?
              </h3>
              <p className="text-xs text-white/50 leading-relaxed mb-6">
                I have full awareness of "{event.name}" — including your {event.guestCount} guests, budget of ₹{event.totalBudget.toLocaleString()}, and current vendors.
              </p>

              <div className="w-full space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-wider text-white/40 mb-2">
                  Suggested Prompts to Start:
                </div>
                {quickPrompts.slice(0, 3).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="w-full text-left p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-brand-gold/40 hover:bg-white/[0.04] text-xs text-white/80 transition-all flex items-center justify-between group"
                  >
                    <span>{prompt}</span>
                    <Sparkles size={12} className="text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {chatMessages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-gold flex items-center justify-center text-surface-50 flex-shrink-0 shadow-gold mt-1">
                      <Sparkles size={14} />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed relative group ${
                      msg.role === 'user'
                        ? 'bg-brand-gold/15 border border-brand-gold/30 text-white font-medium rounded-tr-sm'
                        : 'bg-surface-200/90 border border-white/[0.08] text-white/90 rounded-tl-sm'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-invert prose-xs max-w-none prose-p:leading-relaxed prose-headings:font-display prose-table:border prose-th:bg-white/[0.05] prose-td:border-white/[0.06]">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}

                    {/* Copy action on assistant message */}
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => handleCopyMessage(idx, msg.content)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-surface-300 text-white/30 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy Response"
                      >
                        {copiedIndex === idx ? <Check size={12} className="text-brand-emerald" /> : <Copy size={12} />}
                      </button>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-surface-300 border border-white/[0.08] flex items-center justify-center text-white/60 flex-shrink-0 mt-1">
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3.5 items-center text-xs text-white/40">
                  <div className="w-8 h-8 rounded-xl bg-gradient-gold flex items-center justify-center text-surface-50 flex-shrink-0 shadow-gold animate-pulse">
                    <Sparkles size={14} />
                  </div>
                  <div className="glass-card px-4 py-2.5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-bounce" style={{ animationDelay: '0.4s' }} />
                    <span className="text-[11px] text-white/50 ml-1">Thinking and analyzing event metrics...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Bar & Quick Prompts */}
        <div className="p-4 border-t border-white/[0.06] bg-surface-200/50 space-y-3">
          {/* Quick Prompts Bar */}
          {chatMessages.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(p)}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/60 hover:text-white hover:border-brand-gold/30 whitespace-nowrap flex-shrink-0 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask anything about ${event.name} (e.g. "How can we cut 15% off catering?")...`}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              disabled={loading}
              className="flex-1 bg-surface-300 border border-white/[0.08] rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-white/30 focus:border-brand-gold focus:outline-none"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="btn-gold p-3 rounded-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-gold"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
