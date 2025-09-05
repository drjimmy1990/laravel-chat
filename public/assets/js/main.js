import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// --- 1. Initialize Supabase ---
const supabaseUrl = document.querySelector('meta[name="supabase-url"]').getAttribute('content');
const supabaseAnonKey = document.querySelector('meta[name="supabase-anon-key"]').getAttribute('content');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing. Make sure to set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file and add the meta tags to your Blade layout.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function for security to prevent XSS attacks
function escapeHTML(str) {
    if (!str) return '';
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
}
function getPlatformAvatar(platform) {
    let svg = '';
    // Default icon
    let defaultIcon = `
        <div class="tyn-media tyn-size-lg tyn-circle">
            <img src="/images/avatar/1.jpg" alt="">
        </div>`;

    switch (platform) {
        case 'whatsapp':
            svg = `
                <div class="tyn-media tyn-size-lg tyn-circle">
                    <div class="tyn-media-app bg-success text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                        </svg>
                    </div>
                </div>`;
            break;
        case 'facebook':
            svg = `
                <div class="tyn-media tyn-size-lg tyn-circle">
                    <div class="tyn-media-app bg-primary text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                        </svg>
                    </div>
                </div>`;
            break;
        default:
            svg = `
                <div class="tyn-media tyn-size-lg tyn-circle">
                    <div class="tyn-media-app bg-secondary text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-dots-fill" viewBox="0 0 16 16">
                           <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                        </svg>
                    </div>
                </div>`;
    }
    return svg;
}

function createContactInSidebar(contact) {
    const contactList = document.querySelector('.tyn-aside-list');
    if (!contactList) return;

    // Remove placeholder if it exists
    const placeholder = contactList.querySelector('p');
    if (placeholder && placeholder.textContent.includes('No contacts')) {
        contactList.innerHTML = '';
    }

    const name = (contact.name && contact.name.trim().length > 1) ? contact.name : contact.platform_user_id;
    const preview = (contact.last_message_preview || '').substring(0, 25) + ((contact.last_message_preview || '').length > 25 ? '...' : '');

    let badgeHtml = '';
    if (contact.unread_count > 0) {
        badgeHtml = `<div class="badge bg-primary rounded-pill">${contact.unread_count}</div>`;
    }

    const newContactHtml = `
        <li id="contact-${contact.id}" data-id="${contact.id}" class="tyn-aside-item js-toggle-main contact-item" style="cursor: pointer;">
            <div class="tyn-media-group">
                ${getPlatformAvatar(contact.platform)}
                <div class="tyn-media-col">
                    <div class="tyn-media-row">
                        <h6 class="name">${escapeHTML(name)}</h6>
                    </div>
                    <div class="tyn-media-row has-dot-sap">
                        <p class="content">${escapeHTML(preview)}</p>
                        ${badgeHtml}
                    </div>
                </div>
            </div>
        </li>
    `;

    contactList.insertAdjacentHTML('afterbegin', newContactHtml);
}

function updateContactInSidebar(contact) {
    const contactElement = document.getElementById(`contact-${contact.id}`);
    if (!contactElement) return;

    const previewElement = contactElement.querySelector('.content');
    const badgeElement = contactElement.querySelector('.badge');

    if (previewElement) {
        // Simple string truncation for the preview
        const previewText = contact.last_message_preview || '';
        previewElement.textContent = previewText.length > 25 ? previewText.substring(0, 25) + '...' : previewText;
    }

    if (badgeElement) {
        if (contact.unread_count > 0) {
            badgeElement.textContent = contact.unread_count;
            badgeElement.style.display = '';
        } else {
            badgeElement.style.display = 'none';
        }
    } else if (contact.unread_count > 0) {
        // If the badge doesn't exist, create it
        const newBadge = document.createElement('div');
        newBadge.className = 'badge bg-primary rounded-pill';
        newBadge.textContent = contact.unread_count;
        const mediaRow = contactElement.querySelector('.has-dot-sap');
        if (mediaRow) {
            mediaRow.appendChild(newBadge);
        }
    }

    // Move the updated contact to the top of the list
    const parentList = contactElement.parentNode;
    parentList.prepend(contactElement);
}

