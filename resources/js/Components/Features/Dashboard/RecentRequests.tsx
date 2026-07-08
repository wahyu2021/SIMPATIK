import { RecentRequest } from '../../../Types';
import { Card, StatusBadge, EmptyState } from '../../UI';
import { ListItem, CardLink } from '../../Fragments';

/**
 * Komponen RecentRequests — kartu daftar 5 pengajuan terbaru.
 * Dipakai khusus di halaman Dashboard.
 *
 * @example
 * <RecentRequests data={recentRequests} />
 */
/**
 * Komponen: RecentRequests
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function RecentRequests({ data }: { data: RecentRequest[] }) {
    return (
        <Card title="Pengajuan Terbaru" description="5 pengajuan barang terakhir" noPadding>
            {data.length === 0 ? (
                <EmptyState
                    title="Belum Ada Pengajuan"
                    message="Belum ada pengajuan barang yang tercatat."
                />
            ) : (
                <div className="divide-y divide-gray-100">
                    {data.map((req) => (
                        <ListItem
                            key={req.id}
                            title={req.document_number}
                            subtitle={`${req.requester} — ${req.department}`}
                            trailing={
                                <>
                                    <span className="text-xs text-gray-400 hidden sm:block">{req.date}</span>
                                    <StatusBadge status={req.status} />
                                </>
                            }
                        />
                    ))}
                    <CardLink href="/outbound">Lihat semua pengajuan</CardLink>
                </div>
            )}
        </Card>
    );
}
