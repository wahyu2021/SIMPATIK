<?php

namespace App\Notifications;

use App\Models\OutboundTransaction;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class OutboundStatusUpdatedNotification extends Notification
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
            'status' => $this->outbound->status->value,
            'status_label' => $this->outbound->status->label(),
            'title' => 'Update Status Pengajuan',
            'message' => "Pengajuan #{$this->outbound->document_number} kini berstatus: {$this->outbound->status->label()}.",
            'action_url' => route('outbound.show', $this->outbound->id),
            'type' => 'outbound_status',
        ];
    }
}
