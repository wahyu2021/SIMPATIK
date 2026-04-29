import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { PageProps, InboundTransaction } from '../../Types';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { Breadcrumbs, Button, Badge } from '../../Components/UI';
import { formatCurrency, formatDateLong, formatNumber } from '../../Lib/formatters';

interface Props extends PageProps {
    inbound: InboundTransaction;
}

/** Halaman detail transaksi barang masuk. */
export default function InboundShow({ inbound }: Props) {
    const details = inbound.details ?? [];
    const grandTotal = details.reduce((sum, d) => sum + d.quantity * d.unit_price, 0);
    const totalItems = details.reduce((sum, d) => sum + d.quantity, 0);

    return (
        <AuthenticatedLayout title="Detail Barang Masuk">
            <Head title={`Detail — ${inbound.reference_number}`} />

            <Breadcrumbs items={[
                { label: 'Barang Masuk', href: '/inbound' },
                { label: inbound.reference_number },
            ]} />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/inbound"
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Detail Barang Masuk</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Transaksi penerimaan barang dari vendor
                        </p>
                    </div>
                </div>
                <Link href={`/inbound/${inbound.id}/edit`}>
                    <Button className="flex items-center gap-2">
                        <Pencil className="w-4 h-4" />
                        Edit
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Transaksi</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">No. Referensi</dt>
                        <dd className="mt-1 text-sm font-mono font-semibold text-gray-900">
                            {inbound.reference_number}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Tanggal Transaksi</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {formatDateLong(inbound.transaction_date)}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Dicatat Oleh</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {inbound.user?.name ?? '-'}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Dicatat Pada</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {formatDateLong(inbound.created_at)}
                        </dd>
                    </div>
                </div>

                {inbound.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <dt className="text-sm font-medium text-gray-500">Catatan</dt>
                        <dd className="mt-1 text-sm text-gray-700">{inbound.notes}</dd>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Detail Barang
                        <Badge variant="info" className="ml-2">{details.length} item</Badge>
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">No</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kode</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Barang</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Jumlah</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Harga Satuan</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {details.map((detail, index) => {
                                const subtotal = detail.quantity * detail.unit_price;
                                return (
                                    <tr key={detail.id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm font-mono text-gray-500">
                                            {detail.item?.item_code ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {detail.item?.name ?? '-'}
                                            <span className="text-gray-400 ml-1">({detail.item?.unit_of_measure})</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                                            {formatNumber(detail.quantity)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 text-right">
                                            {formatCurrency(detail.unit_price)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                                            {formatCurrency(subtotal)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-50 border-t-2 border-gray-200">
                                <td colSpan={3} className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">
                                    Total ({formatNumber(totalItems)} unit)
                                </td>
                                <td colSpan={3} className="px-6 py-4 text-lg font-bold text-gray-900 text-right">
                                    {formatCurrency(grandTotal)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
