import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Breadcrumbs, ComingSoon } from '../../Components/UI';

export default function ReportsIndex() {
    return (
        <AuthenticatedLayout title="Laporan">
            <Head title="Laporan" />
            <Breadcrumbs items={[{ label: 'Laporan' }]} />
            <ComingSoon
                title="Laporan & Mutasi Stok"
                description="Kartu mutasi stok digital, rekonsiliasi bulanan, dan export laporan berstandar ke Excel/PDF."
            />
        </AuthenticatedLayout>
    );
}
