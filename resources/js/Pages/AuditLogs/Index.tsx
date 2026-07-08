import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
    History, 
    User as UserIcon, 
    ShieldAlert, 
    Monitor, 
    Globe, 
    Eye,
    Database,
    ArrowRight
} from 'lucide-react';
import { PageProps, PaginatedData } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { 
    PageHeader, 
    Breadcrumbs, 
    Input, 
    Combobox, 
    Pagination, 
    Badge, 
    Modal,
    Button,
    Loading
} from '../../Components/UI';
import { formatDateLong, formatTimeAgo } from '../../Lib/formatters';
import axios from 'axios';

interface ActivityLog {
    id: number;
    user_id: number | null;
    log_name: string;
    description: string;
    subject_type: string;
    subject_id: number;
    properties: any;
    ip_address: string;
    user_agent: string;
    created_at: string;
    user?: { id: number; name: string };
}

interface Props extends PageProps {
    logs: PaginatedData<ActivityLog>;
    filters: { search?: string; module?: string };
    modules: string[];
}

/**
 * Halaman Audit Trail — Daftar riwayat aktivitas pengguna di sistem.
 */
/**
 * Komponen: Index
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function AuditLogsIndex({ logs, filters, modules }: Props) {
    const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [detailData, setDetailDetailData] = useState<ActivityLog | null>(null);

    const handleFilter = (key: string, value: string) => {
        router.get(route('audit-logs.index'), { ...filters, [key]: value || undefined }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const viewDetail = async (id: number) => {
        setSelectedLog(logs.data.find(l => l.id === id) || null);
        setLoadingDetail(true);
        try {
            const res = await axios.get(route('audit-logs.show', id));
            setDetailDetailData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDetail(false);
        }
    };

    const getBadgeVariant = (desc: string) => {
        if (desc.includes('Dibuat')) return 'success';
        if (desc.includes('Diperbarui')) return 'info';
        if (desc.includes('Dihapus')) return 'danger';
        return 'default';
    };

    return (
        <AuthenticatedLayout title="Audit Trail">
            <Head title="Log Aktivitas — Audit Trail" />

            <Breadcrumbs items={[{ label: 'Keamanan' }, { label: 'Audit Trail' }]} />

            <PageHeader 
                title="Audit Trail Digital" 
                description="Rekam jejak setiap perubahan data dan aktivitas pengguna dalam sistem."
            />

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-50">
                        <Input 
                            placeholder="Cari user, aktivitas, atau modul..." 
                            value={filters.search || ''} 
                            onChange={(e) => handleFilter('search', e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="w-48">
                        <Combobox 
                            options={[
                                { value: '', label: 'Semua Modul' },
                                ...modules.map(m => ({ value: m, label: m.charAt(0).toUpperCase() + m.slice(1) }))
                            ]}
                            value={filters.module || ''}
                            onChange={(v) => handleFilter('module', v)}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 w-48">Waktu</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 w-48">Pengguna</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 w-32">Aktivitas</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 w-40">Modul / Tabel</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">IP Address</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-600 w-24">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logs.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400 italic">
                                        Tidak ada catatan aktivitas ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                logs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="text-gray-900 font-medium">{formatDateLong(log.created_at)}</div>
                                            <div className="text-[10px] text-gray-400">{formatTimeAgo(log.created_at)}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <UserIcon className="w-3.5 h-3.5 text-gray-500" />
                                                </div>
                                                <span className="text-gray-700 font-medium">{log.user?.name || 'Sistem'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={getBadgeVariant(log.description)}>
                                                {log.description}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">
                                                {log.log_name}
                                            </code>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <Globe className="w-3 h-3" /> {log.ip_address}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button 
                                                onClick={() => viewDetail(log.id)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Lihat Detail Perubahan"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-6">
                <Pagination 
                    links={logs.links}
                    from={logs.from}
                    to={logs.to}
                    total={logs.total}
                />
            </div>

            <Modal
                open={!!selectedLog}
                onClose={() => { setSelectedLog(null); setDetailDetailData(null); }}
                title="Detail Aktivitas & Perubahan Data"
                size="lg"
            >
                {loadingDetail ? (
                    <div className="py-12 flex justify-center"><Loading /></div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Informasi Sesi</p>
                                <div className="flex items-center gap-3 text-sm">
                                    <Monitor className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600 truncate" title={detailData?.user_agent}>{detailData?.user_agent}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Globe className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600 font-mono">{detailData?.ip_address}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl space-y-2 border border-blue-100">
                                <p className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">Objek Audit</p>
                                <div className="flex items-center gap-3 text-sm">
                                    <Database className="w-4 h-4 text-blue-400" />
                                    <span className="text-blue-700 font-medium">Model: {detailData?.subject_type.split('\\').pop()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <ShieldAlert className="w-4 h-4 text-blue-400" />
                                    <span className="text-blue-700 font-medium">ID Record: #{detailData?.subject_id}</span>
                                </div>
                            </div>
                        </div>

                        {detailData?.properties ? (
                            <div className="space-y-4">
                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                    <History className="w-4 h-4 text-blue-600" /> 
                                    Rincian Perubahan Data
                                </h4>
                                
                                <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto border border-gray-800 shadow-2xl">
                                    <div className="grid grid-cols-2 gap-8 min-w-150">
                                        <div>
                                            <p className="text-red-400 text-xs font-bold mb-3 uppercase tracking-widest">Sebelum</p>
                                            <div className="space-y-2">
                                                {Object.entries(detailData.properties.old || {}).map(([key, val]: [string, any]) => (
                                                    <div key={key} className="flex flex-col border-b border-gray-800 pb-2">
                                                        <span className="text-[10px] text-gray-500 font-mono uppercase">{key}</span>
                                                        <span className="text-gray-300 text-sm font-mono break-all">{val?.toString() || '(null)'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-green-400 text-xs font-bold mb-3 uppercase tracking-widest">Sesudah</p>
                                            <div className="space-y-2">
                                                {Object.entries(detailData.properties.new || {}).map(([key, val]: [string, any]) => (
                                                    <div key={key} className="flex flex-col border-b border-gray-800 pb-2">
                                                        <span className="text-[10px] text-gray-500 font-mono uppercase">{key}</span>
                                                        <span className="text-white text-sm font-mono font-bold break-all flex items-center gap-2">
                                                            <ArrowRight className="w-3 h-3 text-gray-600" />
                                                            {val?.toString() || '(null)'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-gray-500">Tidak ada rincian properti data untuk aktivitas ini.</p>
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <Button variant="secondary" onClick={() => setSelectedLog(null)}>Tutup</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
