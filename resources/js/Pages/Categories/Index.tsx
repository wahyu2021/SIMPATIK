import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Breadcrumbs, ComingSoon } from '../../Components/UI';

export default function CategoriesIndex() {
    return (
        <AuthenticatedLayout title="Kategori">
            <Head title="Kategori" />
            <Breadcrumbs items={[{ label: 'Kategori' }]} />
            <ComingSoon
                title="Kategori Barang"
                description="Modul pengelolaan kategori barang ATK."
            />
        </AuthenticatedLayout>
    );
}
