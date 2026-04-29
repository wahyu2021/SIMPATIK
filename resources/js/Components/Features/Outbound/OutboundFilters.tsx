import { router } from '@inertiajs/react';
import { SearchInput, Input, Select } from '../../UI';
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

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
                <SearchInput
                    placeholder="Cari nomor dokumen atau catatan..."
                    defaultValue={filters.search}
                    onSearch={debouncedSearch}
                />
            </div>
            <div className="w-full sm:w-40">
                <Select
                    id="status_filter"
                    value={filters.status || ''}
                    onChange={(e) => applyFilter('status', e.target.value)}
                >
                    <option value="">Semua Status</option>
                    <option value="Pending">Menunggu</option>
                    <option value="Approved">Disetujui</option>
                    <option value="Issued">Diserahkan</option>
                    <option value="Rejected">Ditolak</option>
                </Select>
            </div>
            <div className="w-full sm:w-44">
                <Select
                    id="department_filter"
                    value={filters.department_id || ''}
                    onChange={(e) => applyFilter('department_id', e.target.value)}
                >
                    <option value="">Semua Unit Kerja</option>
                    {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                </Select>
            </div>
            <div className="w-full sm:w-40">
                <Input
                    id="date_from"
                    type="date"
                    label=""
                    placeholder="Dari tanggal"
                    value={filters.date_from || ''}
                    onChange={(e) => applyFilter('date_from', e.target.value)}
                />
            </div>
            <div className="w-full sm:w-40">
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
