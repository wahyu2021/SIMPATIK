import { router } from '@inertiajs/react';
import { SearchInput, Combobox, DatePicker } from '../../UI';
import { ComboboxOption } from '../../UI/Combobox';
import useDebounce from '../../../Hooks/useDebounce';
import { Department } from '../../../Types';

interface OutboundFiltersProps {
    filters: {
        search?: string;
        status?: string;
        department_id?: string;
        date_from?: string;
        date_to?: string;
    };
    departments: Department[];
}

const statusOptions: ComboboxOption[] = [
    { value: 'Pending', label: 'Menunggu' },
    { value: 'Approved', label: 'Disetujui' },
    { value: 'Issued', label: 'Diserahkan' },
    { value: 'Rejected', label: 'Ditolak' },
];

/** Bar filter halaman pengajuan barang — search, status, unit kerja, tanggal. */
export default function OutboundFilters({ filters, departments }: OutboundFiltersProps) {
    const applyFilter = (key: string, value: string) => {
        router.get('/outbound', {
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

    const deptOptions: ComboboxOption[] = departments.map((dept) => ({
        value: dept.id.toString(),
        label: dept.name,
    }));

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
                <SearchInput
                    placeholder="Cari nomor dokumen atau catatan..."
                    defaultValue={filters.search}
                    onSearch={debouncedSearch}
                />
            </div>
            <div className="w-full sm:w-44">
                <Combobox
                    id="status_filter"
                    options={statusOptions}
                    value={filters.status || ''}
                    onChange={(val) => applyFilter('status', val)}
                    placeholder="Semua Status"
                    searchPlaceholder="Cari status..."
                />
            </div>
            <div className="w-full sm:w-48">
                <Combobox
                    id="department_filter"
                    options={deptOptions}
                    value={filters.department_id || ''}
                    onChange={(val) => applyFilter('department_id', val)}
                    placeholder="Semua Unit Kerja"
                    searchPlaceholder="Cari unit kerja..."
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
