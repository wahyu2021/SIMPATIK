import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Breadcrumbs, ComingSoon } from '../../Components/UI';

export default function SettingsIndex() {
    return (
        <AuthenticatedLayout title="Pengaturan">
            <Head title="Pengaturan" />
            <Breadcrumbs items={[{ label: 'Pengaturan' }]} />
            <ComingSoon
                title="Pengaturan Sistem"
                description="Konfigurasi batas minimum stok, pengaturan notifikasi, dan preferensi sistem lainnya."
            />
        </AuthenticatedLayout>
    );
}
