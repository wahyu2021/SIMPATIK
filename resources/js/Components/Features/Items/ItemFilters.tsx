import { router } from '@inertiajs/react';
import { SearchInput, Select } from '../../UI';
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

/**
 * Komponen ItemFilters — bar filter untuk halaman daftar barang.
 * Terdiri dari search (debounced), filter kategori, dan filter stok rendah.
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

    // Debounce search 400ms — supaya tidak kirim request setiap ketikan
    const debouncedSearch = useDebounce((value: string) => {
        applyFilter('search', value);
    }, 400);

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
                <Select
                    value={filters.category_id || ''}
                    onChange={(e) => applyFilter('category_id', e.target.value)}
                >
                    <option value="">Semua Kategori</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </Select>
            </div>
            <div className="w-full sm:w-44">
                <Select
                    value={filters.low_stock || ''}
                    onChange={(e) => applyFilter('low_stock', e.target.value)}
                >
                    <option value="">Semua Stok</option>
                    <option value="1">Stok Rendah</option>
                </Select>
            </div>
        </div>
    );
}
