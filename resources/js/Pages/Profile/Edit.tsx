import { Head, usePage } from '@inertiajs/react';
import { PageProps, User } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Alert, Breadcrumbs } from '../../Components/UI';
import UpdateProfileForm from '../../Components/Features/Profile/UpdateProfileForm';
import UpdatePasswordForm from '../../Components/Features/Profile/UpdatePasswordForm';

interface Props extends PageProps {
    user: User;
}

export default function ProfileEdit({ user }: Props) {
    const { flash } = usePage<PageProps>().props;

    const roleLabels: Record<string, string> = {
        warehouse_admin: 'Admin Gudang',
        division_head: 'Penyelia / Kepala Unit Kerja',
        general_affairs: 'Staff Bagian Umum',
        staff: 'Staf Unit Kerja',
    };
    const roleName = user.roles?.[0]?.name ?? '';
    const roleLabel = roleLabels[roleName] || roleName;

    return (
        <AuthenticatedLayout title="Profil">
            <Head title="Profil Saya" />

            <Breadcrumbs items={[{ label: 'Profil' }]} />

            <PageHeader
                title="Profil Saya"
                description={`${roleLabel}${user.department?.name ? ` — ${user.department.name}` : ''}`}
            />

            {/* Flash Message */}
            {flash?.success && (
                <Alert type="success" className="mb-6">{flash.success}</Alert>
            )}

            {/* Sections */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                <UpdateProfileForm user={user} />
                <UpdatePasswordForm />
            </div>
        </AuthenticatedLayout>
    );
}
