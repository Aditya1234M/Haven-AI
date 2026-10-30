import type { CelebrationEvent, ThemeIdea, InvitationDraft, ActivityIdea } from '../types';
import { sanitizeMarkdown } from '../utils/security';

// ─── Simulated AI Engine ─────────────────────────────────────
// Provides instant, deterministic, context-aware responses
// so evaluators can test without needing an external API key.

export function getEventContext(event: CelebrationEvent): string {
  return `${event.type} named "${event.name}" on ${event.date} with ${event.guestCount} guests, budget ₹${event.totalBudget.toLocaleString()}, at ${event.location}. Description: ${event.description}`;
}

export function simulateThemeIdeas(event: CelebrationEvent): ThemeIdea[] {
  const themes: Record<string, ThemeIdea[]> = {
    wedding: [
      {
        id: '', name: 'Enchanted Garden Romance',
        description: 'A lush, romantic garden theme with cascading florals, fairy lights woven through canopies, and soft pastel tones. The mandap features an arch of white roses and eucalyptus. Tables are adorned with vintage brass candleholders and moss runners.',
        colorPalette: ['#F8E8D4', '#C9A87C', '#8B6F47', '#4A7C59', '#F5F0EB'],
        keywords: ['romantic', 'garden', 'floral', 'ethereal', 'vintage brass'],
        aestheticVibe: 'Timeless elegance meets natural beauty — think soft golden hour light filtering through rose arches',
      },
      {
        id: '', name: 'Royal Mughal Splendor',
        description: 'An opulent celebration inspired by Mughal architecture — intricate jaali patterns, deep jewel-toned fabrics, gold leaf details, and massive floral chandeliers. The stage features towering pillar structures with marigold garlands and ornate mirror work.',
        colorPalette: ['#8B1A1A', '#D4A853', '#1A1A4E', '#2D5016', '#F5E6C8'],
        keywords: ['royal', 'mughal', 'opulent', 'jewel-toned', 'gold leaf'],
        aestheticVibe: 'Grand palatial luxury — the richness of a royal court meets modern celebration',
      },
      {
        id: '', name: 'Minimalist White & Gold',
        description: 'A sleek, contemporary wedding with clean white marble-inspired surfaces, geometric gold accents, and strategic greenery. Less is more — every element is intentional and breathtaking.',
        colorPalette: ['#FFFFFF', '#D4A853', '#1A1A1A', '#4A7C59', '#F5F5F5'],
        keywords: ['minimalist', 'modern', 'geometric', 'clean', 'sophisticated'],
        aestheticVibe: 'Instagram-worthy modern minimalism with luxurious gold touches',
      },
    ],
    birthday: [
      {
        id: '', name: 'Neon Cyberpunk Glow',
        description: 'A futuristic neon-lit celebration with LED strip lighting, holographic decor, and UV-reactive elements. Think cyberpunk city meets rave party. Guests get glow-in-the-dark accessories and neon face paint stations.',
        colorPalette: ['#FF00FF', '#00FFFF', '#FF6600', '#0A0A0A', '#7B00FF'],
        keywords: ['neon', 'cyberpunk', 'glow', 'futuristic', 'UV-reactive'],
        aestheticVibe: 'Electric, high-energy, and visually stunning — a party that glows',
      },
      {
        id: '', name: '90s Retro Nostalgia',
        description: 'Take it back to the 90s with pop culture references, cassette tape centerpieces, boombox decor, inflatable furniture, and a photo booth with 90s props. Music spans from Backstreet Boys to Bollywood hits of the era.',
        colorPalette: ['#FF1493', '#00CED1', '#FFD700', '#9400D3', '#32CD32'],
        keywords: ['retro', '90s', 'nostalgia', 'pop culture', 'colorful'],
        aestheticVibe: 'Fun, loud, and unapologetically nostalgic — pure 90s energy',
      },
      {
        id: '', name: 'Bohemian Sunset Soirée',
        description: 'A dreamy outdoor celebration with macramé hangings, terracotta pots, dried pampas grass, and warm sunset-inspired tones. Low seating with floor cushions and a live acoustic set as the sun goes down.',
        colorPalette: ['#E07A5F', '#F2CC8F', '#81B29A', '#3D405B', '#F4F1DE'],
        keywords: ['bohemian', 'sunset', 'organic', 'earthy', 'acoustic'],
        aestheticVibe: 'Warm, organic, and free-spirited — like a sunset in human form',
      },
    ],
    community: [
      {
        id: '', name: 'Cultural Mosaic Festival',
        description: 'A vibrant celebration of diversity with themed zones representing different cultures — each with its own food, art, and music. A central stage hosts performances from various traditions, connected by colorful fabric canopy pathways.',
        colorPalette: ['#E63946', '#457B9D', '#F4A261', '#2A9D8F', '#E9C46A'],
        keywords: ['multicultural', 'diversity', 'vibrant', 'interactive', 'zones'],
        aestheticVibe: 'A kaleidoscope of cultures united in one joyful celebration',
      },
      {
        id: '', name: 'Green Earth Eco-Festival',
        description: 'An eco-conscious event with bamboo structures, recycled material art installations, farm-to-table food stalls, and zero-waste stations. Solar-powered stages and seed-paper event passes that guests can plant at home.',
        colorPalette: ['#2D5016', '#8FBC8F', '#F5DEB3', '#8B4513', '#87CEEB'],
        keywords: ['eco-friendly', 'sustainable', 'green', 'organic', 'zero-waste'],
        aestheticVibe: 'Earth-conscious celebration that proves sustainability can be beautiful',
      },
      {
        id: '', name: 'Street Art & Music Block Party',
        description: 'Transform the venue into an urban art gallery with live mural painting, graffiti workshops, food trucks, and a multi-genre music lineup from hip-hop to electronic. Interactive art walls where attendees contribute to a collective mural.',
        colorPalette: ['#FF4500', '#1E90FF', '#FFD700', '#1A1A1A', '#FFFFFF'],
        keywords: ['urban', 'street art', 'graffiti', 'music', 'interactive'],
        aestheticVibe: 'Raw urban energy meets creative expression — the streets come alive',
      },
    ],
  };

  return (themes[event.type] ?? themes['wedding'] ?? []).map(t => ({ ...t }));
}

