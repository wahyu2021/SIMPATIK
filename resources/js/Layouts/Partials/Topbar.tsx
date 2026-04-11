import { Link, usePage, router } from '@inertiajs/react';
import { Menu, LogOut, UserCircle, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { PageProps } from '../../Types';

/**
 * Props untuk komponen Topbar.
 * @property onMenuToggle - Callback tombol hamburger (toggle mobile drawer)
 * @property onCollapseToggle - Callback toggle collapsed sidebar (desktop)
 */
interface TopbarProps {
    onMenuToggle: () => void;
}

/**
 * Komponen Topbar — header atas aplikasi.
 * Menampilkan hamburger (mobile), judul area, dan user profile dropdown.
 *
 * @example
 * <Topbar onMenuToggle={() => setMobileOpen(!mobileOpen)} />
 */
export default function Topbar({ onMenuToggle }: TopbarProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const role = user.roles?.[0]?.name?.replace(/_/g, ' ') || 'User';

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    /** Tutup dropdown saat klik di luar */
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /** Ambil inisial nama untuk avatar */
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 shrink-0">
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
                {/* ── Left: Hamburger (mobile) ── */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                {/* ── Right: User Profile ── */}
                <div className="flex items-center gap-3" ref={dropdownRef}>
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            {/* Avatar */}
                            <div className="w-9 h-9 bg-[#0052A3] rounded-lg flex items-center justify-center">
                                <span className="text-xs font-bold text-white">{getInitials(user.name)}</span>
                            </div>

                            {/* Name & Role — hidden di mobile kecil */}
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</p>
                                <p className="text-xs text-gray-500 capitalize leading-tight">{role}</p>
                            </div>

                            <ChevronDown className={`w-4 h-4 text-gray-400 hidden sm:block transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* ── Dropdown Menu ── */}
                        {dropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                {/* User Info (mobile) */}
                                <div className="sm:hidden px-4 py-2 border-b border-gray-100 mb-1">
                                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{role}</p>
                                </div>

                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    <UserCircle className="w-4 h-4 text-gray-400" />
                                    Profil Saya
                                </Link>

                                <div className="border-t border-gray-100 my-1" />

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
