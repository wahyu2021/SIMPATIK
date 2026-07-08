import { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Plus, 
    Trash2, 
    Save, 
    User, 
    Building2, 
    Calendar, 
    PackagePlus,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import { PageProps, Item, Department, User as UserType } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { 
    PageHeader, 
    Button, 
    Input, 
    Combobox, 
    Label, 
    Breadcrumbs, 
    Card,
    Textarea,
    Alert,
    ConfirmDialog
} from '../../Components/UI';

interface Props extends PageProps {
    items: Item[];
    departments: Department[];
    users: UserType[];
}

interface DetailItem {
    item_id: string;
    quantity: number;
    notes: string;
}

/**
 * Form khusus Admin Gudang untuk mencatat pengambilan barang langsung (bypass approval).
 */
/**
 * Komponen: DirectForm
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function DirectRequestForm({ items, departments, users }: Props) {
    const { auth } = usePage<PageProps>().props;
    const [confirmOpen, setConfirmOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        requester_id: '',
        department_id: '',
        transaction_date: new Date().toISOString().split('T')[0],
        is_special_request: false,
        notes: '',
        details: [] as DetailItem[],
    });

    // Option lists
    const itemOptions = items.map(i => ({ 
        value: i.id.toString(), 
        label: `${i.item_code} - ${i.name} (${i.current_stock} ${i.unit_of_measure})` 
    }));

    const deptOptions = departments.map(d => ({ 
        value: d.id.toString(), 
        label: d.name 
    }));

    const userOptions = users.map(u => ({
        value: u.id.toString(),
        label: `${u.name} (${u.roles?.[0]?.name ?? 'User'})`
    }));

    // Actions
    const addDetail = () => {
        setData('details', [...data.details, { item_id: '', quantity: 1, notes: '' }]);
    };

    const removeDetail = (index: number) => {
        setData('details', data.details.filter((_, i) => i !== index));
    };

    const updateDetail = (index: number, field: keyof DetailItem, value: any) => {
        const newDetails = [...data.details];
        newDetails[index] = { ...newDetails[index], [field]: value };
        setData('details', newDetails);
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        setConfirmOpen(false);
        post(route('outbound.store-direct'));
    };

    // Auto-fill department saat user dipilih
    /**\n     * [React Hook: useEffect]\n     * Dieksekusi setelah proses render selesai.\n     * Berhati-hati dengan Dependency Array agar tidak terjadi infinite loop.\n     */\n    useEffect(() => {
        if (data.requester_id) {
            const selectedUser = users.find(u => u.id.toString() === data.requester_id);
            if (selectedUser?.department_id) {
                setData('department_id', selectedUser.department_id.toString());
            }
        }
    }, [data.requester_id]);

    return (
        <AuthenticatedLayout title="Input Pengambilan Langsung">
            <Head title="Input Pengambilan Langsung" />

            <Breadcrumbs items={[
                { label: 'Pengajuan Barang', href: route('outbound.index') },
                { label: 'Pengambilan Langsung' }
            ]} />

            <div className="mb-6">
                <Link
                    href={route('outbound.index')}
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar
                </Link>
            </div>

            <PageHeader 
                title="Input Pengambilan Langsung" 
                description="Catat barang yang diambil langsung dari gudang (bypass approval)."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Utama */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Informasi Pihak Pengambil</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="requester_id">Staf Pengambil</Label>
                                <Combobox 
                                    id="requester_id"
                                    options={userOptions}
                                    value={data.requester_id}
                                    onChange={(v) => setData('requester_id', v)}
                                    placeholder="Pilih Staf..."
                                    error={errors.requester_id}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department_id">Unit Kerja</Label>
                                <Combobox 
                                    id="department_id"
                                    options={deptOptions}
                                    value={data.department_id}
                                    onChange={(v) => setData('department_id', v)}
                                    placeholder="Pilih Unit..."
                                    error={errors.department_id}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="transaction_date">Tanggal Pengambilan</Label>
                                <Input 
                                    id="transaction_date"
                                    type="date"
                                    value={data.transaction_date}
                                    onChange={(e) => setData('transaction_date', e.target.value)}
                                    error={errors.transaction_date}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <PackagePlus className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg">Daftar Barang yang Diambil</h3>
                            </div>
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={addDetail}
                                className="flex items-center gap-1.5"
                            >
                                <Plus className="w-4 h-4" /> Tambah Barang
                            </Button>
                        </div>

                        {data.details.length === 0 ? (
                            <div className="py-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <PackagePlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">Belum ada barang yang ditambahkan.</p>
                                <button 
                                    type="button" 
                                    onClick={addDetail}
                                    className="mt-2 text-sm text-blue-600 hover:underline"
                                >
                                    Klik di sini untuk menambah baris
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {data.details.map((detail, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                                        <div className="flex-1 space-y-2">
                                            <Label>Barang</Label>
                                            <Combobox 
                                                options={itemOptions}
                                                value={detail.item_id}
                                                onChange={(v) => updateDetail(index, 'item_id', v)}
                                                placeholder="Cari barang..."
                                            />
                                        </div>
                                        <div className="w-full sm:w-32 space-y-2">
                                            <Label>Jumlah</Label>
                                            <Input 
                                                type="number"
                                                min="1"
                                                value={detail.quantity}
                                                onChange={(e) => updateDetail(index, 'quantity', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => removeDetail(index)}
                                            className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-600 transition-colors bg-white rounded-lg border border-gray-200 shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {errors.details && <p className="mt-4 text-sm text-red-600">{errors.details}</p>}
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="p-6 bg-blue-600 text-white border-0 shadow-lg shadow-blue-200">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> Konfirmasi Admin
                        </h3>
                        <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                            Pencatatan ini akan langsung memotong stok di gudang dan melewati alur persetujuan penyelia. Pastikan formulir fisik sudah valid.
                        </p>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-blue-50">Catatan Internal</Label>
                                <Textarea 
                                    id="notes"
                                    placeholder="Alasan pengambilan langsung..."
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/50"
                                />
                            </div>

                            <Button 
                                type="button"
                                className="w-full bg-white text-blue-600 hover:bg-blue-50 border-0 h-11 text-base font-bold shadow-md"
                                onClick={() => setConfirmOpen(true)}
                                disabled={processing || data.details.length === 0}
                            >
                                <Save className="w-5 h-5 mr-2" /> Simpan Transaksi
                            </Button>
                        </div>
                    </Card>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-800 leading-relaxed">
                            <strong>Penting:</strong> Gunakan fitur ini hanya untuk pengambilan mendadak atau unit yang tidak terdaftar di sistem persetujuan digital (seperti Satpam).
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog 
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleSubmit}
                title="Simpan Pengambilan Langsung?"
                message="Transaksi akan langsung dicatat, stok akan dipotong, dan status menjadi 'Disetujui Gudang'. Lanjutkan?"
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}
