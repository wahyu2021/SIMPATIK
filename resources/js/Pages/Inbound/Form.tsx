import { Head, useForm, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { PageProps, InboundTransaction, Item } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Button, Input, Breadcrumbs, Textarea, DatePicker } from '../../Components/UI';
import InboundDetailRow, { DetailRow, emptyDetail } from '../../Components/Features/Inbound/InboundDetailRow';
import { formatCurrency, normalizeDate } from '../../Lib/formatters';

interface Props extends PageProps {
    inbound?: InboundTransaction;
    items: Item[];
    nextReference?: string;
}

/** Halaman Form Barang Masuk — Create & Edit. */
/**
 * Komponen: Form
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function InboundForm({ inbound, items, nextReference }: Props) {
    const isEdit = !!inbound;

    const { data, setData, post, processing, errors, transform } = useForm({
        reference_number: inbound?.reference_number || nextReference || '',
        transaction_date: normalizeDate(inbound?.transaction_date),
        notes: inbound?.notes || '',
        receipt_image: null as File | null,
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
            transform((data) => ({
                ...data,
                _method: 'PUT',
            }));
            post(`/inbound/${inbound!.id}`, { forceFormData: true });
        } else {
            post('/inbound', { forceFormData: true });
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
                        <DatePicker
                            id="transaction_date"
                            label="Tanggal Transaksi"
                            max={new Date().toISOString().split('T')[0]}
                            value={data.transaction_date}
                            onChange={(val) => setData('transaction_date', val)}
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
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Bukti Transaksi</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bukti Transaksi / Nota (Wajib)
                            </label>
                            <input
                                type="file"
                                id="receipt_image"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) => setData('receipt_image', e.target.files ? e.target.files[0] : null)}
                                className={`block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-medium
                                    file:bg-blue-50 file:text-[#0052A3]
                                    hover:file:bg-blue-100
                                    border border-gray-200 rounded-lg cursor-pointer
                                    ${errors.receipt_image ? 'border-red-500' : ''}`}
                            />
                            {errors.receipt_image && (
                                <p className="text-sm text-red-600 mt-1">{errors.receipt_image}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Upload foto atau scan nota (JPG, PNG, PDF, maks 2MB)</p>
                        </div>

                        {/* Preview */}
                        {(data.receipt_image || (isEdit && inbound?.receipt_image_url)) && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Preview Bukti:</p>
                                {data.receipt_image ? (
                                    data.receipt_image.type === 'application/pdf' ? (
                                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 w-fit">
                                            <span className="text-sm font-medium text-gray-700">{data.receipt_image.name}</span>
                                            <span className="text-xs text-gray-500">({(data.receipt_image.size / 1024 / 1024).toFixed(2)} MB)</span>
                                        </div>
                                    ) : (
                                        <img
                                            src={URL.createObjectURL(data.receipt_image)}
                                            alt="Preview"
                                            className="h-40 object-contain rounded-lg border border-gray-200"
                                        />
                                    )
                                ) : (
                                    inbound?.receipt_image_url?.endsWith('.pdf') ? (
                                        <a href={inbound.receipt_image_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">
                                            Lihat File PDF Saat Ini
                                        </a>
                                    ) : (
                                        <img
                                            src={inbound?.receipt_image_url}
                                            alt="Preview"
                                            className="h-40 object-contain rounded-lg border border-gray-200"
                                        />
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Detail Barang</h2>
                        <Button
                            type="button"
                            onClick={addDetail}
                            className="flex items-center gap-1.5 text-sm!"
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
