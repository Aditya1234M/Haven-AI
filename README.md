# Haven AI — GenAI Celebration & Event Planner

> **PromptWars Challenge 5**: A luxury GenAI-powered planning platform for organizing **Weddings & Receptions**, **Milestone Birthdays**, and **Community Festivals** with dynamic budgets, dual-view run-of-show timelines, vendor procurement pipelines, and personalized creative studio ideas.

---

## 🌟 Key Features

### 1. Multi-Event Archetypes
- 💍 **Weddings & Receptions**: Multi-ceremony planning, vendor milestone comparison, seating tiers, and guest budget allocation.
- 🎂 **Milestone Birthdays**: Thematic celebration setup, entertainment cues, DIY mixology/arcade activities, and party favor tracking.
- 🎪 **Community Events & Festivals**: Volunteer coordination, safety/permit checklists, and community stage run-of-show.

### 2. Four Anchor Modules
- 💰 **Dynamic Budget Intelligence**: Visual category allocation (Venue, Catering, Decor, Music, Logistics, Contingency), variance tracking (Estimated vs. Contracted vs. Paid), and automated per-guest spend metrics.
- 📅 **Dual-View Timeline & Run-of-Show**:
  - **Pre-Event Countdown**: Milestone scheduling (months/weeks/days out) with assignees and priority indicators.
  - **Day-Of Master Run-of-Show**: Hour-by-hour operational cues with precise execution orders.
- 👥 **Smart Vendor Hub & Procurement**:
  - **6-Stage Status Pipeline**: *Identified → Contacted → Quoted → Contract Signed → Deposit Paid → Completed*.
  - **Procurement Checklist**: Categorized task list with priority badges and completion states.
  - **AI Request for Proposal (RFP) Generator**: Category-tailored letters & interview question generator with one-click clipboard copying.
- ✨ **GenAI Personalized Ideas Studio**:
  - **Themes & Aesthetics**: Curated color palettes with 1-click hex copy, aesthetic keywords, and image concept prompts.
  - **Custom Invitation Copywriter**: Tone-adaptive invitations (*Formal 🎩, Whimsical ✨, Poetic 📜, Casual 🎉, WhatsApp/SMS RSVP 📱*) with an editable stationery preview card.
  - **Curated Activities & Music**: Demographic-targeted activities with direct *"Add to Run-of-Show"* integration.

### 3. Haven AI Co-Pilot
- Context-aware event strategist with dual-mode architecture:
  - **Evaluator Mode (Offline)**: Deterministic, hyper-realistic responses for zero-latency testing without external API keys.
  - **Live Gemini Mode**: Client-side Gemini 2.0 Flash integration with local in-memory key masking and zero server leakage.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS, Custom Glassmorphism Theme (Champagne Gold & Velvet Dark)
- **Icons & Animation**: Lucide React, Framer Motion
- **State & Storage**: Zustand with LocalStorage persistence & JSON Backup Export/Import
- **Testing**: Vitest (12/12 passing tests)
- **Deployment**: Docker, Nginx, Google Cloud Run ready

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
git clone https://github.com/Aditya1234M/Haven-AI.git
cd Haven-AI
npm install
```

### Running Locally
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Running Tests
```bash
npm test
```

### Production Build
```bash
npm run build
```

---

## 🐳 Docker & Cloud Run Deployment

Build and run locally with Docker:
```bash
docker build -t haven-ai .
docker run -p 8080:8080 haven-ai
```

Deploy directly to Google Cloud Run:
```bash
gcloud run deploy haven-ai --source . --region us-central1 --allow-unauthenticated
```
