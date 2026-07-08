import { Head, useForm } from '@inertiajs/react';
import { PageProps, Item, Category } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Button, Input, Combobox, Label, Breadcrumbs } from '../../Components/UI';
import { ComboboxOption } from '../../Components/UI/Combobox';

interface Props extends PageProps {
    item?: Item;
    categories: Category[];
    nextCode?: string;
}

/**
 * Komponen: Form
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function ItemForm({ item, categories, nextCode }: Props) {
    const isEdit = !!item;

    const { data, setData, post, put, processing, errors } = useForm({
        category_id: item?.category_id?.toString() || '',
        name: item?.name || '',
        unit_of_measure: item?.unit_of_measure || '',
        unit_price: item?.unit_price?.toString() || '',
        current_stock: item?.current_stock?.toString() || '0',
        minimum_stock_level: item?.minimum_stock_level?.toString() || '0',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/items/${item!.id}`);
        } else {
            post('/items');
        }
    };

    return (
        <AuthenticatedLayout title={isEdit ? 'Edit Barang' : 'Tambah Barang'}>
            <Head title={isEdit ? 'Edit Barang' : 'Tambah Barang'} />

            <Breadcrumbs items={[
                { label: 'Barang', href: '/items' },
                { label: isEdit ? 'Edit' : 'Tambah' },
            ]} />

            <PageHeader
                title={isEdit ? 'Edit Barang' : 'Tambah Barang'}
                description={isEdit ? `Perbarui data barang ${item!.item_code}` : `Kode barang: ${nextCode}`}
                backUrl="/items"
            />

            <div className="max-w-4xl">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Kategori */}
                        <div>
                            <Label htmlFor="category_id" required>Kategori</Label>
                            <Combobox
                                id="category_id"
                                options={categories.map((cat): ComboboxOption => ({
                                    value: cat.id.toString(),
                                    label: cat.name,
                                }))}
                                value={data.category_id}
                                onChange={(val) => setData('category_id', val)}
                                placeholder="— Cari kategori —"
                                searchPlaceholder="Ketik nama kategori..."
                                error={errors.category_id}
                            />
                        </div>

                        {/* Nama Barang */}
                        <Input
                            id="name"
                            label="Nama Barang"
                            placeholder="Contoh: Kertas HVS A4 70gr"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            required
                        />

                        {/* Satuan & Harga */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                id="unit_of_measure"
                                label="Satuan"
                                placeholder="Contoh: rim, pcs, box"
                                value={data.unit_of_measure}
                                onChange={(e) => setData('unit_of_measure', e.target.value)}
                                error={errors.unit_of_measure}
                                required
                            />
                            <Input
                                id="unit_price"
                                label="Harga Satuan (Opsional)"
                                type="number"
                                min="0"
                                step="100"
                                placeholder="0"
                                value={data.unit_price}
                                onChange={(e) => setData('unit_price', e.target.value)}
                                error={errors.unit_price}
                            />
                        </div>

                        {/* Stok & Minimum */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {!isEdit && (
                                <Input
                                    id="current_stock"
                                    label="Stok Awal"
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={data.current_stock}
                                    onChange={(e) => setData('current_stock', e.target.value)}
                                    error={errors.current_stock}
                                    required
                                />
                            )}
                            <Input
                                id="minimum_stock_level"
                                label="Stok Minimum"
                                type="number"
                                min="0"
                                placeholder="0"
                                value={data.minimum_stock_level}
                                onChange={(e) => setData('minimum_stock_level', e.target.value)}
                                error={errors.minimum_stock_level}
                                required
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
                            </Button>
                            <a
                                href="/items"
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Batal
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
