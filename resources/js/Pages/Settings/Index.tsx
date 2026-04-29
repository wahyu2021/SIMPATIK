import { Head, useForm, usePage } from '@inertiajs/react';
import { Building2, FileText, MessageSquare, BrainCircuit, Save } from 'lucide-react';
import { PageProps } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Button, Input, Alert, Breadcrumbs } from '../../Components/UI';

interface Props extends PageProps {
    settings: Record<string, string>;
}

export default function SettingsIndex({ settings }: Props) {
    const { flash } = usePage<PageProps>().props;

    const { data, setData, put, processing, errors } = useForm({
        company_name: settings.company_name || '',
        company_branch: settings.company_branch || '',
        company_address: settings.company_address || '',
        document_prefix_inbound: settings.document_prefix_inbound || '',
        document_prefix_outbound: settings.document_prefix_outbound || '',
        wa_api_url: settings.wa_api_url || '',
        wa_api_token: settings.wa_api_token || '',
        wa_alert_numbers: settings.wa_alert_numbers || '',
        ml_api_url: settings.ml_api_url || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/settings');
    };

    return (
        <AuthenticatedLayout title="Pengaturan">
            <Head title="Pengaturan Sistem" />

            <Breadcrumbs items={[{ label: 'Pengaturan' }]} />

            <PageHeader
                title="Pengaturan Sistem"
                description="Konfigurasi informasi perusahaan, format dokumen, dan integrasi"
            />

            {flash?.success && (
                <Alert type="success" className="mb-4">{flash.success}</Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ── Informasi Perusahaan ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Informasi Perusahaan</h2>
                            <p className="text-xs text-gray-500">Ditampilkan di header laporan dan dokumen</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Input
                            id="company_name"
                            label="Nama Perusahaan"
                            placeholder="PT. Bank ..."
                            value={data.company_name}
                            onChange={(e) => setData('company_name', e.target.value)}
                            error={errors.company_name}
                            required
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                id="company_branch"
                                label="Nama Cabang"
                                placeholder="Cabang Utama ..."
                                value={data.company_branch}
                                onChange={(e) => setData('company_branch', e.target.value)}
                                error={errors.company_branch}
                                required
                            />
                            <Input
                                id="company_address"
                                label="Alamat"
                                placeholder="Jl. ..."
                                value={data.company_address}
                                onChange={(e) => setData('company_address', e.target.value)}
                                error={errors.company_address}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* ── Format Dokumen ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Format Dokumen</h2>
                            <p className="text-xs text-gray-500">Prefix untuk penomoran otomatis transaksi</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Input
                                id="document_prefix_inbound"
                                label="Prefix Barang Masuk"
                                placeholder="INB"
                                value={data.document_prefix_inbound}
                                onChange={(e) => setData('document_prefix_inbound', e.target.value)}
                                error={errors.document_prefix_inbound}
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">Contoh: <span className="font-mono">INB-202604-0001</span></p>
                        </div>
                        <div>
                            <Input
                                id="document_prefix_outbound"
                                label="Prefix Pengajuan Barang"
                                placeholder="SPB"
                                value={data.document_prefix_outbound}
                                onChange={(e) => setData('document_prefix_outbound', e.target.value)}
                                error={errors.document_prefix_outbound}
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">Contoh: <span className="font-mono">SPB-202604-0001</span></p>
                        </div>
                    </div>
                </div>

                {/* ── Integrasi WhatsApp ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Integrasi WhatsApp</h2>
                            <p className="text-xs text-gray-500">Notifikasi otomatis saat stok rendah atau pengajuan baru</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                id="wa_api_url"
                                label="WA API URL"
                                type="url"
                                placeholder="https://api.example.com/send"
                                value={data.wa_api_url}
                                onChange={(e) => setData('wa_api_url', e.target.value)}
                                error={errors.wa_api_url}
                            />
                            <Input
                                id="wa_api_token"
                                label="WA API Token"
                                type="password"
                                placeholder="Token autentikasi"
                                value={data.wa_api_token}
                                onChange={(e) => setData('wa_api_token', e.target.value)}
                                error={errors.wa_api_token}
                            />
                        </div>
                        <div>
                            <Input
                                id="wa_alert_numbers"
                                label="Nomor Penerima Notifikasi"
                                placeholder="628123456789, 628987654321"
                                value={data.wa_alert_numbers}
                                onChange={(e) => setData('wa_alert_numbers', e.target.value)}
                                error={errors.wa_alert_numbers}
                            />
                            <p className="text-xs text-gray-400 mt-1">Pisahkan dengan koma untuk beberapa nomor</p>
                        </div>
                    </div>
                </div>

                {/* ── Integrasi ML/Forecasting ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                            <BrainCircuit className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Prediksi Permintaan (ML)</h2>
                            <p className="text-xs text-gray-500">Endpoint API untuk forecasting kebutuhan barang</p>
                        </div>
                    </div>

                    <Input
                        id="ml_api_url"
                        label="ML API URL"
                        type="url"
                        placeholder="http://localhost:8001/api/forecast"
                        value={data.ml_api_url}
                        onChange={(e) => setData('ml_api_url', e.target.value)}
                        error={errors.ml_api_url}
                    />
                </div>

                {/* ── Save Button ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing} className="flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                        </Button>
                        <span className="text-sm text-gray-400">Perubahan akan langsung diterapkan</span>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
