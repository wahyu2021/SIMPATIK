<?php

namespace App\Notifications;

use App\Models\OutboundTransaction;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewOutboundRequestNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public OutboundTransaction $outbound
    ) {}

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'outbound_id' => $this->outbound->id,
            'document_number' => $this->outbound->document_number,
            'requester_name' => $this->outbound->requester->name,
            'title' => 'Pengajuan Barang Baru',
            'message' => "Staf {$this->outbound->requester->name} membuat pengajuan barang baru (#{$this->outbound->document_number}) yang perlu disetujui.",
            'action_url' => route('outbound.show', $this->outbound->id),
            'type' => 'new_request',
        ];
    }
}
