import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { PageProps, Item, Department, OutboundTransaction } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Button, Combobox, Breadcrumbs, Textarea, Label, DatePicker } from '../../Components/UI';
import { ComboboxOption } from '../../Components/UI/Combobox';
import OutboundDetailRowComponent, { OutboundDetailRow, emptyDetail } from '../../Components/Features/Outbound/OutboundDetailRow';
/**
 * Komponen: Outbound/Form
 *
 * [Fungsionalitas]
 * Formulir interaktif untuk pengajuan barang keluar (Outbound Request).
 * Komponen ini menangani manajemen state keranjang barang (items array) dan validasi dasar
 * di sisi klien (Client-side validation) sebelum dikirim via Inertia Form Helper.
 */
import { normalizeDate } from '../../Lib/formatters';

interface Props extends PageProps {
    items: Item[];
    departments: Department[];
    nextDocument?: string;
    outbound?: OutboundTransaction;
}

/**
 * Halaman form pengajuan barang — mendukung mode Buat dan Edit.
 * 
 * [Inertia Data Flow]
 * - \`items\` dan \`departments\` dipassing langsung dari Controller sebagai master data (Prop).
 * - \`outbound\` dipassing HANYA jika dalam mode Edit (Berisi data transaksi yang sedang diedit).
 * 
 * @param props Props dari Inertia Server (Controller)
 */
/**
 * Komponen: Form
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function OutboundForm({ items, departments, nextDocument, outbound }: Props) {
    const { auth } = usePage<PageProps>().props;
    const isEdit = !!outbound;

    const initialDetails: OutboundDetailRow[] = isEdit
        ? (outbound.details ?? []).map(d => ({
            item_id: d.item_id.toString(),
            quantity_requested: d.quantity_requested.toString(),
            notes: d.notes ?? '',
        }))
        : [{ ...emptyDetail }];

    const initialDetails: OutboundDetailRow[] = isEdit
        ? (outbound.details ?? []).map(d => ({
            item_id: d.item_id.toString(),
            quantity_requested: d.quantity_requested.toString(),
            notes: d.notes ?? '',
        }))
        : [{ ...emptyDetail }];

    /**
     * [State Management via Inertia useForm]
     * Mengelola seluruh data keranjang belanja dan metadata form.
     * Mengikat nilai (data-binding) langsung ke UI komponen.
     * 'data' memegang payload JSON yang akan dikirim ke endpoint store/update.
     */
    const { data, setData, post, put, processing, errors } = useForm({
        department_id: isEdit
            ? outbound.department_id.toString()
            : (auth.user.department_id?.toString() || ''),
        transaction_date: isEdit
            ? normalizeDate(outbound.transaction_date)
            : normalizeDate(),
        is_special_request: isEdit ? outbound.is_special_request : false,
        notes: isEdit ? (outbound.notes ?? '') : '',
        details: initialDetails,
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
        // [Inertia Submit Logic]
        // Jika isEdit true, gunakan method PUT ke rute update.
        // Jika false, gunakan method POST ke rute store.
        // Inertia otomatis mem-bypass reload halaman dan menangani error validasi (302).
        if (isEdit) {
            put(`/outbound/${outbound.id}`);
        } else {
            post('/outbound');
        }
    };

    const pageTitle = isEdit ? 'Edit Pengajuan Barang' : 'Buat Pengajuan Barang';
    const documentNumber = isEdit ? outbound.document_number : nextDocument;

    return (
        <AuthenticatedLayout title={pageTitle}>
            <Head title={pageTitle} />

            <Breadcrumbs items={[
                { label: 'Pengajuan Barang', href: '/outbound' },
                { label: isEdit ? 'Edit Pengajuan' : 'Buat Pengajuan' },
            ]} />

            <PageHeader
                title={pageTitle}
                description={isEdit
                    ? `Edit pengajuan ${outbound.document_number}`
                    : 'Ajukan kebutuhan ATK untuk unit kerja Anda'
                }
                backUrl={isEdit ? `/outbound/${outbound.id}` : '/outbound'}
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pengajuan</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="document_number">No. Dokumen</Label>
                            <div className="mt-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono font-medium text-gray-700 border border-gray-200">
                                {documentNumber || 'Auto-generated'}
                            </div>
                        </div>

                        <DatePicker
                            id="transaction_date"
                            label="Tanggal Pengajuan"
                            max={new Date().toISOString().split('T')[0]}
                            value={data.transaction_date}
                            onChange={(val) => setData('transaction_date', val)}
                            error={errors.transaction_date}
                            required
                        />

                        <div>
                            <Label htmlFor="department_id">Unit Kerja</Label>
                            <div className="mt-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
                                {auth.user.department?.name ?? 'Tidak ada unit'}
                            </div>
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
                            {processing
                                ? 'Menyimpan...'
                                : isEdit ? 'Simpan Perubahan' : 'Kirim Pengajuan'
                            }
                        </Button>
                        <Link
                            href={isEdit ? `/outbound/${outbound.id}` : '/outbound'}
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
