import { Head } from '@inertiajs/react';
import { LogIn, Shield, TrendingUp, BarChart3, Users, Lock } from 'lucide-react';
import LoginForm from '../../Components/Features/Auth/LoginForm';
import DemoCredentials from '../../Components/Features/Auth/DemoCredentials';
import FeatureCard from '../../Components/Fragments/FeatureCard';

interface LoginPageProps {
    errors?: Record<string, string>;
}

export default function Login({ errors = {} }: LoginPageProps) {
    return (
        <>
            <Head title="Login - SIMPATIK" />
            <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-linear-to-br from-[#003366] to-[#0052A3]">
                <div className="w-full max-w-md lg:max-w-6xl flex gap-20 justify-center items-center">
                    
                    {/* Kolom Kiri: Form Login */}
                    <div className="flex-1 w-full max-w-md mx-auto">
                        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                            {/* Header Form */}
                            <div className="px-8 py-8 text-center bg-linear-to-br from-[#003366] to-[#0052A3]">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                        {/* Logo atau yang lainnya */}
                                        <LogIn className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold text-white">SIMPATIK</h1>
                                <div className="text-blue-100 mt-2">
                                    <p className="block lg:hidden text-sm">Sistem Manajemen Permintaan ATK Terpadu</p>
                                    <p className="hidden lg:block text-base">Sistem Informasi Manajemen Persediaan ATK dan prediksi Kebutuhan</p>
                                </div>
                                <p className="text-blue-100 text-xs lg:text-sm mt-1">Bank Sumsel Babel</p>
                            </div>

                            {/* Area Form */}
                            <div className="px-8 py-8">
                                <LoginForm errors={errors} />
                            </div>

                            {/* Demo Credentials yang di-extract */}
                            <DemoCredentials />

                            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 text-center text-xs text-gray-600">
                                <p>© 2024 Bank Sumsel Babel. All rights reserved.</p>
                            </div>
                        </div>

                        {/* Additional Info (Only visible on Mobile view) */}
                        <div className="mt-6 text-center text-white text-sm lg:hidden">
                            <p>Butuh bantuan? <button type="button" className="underline hover:no-underline bg-transparent border-0 cursor-pointer text-white">Hubungi IT Support</button></p>
                        </div>
                    </div>

                    {/* Kolom Kanan: Feature Panel (Hanya tampak di Desktop) */}
                    <div className="hidden lg:flex flex-1 flex-col space-y-6 self-start">
                        <div className="text-white mb-8 text-center">
                            <h2 className="text-4xl font-bold mb-2">Selamat Datang</h2>
                            <p className="text-blue-100">Sistem Informasi Manajemen Persediaan ATK dan prediksi Kebutuhan</p>
                        </div>

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
                        <FeatureCard
                            icon={Lock}
                            title="Privasi Terjamin"
                            description="Tanda tangan digital dan data user dilindungi dengan sistem keamanan standar bank"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}


