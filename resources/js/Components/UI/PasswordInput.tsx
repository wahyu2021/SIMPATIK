import { InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}

/**
 * Komponen: PasswordInput
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function PasswordInput({ error, label, className = '', ...props }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {props.required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    {...props}
                    type={showPassword ? 'text' : 'password'}
                    className={`
                        w-full px-3 py-2 pr-10 border rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-600
                        disabled:bg-gray-100 disabled:cursor-not-allowed
                        ${error ? 'border-red-500' : 'border-gray-300'}
                        ${className}
                    `}
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    tabIndex={-1}
                    title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                    {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
