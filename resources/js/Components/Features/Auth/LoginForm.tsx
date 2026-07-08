import { FormEvent, useState } from 'react';
import { router } from '@inertiajs/react';
import { LogIn, Loader } from 'lucide-react';
import Button from '../../UI/Button';
import Input from '../../UI/Input';
import PasswordInput from '../../UI/PasswordInput';

interface LoginFormProps {
    errors?: Record<string, string>;
}

/**
 * Komponen: LoginForm
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function LoginForm({ errors = {} }: LoginFormProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.post(route('login'), formData, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                id="email"
                type="email"
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="admin@simpatik.test"
                disabled={isSubmitting}
                required
                autoComplete="email"
            />

            <PasswordInput
                id="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Masukkan password"
                disabled={isSubmitting}
                required
                autoComplete="current-password"
            />

            <div className="flex items-center pt-2">
                <input
                    id="remember"
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-900 focus:ring-blue-600 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                    Ingat saya di perangkat ini
                </label>
            </div>

            {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-semibold text-sm mb-2">Gagal Login</p>
                    <ul className="space-y-1 text-sm">
                        {Object.entries(errors).map(([key, message]) => (
                            <li key={key}>• {message}</li>
                        ))}
                    </ul>
                </div>
            )}

            <Button
                type="submit"
                disabled={isSubmitting}
                variant="primary"
                size="md"
                className="w-full font-semibold flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Sedang login...
                    </>
                ) : (
                    <>
                        <LogIn className="w-5 h-5" />
                        Login
                    </>
                )}
            </Button>
        </form>
    );
}
