import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { menuGroups, type MenuGroup } from '../../Config/navigation';
import { PageProps } from '../../Types';

/**
 * Props untuk komponen Sidebar.
 * @property collapsed - Apakah sidebar dalam mode collapsed (hanya icon)
 * @property onToggle - Callback toggle collapsed/expanded
 * @property onClose - Callback tutup drawer (mobile only)
 */
interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    onClose?: () => void;
}

/**
 * Filter menu groups berdasarkan role user.
 * Jika item.roles kosong/undefined, menu ditampilkan untuk semua role.
 */
function filterMenuByRole(groups: MenuGroup[], userRole: string): MenuGroup[] {
    return groups
        .map((group) => ({
            ...group,
            items: group.items.filter(
                (item) => !item.roles || item.roles.length === 0 || item.roles.includes(userRole)
            ),
        }))
        .filter((group) => group.items.length > 0);
}

/**
 * Komponen Sidebar — navigasi utama SIMPATIK di sisi kiri.
 * Mendukung mode collapsed (icon only), expanded (full label), dan mobile drawer.
 * Warna menggunakan BSB Dark Blue (#003366) dengan aksen BSB Blue (#0052A3).
 * Menu di-filter berdasarkan role user yang login.
 *
 * @example
 * <Sidebar collapsed={false} onToggle={() => setCollapsed(!collapsed)} />
 */
export default function Sidebar({ collapsed, onToggle, onClose }: SidebarProps) {
    const { url, props } = usePage<PageProps>();
    const userRole = props.auth.user.roles?.[0]?.name ?? '';
    const filteredGroups = filterMenuByRole(menuGroups, userRole);

    /** Cek apakah menu ini aktif berdasarkan URL saat ini */
    const isActive = (routeMatch: string) => {
        if (routeMatch === '/dashboard') return url === '/dashboard';
        return url.startsWith(routeMatch);
    };

    return (
        <aside
            className={`
                flex flex-col h-full bg-[#003366] text-white overflow-hidden
                transition-all duration-300 ease-in-out
                ${collapsed ? 'w-[72px]' : 'w-[260px]'}
            `}
        >
            {/* ── Logo Area ── */}
            <div className={`
                flex items-center h-16 border-b border-white/10 shrink-0
                ${collapsed ? 'justify-center px-2' : 'px-5'}
            `}>
                {collapsed ? (
                    <span className="text-xl font-bold text-white tracking-tight">S</span>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
                            <span className="text-sm font-bold text-white">S</span>
                        </div>
                        <div>
                            <h1 className="text-base font-bold tracking-tight leading-none">SIMPATIK</h1>
                            <p className="text-[10px] text-blue-200/70 leading-none mt-0.5">Bank Sumsel Babel</p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Menu Groups ── */}
            <nav className="flex-1 overflow-x-hidden overflow-y-auto py-4 sidebar-scrollbar">
                {filteredGroups.map((group) => (
                    <div key={group.title} className="mb-4">
                        {/* Group Title — hidden saat collapsed */}
                        {!collapsed && (
                            <p className="px-5 mb-2 text-[11px] font-semibold uppercase tracking-wider text-blue-300/60">
                                {group.title}
                            </p>
                        )}

                        {/* Menu Items */}
                        <ul className="space-y-1 px-3">
                            {group.items.map((item) => {
                                const active = isActive(item.routeMatch);
                                const Icon = item.icon;

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={onClose}
                                            className={`
                                                group relative flex items-center gap-3 rounded-lg
                                                transition-all duration-200
                                                ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                                                ${active
                                                    ? 'bg-[#0052A3] text-white shadow-lg shadow-blue-900/30'
                                                    : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
                                                }
                                            `}
                                        >
                                            <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-white' : ''}`} />

                                            {/* Label — hidden saat collapsed */}
                                            {!collapsed && (
                                                <span className="text-sm font-medium truncate">{item.label}</span>
                                            )}

                                            {/* Active indicator bar */}
                                            {active && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full" />
                                            )}

                                            {/* Tooltip saat collapsed */}
                                            {collapsed && (
                                                <div className="
                                                    invisible opacity-0 group-hover:visible group-hover:opacity-100
                                                    absolute left-full ml-3 px-3 py-1.5
                                                    bg-gray-900 text-white text-xs font-medium rounded-lg
                                                    shadow-xl whitespace-nowrap z-50
                                                    transition-all duration-200 pointer-events-none
                                                ">
                                                    {item.label}
                                                    <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-gray-900 rotate-45" />
                                                </div>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* ── Collapse Toggle (Desktop Only) ── */}
            <div className="hidden lg:block border-t border-white/10 p-3 shrink-0">
                <button
                    onClick={onToggle}
                    className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg
                        text-blue-200/60 hover:bg-white/10 hover:text-white
                        transition-all duration-200
                        ${collapsed ? 'justify-center' : ''}
                    `}
                    title={collapsed ? 'Perluas sidebar' : 'Perkecil sidebar'}
                >
                    <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
                    {!collapsed && <span className="text-sm font-medium">Perkecil</span>}
                </button>
            </div>
        </aside>
    );
}