document.addEventListener('DOMContentLoaded', function () {
    
    let currentContactId = null;
    let messageSubscription = null;

    // --- 2. Get references to all essential HTML elements ---
    const chatBody = document.getElementById('tynReply');          // container for messages
    const chatScrollContainer = document.getElementById('tynChatBody'); // scrollable container
    const headerName = document.getElementById('header-name');
    const headerAvatarLg = document.getElementById('header-avatar-lg');
    const asideName = document.getElementById('aside-name');
    const asideAvatar = document.getElementById('aside-avatar');
    const aiToggle = document.getElementById('ai-toggle-switch');
    const renameButton = document.getElementById('rename-contact-btn');
    const renameInput = document.getElementById('new-contact-name');
    const deleteButton = document.getElementById('delete-contact-btn');
    const revertButton = document.getElementById('revert-name-btn');
    
    if (!chatBody || !headerName || !headerAvatarLg || !asideName || !asideAvatar || !aiToggle || !renameButton || !renameInput || !deleteButton || !revertButton) {
        console.error("CRITICAL ERROR: One or more essential HTML elements are missing an ID.");
        return;
    }

    // --- 3. Add a single, efficient click listener to the contacts list ---
    const contactListContainer = document.querySelector('.tyn-aside-list');
    if (contactListContainer) {
        contactListContainer.addEventListener('click', function(event) {
            const contactItem = event.target.closest('.contact-item');
            if (contactItem) {
                event.preventDefault();
                handleContactClick(contactItem);
            }
        });
    }

    // --- 4. Function to handle the logic when a contact is clicked ---
    function handleContactClick(contactElement) {
        const contactId = contactElement.dataset.id;
        currentContactId = contactId;

        document.querySelectorAll('.contact-item').forEach(i => i.classList.remove('active'));
        contactElement.classList.add('active');
        
        chatBody.innerHTML = '<p class="p-5 text-center">Loading messages...</p>';
        
        // Unsubscribe from previous channel if it exists
        if (messageSubscription) {
            supabase.removeChannel(messageSubscription);
            messageSubscription = null;
        }

        // Mark chat as read by invoking the Supabase Edge Function
        supabase.functions.invoke('mark-chat-as-read', {
            body: { contact_id: contactId }
        }).then(response => {
            if (response.error) {
                console.error('Error marking chat as read:', response.error);
            } else {
                console.log('Chat marked as read:', response.data);
                // Optionally, update the UI to remove the unread badge immediately
                const contactBadge = contactElement.querySelector('.badge');
                if (contactBadge) {
                    contactBadge.style.display = 'none';
                }
            }
        });

        fetch(`/api/contacts/${contactId}`)
            .then(response => {
                if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
                return response.json();
            })
            .then(data => {
                updateChatUI(data);
                // After loading historical messages, subscribe to new ones
                subscribeToMessages(contactId);
            })
            .catch(error => {
                console.error('Error fetching contact data:', error);
                chatBody.innerHTML = '<p class="p-5 text-center text-danger">Failed to load messages.</p>';
            });
    }

    // --- 5. Main function to update the entire chat interface ---
    function updateChatUI(data) {
        const contact = data.contact;
        const messages = data.messages;
        const defaultAvatar = '/images/avatar/1.jpg';
        const contactAvatar = contact.avatar_url || defaultAvatar;

        headerName.textContent = contact.name || contact.platform_user_id;
        headerAvatarLg.src = contactAvatar;
        const headerAvatarSm = document.getElementById('header-avatar-sm');
        if (headerAvatarSm) headerAvatarSm.src = contactAvatar;
        asideName.textContent = contact.name || contact.platform_user_id;
        asideAvatar.src = contactAvatar;
        aiToggle.checked = contact.ai_enabled;

        chatBody.innerHTML = '';

        if (messages && messages.length > 0) {
            // Do not reverse, keep natural chronological order
            messages.forEach(message => {
                const messageHtml = buildMessageHtml(message, contactAvatar);
                appendMessage(messageHtml);
            });
            // Force scroll to bottom after rendering
            setTimeout(scrollToBottom, 100);
        } else {
            chatBody.innerHTML = '<p class="p-5 text-center">No messages in this conversation yet.</p>';
        }
    }

    // --- 6. Function to build the HTML for a single message bubble ---
    function buildMessageHtml(message, contactAvatar) {
        let bubbleContent = '';
        const contentType = message.content_type || 'text';
        const textContent = message.text_content || '';
        const attachmentUrl = message.attachment_url || '';

        switch (contentType) {
            case 'image':
                bubbleContent = `
                    <div style="padding: 5px;">
                        <a href="${escapeHTML(attachmentUrl)}" target="_blank">
                            <img src="${escapeHTML(attachmentUrl)}"
                                 style="max-width: 250px; max-height: 250px; border-radius: 10px; display: block;"
                                 alt="Image attachment">
                        </a>
                    </div>`;
                if (textContent) {
                    bubbleContent += `<div class="tyn-reply-text" style="padding: 5px 10px;">${escapeHTML(textContent)}</div>`;
                }
                break;
            
            case 'audio':
                bubbleContent = `
                    <div style="padding: 5px;">
                        <audio controls style="width: 250px; height: 40px;">
                            <source src="${escapeHTML(attachmentUrl)}">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                `;
                break;

            case 'text':
            default:
                bubbleContent = `<div class="tyn-reply-text">${escapeHTML(textContent)}</div>`;
                break;
        }
        
        let messageHtml = '';
        const senderClass = (message.sender_type === 'user') ? 'incoming' : 'outgoing';

        messageHtml = `<div class="tyn-reply-item ${senderClass}">`;

        if (senderClass === 'incoming') {
            messageHtml += `
                <div class="tyn-reply-avatar">
                    <div class="tyn-media tyn-size-md tyn-circle"><img src="${contactAvatar}" alt=""></div>
                </div>`;
        }

        messageHtml += `
            <div class="tyn-reply-group">
                <div class="tyn-reply-bubble">
                    ${bubbleContent}
                </div>
            </div>
        </div>`;

        return messageHtml;
    }

    // --- 7. Function to subscribe to realtime messages for a contact ---
    function subscribeToMessages(contactId) {
        // Use a unique channel name for each contact
        const channelName = `messages-for-${contactId}`;
        messageSubscription = supabase
            .channel(channelName)
            .on('postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `contact_id=eq.${contactId}`
                },
                (payload) => {
                    console.log('New message received:', payload.new);
                    // Check if the chat for this contact is currently open
                    if (payload.new.contact_id === currentContactId) {
                        console.log('Message is for the currently open chat. Appending...');
                        const contactAvatar = document.getElementById('header-avatar-lg').src; // Get avatar from the main header
                        const messageHtml = buildMessageHtml(payload.new, contactAvatar);
                        appendMessage(messageHtml);
                    }
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log(`Successfully subscribed to channel: ${channelName}`);
                }
                if (status === 'CHANNEL_ERROR') {
                    console.error(`Error subscribing to channel: ${channelName}`);
                }
            });
    }

    // --- 8. Subscribe to Contact List Updates ---
    const contactSubscription = supabase
        .channel('public-contacts')
        .on('postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'contacts'
            },
            (payload) => {
                console.log('Contact change received:', payload);
                if (payload.eventType === 'INSERT') {
                    console.log('New contact detected, creating element...');
                    createContactInSidebar(payload.new);
                } else if (payload.eventType === 'UPDATE') {
                    console.log('Contact update detected, updating element...');
                    updateContactInSidebar(payload.new);
                }
            }
        )
        .subscribe();

    aiToggle.addEventListener('change', async function() {
        if (!currentContactId) return;

        const isEnabled = this.checked;

        const { data, error } = await supabase
            .from('contacts')
            .update({ ai_enabled: isEnabled })
            .eq('id', currentContactId);

        if (error) {
            console.error('Error updating AI status:', error);
            // Optionally, revert the toggle switch on error
            this.checked = !isEnabled;
        } else {
            console.log('AI status updated successfully:', data);
        }
    });

    renameButton.addEventListener('click', async function() {
        if (!currentContactId) return;

        const newName = renameInput.value.trim();
        if (newName === '') {
            alert('Please enter a name.');
            return;
        }

        const { data, error } = await supabase
            .from('contacts')
            .update({ name: newName })
            .eq('id', currentContactId)
            .select();

        if (error) {
            console.error('Error updating contact name:', error);
            alert('Failed to rename contact.');
        } else {
            console.log('Contact name updated successfully:', data);
            alert('Contact renamed successfully.');
            // Optionally, you can update the name in the UI immediately
            headerName.textContent = newName;
            asideName.textContent = newName;
            const contactInSidebar = document.getElementById(`contact-${currentContactId}`);
            if (contactInSidebar) {
                contactInSidebar.querySelector('.name').textContent = newName;
            }
            renameInput.value = '';
        }
    });

    revertButton.addEventListener('click', async function() {
        if (!currentContactId) return;

        const { data, error } = await supabase
            .from('contacts')
            .select('platform_user_id')
            .eq('id', currentContactId)
            .single();

        if (error) {
            console.error('Error fetching original name:', error);
            alert('Failed to revert name.');
            return;
        }

        const originalName = data.platform_user_id;

        const { data: updateData, error: updateError } = await supabase
            .from('contacts')
            .update({ name: originalName })
            .eq('id', currentContactId)
            .select();

        if (updateError) {
            console.error('Error reverting contact name:', updateError);
            alert('Failed to revert name.');
        } else {
            console.log('Contact name reverted successfully:', updateData);
            alert('Contact name reverted successfully.');
            // Optionally, you can update the name in the UI immediately
            headerName.textContent = originalName;
            asideName.textContent = originalName;
            const contactInSidebar = document.getElementById(`contact-${currentContactId}`);
            if (contactInSidebar) {
                contactInSidebar.querySelector('.name').textContent = originalName;
            }
            renameInput.value = '';
        }
    });

    deleteButton.addEventListener('click', async function() {
        if (!currentContactId) return;

        if (confirm('Are you sure you want to delete this contact and all their messages? This action cannot be undone.')) {
            const { data, error } = await supabase
                .from('contacts')
                .delete()
                .eq('id', currentContactId);

            if (error) {
                console.error('Error deleting contact:', error);
                alert('Failed to delete contact.');
            } else {
                console.log('Contact deleted successfully:', data);
                alert('Contact deleted successfully.');
                // Reload the page to reflect the changes
                location.reload();
            }
        }
    });

    // --- 9. Helper to append a message and scroll ---
    function appendMessage(html) {
        console.log("Attempting to append message HTML...");
        const placeholder = chatBody.querySelector('p.text-center');
        
        if (placeholder && placeholder.textContent.includes('No messages')) {
            console.log("Placeholder found, removing it.");
            chatBody.innerHTML = '';
        }
        
        chatBody.insertAdjacentHTML('beforeend', html);
        scrollToBottom();
        console.log("Message HTML appended.");
    }

    function scrollToBottom() {
        setTimeout(() => {
            let scrollEl = document.querySelector('#tynChatBody .simplebar-content-wrapper');
            if (!scrollEl) scrollEl = chatScrollContainer;

            if (scrollEl) {
                scrollEl.scrollTop = scrollEl.scrollHeight;
                console.log("Forced scroll to bottom using", scrollEl.className);
            }
        }, 300);
    }

    // Force scroll also on window load for safety
    window.addEventListener("load", () => {
        const chatBodyEl = document.getElementById('tynChatBody');
        if (chatBodyEl) {
            setTimeout(() => {
                chatBodyEl.scrollTop = chatBodyEl.scrollHeight;
                console.log("Window onload chat scroll forced.");
            }, 500);
        }

        // --- 10. Ensure scroll after UI update ---
        // (Removed MutationObserver - only scroll on initial load)
    });
});