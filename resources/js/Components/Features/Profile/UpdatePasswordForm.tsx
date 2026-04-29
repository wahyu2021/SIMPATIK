import { useForm } from '@inertiajs/react';
import { Input, Button } from '../../UI';

/**
 * Komponen UpdatePasswordForm — form ganti password.
 */
export default function UpdatePasswordForm() {
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/profile/password', {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Ubah Password</h2>
            <p className="text-sm text-gray-500 mb-5">Pastikan akun Anda menggunakan password yang kuat.</p>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <Input
                    id="current_password"
                    label="Password Saat Ini"
                    type="password"
                    value={data.current_password}
                    onChange={(e) => setData('current_password', e.target.value)}
                    error={errors.current_password}
                    required
                />
                <Input
                    id="password"
                    label="Password Baru"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                    required
                />
                <Input
                    id="password_confirmation"
                    label="Konfirmasi Password Baru"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    error={errors.password_confirmation}
                    required
                />
                <Button type="submit" disabled={processing}>
                    {processing ? 'Mengubah...' : 'Ubah Password'}
                </Button>
            </form>
        </div>
    );
}
