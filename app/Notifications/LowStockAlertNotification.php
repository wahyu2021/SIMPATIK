<?php

namespace App\Notifications;

use App\Channels\WhatsAppChannel;
use App\Models\Item;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class LowStockAlertNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Item $item
    ) {}

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        // Kirim ke database (Web) dan WhatsApp
        return ['database', WhatsAppChannel::class];
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'item_id' => $this->item->id,
            'item_name' => $this->item->name,
            'current_stock' => $this->item->current_stock,
            'title' => 'Peringatan Stok Rendah',
            'message' => "Barang \"{$this->item->name}\" sudah menyentuh batas minimum. Stok saat ini: {$this->item->current_stock} {$this->item->unit_of_measure}.",
            'action_url' => route('items.index', ['search' => $this->item->item_code]),
            'type' => 'low_stock',
        ];
    }

    /**
     * Representasi pesan untuk WhatsApp.
     */
    public function toWhatsApp(object $notifiable): array
    {
        return [
            'recipients' => \App\Models\Setting::getValue('wa_alert_numbers'),
            'message' => "🚨 *PERINGATAN STOK RENDAH (SIMPATIK)*\n\nBarang: *{$this->item->name}*\nKode: `{$this->item->item_code}`\nStok Saat Ini: *{$this->item->current_stock} {$this->item->unit_of_measure}*\nBatas Minimum: {$this->item->minimum_stock_level}\n\nMohon segera lakukan pengadaan barang. 🏦",
        ];
    }
}
