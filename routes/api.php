<?php

use App\Http\Controllers\ChatController; // <-- Add this import
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// This route will respond to GET requests like: /api/contacts/some-contact-uuid
Route::get('/contacts/{contact}', [ChatController::class, 'show']);