export function simulateInvitations(event: CelebrationEvent): InvitationDraft[] {
  const typeLabel = event.type === 'wedding' ? 'wedding' : event.type === 'birthday' ? 'birthday celebration' : 'community event';

  return [
    {
      id: '',
      tone: 'formal',
      content: `You are cordially invited to the ${event.name}\n\nWe request the honour of your gracious presence at the ${typeLabel} of the season.\n\n📅 Date: ${event.date}\n📍 Venue: ${event.location}\n👥 Guest Count: ${event.guestCount}\n\nKindly RSVP by [Date]. We look forward to celebrating this momentous occasion with you.\n\nWith warm regards,\nThe Hosts`,
    },
    {
      id: '',
      tone: 'whimsical',
      content: `✨ You're Invited to Something Magical! ✨\n\n${event.name} is happening and it wouldn't be the same without YOU! 🎉\n\nMark your calendars, grab your dancing shoes, and get ready for an unforgettable ${typeLabel}!\n\n🗓 When: ${event.date}\n📍 Where: ${event.location}\n🎊 What: The best party of ${new Date(event.date).getFullYear()}!\n\nRSVP and let's make some memories! 💫`,
    },
    {
      id: '',
      tone: 'poetic',
      content: `In the dance of time, some moments shine brighter —\nThis is one such moment, woven with love and light.\n\nWe invite you to witness and celebrate\n${event.name}\n\nWhere hearts gather and joy takes flight,\nAt ${event.location}\nOn the blessed day of ${event.date}\n\nYour presence would make our celebration complete.\nWith love and anticipation.`,
    },
    {
      id: '',
      tone: 'casual',
      content: `Hey! 👋\n\nWe're throwing a ${typeLabel} and you're on the VIP list!\n\n🎉 ${event.name}\n📅 ${event.date}\n📍 ${event.location}\n\nSeriously, it's going to be amazing. Don't miss it!\n\nDrop a quick reply to let us know you're coming. See you there! 🙌`,
    },
    {
      id: '',
      tone: 'rsvp_text',
      content: `📱 ${event.name} | ${event.date}\n\nHey! You're invited to our ${typeLabel} at ${event.location}! 🎊\n\nReply YES to confirm | NO if you can't make it\n\nWe'd love to see you there! ❤️`,
    },
  ];
}

