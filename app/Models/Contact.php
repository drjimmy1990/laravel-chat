<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contact extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'platform',
        'platform_user_id',
        'name',
        'avatar_url',
        'ai_enabled',
        'last_interaction_at',
        'last_message_preview',
        'unread_count',
    ];

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }
}