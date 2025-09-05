<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            // CHANGE 1: Use char(36) for this table's primary key as well
            $table->char('id', 36)->primary();

            // CHANGE 2: Define contact_id with the EXACT same type and apply the foreign key
            $table->char('contact_id', 36);
            $table->foreign('contact_id')->references('id')->on('contacts')->onDelete('cascade');

            $table->string('message_platform_id')->nullable();
            $table->enum('sender_type', ['user', 'agent', 'ai', 'system']);
            $table->string('content_type')->default('text');
            $table->text('text_content')->nullable();
            $table->text('attachment_url')->nullable();
            $table->string('attachment_filename')->nullable();
            $table->json('attachment_metadata')->nullable();
            $table->boolean('is_read_by_agent')->default(false);
            $table->timestamp('platform_timestamp')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};