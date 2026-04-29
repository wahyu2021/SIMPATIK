import { Head, useForm, Link } from '@inertiajs/react';
import { PageProps, User, Department } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Button, Input, Combobox, Label, Breadcrumbs } from '../../Components/UI';
import { ComboboxOption } from '../../Components/UI/Combobox';

interface Props extends PageProps {
    user?: User;
    departments: Department[];
    roles: Record<string, string>;
}

export default function UserForm({ user, departments, roles }: Props) {
    const isEdit = !!user;

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        department_id: user?.department_id?.toString() || '',
        role: user?.roles?.[0]?.name || '',
        is_active: user?.is_active ?? true,
    });

    const deptOptions: ComboboxOption[] = departments.map((d) => ({
        value: d.id.toString(),
        label: d.name,
    }));

    const roleOptions: ComboboxOption[] = Object.entries(roles).map(([value, label]) => ({
        value,
        label,
    }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/users/${user!.id}`);
        } else {
            post('/users');
        }
    };

    return (
        <AuthenticatedLayout title={isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}>
            <Head title={isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'} />

            <Breadcrumbs items={[
                { label: 'Pengguna', href: '/users' },
                { label: isEdit ? 'Edit' : 'Tambah' },
            ]} />

            <PageHeader
                title={isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}
                description={isEdit ? `Perbarui data ${user!.name}` : 'Buat akun pengguna baru untuk akses sistem'}
                backUrl="/users"
            />

            <div className="max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Info Akun */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Akun</h2>

                        <div className="space-y-4">
                            <Input
                                id="name"
                                label="Nama Lengkap"
                                placeholder="Contoh: Andi Setiawan"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                required
                            />

                            <Input
                                id="email"
                                label="Email"
                                type="email"
                                placeholder="contoh@simpatik.test"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={errors.email}
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    id="password"
                                    label={isEdit ? 'Password Baru (opsional)' : 'Password'}
                                    type="password"
                                    placeholder={isEdit ? 'Kosongkan jika tidak diubah' : 'Min. 8 karakter'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                    required={!isEdit}
                                />
                                <Input
                                    id="password_confirmation"
                                    label="Konfirmasi Password"
                                    type="password"
                                    placeholder="Ulangi password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required={!isEdit || !!data.password}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Role & Departemen */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Role & Penempatan</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="role" required>Role</Label>
                                <Combobox
                                    id="role"
                                    options={roleOptions}
                                    value={data.role}
                                    onChange={(val) => setData('role', val)}
                                    placeholder="— Pilih Role —"
                                    searchPlaceholder="Cari role..."
                                    error={errors.role}
                                />
                            </div>
                            <div>
                                <Label htmlFor="department_id" required>Unit Kerja</Label>
                                <Combobox
                                    id="department_id"
                                    options={deptOptions}
                                    value={data.department_id}
                                    onChange={(val) => setData('department_id', val)}
                                    placeholder="— Pilih Unit Kerja —"
                                    searchPlaceholder="Cari unit kerja..."
                                    error={errors.department_id}
                                />
                            </div>
                        </div>

                        {/* Status Aktif */}
                        <div className="mt-4 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setData('is_active', !data.is_active)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                    data.is_active ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow ${
                                        data.is_active ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                            <Label htmlFor="is_active">
                                {data.is_active ? 'Akun Aktif' : 'Akun Nonaktif'}
                            </Label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
                            </Button>
                            <Link
                                href="/users"
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Batal
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
