import { router } from '@inertiajs/react';
import { SearchInput, DatePicker } from '../../UI';
import useDebounce from '../../../Hooks/useDebounce';

interface InboundFiltersProps {
    filters: {
        search?: string;
        date_from?: string;
        date_to?: string;
    };
}

/** Bar filter halaman daftar barang masuk — search debounced + filter tanggal. */
/**
 * Komponen: InboundFilters
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function InboundFilters({ filters }: InboundFiltersProps) {
    const applyFilter = (key: string, value: string) => {
        router.get('/inbound', {
            ...filters,
            [key]: value || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const debouncedSearch = useDebounce((value: string) => {
        applyFilter('search', value);
    }, 400);

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
                <SearchInput
                    placeholder="Cari nomor referensi atau catatan..."
                    defaultValue={filters.search}
                    onSearch={debouncedSearch}
                />
            </div>
            <div className="w-full sm:w-44">
                <DatePicker
                    id="date_from"
                    value={filters.date_from || ''}
                    onChange={(val) => applyFilter('date_from', val)}
                    placeholder="Dari tanggal"
                />
            </div>
            <div className="w-full sm:w-44">
                <DatePicker
                    id="date_to"
                    value={filters.date_to || ''}
                    onChange={(val) => applyFilter('date_to', val)}
                    placeholder="Sampai tanggal"
                />
            </div>
        </div>
    );
}
