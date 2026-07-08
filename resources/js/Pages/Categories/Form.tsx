import { Head, useForm, Link } from '@inertiajs/react';
import { PageProps, Category } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Button, Input, Breadcrumbs } from '../../Components/UI';

interface Props extends PageProps {
    category?: Category;
}

/**
 * Komponen: Form
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function CategoryForm({ category }: Props) {
    const isEdit = !!category;

    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/categories/${category!.id}`);
        } else {
            post('/categories');
        }
    };

    return (
        <AuthenticatedLayout title={isEdit ? 'Edit Kategori' : 'Tambah Kategori'}>
            <Head title={isEdit ? 'Edit Kategori' : 'Tambah Kategori'} />

            <Breadcrumbs items={[
                { label: 'Kategori Barang', href: '/categories' },
                { label: isEdit ? 'Edit' : 'Tambah' },
            ]} />

            <PageHeader
                title={isEdit ? 'Edit Kategori' : 'Tambah Kategori'}
                description={isEdit
                    ? `Perbarui data kategori "${category!.name}"`
                    : 'Tambahkan kategori baru untuk klasifikasi barang ATK'
                }
                backUrl="/categories"
            />

            <div className="max-w-2xl">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            id="name"
                            label="Nama Kategori"
                            placeholder="Contoh: Alat Tulis"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            required
                        />

                        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
                            </Button>
                            <Link
                                href="/categories"
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
