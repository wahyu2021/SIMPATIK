import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Breadcrumbs, ComingSoon } from '../../Components/UI';

export default function UserIndex() {
    return (
        <AuthenticatedLayout title="Pengguna">
            <Head title="Pengguna" />
            <Breadcrumbs items={[{ label: 'Pengguna' }]} />
            <ComingSoon
                title="Manajemen Pengguna"
                description="Kelola akun pegawai, atur role, dan pantau status tanda tangan digital."
            />
        </AuthenticatedLayout>
    );
}
