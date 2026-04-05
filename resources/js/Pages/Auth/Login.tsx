import { FormEvent, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { LogIn, Loader, Shield, TrendingUp, BarChart3, Users, Lock } from 'lucide-react';
import Button from '../../Components/Atoms/Button';
import Input from '../../Components/Atoms/Input';
import PasswordInput from '../../Components/Atoms/PasswordInput';

interface LoginPageProps {
    errors?: Record<string, string>;
}

export default function Login({ errors = {} }: LoginPageProps) {
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
        <>
            <Head title="Login - SIMPATIK" />
            {/* Desktop & Mobile Container */}
            <div 
                className="min-h-screen flex items-center justify-center px-4 py-12"
                style={{ background: 'linear-gradient(135deg, #003366 0%, #0052A3 100%)' }}
            >
                {/* Mobile: Single Column */}
                <div className="block lg:hidden w-full max-w-md">
                    {/* Card */}
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div 
                            className="px-8 py-8 text-center"
                            style={{ background: 'linear-gradient(135deg, #003366 0%, #0052A3 100%)' }}
                        >
                            <div className="flex justify-center mb-4">
                                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                    <LogIn className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-white">SIMPATIK</h1>
                            <p className="text-blue-100 text-sm mt-2">Sistem Manajemen Permintaan ATK Terpadu</p>
                            <p className="text-blue-100 text-xs mt-1">Bank Sumsel Babel</p>
                        </div>

                        {/* Form */}
                        <div className="px-8 py-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Field */}
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

                                {/* Password Field */}
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

                                {/* Remember Me */}
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

                                {/* Error Messages */}
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

                                {/* Submit Button */}
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
                        </div>

                        {/* Demo Credentials */}
                        <div className="bg-blue-50 border-t border-blue-200 px-8 py-6">
                            <p className="font-semibold text-blue-900 text-sm mb-3">Akun Demo:</p>
                            <div className="space-y-2 text-xs text-blue-800">
                                <div className="flex justify-between">
                                    <span><strong>Admin:</strong></span>
                                    <code className="bg-white px-2 py-1 rounded border border-blue-200">admin@simpatik.test</code>
                                </div>
                                <div className="flex justify-between">
                                    <span><strong>Bagian Umum:</strong></span>
                                    <code className="bg-white px-2 py-1 rounded border border-blue-200">bagianumum@simpatik.test</code>
                                </div>
                                <div className="flex justify-between">
                                    <span><strong>Pimpinan:</strong></span>
                                    <code className="bg-white px-2 py-1 rounded border border-blue-200">pimpinan@simpatik.test</code>
                                </div>
                                <div className="flex justify-between">
                                    <span><strong>Staff:</strong></span>
                                    <code className="bg-white px-2 py-1 rounded border border-blue-200">staff@simpatik.test</code>
                                </div>
                                <div className="pt-2 border-t border-blue-200 flex justify-between">
                                    <span><strong>Password:</strong></span>
                                    <code className="bg-white px-2 py-1 rounded border border-blue-200">password</code>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 text-center text-xs text-gray-600">
                            <p>© 2024 Bank Sumsel Babel. All rights reserved.</p>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 text-center text-white text-sm">
                        <p>Butuh bantuan? <a href="#" className="underline hover:no-underline">Hubungi IT Support</a></p>
                    </div>
                </div>

                {/* Desktop: Two Columns */}
                <div className="hidden lg:flex w-full max-w-7xl gap-8 items-center">
                    {/* Left Column - Login Form */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div 
                                className="px-8 py-8 text-center"
                                style={{ background: 'linear-gradient(135deg, #003366 0%, #0052A3 100%)' }}
                            >
                                <div className="flex justify-center mb-4">
                                    <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                        <LogIn className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold text-white">SIMPATIK</h1>
                                <p className="text-blue-100 text-sm mt-2">Sistem Manajemen Permintaan ATK Terpadu</p>
                                <p className="text-blue-100 text-xs mt-1">Bank Sumsel Babel</p>
                            </div>

                            {/* Form */}
                            <div className="px-8 py-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Email Field */}
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

                                    {/* Password Field */}
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

                                    {/* Remember Me */}
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

                                    {/* Error Messages */}
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

                                    {/* Submit Button */}
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
                            </div>

                            {/* Demo Credentials */}
                            <div className="bg-blue-50 border-t border-blue-200 px-8 py-6">
                                <p className="font-semibold text-blue-900 text-sm mb-3">Akun Demo:</p>
                                <div className="space-y-2 text-xs text-blue-800">
                                    <div className="flex justify-between">
                                        <span><strong>Admin:</strong></span>
                                        <code className="bg-white px-2 py-1 rounded border border-blue-200">admin@simpatik.test</code>
                                    </div>
                                    <div className="flex justify-between">
                                        <span><strong>Bagian Umum:</strong></span>
                                        <code className="bg-white px-2 py-1 rounded border border-blue-200">bagianumum@simpatik.test</code>
                                    </div>
                                    <div className="flex justify-between">
                                        <span><strong>Pimpinan:</strong></span>
                                        <code className="bg-white px-2 py-1 rounded border border-blue-200">pimpinan@simpatik.test</code>
                                    </div>
                                    <div className="flex justify-between">
                                        <span><strong>Staff:</strong></span>
                                        <code className="bg-white px-2 py-1 rounded border border-blue-200">staff@simpatik.test</code>
                                    </div>
                                    <div className="pt-2 border-t border-blue-200 flex justify-between">
                                        <span><strong>Password:</strong></span>
                                        <code className="bg-white px-2 py-1 rounded border border-blue-200">password</code>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 text-center text-xs text-gray-600">
                                <p>© 2024 Bank Sumsel Babel. All rights reserved.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Information Panel */}
                    <div className="flex-1 space-y-6">
                        {/* Title */}
                        <div className="text-white mb-8">
                            <h2 className="text-4xl font-bold mb-2">Selamat Datang</h2>
                            <p className="text-blue-100">Sistem Manajemen Permintaan ATK Terpadu</p>
                        </div>

                        {/* Feature Cards */}
                        <FeatureCard
                            icon={Shield}
                            title="Keamanan Terpercaya"
                            description="Sistem autentikasi berlapis dengan enkripsi password dan audit trail digital"
                        />

                        <FeatureCard
                            icon={TrendingUp}
                            title="Efisiensi Operasional"
                            description="Kelola permintaan ATK dengan cepat dan mudah melalui interface yang intuitif"
                        />

                        <FeatureCard
                            icon={BarChart3}
                            title="Laporan & Analitik"
                            description="Dapatkan insights mendalam tentang mutasi barang dan tren penggunaan"
                        />

                        <FeatureCard
                            icon={Users}
                            title="Kolaborasi Tim"
                            description="Bekerja bersama dengan role-based access control untuk setiap departemen"
                        />

                        {/* Support Section */}
                        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20">
                            <div className="flex items-start gap-4">
                                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                    <Lock className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Privasi Terjamin</h3>
                                    <p className="text-blue-100 text-sm">
                                        Tanda tangan digital dan data user dilindungi dengan sistem keamanan standar bank
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

interface FeatureCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
    return (
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20 hover:border-white hover:border-opacity-40 transition-all duration-300">
            <div className="flex items-start gap-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-white font-semibold mb-1">{title}</h3>
                    <p className="text-blue-100 text-sm">{description}</p>
                </div>
            </div>
        </div>
    );
}
