<?php

namespace App\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppChannel
{
    /**
     * Kirim notifikasi yang diberikan.
     */
    public function send(object $notifiable, Notification $notification): void
    {
        if (!method_exists($notification, 'toWhatsApp')) {
            return;
        }

        $data = $notification->toWhatsApp($notifiable);
        $message = $data['message'] ?? '';

        if (!$message) {
            return;
        }

        // Ambil daftar nomor tujuan (Bisa array dari Settings atau string dari User)
        $recipients = $data['recipients'] ?? [$notifiable->phone_number];

        // Jika recipients adalah string (koma terpisah), ubah ke array
        if (is_string($recipients)) {
            $recipients = array_map('trim', explode(',', $recipients));
        }

        foreach ($recipients as $phone) {
            if (!$phone) continue;

            try {
                // Tembak API bot WA lokal yang berjalan di port 3000
                $response = Http::timeout(5)->post('http://127.0.0.1:3000/send-message', [
                    'phone' => $phone,
                    'message' => $message,
                ]);

                if ($response->failed()) {
                    Log::error('Gagal mengirim WhatsApp ke ' . $phone . ': ' . $response->body());
                }
            } catch (\Exception $e) {
                Log::error('WhatsApp Gateway Error: ' . $e->getMessage());
            }
        }
    }
}
