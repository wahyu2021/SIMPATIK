import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DatePickerProps {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    error?: string;
    max?: string;
    min?: string;
    required?: boolean;
    disabled?: boolean;
    align?: 'left' | 'right' | 'auto';
}

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

/** Custom DatePicker — kalender popup yang lebih menarik dari input[type=date] native. */
/**
 * Komponen: DatePicker
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function DatePicker({
    id,
    value,
    onChange,
    label,
    placeholder = 'Pilih tanggal...',
    error,
    max,
    min,
    required,
    disabled,
    align = 'auto',
}: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const [popupAlign, setPopupAlign] = useState<'left' | 'right'>('left');
    const containerRef = useRef<HTMLDivElement>(null);

    const today = new Date();
    const selectedDate = value ? new Date(value + 'T00:00:00') : null;
    const [viewYear, setViewYear] = useState(selectedDate?.getFullYear() ?? today.getFullYear());
    const [viewMonth, setViewMonth] = useState(selectedDate?.getMonth() ?? today.getMonth());

    const maxDate = max ? new Date(max + 'T00:00:00') : null;
    const minDate = min ? new Date(min + 'T00:00:00') : null;

    /**\n     * [React Hook: useEffect]\n     * Dieksekusi setelah proses render selesai.\n     * Berhati-hati dengan Dependency Array agar tidak terjadi infinite loop.\n     */\n    useEffect(() => {
        const handleOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    // Auto-detect alignment when opening
    /**\n     * [React Hook: useEffect]\n     * Dieksekusi setelah proses render selesai.\n     * Berhati-hati dengan Dependency Array agar tidak terjadi infinite loop.\n     */\n    useEffect(() => {
        if (open && align === 'auto' && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const spaceRight = window.innerWidth - rect.right;
            setPopupAlign(spaceRight < 320 ? 'right' : 'left');
        } else if (align !== 'auto') {
            setPopupAlign(align);
        }
    }, [open, align]);

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const isDisabledDate = (date: Date) => {
        if (maxDate && date > maxDate) return true;
        if (minDate && date < minDate) return true;
        return false;
    };

    const isToday = (year: number, month: number, day: number) => {
        return year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
    };

    const isSelected = (year: number, month: number, day: number) => {
        if (!selectedDate) return false;
        return year === selectedDate.getFullYear() && month === selectedDate.getMonth() && day === selectedDate.getDate();
    };

    const selectDate = (day: number) => {
        const date = new Date(viewYear, viewMonth, day);
        if (isDisabledDate(date)) return;
        const pad = (n: number) => n.toString().padStart(2, '0');
        onChange(`${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`);
        setOpen(false);
    };

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };

    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const goToToday = () => {
        setViewYear(today.getFullYear());
        setViewMonth(today.getMonth());
    };

    const clearDate = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    };

    const formatDisplayDate = (dateStr: string) => {
        const d = new Date(dateStr + 'T00:00:00');
        return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    };

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const prevDays = getDaysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1);

    return (
        <div ref={containerRef} className="relative">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <button
                type="button"
                id={id}
                onClick={() => !disabled && setOpen(!open)}
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
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                        {value ? formatDisplayDate(value) : placeholder}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    {value && !disabled && (
                        <span
                            role="button"
                            tabIndex={-1}
                            onClick={clearDate}
                            className="p-0.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </span>
                    )}
                </div>
            </button>

            {open && (
                <div className={`absolute z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-[300px] animate-in fade-in slide-in-from-top-1 duration-150 ${popupAlign === 'right' ? 'right-0' : 'left-0'}`}>
                    <div className="flex items-center justify-between mb-3">
                        <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={goToToday} className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {MONTHS[viewMonth]} {viewYear}
                        </button>
                        <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-0.5 mb-1">
                        {DAYS.map(d => (
                            <div key={d} className="text-center text-xs font-medium text-gray-400 py-1.5">
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-0.5">
                        {Array.from({ length: firstDay }, (_, i) => (
                            <div key={`prev-${i}`} className="text-center py-1.5 text-xs text-gray-300">
                                {prevDays - firstDay + i + 1}
                            </div>
                        ))}

                        {Array.from({ length: daysInMonth }, (_, i) => {
                            const day = i + 1;
                            const date = new Date(viewYear, viewMonth, day);
                            const isDisabled = isDisabledDate(date);
                            const isSel = isSelected(viewYear, viewMonth, day);
                            const isTod = isToday(viewYear, viewMonth, day);

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => selectDate(day)}
                                    disabled={isDisabled}
                                    className={`
                                        py-1.5 text-xs rounded-lg transition-all duration-100
                                        ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-50'}
                                        ${isSel ? 'bg-blue-600 text-white hover:bg-blue-700 font-semibold' : ''}
                                        ${isTod && !isSel ? 'ring-1 ring-blue-400 text-blue-600 font-semibold' : ''}
                                        ${!isSel && !isTod && !isDisabled ? 'text-gray-700' : ''}
                                    `}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => { goToToday(); selectDate(today.getDate()); }}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            Hari ini
                        </button>
                        <span className="text-xs text-gray-400">
                            {value ? formatDisplayDate(value) : 'Belum dipilih'}
                        </span>
                    </div>
                </div>
            )}

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
