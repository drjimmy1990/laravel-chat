<?php

use App\Http\Controllers\ChatController; // <-- IMPORTANT: Make sure this line is here
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// This is the ONLY route that should be active for the homepage.
// It points to the 'index' method in your ChatController.
Route::get('/', [ChatController::class, 'index'])->name('dashboard');