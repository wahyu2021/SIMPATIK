import { Head, useForm, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { PageProps, InboundTransaction, Item } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Button, Input, Breadcrumbs, Textarea } from '../../Components/UI';
import InboundDetailRow, { DetailRow, emptyDetail } from '../../Components/Features/Inbound/InboundDetailRow';
import { formatCurrency, normalizeDate } from '../../Lib/formatters';

interface Props extends PageProps {
    inbound?: InboundTransaction;
    items: Item[];
    nextReference?: string;
}

/** Halaman Form Barang Masuk — Create & Edit. */
export default function InboundForm({ inbound, items, nextReference }: Props) {
    const isEdit = !!inbound;

    const { data, setData, post, put, processing, errors } = useForm({
        reference_number: inbound?.reference_number || nextReference || '',
        transaction_date: normalizeDate(inbound?.transaction_date),
        notes: inbound?.notes || '',
        details: (inbound?.details && inbound.details.length > 0)
            ? inbound.details.map(d => ({
                item_id: d.item_id.toString(),
                quantity: d.quantity.toString(),
                unit_price: d.unit_price.toString(),
            }))
            : [{ ...emptyDetail }],
    });

    // ── Detail Repeater Handlers ──

    const addDetail = () => {
        setData('details', [...data.details, { ...emptyDetail }]);
    };

    const removeDetail = (index: number) => {
        if (data.details.length <= 1) return;
        setData('details', data.details.filter((_, i) => i !== index));
    };

    const updateDetail = (index: number, field: keyof DetailRow, value: string) => {
        const updated = [...data.details];
        updated[index] = { ...updated[index], [field]: value };

        // Auto-fill harga satuan saat item dipilih
        if (field === 'item_id' && value) {
            const selectedItem = items.find(item => item.id.toString() === value);
            if (selectedItem) {
                updated[index].unit_price = selectedItem.unit_price.toString();
            }
        }

        setData('details', updated);
    };

    // ── Computed Values ──

    const getSubtotal = (detail: DetailRow): number => {
        const qty = parseInt(detail.quantity) || 0;
        const price = parseFloat(detail.unit_price) || 0;
        return qty * price;
    };

    const grandTotal = data.details.reduce((sum, d) => sum + getSubtotal(d), 0);


    const getUsedItemIds = (currentIndex: number): string[] => {
        return data.details
            .filter((_, i) => i !== currentIndex)
            .map(d => d.item_id)
            .filter(Boolean);
    };

    // ── Submit ──

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/inbound/${inbound!.id}`);
        } else {
            post('/inbound');
        }
    };

    return (
        <AuthenticatedLayout title={isEdit ? 'Edit Barang Masuk' : 'Catat Barang Masuk'}>
            <Head title={isEdit ? 'Edit Barang Masuk' : 'Catat Barang Masuk'} />

            <Breadcrumbs items={[
                { label: 'Barang Masuk', href: '/inbound' },
                { label: isEdit ? 'Edit' : 'Catat Baru' },
            ]} />

            <PageHeader
                title={isEdit ? 'Edit Barang Masuk' : 'Catat Barang Masuk'}
                description={isEdit
                    ? `Perbarui transaksi ${inbound!.reference_number}`
                    : 'Catat penerimaan barang dari vendor ke gudang'
                }
                backUrl="/inbound"
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Transaksi</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            id="reference_number"
                            label="No. Referensi / Surat Jalan"
                            placeholder="Contoh: SJ-2026/04/001"
                            value={data.reference_number}
                            onChange={(e) => setData('reference_number', e.target.value)}
                            error={errors.reference_number}
                            required
                        />
                        <Input
                            id="transaction_date"
                            label="Tanggal Transaksi"
                            type="date"
                            max={new Date().toISOString().split('T')[0]}
                            value={data.transaction_date}
                            onChange={(e) => setData('transaction_date', e.target.value)}
                            error={errors.transaction_date}
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <Textarea
                            id="notes"
                            label="Catatan (Opsional)"
                            placeholder="Catatan tambahan tentang penerimaan barang..."
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
                            <InboundDetailRow
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

                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                        <div className="text-right">
                            <span className="text-sm text-gray-500">Total Nilai Transaksi</span>
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(grandTotal)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
                        </Button>
                        <Link
                            href="/inbound"
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
