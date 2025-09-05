# Project Overview

This project is a multi-platform chat dashboard designed to centralize conversations from services like WhatsApp and Facebook. It features a hybrid architecture that leverages the strengths of both a traditional PHP backend and a modern serverless platform.

*   **Initial Rendering Backend:** A **Laravel 12** application serves the initial user interface. Its primary role is to render the main Blade template that contains the application's HTML shell and frontend assets.
*   **Core API & Database Backend:** **Supabase** serves as the core of the application.
    *   **Database:** A **PostgreSQL** database on Supabase is the single source of truth for all data, including contacts and messages. It contains advanced database logic, such as triggers for automatically updating contact summaries.
    *   **API Layer:** The primary application logic is handled by a suite of **Supabase Edge Functions** written in TypeScript/Deno. These serverless functions manage all real-time data operations, such as fetching messages, sending new messages, and updating contact details.
    *   **Realtime:** Supabase Realtime is enabled on the `contacts` and `messages` tables, allowing the frontend to receive live updates for new messages and changes.
*   **External Services & Automation:** **n8n** is used as a workflow automation tool to handle the complexities of sending outbound messages to third-party platforms like Facebook and WhatsApp. It also contains the core logic for the AI-powered chatbot.

---

## Architecture & Data Flow

The application's logic is split between the Laravel backend, the Supabase serverless environment, and n8n workflows.

#### **1. Initial Page Load**
1.  A user navigates to the application's root URL.
2.  The request hits the Laravel application's `routes/web.php`.
3.  The route is handled by the `ChatController@index` method.
4.  The controller performs an initial query to the Supabase database to fetch the list of all contacts.
5.  Laravel renders the master view at `resources/views/layouts/app.blade.php`, injecting the initial contact list into the HTML.
6.  The user's browser receives the fully-formed HTML page.

#### **2. Interactive Chat Operations (Client-Side)**
1.  **Fetching Messages:** When a user clicks on a contact, the frontend JavaScript **does not** call the Laravel backend. Instead, it directly invokes the `get-messages-for-contact` Supabase Edge Function, passing the contact's UUID. The function returns the chat history as JSON, which the frontend then renders.
2.  **Sending a Message:** The frontend calls the appropriate Supabase Edge Function (`send-facebook-agent-message` or `send-agent-whatsapp-message`).
    *   The Edge Function first saves the new message to the `messages` table in the Supabase database.
    *   It then makes an asynchronous webhook call to an n8n workflow.
    *   n8n receives the webhook and is responsible for actually delivering the message to the external platform (e.g., Facebook).
3.  **Receiving a Message (Realtime):** The frontend client subscribes to realtime updates from the `messages` table via the Supabase JavaScript library. When a new message is inserted into the database (e.g., by an incoming webhook from n8n), Supabase pushes the new data directly to the client, allowing the UI to update instantly without polling.

---

## Key Components

#### **Laravel Backend (View Layer)**
*   `.env`: Contains the critical database credentials for connecting to Supabase.
*   `app/Http/Controllers/ChatController.php`: The primary controller. `index()` loads the initial contact list; `show()` provides an API endpoint for fetching messages (though this may be superseded by the Edge Function).
*   `app/Models/Contact.php` & `Message.php`: Eloquent models configured with the `HasUuids` trait to correctly interface with the PostgreSQL tables.
*   `routes/web.php` & `api.php`: Define the initial page load route and API endpoints.
*   `resources/views/layouts/app.blade.php`: The master UI template. Contains the HTML structure, Blade loops for the initial contact list, and all of the client-side JavaScript for interactivity.

#### **Supabase Backend (Core Logic Layer)**
*   **Database Tables:**
    *   `contacts`: Stores contact information, including platform-specific IDs.
    *   `messages`: Stores all chat history, linked to a contact.
    *   `leads`, `queue`, `ai_wisdom_history`: Additional tables for bot and lead management, likely used by n8n workflows.
*   **Database Logic:**
    *   A key trigger, `update_contact_summary_on_message`, runs after any change to the `messages` table. It automatically recalculates and updates the parent contact's `last_message_preview`, `last_interaction_at`, and `unread_count` fields.
