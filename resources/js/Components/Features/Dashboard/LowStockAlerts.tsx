import { CheckCircle } from 'lucide-react';
import { LowStockItemData, PageProps } from '../../../Types';
import { Card, Badge, EmptyState } from '../../UI';
import { ListItem, CardLink } from '../../Fragments';
import { usePage } from '@inertiajs/react';

/**
 * Komponen LowStockAlerts — kartu daftar barang yang stoknya di bawah minimum.
 * Dipakai khusus di halaman Dashboard.
 *
 * @example
 * <LowStockAlerts data={lowStockItems} />
 */
/**
 * Komponen: LowStockAlerts
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function LowStockAlerts({ data }: { data: LowStockItemData[] }) {
    const { auth } = usePage<PageProps>().props;
    const role = auth.user.roles?.[0]?.name ?? '';
    const isGeneralAffairs = role === 'general_affairs';

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
                    {isGeneralAffairs && <CardLink href="/inbound">Tambah barang masuk</CardLink>}
                </div>
            )}
        </Card>
    );
}
