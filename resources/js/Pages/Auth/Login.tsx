import { Head } from '@inertiajs/react';
import LoginForm from '../../Components/Features/Auth/LoginForm';

interface LoginPageProps {
    errors?: Record<string, string>;
}

export default function Login({ errors = {} }: LoginPageProps) {
    return (
        <>
            <Head title="Login" />

            {/* Animasi entrance via CSS keyframes */}
            <style>{`
                @keyframes loginEntrance {
                    from {
                        opacity: 0;
                        transform: translateY(24px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .login-card-enter {
                    animation: loginEntrance 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
            `}</style>

            {/* Full-screen background dengan overlay */}
            <div
                className="relative min-h-screen flex items-center justify-center px-4 py-12"
                style={{
                    backgroundImage: 'url(/images/login-bg.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: '#003366',
                }}
            >
                {/* Overlay gelap semi-transparan */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#001a33]/80 via-[#003366]/70 to-[#0052A3]/60" />

                {/* Card form login — single column centered */}
                <div className="relative z-10 w-full max-w-md login-card-enter">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

                        {/* Header: Logo + Branding */}
                        <div className="px-8 pt-10 pb-6 text-center">
                            <div className="flex justify-center mb-5">
                                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                    <img
                                        src="/images/logo.webp"
                                        alt="Logo SIMPATIK"
                                        className="w-11 h-11 object-contain"
                                    />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                                SIMPATIK
                            </h1>
                            <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
                                Sistem Informasi Manajemen Persediaan ATK
                            </p>
                            <p className="text-slate-400 text-xs mt-0.5">
                                Bank Sumsel Babel
                            </p>
                        </div>

                        {/* Pemisah halus */}
                        <div className="mx-8 border-t border-slate-100" />

                        {/* Area Form Login */}
                        <div className="px-8 py-8">
                            <LoginForm errors={errors} />
                        </div>

                        {/* Footer copyright */}
                        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
                            <p className="text-xs text-slate-400">
                                © {new Date().getFullYear()} Bank Sumsel Babel. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
