import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { PageProps, Item, Department } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Button, Input, Select, Breadcrumbs, Textarea, Label } from '../../Components/UI';
import OutboundDetailRowComponent, { OutboundDetailRow, emptyDetail } from '../../Components/Features/Outbound/OutboundDetailRow';
import { normalizeDate } from '../../Lib/formatters';

interface Props extends PageProps {
    items: Item[];
    departments: Department[];
    nextDocument?: string;
}

/** Halaman form pengajuan barang baru. */
export default function OutboundForm({ items, departments, nextDocument }: Props) {
    const { auth } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        department_id: auth.user.department_id?.toString() || '',
        transaction_date: normalizeDate(),
        is_special_request: false,
        notes: '',
        details: [{ ...emptyDetail }],
    });

    const addDetail = () => {
        setData('details', [...data.details, { ...emptyDetail }]);
    };

    const removeDetail = (index: number) => {
        if (data.details.length <= 1) return;
        setData('details', data.details.filter((_, i) => i !== index));
    };

    const updateDetail = (index: number, field: keyof OutboundDetailRow, value: string) => {
        const updated = [...data.details];
        updated[index] = { ...updated[index], [field]: value };
        setData('details', updated);
    };

    const getUsedItemIds = (currentIndex: number): string[] => {
        return data.details
            .filter((_, i) => i !== currentIndex)
            .map(d => d.item_id)
            .filter(Boolean);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/outbound');
    };

    return (
        <AuthenticatedLayout title="Buat Pengajuan Barang">
            <Head title="Buat Pengajuan Barang" />

            <Breadcrumbs items={[
                { label: 'Pengajuan Barang', href: '/outbound' },
                { label: 'Buat Pengajuan' },
            ]} />

            <PageHeader
                title="Buat Pengajuan Barang"
                description="Ajukan kebutuhan ATK untuk unit kerja Anda"
                backUrl="/outbound"
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pengajuan</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="document_number">No. Dokumen</Label>
                            <div className="mt-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono font-medium text-gray-700 border border-gray-200">
                                {nextDocument || 'Auto-generated'}
                            </div>
                        </div>

                        <Input
                            id="transaction_date"
                            label="Tanggal Pengajuan"
                            type="date"
                            max={new Date().toISOString().split('T')[0]}
                            value={data.transaction_date}
                            onChange={(e) => setData('transaction_date', e.target.value)}
                            error={errors.transaction_date}
                            required
                        />

                        <div>
                            <Label htmlFor="department_id" required>Unit Kerja</Label>
                            <Select
                                id="department_id"
                                value={data.department_id}
                                onChange={(e) => setData('department_id', e.target.value)}
                                error={errors.department_id}
                            >
                                <option value="">— Pilih Unit Kerja —</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </Select>
                        </div>

                        <div className="flex items-center gap-3 mt-6">
                            <input
                                id="is_special_request"
                                type="checkbox"
                                checked={data.is_special_request}
                                onChange={(e) => setData('is_special_request', e.target.checked)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <Label htmlFor="is_special_request">Pesanan Khusus</Label>
                        </div>
                    </div>

                    <div className="mt-4">
                        <Textarea
                            id="notes"
                            label={data.is_special_request ? 'Catatan (wajib untuk pesanan khusus)' : 'Catatan (opsional)'}
                            placeholder="Alasan pengajuan atau catatan tambahan..."
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            error={errors.notes}
                            rows={2}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Detail Barang</h2>
                        <Button
                            type="button"
                            onClick={addDetail}
                            className="flex items-center gap-1.5 !text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Baris
                        </Button>
                    </div>

                    {errors.details && (
                        <p className="text-sm text-red-600 mb-3">{errors.details}</p>
                    )}

                    <div className="space-y-4">
                        {data.details.map((detail, index) => (
                            <OutboundDetailRowComponent
                                key={index}
                                index={index}
                                detail={detail}
                                items={items}
                                usedItemIds={getUsedItemIds(index)}
                                errors={errors}
                                canRemove={data.details.length > 1}
                                onUpdate={updateDetail}
                                onRemove={removeDetail}
                            />
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                        </Button>
                        <Link
                            href="/outbound"
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Batal
                        </Link>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