export function simulateActivities(event: CelebrationEvent): ActivityIdea[] {
  const activities: Record<string, ActivityIdea[]> = {
    wedding: [
      { id: '', name: 'Mehndi Art Station', description: 'Professional mehndi artists offering intricate designs for all guests. Set up in a cozy, cushioned lounge area with chai and snacks.', timeSlot: 'Pre-ceremony (2-5 PM)', demographic: 'All guests' },
      { id: '', name: 'Sangeet Dance Battle', description: 'Choreographed group performances from both families, followed by an open dance floor competition with fun prizes.', timeSlot: 'Evening (7-10 PM)', demographic: 'All ages' },
      { id: '', name: 'Memory Lane Photo Walk', description: 'A curated gallery of couple photos from childhood to present, with QR codes linking to video messages from loved ones.', timeSlot: 'During cocktail hour', demographic: 'All guests' },
      { id: '', name: 'Couple Trivia Game', description: 'An interactive quiz about the couple — guests answer via their phones, and top scorers win personalized gifts.', timeSlot: 'Reception (8 PM)', demographic: 'Adults' },
    ],
    birthday: [
      { id: '', name: 'Retro Arcade Tournament', description: 'Competitive gaming on classic arcade machines — Pac-Man, Space Invaders, Street Fighter. Leaderboard displayed on a big screen.', timeSlot: 'Throughout the party', demographic: 'All ages' },
      { id: '', name: 'DIY Cocktail / Mocktail Bar', description: 'Interactive bar where guests create their own signature drinks with guidance from a mixologist.', timeSlot: 'Evening (7-10 PM)', demographic: 'Adults (mocktails for kids)' },
      { id: '', name: 'Karaoke Showdown', description: 'Birthday theme karaoke with decade-specific song challenges. Best performer wins a trophy.', timeSlot: '9:30 PM onwards', demographic: 'All guests' },
      { id: '', name: 'Time Capsule Station', description: 'Guests write messages, predictions, and wishes for the birthday person to open on their next milestone birthday.', timeSlot: 'Anytime during party', demographic: 'All guests' },
    ],
    community: [
      { id: '', name: 'Live Mural Painting', description: 'Local artists create a large-scale community mural live during the event. Attendees can contribute to designated sections.', timeSlot: 'All day', demographic: 'All ages' },
      { id: '', name: 'Cultural Workshop Circuit', description: 'Rotating 30-minute workshops: pottery, rangoli, origami, drum circles, and block printing. Each run by local artisans.', timeSlot: '11 AM - 4 PM', demographic: 'Families' },
      { id: '', name: 'Food Trail Challenge', description: 'A passport-style food trail where visitors collect stamps from each food stall. Complete passport = entry to raffle.', timeSlot: 'During food hours', demographic: 'All visitors' },
      { id: '', name: 'Community Talent Showcase', description: 'Open mic stage for local performers — singers, poets, dancers, comedians. 5-minute slots, audience votes for favorites.', timeSlot: '3 PM - 6 PM', demographic: 'All ages' },
    ],
  };

  return (activities[event.type] ?? activities['wedding'] ?? []).map(a => ({ ...a }));
}

