import { SaldistatCategory, SaldistatSummary, SaldistatPeriod, Signatory, SaldistatFilters } from '../../../Types/saldistat';
import { formatCurrency, formatNumber } from '../../../Lib/formatters';

interface Props {
    categories: SaldistatCategory[];
    summary: SaldistatSummary;
    period: SaldistatPeriod;
    signatory: Signatory;
    signerName: string;
    filters: SaldistatFilters;
}

/** Tabel Saldistat ATK — grouped by kategori, subtotal, grand total, footer TTD. */
export default function SaldistatTable({ categories, summary, period, signatory, signerName }: Props) {
    const fmtQty = (v: number) => v === 0 ? '-' : formatNumber(v);
    const fmtVal = (v: number) => v === 0 ? '-' : formatCurrency(v);
    const fmtPrice = (v: number) => formatNumber(v);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 text-center">
                <p className="text-sm font-semibold text-gray-900">{signatory.company_branch}</p>
                <p className="text-lg font-bold text-gray-900">Saldistat Alat Tulis Kantor dan Barang Cetakan</p>
                <p className="text-sm text-gray-600">Per {period.end_label}</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="bg-[#003366] text-white">
                            <th rowSpan={2} className="px-2 py-2 text-center border-r border-blue-800 w-10">NO</th>
                            <th rowSpan={2} className="px-2 py-2 text-left border-r border-blue-800 min-w-[180px]">JENIS BARANG</th>
                            <th colSpan={3} className="px-2 py-1.5 text-center border-r border-blue-800">SALDO AWAL</th>
                            <th colSpan={3} className="px-2 py-1.5 text-center border-r border-blue-800">PENERIMAAN</th>
                            <th colSpan={3} className="px-2 py-1.5 text-center border-r border-blue-800">PENGELUARAN</th>
                            <th colSpan={3} className="px-2 py-1.5 text-center">SALDO AKHIR</th>
                        </tr>
                        <tr className="bg-[#004080] text-white text-[10px]">
                            <th className="px-2 py-1 text-right border-r border-blue-700 w-14">QTY</th>
                            <th className="px-2 py-1 text-right border-r border-blue-700 w-20">HARGA</th>
                            <th className="px-2 py-1 text-right border-r border-blue-700 w-24">JUMLAH</th>
                            <th className="px-2 py-1 text-right border-r border-blue-700 w-14">QTY</th>
                            <th className="px-2 py-1 text-right border-r border-blue-700 w-20">HARGA</th>
                            <th className="px-2 py-1 text-right border-r border-blue-700 w-24">JUMLAH</th>
                            <th className="px-2 py-1 text-right border-r border-blue-700 w-14">QTY</th>
                            <th className="px-2 py-1 text-right border-r border-blue-700 w-20">HARGA</th>
                            <th className="px-2 py-1 text-right border-r border-blue-700 w-24">JUMLAH</th>
                            <th className="px-2 py-1 text-right border-r border-blue-700 w-14">QTY</th>
                            <th className="px-2 py-1 text-right border-r border-blue-700 w-20">HARGA</th>
                            <th className="px-2 py-1 text-right w-24">JUMLAH</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map((cat) => (
                            <CategoryGroup key={cat.id} category={cat} fmtQty={fmtQty} fmtVal={fmtVal} fmtPrice={fmtPrice} />
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-[#003366] text-white font-bold text-xs">
                            <td colSpan={4} className="px-3 py-2.5 text-center">GRAND TOTAL</td>
                            <td className="px-2 py-2.5 text-right">{fmtVal(summary.opening_value)}</td>
                            <td colSpan={2} className="px-2 py-2.5"></td>
                            <td className="px-2 py-2.5 text-right">{fmtVal(summary.inbound_value)}</td>
                            <td colSpan={2} className="px-2 py-2.5"></td>
                            <td className="px-2 py-2.5 text-right">{fmtVal(summary.outbound_value)}</td>
                            <td colSpan={2} className="px-2 py-2.5"></td>
                            <td className="px-2 py-2.5 text-right">{fmtVal(summary.closing_value)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Footer — TTD */}
            <div className="px-6 py-8 border-t border-gray-200">
                <div className="flex justify-end">
                    <div className="text-center text-sm text-gray-700">
                        <p>Palembang, {period.end_label}</p>
                        <p className="font-medium">Unit Umum Akuntansi</p>
                        <div className="h-16"></div>
                        <p className="font-bold underline">{signerName}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Sub-component ──

function CategoryGroup({ category, fmtQty, fmtVal, fmtPrice }: {
    category: SaldistatCategory;
    fmtQty: (v: number) => string;
    fmtVal: (v: number) => string;
    fmtPrice: (v: number) => string;
}) {
    return (
        <>
            <tr className="bg-blue-50">
                <td colSpan={14} className="px-3 py-1.5 font-bold text-xs text-[#003366] uppercase tracking-wide">{category.name}</td>
            </tr>
            {category.items.map((item) => (
                <tr key={item.item_id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-2 py-1.5 text-center text-gray-500">{item.no}</td>
                    <td className="px-2 py-1.5 text-gray-900 font-medium">{item.name}</td>
                    <td className="px-2 py-1.5 text-right text-gray-600">{fmtQty(item.opening_qty)}</td>
                    <td className="px-2 py-1.5 text-right text-gray-500">{fmtPrice(item.unit_price)}</td>
                    <td className="px-2 py-1.5 text-right text-gray-900">{fmtVal(item.opening_value)}</td>
                    <td className="px-2 py-1.5 text-right text-gray-600">{fmtQty(item.inbound_qty)}</td>
                    <td className="px-2 py-1.5 text-right text-gray-500">{fmtPrice(item.unit_price)}</td>
                    <td className="px-2 py-1.5 text-right text-gray-900">{fmtVal(item.inbound_value)}</td>
                    <td className="px-2 py-1.5 text-right text-gray-600">{fmtQty(item.outbound_qty)}</td>
                    <td className="px-2 py-1.5 text-right text-gray-500">{fmtPrice(item.unit_price)}</td>
                    <td className="px-2 py-1.5 text-right text-gray-900">{fmtVal(item.outbound_value)}</td>
                    <td className="px-2 py-1.5 text-right text-gray-600">{fmtQty(item.closing_qty)}</td>
                    <td className="px-2 py-1.5 text-right text-gray-500">{fmtPrice(item.unit_price)}</td>
                    <td className="px-2 py-1.5 text-right text-gray-900 font-medium">{fmtVal(item.closing_value)}</td>
                </tr>
            ))}
            <tr className="bg-gray-50 font-semibold text-xs border-t border-gray-200">
                <td colSpan={4} className="px-3 py-1.5 text-right text-gray-700">Subtotal {category.name}</td>
                <td className="px-2 py-1.5 text-right text-gray-900">{fmtVal(category.subtotal_opening)}</td>
                <td colSpan={2} className="px-2 py-1.5"></td>
                <td className="px-2 py-1.5 text-right text-gray-900">{fmtVal(category.subtotal_inbound)}</td>
                <td colSpan={2} className="px-2 py-1.5"></td>
                <td className="px-2 py-1.5 text-right text-gray-900">{fmtVal(category.subtotal_outbound)}</td>
                <td colSpan={2} className="px-2 py-1.5"></td>
                <td className="px-2 py-1.5 text-right text-gray-900">{fmtVal(category.subtotal_closing)}</td>
            </tr>
        </>
    );
}
