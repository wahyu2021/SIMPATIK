import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Breadcrumbs, ComingSoon } from '../../Components/UI';

export default function OutboundIndex() {
    return (
        <AuthenticatedLayout title="Pengajuan Barang">
            <Head title="Pengajuan Barang" />
            <Breadcrumbs items={[{ label: 'Pengajuan Barang' }]} />
            <ComingSoon
                title="Pengajuan Barang"
                description="Modul pengajuan kebutuhan ATK oleh unit kerja. Alur: pengajuan → persetujuan penyelia → penyerahan barang oleh admin gudang."
            />
        </AuthenticatedLayout>
    );
}
