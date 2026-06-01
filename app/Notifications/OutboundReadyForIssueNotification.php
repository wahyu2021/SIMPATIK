<?php

namespace App\Notifications;

use App\Channels\WhatsAppChannel;
use App\Models\OutboundTransaction;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class OutboundReadyForIssueNotification extends Notification
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
        return ['database', WhatsAppChannel::class];
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'outbound_id' => $this->outbound->id,
            'document_number' => $this->outbound->document_number,
            'department_name' => $this->outbound->department->name,
            'title' => 'Pengajuan Siap Diproses',
            'message' => "Pengajuan #{$this->outbound->document_number} dari {$this->outbound->department->name} telah disetujui Penyelia dan menunggu untuk dikeluarkan.",
            'action_url' => route('outbound.show', $this->outbound->id),
            'type' => 'outbound_status',
        ];
    }

    /**
     * Pesan untuk WhatsApp.
     */
    public function toWhatsApp(object $notifiable): array
    {
        return [
            'recipients' => \App\Models\Setting::getValue('wa_alert_numbers'),
            'message' => "📦 *PERMINTAAN SIAP DIPROSES (SIMPATIK)*\n\nNo. Dokumen: *#{$this->outbound->document_number}*\nUnit Kerja: *{$this->outbound->department->name}*\n\nPengajuan telah disetujui oleh Penyelia. Mohon segera siapkan barang dan proses pengeluaran di aplikasi. 🏦",
        ];
    }
}
