import { useState, useRef, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Bell, CheckCheck, Info, Package, AlertCircle, Clock } from 'lucide-react';
import { PageProps } from '../../Types';
import { formatTimeAgo } from '../../Lib/formatters';

/**
 * Dropdown untuk melihat ringkasan notifikasi terbaru di Topbar.
 */
export default function NotificationDropdown() {
    const { auth } = usePage<PageProps>().props;
    const { notifications } = auth;
    
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllAsRead = () => {
        router.post(route('notifications.read-all'), {}, { preserveScroll: true });
        setIsOpen(false);
    };

    const handleNotificationClick = (id: string, url?: string) => {
        router.post(route('notifications.read', id), {}, {
            onSuccess: () => {
                if (url) router.get(url);
            }
        });
        setIsOpen(false);
    };

    const getIcon = (type?: string) => {
        switch (type) {
            case 'low_stock': return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'outbound_status': return <Package className="w-4 h-4 text-blue-500" />;
            case 'new_request': return <Clock className="w-4 h-4 text-amber-500" />;
            default: return <Info className="w-4 h-4 text-gray-500" />;
        }
    };

    const count = notifications?.unread_count || 0;
    const latest = notifications?.latest || [];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    relative p-2 rounded-lg transition-colors
                    ${isOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}
                `}
            >
                <Bell className="w-5 h-5" />
                {count > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                        {count > 9 ? '9+' : count}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-900">Notifikasi</h3>
                        {count > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-[11px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                                <CheckCheck className="w-3 h-3" /> Tandai semua dibaca
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {latest.length === 0 ? (
                            <div className="py-12 text-center">
                                <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">Tidak ada notifikasi baru</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {latest.map((notif) => (
                                    <button
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif.id, notif.data.action_url)}
                                        className="w-full text-left p-4 hover:bg-blue-50/30 transition-colors flex gap-3 group"
                                    >
                                        <div className="mt-1 p-2 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                                            {getIcon(notif.data.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{notif.data.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{notif.data.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                                                <Clock className="w-2.5 h-2.5" />
                                                {formatTimeAgo(notif.created_at)}
                                            </p>
                                        </div>
                                        {!notif.read_at && (
                                            <div className="mt-2 w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        href={route('notifications.index')}
                        onClick={() => setIsOpen(false)}
                        className="block py-3 text-center text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border-t border-gray-100 transition-colors"
                    >
                        Lihat Semua Notifikasi
                    </Link>
                </div>
            )}
        </div>
    );
}
