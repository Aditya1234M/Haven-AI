import { GoogleGenAI } from '@google/genai';
import type { CelebrationEvent } from '../types';
import { sanitizeMarkdown } from '../utils/security';
import {
  simulateThemeIdeas,
  simulateInvitations,
  simulateActivities,
  simulateChatResponse,
} from './simulatedAI';

// ─── Live Gemini AI Service ──────────────────────────────────

function buildSystemPrompt(event: CelebrationEvent): string {
  return `You are Haven AI, a luxury celebration and event planning assistant. You are helping plan a ${event.type} event called "${event.name}".

Event Details:
- Type: ${event.type}
- Date: ${event.date}
- Guest Count: ${event.guestCount}
- Total Budget: ₹${event.totalBudget.toLocaleString()}
- Location: ${event.location}
- Description: ${event.description}

Current Budget Items: ${JSON.stringify(event.budgetItems.map(b => ({ name: b.name, category: b.category, estimated: b.estimated, actual: b.actual })))}
Current Timeline Tasks: ${event.timeline.length} tasks (${event.timeline.filter(t => t.completed).length} completed)
Current Vendors: ${event.vendors.map(v => `${v.name} (${v.status})`).join(', ') || 'None yet'}

Instructions:
- Provide specific, actionable advice tailored to this event
- Use markdown formatting with headers, tables, lists, and emojis
- Be warm, professional, and creative
- When discussing budget, always reference actual numbers
- Suggest practical solutions, not generic advice
- Keep responses concise but comprehensive`;
}

export async function sendLiveChat(
  apiKey: string,
  event: CelebrationEvent,
  userMessage: string,
): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        { role: 'user', parts: [{ text: buildSystemPrompt(event) }] },
        { role: 'model', parts: [{ text: 'I understand! I\'m Haven AI, ready to help plan your event. How can I assist you?' }] },
        { role: 'user', parts: [{ text: userMessage }] },
      ],
    });

    const text = response.text ?? 'I apologize, I wasn\'t able to generate a response. Please try again.';
    return sanitizeMarkdown(text);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`AI service error: ${message}`);
  }
}

export async function generateLiveThemes(
  apiKey: string,
  event: CelebrationEvent,
): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [{
            text: `${buildSystemPrompt(event)}

Generate 3 unique, creative theme ideas for this event. For each theme provide:
1. Theme name
2. Detailed description (3-4 sentences)
3. Color palette (5 hex colors)
4. 5 aesthetic keywords
5. Vibe description (1 sentence)

Format as markdown with clear sections for each theme. Use emojis and make it inspiring.`,
          }],
        },
      ],
    });

    return sanitizeMarkdown(response.text ?? 'Unable to generate themes.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Theme generation error: ${message}`);
  }
}

// ─── Unified AI Interface ────────────────────────────────────

export interface AIService {
  chat: (event: CelebrationEvent, message: string) => Promise<string>;
  getThemes: (event: CelebrationEvent) => ReturnType<typeof simulateThemeIdeas>;
  getInvitations: (event: CelebrationEvent) => ReturnType<typeof simulateInvitations>;
  getActivities: (event: CelebrationEvent) => ReturnType<typeof simulateActivities>;
}

export function createAIService(mode: 'live' | 'simulated', apiKey: string): AIService {
  if (mode === 'live' && apiKey) {
    return {
      chat: (event, message) => sendLiveChat(apiKey, event, message),
      getThemes: (event) => simulateThemeIdeas(event),
      getInvitations: (event) => simulateInvitations(event),
      getActivities: (event) => simulateActivities(event),
    };
  }

  return {
    chat: async (event, message) => simulateChatResponse(event, message),
    getThemes: (event) => simulateThemeIdeas(event),
    getInvitations: (event) => simulateInvitations(event),
    getActivities: (event) => simulateActivities(event),
  };
}
