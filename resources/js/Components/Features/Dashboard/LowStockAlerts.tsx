import { CheckCircle } from 'lucide-react';
import { Card, Badge, EmptyState } from '../../UI';
import { ListItem, CardLink } from '../../Fragments';

/**
 * Data satu barang stok rendah dari DashboardService.
 */
export interface LowStockItemData {
    id: number;
    name: string;
    item_code: string;
    category: string;
    current_stock: number;
    minimum_stock: number;
    unit: string;
}

/**
 * Komponen LowStockAlerts — kartu daftar barang yang stoknya di bawah minimum.
 * Dipakai khusus di halaman Dashboard.
 *
 * @example
 * <LowStockAlerts data={lowStockItems} />
 */
export default function LowStockAlerts({ data }: { data: LowStockItemData[] }) {
    return (
        <Card title="Peringatan Stok Rendah" description="Barang yang perlu segera di-restock" noPadding>
            {data.length === 0 ? (
                <EmptyState
                    title="Stok Aman"
                    message="Semua barang memiliki stok di atas batas minimum."
                    icon={CheckCircle}
                />
            ) : (
                <div className="divide-y divide-gray-100">
                    {data.map((item) => (
                        <ListItem
                            key={item.id}
                            title={item.name}
                            subtitle={`${item.item_code} — ${item.category}`}
                            trailing={
                                <Badge variant={item.current_stock === 0 ? 'danger' : 'warning'} size="md">
                                    {item.current_stock} / {item.minimum_stock} {item.unit}
                                </Badge>
                            }
                        />
                    ))}
                    <CardLink href="/inbound">Tambah barang masuk</CardLink>
                </div>
            )}
        </Card>
    );
}
