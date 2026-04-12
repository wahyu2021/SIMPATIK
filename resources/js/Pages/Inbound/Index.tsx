import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Breadcrumbs, ComingSoon } from '../../Components/UI';

export default function InboundIndex() {
    return (
        <AuthenticatedLayout title="Barang Masuk">
            <Head title="Barang Masuk" />
            <Breadcrumbs items={[{ label: 'Barang Masuk' }]} />
            <ComingSoon
                title="Barang Masuk"
                description="Modul pencatatan penerimaan barang dari vendor. Catat stok masuk, nomor surat jalan, dan harga per satuan."
            />
        </AuthenticatedLayout>
    );
}