*   **Edge Functions:**
    *   `get-contacts`: Fetches and returns the list of all contacts.
    *   `get-messages-for-contact`: Fetches the full message history for a single contact.
    *   `mark-chat-as-read`: Updates the `is_read_by_agent` flag for all messages in a chat.
    *   `send-facebook-agent-message`: Saves an agent's message and triggers the Facebook n8n webhook.
    *   `send-agent-whatsapp-message`: Saves an agent's message and triggers the WhatsApp n8n webhook.
    *   `update-contact-name`: Allows for editing a contact's name.
    *   `delete-contact-and-messages`: Deletes a contact and all of their associated messages (leveraging `ON DELETE CASCADE`).

#### **n8n Workflows (Automation & AI)**
*   The `workflow.txt` file defines a complex n8n workflow that acts as the core of the application's backend logic for handling incoming messages.
*   **Message Ingestion:** The workflow starts with a webhook that receives incoming messages from Facebook Messenger.
*   **Content Analysis:** It uses a Switch node to determine the type of message (text, image, audio).
    *   **Audio:** Audio messages are transcribed using the Google Gemini API.
    *   **Images:** Images are analyzed by a Google Gemini Chat Model to generate a description.
*   **AI-Powered Responses:** The workflow uses a LangChain agent with a Google Gemini model to generate AI-powered responses to user messages. The agent has a detailed system prompt that instructs it to act as a friendly and helpful customer service agent for a dental clinic.
*   **Database Interaction:** The workflow interacts with the Supabase database to:
    *   Create new contacts if they don't exist.
    *   Save incoming messages to the `messages` table.
    *   Save AI-generated responses to the `messages` table.
    *   Manage a message queue in the `queue` table.
    *   Store leads in the `leads` table.
*   **Message Sending:** The workflow uses the Facebook Graph API to send messages back to the user.

---

## Running the Project

This project requires running two separate parts of the stack.

#### **1. Running the Laravel Frontend**
1.  Install PHP dependencies: `composer install`
2.  Install frontend assets (if any are managed by npm): `npm install`
3.  Create your environment file: `cp .env.example .env`
4.  Update `.env` with your Supabase Database credentials (`DB_CONNECTION=pgsql`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).
5.  Generate the application key: `php artisan key:generate`
6.  Start the local development server: `php artisan serve`

#### **2. Deploying the Supabase Backend**
1.  Install the Supabase CLI.
2.  Link your local project to your Supabase project: `supabase link --project-ref <your-project-ref>`
3.  Set the required secrets (environment variables) for the Edge Functions. These are critical for them to run.
    ```bash
    supabase secrets set SUPABASE_URL=<your-project-url>
    supabase secrets set SUPABASE_ANON_KEY=<your-anon-key>
    supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
    supabase secrets set N8N_MESSAGE_SEND_WEBHOOK_URL=<your-n8n-facebook-webhook>
    supabase secrets set N8N_WHATSAPP_SENDER_WEBHOOK_URL=<your-n8n-whatsapp-webhook>
    supabase secrets set WABA_BUSINESS_PHONE_ID=<your-whatsapp-business-phone-id>
    ```
4.  Deploy the Edge Functions: `supabase functions deploy`

---

## Future Work & TODOs

Based on the project's current state, here are the next logical steps:

*   **Implement Authentication:** Replace the temporary `anon` role database policies with a proper user authentication system (e.g., Supabase Auth). The frontend should require a user to log in.
*   **Refactor Frontend JavaScript:** Move the large block of JavaScript from `app.blade.php` into a separate, version-controlled file (e.g., `resources/js/chat.js`) and include it via the asset pipeline.
*   **Integrate Supabase Realtime Client:** Fully implement the Supabase JS client on the frontend to listen for realtime database changes, ensuring the UI updates instantly when new messages arrive or contacts are updated.
*   **Develop Bot/AI Features:** Build out the functionality related to the `ai_wisdom_history` table and the `ai_enabled` flag on contacts.
*   **Lead Management:** Create the UI and logic to interact with the `leads` and `queue` tables.
*   **Error Handling:** Enhance the frontend JavaScript to gracefully handle potential errors from the Supabase Edge Function calls and provide feedback to the user.