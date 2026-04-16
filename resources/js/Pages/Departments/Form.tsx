import { Head, useForm, Link } from '@inertiajs/react';
import { PageProps, Department } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Button, Input, Breadcrumbs } from '../../Components/UI';

interface Props extends PageProps {
    department?: Department;
}

export default function DepartmentForm({ department }: Props) {
    const isEdit = !!department;

    const { data, setData, post, put, processing, errors } = useForm({
        name: department?.name || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/departments/${department!.id}`);
        } else {
            post('/departments');
        }
    };

    return (
        <AuthenticatedLayout title={isEdit ? 'Edit Unit Kerja' : 'Tambah Unit Kerja'}>
            <Head title={isEdit ? 'Edit Unit Kerja' : 'Tambah Unit Kerja'} />

            <Breadcrumbs items={[
                { label: 'Unit Kerja', href: '/departments' },
                { label: isEdit ? 'Edit' : 'Tambah' },
            ]} />

            <PageHeader
                title={isEdit ? 'Edit Unit Kerja' : 'Tambah Unit Kerja'}
                description={isEdit
                    ? `Perbarui data unit kerja "${department!.name}"`
                    : 'Tambahkan unit kerja baru ke dalam sistem'
                }
                backUrl="/departments"
            />

            <div className="max-w-2xl">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nama Unit Kerja */}
                        <Input
                            id="name"
                            label="Nama Unit Kerja"
                            placeholder="Contoh: Customer Service"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            required
                        />

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
                            </Button>
                            <Link
                                href="/departments"
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
