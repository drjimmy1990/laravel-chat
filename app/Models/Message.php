<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'contact_id',
        'message_platform_id',
        'sender_type',
        'content_type',
        'text_content',
        'attachment_url',
        'attachment_filename',
        'attachment_metadata',
        'is_read_by_agent',
        'platform_timestamp',
    ];

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }
}