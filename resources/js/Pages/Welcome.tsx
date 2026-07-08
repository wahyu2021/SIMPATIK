import { Link, Head } from '@inertiajs/react';

interface Props {
    canLogin: boolean;
    canRegister: boolean;
}

/**
 * Komponen: Welcome
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function Welcome({ canLogin, canRegister }: Props) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Welcome to SIMPATIK
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Laravel + Inertia.js + React + TypeScript
                    </p>
                    
                    {canLogin && (
                        <div className="space-x-4">
                            <Link
                                href="/login"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Log in
                            </Link>
                            
                            {canRegister && (
                                <Link
                                    href="/register"
                                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                >
                                    Register
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
