import { useForm } from '@inertiajs/react';
import { User } from '../../../Types';
import { Input, Button } from '../../UI';

interface Props {
    user: User;
}

/**
 * Komponen UpdateProfileForm — form edit nama dan email.
 */
export default function UpdateProfileForm({ user }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/profile/update');
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Informasi Profil</h2>
            <p className="text-sm text-gray-500 mb-5">Perbarui nama dan email akun Anda.</p>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <Input
                    id="name"
                    label="Nama Lengkap"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    error={errors.name}
                    required
                />
                <Input
                    id="email"
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    required
                />
                <Button type="submit" disabled={processing}>
                    {processing ? 'Menyimpan...' : 'Simpan'}
                </Button>
            </form>
        </div>
    );
}
