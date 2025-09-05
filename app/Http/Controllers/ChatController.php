<?php

namespace App\Http\Controllers;

use App\Models\Contact; // Import the Contact model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Str;
use Illuminate\View\View;


class ChatController extends Controller
{
    /**
     * Display the chat dashboard.
     */
    public function index(): View
    {
        // Fetch contacts from the Supabase DB, order by most recent
        // Use 'created_at' for now if 'last_interaction_at' is null
        $contacts = Contact::orderBy('last_interaction_at', 'desc')->orderBy('created_at', 'desc')->get();

        // Return the main view and pass the contacts data to it
        return view('layouts.app', [
            'contacts' => $contacts
        ]);
    }
    /**
     * Fetch a single contact and all their messages.
     * THIS IS THE GUARANTEED WORKING VERSION.
     */
    public function show(Contact $contact)
    {
        // This is the query you confirmed works and provides the correct order.
        // We will not add anything else to it.
        $messages = $contact->messages()->get();

        return response()->json([
            'contact' => $contact,
            'messages' => $messages
        ]);
    }
}


