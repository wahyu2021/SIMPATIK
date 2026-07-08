import { router } from '@inertiajs/react';
import { SearchInput, Combobox } from '../../UI';
import { ComboboxOption } from '../../UI/Combobox';
import { Category } from '../../../Types';
import useDebounce from '../../../Hooks/useDebounce';

interface ItemFiltersProps {
    filters: {
        search?: string;
        category_id?: string;
        low_stock?: string;
    };
    categories: Category[];
}

const stockOptions: ComboboxOption[] = [
    { value: '1', label: 'Stok Rendah' },
];

/** Komponen ItemFilters — bar filter untuk halaman daftar barang. */
/**
 * Komponen: ItemFilters
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function ItemFilters({ filters, categories }: ItemFiltersProps) {
    const applyFilter = (key: string, value: string) => {
        router.get('/items', {
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

    const categoryOptions: ComboboxOption[] = categories.map((cat) => ({
        value: cat.id.toString(),
        label: cat.name,
    }));

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
                <SearchInput
                    placeholder="Cari nama atau kode barang..."
                    defaultValue={filters.search}
                    onSearch={debouncedSearch}
                />
            </div>
            <div className="w-full sm:w-48">
                <Combobox
                    id="category_filter"
                    options={categoryOptions}
                    value={filters.category_id || ''}
                    onChange={(val) => applyFilter('category_id', val)}
                    placeholder="Semua Kategori"
                    searchPlaceholder="Cari kategori..."
                />
            </div>
            <div className="w-full sm:w-44">
                <Combobox
                    id="stock_filter"
                    options={stockOptions}
                    value={filters.low_stock || ''}
                    onChange={(val) => applyFilter('low_stock', val)}
                    placeholder="Semua Stok"
                />
            </div>
        </div>
    );
}