export function simulateChatResponse(event: CelebrationEvent, userMessage: string): string {
  const msg = userMessage.toLowerCase();

  // Budget-related queries
  if (msg.includes('budget') || msg.includes('cost') || msg.includes('expensive') || msg.includes('save') || msg.includes('money')) {
    const totalActual = event.budgetItems.reduce((s, b) => s + b.actual, 0);
    const remaining = event.totalBudget - totalActual;
    const utilization = event.totalBudget > 0 ? Math.round((totalActual / event.totalBudget) * 100) : 0;

    return sanitizeMarkdown(`## 💰 Budget Analysis for ${event.name}

Here's your current budget snapshot:

| Metric | Value |
|--------|-------|
| **Total Budget** | ₹${event.totalBudget.toLocaleString()} |
| **Total Allocated** | ₹${totalActual.toLocaleString()} |
| **Remaining** | ₹${remaining.toLocaleString()} |
| **Utilization** | ${utilization}% |

### 💡 Smart Recommendations:
${remaining < 0
  ? `⚠️ **You're over budget by ₹${Math.abs(remaining).toLocaleString()}!** Here are some ways to optimize:
1. **Negotiate venue costs** — Ask about off-peak discounts or weekday rates
2. **Simplify decor** — Use statement pieces instead of extensive coverage (saves ~15-20%)
3. **Reduce guest count for sit-down portions** — Consider cocktail-style reception
4. **Bundle vendor services** — Many photographers offer combo deals with videography`
  : `✅ You're within budget with ₹${remaining.toLocaleString()} remaining. Consider:
1. **Allocate 10% to contingency** if you haven't already
2. **Upgrade photography** — This is the one investment you'll cherish forever
3. **Add a surprise element** — A sparkler exit, fireworks, or a flash mob performance
4. **Per-guest spend**: ₹${event.guestCount > 0 ? Math.round(totalActual / event.guestCount).toLocaleString() : '0'}/person`
}`);
  }

  // Timeline/schedule queries
  if (msg.includes('timeline') || msg.includes('schedule') || msg.includes('when') || msg.includes('plan') || msg.includes('checklist')) {
    const preEventTasks = event.timeline.filter(t => t.phase === 'pre-event');
    const dayOfTasks = event.timeline.filter(t => t.phase === 'day-of');
    const completedPre = preEventTasks.filter(t => t.completed).length;

    return sanitizeMarkdown(`## 📅 Timeline Overview for ${event.name}

### Pre-Event Progress: ${completedPre}/${preEventTasks.length} tasks done

**Upcoming Pre-Event Tasks:**
${preEventTasks.filter(t => !t.completed).slice(0, 5).map(t =>
  `- ⏳ **${t.title}** — ${t.dueLabel} (${t.priority} priority, assigned to ${t.assignee})`
).join('\n')}

### Day-of Run of Show (${dayOfTasks.length} cues):
${dayOfTasks.slice(0, 6).map(t =>
  `- 🕐 **${t.dueLabel}** — ${t.title} *(${t.assignee})*`
).join('\n')}

### 💡 Tips:
1. **Start vendor booking 6 months out** for the best availability
2. **Send invitations 6-8 weeks before** the event
3. **Do a full rehearsal 2 days before** — including vendor coordination
4. **Assign a day-of coordinator** so you can enjoy your event stress-free`);
  }

  // Vendor queries
  if (msg.includes('vendor') || msg.includes('caterer') || msg.includes('photographer') || msg.includes('dj') || msg.includes('florist')) {
    return sanitizeMarkdown(`## 🤝 Vendor Management for ${event.name}

**Current Vendor Pipeline:**
${event.vendors.length > 0
  ? event.vendors.map(v => `- **${v.name}** (${v.category}) — Status: *${v.status.replace('_', ' ')}* | Quote: ₹${v.quote.toLocaleString()} | Rating: ${'⭐'.repeat(v.rating)}`).join('\n')
  : '- No vendors added yet. Let me help you find the right ones!'}

### 📋 Vendor Interview Questions to Ask:
1. **Availability** — Are you available on ${event.date}?
2. **Package Details** — What's included in your base package vs. add-ons?
3. **Backup Plan** — What happens if you're unable to attend?
4. **References** — Can you share contacts of recent clients?
5. **Payment Terms** — What's your deposit and payment schedule?

### 💡 Pro Tips:
- Always get **3 quotes minimum** before committing
- Read contracts carefully — look for **cancellation and liability clauses**
- Ask for a **detailed breakdown**, not just a lump sum quote
- Book popular vendors **6-12 months in advance**`);
  }

  // Theme/decor queries
  if (msg.includes('theme') || msg.includes('decor') || msg.includes('color') || msg.includes('aesthetic') || msg.includes('design') || msg.includes('idea')) {
    return sanitizeMarkdown(`## 🎨 Creative Ideas for ${event.name}

Based on your ${event.type} with ${event.guestCount} guests at ${event.location}, here are personalized suggestions:

### Theme Concepts:
${event.type === 'wedding'
  ? `1. **Enchanted Garden** — Fairy lights, trailing florals, birdsong ambiance
2. **Royal Mughal** — Jewel tones, gold accents, ornate mirror work
3. **Modern Minimalist** — White + gold, geometric shapes, statement pieces`
  : event.type === 'birthday'
  ? `1. **Neon Nights** — UV paint, glow decor, LED everything
2. **Vintage Bollywood** — Retro posters, filmi music, themed photo ops
3. **Garden Brunch** — Pastel florals, macramé, farm-to-table menu`
  : `1. **Cultural Kaleidoscope** — Multi-zone cultural experiences
2. **Eco-Festival** — Sustainable materials, green installations
3. **Street Art Carnival** — Live murals, food trucks, urban energy`}

### Quick Design Tips:
- Use **odd numbers** in decor groupings (3 candles, 5 flowers)
- **Lighting is everything** — warm tones for intimate, cool for energetic
- **Create a photo moment** — one Instagrammable installation everyone remembers
- **Scent matters** — Fresh flowers or diffusers set the mood before guests even look around

💡 *Head to the Ideas Studio tab to generate detailed themes with color palettes!*`);
  }

  // Food/catering queries
  if (msg.includes('food') || msg.includes('menu') || msg.includes('cater') || msg.includes('cake') || msg.includes('drink') || msg.includes('bar')) {
    return sanitizeMarkdown(`## 🍽️ Catering & Menu Ideas for ${event.name}

For ${event.guestCount} guests, here's what I recommend:

### Menu Format Options:
| Style | Best For | Per-Plate Estimate |
|-------|----------|-------------------|
| **Sit-Down Dinner** | Elegant, intimate (< 100 guests) | ₹1,500 - 3,000 |
| **Buffet Spread** | Large gatherings (100+ guests) | ₹800 - 2,000 |
| **Food Stations** | Casual, interactive | ₹1,000 - 2,500 |
| **Cocktail Style** | Evening parties, networking | ₹600 - 1,500 |

### Recommended Menu Structure:
1. **Welcome Drinks** — Signature mocktail + classic options
2. **Starters** — 3 veg + 2 non-veg (passed around or station)
3. **Main Course** — 4-5 dishes with live counters (chaat, pasta, kebab)
4. **Desserts** — Custom cake + dessert table (gulab jamun, ice cream, pastries)

### 💡 Pro Tips:
- Order **10% extra** beyond headcount for safety
- Plan for **dietary restrictions** early (veg, vegan, gluten-free, Jain)
- **Tasting session** is non-negotiable — book 6 weeks before
- Keep **kids' menu simple** — nuggets, pasta, juice boxes`);
  }

  // Default contextual response
  return sanitizeMarkdown(`## ✨ How Can I Help with ${event.name}?

I'm your AI event planning co-pilot! Here's what I can help with:

### 🎯 Quick Actions:
- **"Analyze my budget"** — Get spending insights and optimization tips
- **"Review my timeline"** — See progress and upcoming milestones
- **"Vendor recommendations"** — Get interview questions and negotiation tips
- **"Theme ideas"** — Creative concepts with color palettes
- **"Menu suggestions"** — Catering recommendations for ${event.guestCount} guests
- **"Invitation wording"** — Draft invitations in any tone

### 📊 Your Event at a Glance:
- **Type:** ${event.type.charAt(0).toUpperCase() + event.type.slice(1)}
- **Date:** ${event.date}
- **Guests:** ${event.guestCount}
- **Budget:** ₹${event.totalBudget.toLocaleString()}
- **Location:** ${event.location}
- **Budget Items:** ${event.budgetItems.length} | **Timeline Tasks:** ${event.timeline.length} | **Vendors:** ${event.vendors.length}

Just type what you need and I'll give you tailored, actionable advice! 💫`);
}
