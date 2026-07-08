import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';

export interface ComboboxOption {
    value: string;
    label: string;
    sublabel?: string;
    disabled?: boolean;
}

interface ComboboxProps {
    id?: string;
    options: ComboboxOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    error?: string;
    disabled?: boolean;
}

/** Custom searchable dropdown — pengganti <select> native dengan search, keyboard nav, dan styling premium. */
/**
 * Komponen: Combobox
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function Combobox({
    id,
    options,
    value,
    onChange,
    placeholder = '— Pilih —',
    searchPlaceholder = 'Cari...',
    error,
    disabled,
}: ComboboxProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const selected = options.find(o => o.value === value);

    const filtered = useMemo(() => {
        if (!search) return options;
        const q = search.toLowerCase();
        return options.filter(o =>
            o.label.toLowerCase().includes(q) ||
            o.sublabel?.toLowerCase().includes(q)
        );
    }, [options, search]);

    /**\n     * [React Hook: useEffect]\n     * Dieksekusi setelah proses render selesai.\n     * Berhati-hati dengan Dependency Array agar tidak terjadi infinite loop.\n     */\n    useEffect(() => {
        if (open) {
            searchRef.current?.focus();
            setHighlightIndex(-1);
        } else {
            setSearch('');
        }
    }, [open]);

    /**\n     * [React Hook: useEffect]\n     * Dieksekusi setelah proses render selesai.\n     * Berhati-hati dengan Dependency Array agar tidak terjadi infinite loop.\n     */\n    useEffect(() => {
        const handleOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    /**\n     * [React Hook: useEffect]\n     * Dieksekusi setelah proses render selesai.\n     * Berhati-hati dengan Dependency Array agar tidak terjadi infinite loop.\n     */\n    useEffect(() => {
        if (highlightIndex >= 0 && listRef.current) {
            const el = listRef.current.children[highlightIndex] as HTMLElement;
            el?.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightIndex]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open) {
            if (e.key === 'Enter' || e.key === 'ArrowDown') {
                e.preventDefault();
                setOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightIndex(prev => {
                    let next = prev + 1;
                    while (next < filtered.length && filtered[next].disabled) next++;
                    return next < filtered.length ? next : prev;
                });
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightIndex(prev => {
                    let next = prev - 1;
                    while (next >= 0 && filtered[next].disabled) next--;
                    return next >= 0 ? next : prev;
                });
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightIndex >= 0 && filtered[highlightIndex] && !filtered[highlightIndex].disabled) {
                    onChange(filtered[highlightIndex].value);
                    setOpen(false);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setOpen(false);
                break;
        }
    };

    const selectOption = (opt: ComboboxOption) => {
        if (opt.disabled) return;
        onChange(opt.value);
        setOpen(false);
    };

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    };

    return (
        <div ref={containerRef} className="relative" id={id}>
            <button
                type="button"
                onClick={() => !disabled && setOpen(!open)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                className={`
                    w-full flex items-center justify-between px-3 py-2 border rounded-lg text-sm text-left
                    transition-all duration-150
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                    ${open ? 'ring-2 ring-blue-500 border-blue-500' : ''}
                    ${error ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'}
                `}
            >
                <span className={selected ? 'text-gray-900' : 'text-gray-400'}>
                    {selected ? selected.label : placeholder}
                </span>
                <div className="flex items-center gap-1 ml-2">
                    {value && !disabled && (
                        <span
                            role="button"
                            tabIndex={-1}
                            onClick={clearSelection}
                            className="p-0.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                ref={searchRef}
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setHighlightIndex(-1); }}
                                onKeyDown={handleKeyDown}
                                placeholder={searchPlaceholder}
                                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <ul ref={listRef} className="max-h-56 overflow-y-auto py-1">
                        {filtered.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-gray-400 text-center">
                                Tidak ditemukan
                            </li>
                        ) : (
                            filtered.map((opt, i) => {
                                const isSelected = opt.value === value;
                                const isHighlighted = i === highlightIndex;
                                return (
                                    <li
                                        key={opt.value}
                                        onClick={() => selectOption(opt)}
                                        className={`
                                            flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors
                                            ${opt.disabled ? 'text-gray-300 cursor-not-allowed' : ''}
                                            ${isHighlighted && !opt.disabled ? 'bg-blue-50' : ''}
                                            ${isSelected && !opt.disabled ? 'bg-blue-50 text-blue-700 font-medium' : ''}
                                            ${!isSelected && !isHighlighted && !opt.disabled ? 'text-gray-700 hover:bg-gray-50' : ''}
                                        `}
                                    >
                                        <div>
                                            <div>{opt.label}</div>
                                            {opt.sublabel && (
                                                <div className="text-xs text-gray-400 mt-0.5">{opt.sublabel}</div>
                                            )}
                                        </div>
                                        {isSelected && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
