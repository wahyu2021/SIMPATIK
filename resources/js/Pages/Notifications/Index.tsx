import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Bell, 
    Clock, 
    CheckCircle2, 
    Info, 
    Package, 
    AlertCircle, 
    ChevronRight,
    CheckCheck
} from 'lucide-react';
import { PageProps, PaginatedData, NotificationData } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Breadcrumbs, Button, Pagination, Badge } from '../../Components/UI';
import { formatTimeAgo, formatDateLong } from '../../Lib/formatters';

interface Props extends PageProps {
    notifications: PaginatedData<NotificationData>;
}

/**
 * Halaman daftar lengkap semua notifikasi user.
 */
/**
 * Komponen: Index
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function NotificationsIndex({ notifications }: Props) {
    const markAllAsRead = () => {
        router.post(route('notifications.read-all'));
    };

    const handleRead = (id: string, url?: string) => {
        router.post(route('notifications.read', id), {}, {
            onSuccess: () => {
                if (url) router.get(url);
            }
        });
    };

    const getIcon = (type?: string) => {
        switch (type) {
            case 'low_stock': return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'outbound_status': return <Package className="w-5 h-5 text-blue-500" />;
            case 'new_request': return <Clock className="w-5 h-5 text-amber-500" />;
            default: return <Info className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <AuthenticatedLayout title="Notifikasi">
            <Head title="Semua Notifikasi" />
            
            <Breadcrumbs items={[{ label: 'Notifikasi' }]} />

            <PageHeader 
                title="Notifikasi Saya" 
                description="Pantau seluruh pemberitahuan sistem dan aktivitas Anda"
                action={
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={markAllAsRead}
                        className="flex items-center gap-2"
                        disabled={notifications.total === 0}
                    >
                        <CheckCheck className="w-4 h-4" />
                        Tandai Semua Dibaca
                    </Button>
                }
            />

            <div className="max-w-4xl">
                {notifications.data.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Belum Ada Notifikasi</h3>
                        <p className="text-gray-500 mt-1">Seluruh pemberitahuan sistem akan muncul di halaman ini.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.data.map((notif) => (
                            <div 
                                key={notif.id}
                                className={`
                                    group relative bg-white rounded-2xl border transition-all duration-200
                                    ${notif.read_at ? 'border-gray-100 opacity-75' : 'border-blue-100 shadow-md shadow-blue-500/5 ring-1 ring-blue-50'}
                                `}
                            >
                                <div className="flex items-start gap-4 p-5">
                                    <div className={`
                                        p-3 rounded-xl flex-shrink-0 transition-colors
                                        ${notif.read_at ? 'bg-gray-50 text-gray-400' : 'bg-blue-50 text-blue-600'}
                                    `}>
                                        {getIcon(notif.data.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className={`text-base font-bold ${notif.read_at ? 'text-gray-700' : 'text-gray-900'}`}>
                                                {notif.data.title}
                                            </h4>
                                            {!notif.read_at && (
                                                <Badge color="blue" variant="flat" size="sm">Baru</Badge>
                                            )}
                                        </div>
                                        <p className={`text-sm leading-relaxed ${notif.read_at ? 'text-gray-500' : 'text-gray-600 font-medium'}`}>
                                            {notif.data.message}
                                        </p>
                                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {formatDateLong(notif.created_at)} ({formatTimeAgo(notif.created_at)})
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {notif.data.action_url && (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="group/btn"
                                                onClick={() => handleRead(notif.id, notif.data.action_url)}
                                            >
                                                Lihat Detail
                                                <ChevronRight className="w-3.5 h-3.5 ml-1.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                            </Button>
                                        )}
                                        {!notif.read_at && !notif.data.action_url && (
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => handleRead(notif.id)}
                                            >
                                                Tandai Dibaca
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="mt-8">
                            <Pagination 
                                links={notifications.links}
                                from={notifications.from}
                                to={notifications.to}
                                total={notifications.total}
                            />
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
