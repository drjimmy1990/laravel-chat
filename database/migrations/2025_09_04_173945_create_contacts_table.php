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
        Schema::create('contacts', function (Blueprint $table) {
            // THE CHANGE IS HERE: We are using char(36) instead of uuid()
            // This is more explicit for older MySQL versions.
            $table->char('id', 36)->primary();

            $table->string('platform');
            $table->string('platform_user_id');
            $table->string('name')->nullable();
            $table->text('avatar_url')->nullable();
            $table->boolean('ai_enabled')->default(true);
            $table->timestamp('last_interaction_at')->nullable()->index();
            $table->string('last_message_preview', 70)->nullable();
            $table->integer('unread_count')->default(0);
            $table->timestamps();

            $table->unique(['platform', 'platform_user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};