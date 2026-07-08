import { Head, Link } from '@inertiajs/react';
import { ShieldAlert, FileQuestion, Clock, ServerCrash, Construction, Home, ArrowLeft } from 'lucide-react';

interface ErrorPageProps {
    status: number;
}

const ERROR_DATA: Record<number, { title: string; description: string; icon: React.ElementType; color: string; bg: string }> = {
    403: {
        title: 'Akses Ditolak',
        description: 'Anda tidak memiliki izin untuk mengakses halaman ini. Hubungi administrator jika ini adalah kesalahan.',
        icon: ShieldAlert,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
    },
    404: {
        title: 'Halaman Tidak Ditemukan',
        description: 'Halaman yang Anda cari tidak ada atau telah dipindahkan. Periksa kembali URL atau kembali ke dashboard.',
        icon: FileQuestion,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
    },
    419: {
        title: 'Sesi Kedaluwarsa',
        description: 'Sesi Anda telah berakhir karena tidak ada aktivitas. Silakan muat ulang halaman atau login kembali.',
        icon: Clock,
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
    },
    500: {
        title: 'Kesalahan Server',
        description: 'Terjadi kesalahan pada server kami. Tim teknis telah diberitahu. Silakan coba beberapa saat lagi.',
        icon: ServerCrash,
        color: 'text-red-500',
        bg: 'bg-red-500/10',
    },
    503: {
        title: 'Sedang Maintenance',
        description: 'Sistem sedang dalam pemeliharaan terjadwal. Kami akan segera kembali. Terima kasih atas kesabarannya.',
        icon: Construction,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
    },
};

/**
 * Komponen: Error
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function ErrorPage({ status }: ErrorPageProps) {
    const error = ERROR_DATA[status] || ERROR_DATA[500];
    const Icon = error.icon;

    return (
        <>
            <Head title={`${status} — ${error.title}`} />

            <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">
                <div className="max-w-lg w-full text-center">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl ${error.bg} mb-8`}>
                        <Icon className={`w-12 h-12 ${error.color}`} />
                    </div>

                    {/* Status Code */}
                    <div className="mb-4">
                        <span className="inline-block px-4 py-1.5 text-sm font-bold text-gray-400 bg-gray-100 rounded-full tracking-widest">
                            {status}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        {error.title}
                    </h1>

                    {/* Description */}
                    <p className="text-gray-500 leading-relaxed mb-8 max-w-md mx-auto">
                        {error.description}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali
                        </button>

                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#003366] rounded-xl hover:bg-[#002855] transition-all duration-200 shadow-sm"
                        >
                            <Home className="w-4 h-4" />
                            Dashboard
                        </Link>

                        {status === 419 && (
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all duration-200"
                            >
                                Muat Ulang
                            </button>
                        )}
                    </div>

                    {/* Footer */}
                    <p className="mt-12 text-xs text-gray-300">
                        SIMPATIK — Bank Sumsel Babel
                    </p>
                </div>
            </div>
        </>
    );
}
