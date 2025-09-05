# Development Plan & TODO List

This document outlines the development plan for enhancing the Chat Dashboard application. The work is broken down into phases, with each phase containing specific, testable tasks.

---

### **Phase 1: Frontend Refactoring & Realtime Integration**

**Goal:** Improve the frontend architecture for better maintainability and implement a live, realtime user experience.

- [ ] **Task 1.1: Refactor Frontend JavaScript**
    - [ ] Move the main JavaScript block from `resources/views/layouts/app.blade.php` into its own dedicated file at `resources/js/chat.js`.
    - [ ] Ensure the new `chat.js` file is correctly imported and bundled by Vite.
    - [ ] **Test:** Verify that all existing chat functionality (loading contacts, viewing messages) works exactly as before the refactor.

- [ ] **Task 1.2: Implement Realtime Message Updates**
    - [ ] Integrate the Supabase JavaScript client.
    - [ ] Subscribe to the `messages` table for real-time inserts.
    - [ ] When a new message arrives, dynamically append it to the correct chat window if it's currently open.
    - [ ] **Test:** Open a chat, manually insert a new message for that contact in the Supabase dashboard, and confirm it appears in the UI instantly without a page refresh.

- [ ] **Task 1.3: Implement Realtime Contact List Updates**
    - [ ] Subscribe to the `contacts` table for real-time updates.
    - [ ] When a contact record changes (e.g., `last_message_preview`, `unread_count`), find the corresponding contact in the left sidebar and update its content.
    - [ ] Ensure the contact list automatically re-sorts to show the most recent interaction at the top.
    - [ ] **Test:** With the dashboard open, send a new message to a contact (triggering the database function to update the contact summary). Verify the contact's preview and unread count update instantly and the contact moves to the top of the list.

---

### **Phase 2: User Authentication & Security**

**Goal:** Secure the application by implementing a robust user authentication system and proper data authorization policies.

- [ ] **Task 2.1: Implement User Login**
    - [ ] Install and configure a Laravel starter kit (like Breeze or Jetstream) or manually build a login system that interfaces with Supabase Auth.
    - [ ] Create login, registration, and logout routes and views.
    - [ ] Protect the main chat dashboard route so it's only accessible to logged-in users.
    - [ ] **Test:** Confirm that unauthenticated users are redirected to the login page. Verify that users can register, log in, and log out successfully.

- [ ] **Task 2.2: Update Database Security Policies (RLS)**
    - [ ] Modify the Row Level Security (RLS) policies on the `contacts` and `messages` tables in Supabase.
    - [ ] Change the policies from the temporary `anon` or `authenticated` roles to user-specific policies (e.g., `auth.uid() = user_id`). This requires adding a `user_id` column to the `contacts` table.
    - [ ] **Test:** Create two different users. Add contacts for each. Log in as User A and confirm they can ONLY see their own contacts and messages. Log in as User B and confirm the same.

---

### **Phase 3: Core Chat Feature Enhancements**

**Goal:** Build out the essential interactive features required for a functional chat application.

- [ ] **Task 3.1: Implement "Send Message" Functionality**
    - [ ] Add an event listener to the message input form.
    - [ ] On submission, call the appropriate Supabase Edge Function (`send-facebook-agent-message` or `send-agent-whatsapp-message`) with the required payload.
    - [ ] Implement optimistic UI updates (show the message in the chat window immediately with a "sending" status).
    - [ ] Update the message status upon a successful response from the Edge Function.
    - [ ] **Test:** Send a text message and an image message. Verify they are saved to the database and the UI updates correctly.

- [ ] **Task 3.2: Implement "Mark as Read"**
    - [ ] When a user clicks on a contact to open a chat, call the `mark-chat-as-read` Supabase Edge Function.
    - [ ] On a successful response, the realtime update from Task 1.3 should automatically clear the unread count badge in the UI.
    - [ ] **Test:** Select a contact with unread messages. Confirm the unread badge disappears and the messages in the database are marked as read.

- [ ] **Task 3.3: Implement Frontend Error Handling**
    - [ ] Wrap all `fetch` calls to Supabase Edge Functions in `try...catch` blocks.
    - [ ] Display user-friendly error messages or visual indicators if an API call fails (e.g., "Failed to send message").
    - [ ] **Test:** Intentionally break an Edge Function (e.g., rename it) and try to send a message. Verify a user-friendly error is shown.

---

### **Phase 4: Advanced Features**

**Goal:** Build out the UI and logic for the bot and lead management features.

- [ ] **Task 4.1: AI Toggle & Contact Management**
    - [ ] Add a UI element (e.g., a toggle switch) in the right-hand sidebar to update a contact's `ai_enabled` status.
    - [ ] Add a UI element to allow editing a contact's name (`update-contact-name` function).
    - [ ] Add a "Delete Contact" button (`delete-contact-and-messages` function).
    - [ ] **Test:** Use the UI to toggle AI, rename a contact, and delete a contact. Verify the changes are reflected in the database and the UI.

- [ ] **Task 4.2: Lead & Queue Management UI**
    - [ ] Create a new page or modal to display data from the `leads` table.
    - [ ] Create a new page or modal to display data from the `queue` table.
    - [ ] **Test:** Manually add data to the `leads` and `queue` tables and confirm it is displayed correctly in the new UI.
