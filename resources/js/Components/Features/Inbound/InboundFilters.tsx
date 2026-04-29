import { router } from '@inertiajs/react';
import { SearchInput, Input } from '../../UI';
import useDebounce from '../../../Hooks/useDebounce';

interface InboundFiltersProps {
    filters: {
        search?: string;
        date_from?: string;
        date_to?: string;
    };
}

/** Bar filter halaman daftar barang masuk — search debounced + filter tanggal. */
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
                <Input
                    id="date_from"
                    type="date"
                    label=""
                    placeholder="Dari tanggal"
                    value={filters.date_from || ''}
                    onChange={(e) => applyFilter('date_from', e.target.value)}
                />
            </div>
            <div className="w-full sm:w-44">
                <Input
                    id="date_to"
                    type="date"
                    label=""
                    placeholder="Sampai tanggal"
                    value={filters.date_to || ''}
                    onChange={(e) => applyFilter('date_to', e.target.value)}
                />
            </div>
        </div>
    );
}
