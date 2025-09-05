# 📌 New Development Plan & Feature Roadmap

This document is a **comprehensive TODO list** created after reviewing the existing plan (`TODO.MD`) and the Supabase Edge Function setup (`supabaseSetup.txt`).  
It consolidates and expands the roadmap based on current architecture, database schema, and implemented Supabase functions.

---

## **Phase 1: Frontend Refactoring & Realtime Integration** ✅ (partly done)

**Goal:** Improve the frontend architecture for maintainability while ensuring a realtime user experience.

- [ ] **1.1: Frontend Refactor**
  - [ ] Extract inline JS from Blade files into `resources/js/chat.js`.
  - [ ] Add module-based structure for contacts, messages, UI state.
  - [ ] Setup ESLint/Prettier and TypeScript for maintainability.

- [x] **1.2: Realtime Message Sync** (done)

- [x] **1.3: Realtime Contact Updates** (done)

- [ ] **1.4: UI Polishing**
  - [ ] Add consistently styled loading indicators.
  - [ ] Optimize rendering for large chat histories.
  - [ ] Add skeleton loaders for contact and message panels.

---

## **Phase 2: User Authentication & Security**

**Goal:** Secure access + User-specific data isolation.

- [ ] **2.1: Authentication**
  - [ ] Implement Supabase Auth or Laravel Breeze/Jetstream.
  - [ ] Hook login & registration with Supabase.
  - [ ] Role separation: Admin, Agent.

- [ ] **2.2: RLS Policies on Supabase**
  - [ ] Update contacts/messages RLS: `auth.uid() = user_id`.
  - [ ] Add `user_id` column to `contacts`, `messages`.
  - [ ] Test with multi-user dashboards.

- [ ] **2.3: Session Management**
  - [ ] Token refresh handling in frontend.
  - [ ] Logout from all devices.

---

## **Phase 3: Core Chat Features**

**Goal:** Build basic agent <-> customer communication.

- [ ] **3.1: Send Message (Edge Functions)**
  - [ ] Integrate `send-facebook-agent-message`.
  - [ ] Integrate `send-agent-whatsapp-message`.
  - [ ] Implement optimistic UI update + delivery status.

- [ ] **3.2: Read Receipts**
  - [ ] Connect `mark-chat-as-read`.
  - [ ] Display double-tick (sent/read) status.

- [ ] **3.3: Error Handling**
  - [ ] Global error boundary in UI.
  - [ ] Edge function retry for failures.
  - [ ] Show "failed to send" with retry button.

- [ ] **3.4: Attachment Support**
  - [ ] Send images, files, PDFs.
  - [ ] Handle previews and download links.

---

## **Phase 4: Advanced Features**

**Goal:** Enhance CRM + workflow management.

- [ ] **4.1: Contact Management**
  - [ ] AI toggle (`ai_enabled`).
  - [ ] Rename contact (`update-contact-name`).
  - [ ] Delete contact & related chat (`delete-contact-and-messages`).
  - [ ] Contact notes field (new column `notes`).

- [ ] **4.2: Lead & Queue Management**
  - [ ] Leads page: show clients from `leads` table.
  - [ ] Queue page: show pending agent responses from `queue` table.
  - [ ] Assign leads to agents with status updates.

- [ ] **4.3: Agent History**
  - [ ] Implement "history for the agent" table integration.
  - [ ] Search/filter agent session history.
  - [ ] Export history as CSV.

- [ ] **4.4: Multi-Platform Management**
  - [ ] Display platform icons in chat sidebar.
  - [ ] Filter chats by platform (Facebook/WhatsApp/Instagram).
  - [ ] Platform-specific reply templates.

---

## **Phase 5: Analytics & Reporting** 🚀 (new features)

**Goal:** Provide insights into usage and productivity.

- [ ] **5.1: Message Insights**
  - [ ] Count sent vs received messages.
  - [ ] Show average response time per agent.

- [ ] **5.2: Lead Conversion Funnel**
  - [ ] Track number of leads → chats → converted customers.
  - [ ] Visual dashboard with charts (Chart.js).

- [ ] **5.3: AI Performance Metrics**
  - [ ] % of AI-handled vs agent-handled conversations.
  - [ ] AI accuracy feedback loop.

---

## **Phase 6: Backup & Integrations**

**Goal:** Enhance reliability and external connections.

- [ ] **6.1: WhatsApp Contact Backup (done via edge function)**
  - [ ] UI to export WhatsApp contacts via `get-whatsapp-contacts-for-backup`.
  - [ ] Download as CSV/Excel.

- [ ] **6.2: External Integrations**
  - [ ] Salesforce or HubSpot sync.
  - [ ] Zapier/n8n automations.

- [ ] **6.3: Data Export**
  - [ ] Agent history export.
  - [ ] Chat transcript download in PDF.

---

## **Phase 7: Future Enhancements (Ideas)** ✨

- [ ] AI agent training interface (custom knowledge base).
- [ ] Chatbot workflows (auto-FAQ responses).
- [ ] WebSocket fallback for Supabase realtime connection.
- [ ] Multi-language support (i18n).
- [ ] Dark/light theme toggle.
- [ ] Mobile app with same API (React Native/Flutter).
- [ ] Notifications system (new message popups, browser notifications).
- [ ] Voice note support (record & playback).