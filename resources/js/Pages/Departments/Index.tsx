import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Breadcrumbs, ComingSoon } from '../../Components/UI';

export default function DepartmentsIndex() {
    return (
        <AuthenticatedLayout title="Unit Kerja">
            <Head title="Unit Kerja" />
            <Breadcrumbs items={[{ label: 'Unit Kerja' }]} />
            <ComingSoon
                title="Unit Kerja"
                description="Modul pengelolaan data unit kerja kantor cabang."
            />
        </AuthenticatedLayout>
    );
}
