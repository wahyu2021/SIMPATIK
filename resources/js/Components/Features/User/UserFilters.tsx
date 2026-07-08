import { router } from '@inertiajs/react';
import { SearchInput, Combobox } from '../../UI';
import { ComboboxOption } from '../../UI/Combobox';
import { Department } from '../../../Types';
import useDebounce from '../../../Hooks/useDebounce';

interface UserFiltersProps {
    filters: {
        search?: string;
        department_id?: string;
        role?: string;
        is_active?: string;
    };
    departments: Department[];
    roles: Record<string, string>;
}

/** Bar filter halaman daftar pengguna — search, unit kerja, role, status. */
/**
 * Komponen: UserFilters
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function UserFilters({ filters, departments, roles }: UserFiltersProps) {
    const applyFilter = (key: string, value: string) => {
        router.get('/users', {
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

    const deptOptions: ComboboxOption[] = departments.map((d) => ({
        value: d.id.toString(),
        label: d.name,
    }));

    const roleOptions: ComboboxOption[] = Object.entries(roles).map(([value, label]) => ({
        value,
        label,
    }));

    const statusOptions: ComboboxOption[] = [
        { value: '1', label: 'Aktif' },
        { value: '0', label: 'Nonaktif' },
    ];

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
                <SearchInput
                    placeholder="Cari nama atau email..."
                    defaultValue={filters.search}
                    onSearch={debouncedSearch}
                />
            </div>
            <div className="w-full sm:w-48">
                <Combobox
                    id="dept_filter"
                    options={deptOptions}
                    value={filters.department_id || ''}
                    onChange={(val) => applyFilter('department_id', val)}
                    placeholder="Semua Unit Kerja"
                    searchPlaceholder="Cari unit kerja..."
                />
            </div>
            <div className="w-full sm:w-44">
                <Combobox
                    id="role_filter"
                    options={roleOptions}
                    value={filters.role || ''}
                    onChange={(val) => applyFilter('role', val)}
                    placeholder="Semua Role"
                    searchPlaceholder="Cari role..."
                />
            </div>
            <div className="w-full sm:w-36">
                <Combobox
                    id="status_filter"
                    options={statusOptions}
                    value={filters.is_active ?? ''}
                    onChange={(val) => applyFilter('is_active', val)}
                    placeholder="Semua Status"
                />
            </div>
        </div>
    );
}
