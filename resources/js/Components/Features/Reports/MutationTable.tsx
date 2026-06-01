import React, { useState } from 'react';
import { MutationCategory, MutationSummary, MutationPeriod, Signatory, MutationFilters } from '../../../Types/mutation';
import { formatNumber } from '../../../Lib/formatters';
import { Search } from 'lucide-react';
import BreakdownModal from './BreakdownModal';

interface Props {
    categories: MutationCategory[];
    summary: MutationSummary;
    period: MutationPeriod;
    signatory: Signatory;
    signerName: string;
    filters: MutationFilters;
}

/** Tabel Rekapitulasi Mutasi Barang — Fokus pada kuantitas stok sesuai arahan dosen. */
export default function MutationTable({ categories, summary, period, signatory, signerName, filters }: Props) {
    const [breakdown, setBreakdown] = useState<{ id: number; name: string } | null>(null);
    const fmtQty = (v: number) => v === 0 ? '-' : formatNumber(v);

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 text-center">
                    <p className="text-sm font-semibold text-gray-900">{signatory.company_branch}</p>
                    <p className="text-lg font-bold text-gray-900">Rekapitulasi Mutasi Alat Tulis Kantor dan Barang Cetakan</p>
                    <p className="text-sm text-gray-600">Per {period.end_label}</p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-[#003366] text-white">
                                <th className="px-3 py-3 text-center border-r border-blue-800 w-12">NO</th>
                                <th className="px-3 py-3 text-left border-r border-blue-800 min-w-[200px]">NAMA BARANG</th>
                                <th className="px-3 py-3 text-left border-r border-blue-800 w-24">SATUAN</th>
                                <th className="px-3 py-3 text-right border-r border-blue-800 w-28">STOK AWAL</th>
                                <th className="px-3 py-3 text-right border-r border-blue-800 w-28">STOK MASUK</th>
                                <th className="px-3 py-3 text-right border-r border-blue-800 w-28">PERMINTAAN</th>
                                <th className="px-3 py-3 text-right w-28">STOK AKHIR</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map((cat) => (
                                <CategoryGroup 
                                    key={cat.id} 
                                    category={cat} 
                                    fmtQty={fmtQty} 
                                    onShowBreakdown={(id, name) => setBreakdown({ id, name })} 
                                />
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-[#003366] text-white font-bold text-sm">
                                <td colSpan={3} className="px-4 py-3 text-center">GRAND TOTAL</td>
                                <td className="px-3 py-3 text-right">{fmtQty(summary.opening_qty)}</td>
                                <td className="px-3 py-3 text-right">{fmtQty(summary.inbound_qty)}</td>
                                <td className="px-3 py-3 text-right">{fmtQty(summary.outbound_qty)}</td>
                                <td className="px-3 py-3 text-right">{fmtQty(summary.closing_qty)}</td>
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

            {/* Breakdown Modal */}
            <BreakdownModal 
                isOpen={!!breakdown} 
                onClose={() => setBreakdown(null)}
                itemId={breakdown?.id || null}
                itemName={breakdown?.name || ''}
                month={filters.month}
                year={filters.year}
            />
        </>
    );
}

// ── Sub-component ──

function CategoryGroup({ category, fmtQty, onShowBreakdown }: {
    category: MutationCategory;
    fmtQty: (v: number) => string;
    onShowBreakdown: (id: number, name: string) => void;
}) {
    return (
        <>
            <tr className="bg-blue-50">
                <td colSpan={7} className="px-3 py-2 font-bold text-xs text-[#003366] uppercase tracking-wide">{category.name}</td>
            </tr>
            {category.items.map((item) => (
                <tr key={item.item_id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-3 py-2 text-center text-gray-500">{item.no}</td>
                    <td className="px-3 py-2 text-gray-900 font-medium">
                        <div className="flex items-center justify-between">
                            <span>{item.name}</span>
                            {item.outbound_qty > 0 && (
                                <button 
                                    onClick={() => onShowBreakdown(item.item_id, item.name)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-blue-600 hover:bg-blue-50 rounded transition-all title=\"Lihat Detail Pengeluaran\""
                                >
                                    <Search className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </td>
                    <td className="px-3 py-2 text-left text-gray-500">{item.unit}</td>
                    <td className="px-3 py-2 text-right text-gray-600 font-mono">{fmtQty(item.opening_qty)}</td>
                    <td className="px-3 py-2 text-right text-gray-600 font-mono">{fmtQty(item.inbound_qty)}</td>
                    <td className="px-3 py-2 text-right text-gray-600 font-mono">{fmtQty(item.outbound_qty)}</td>
                    <td className="px-3 py-2 text-right text-gray-900 font-bold font-mono">{fmtQty(item.closing_qty)}</td>
                </tr>
            ))}
            <tr className="bg-gray-50 font-semibold text-xs border-t border-gray-200">
                <td colSpan={3} className="px-4 py-2 text-right text-gray-700 italic">Subtotal {category.name}</td>
                <td className="px-3 py-2 text-right text-gray-900 font-mono">{fmtQty(category.subtotal_opening)}</td>
                <td className="px-3 py-2 text-right text-gray-900 font-mono">{fmtQty(category.subtotal_inbound)}</td>
                <td className="px-3 py-2 text-right text-gray-900 font-mono">{fmtQty(category.subtotal_outbound)}</td>
                <td className="px-3 py-2 text-right text-gray-900 font-mono">{fmtQty(category.subtotal_closing)}</td>
            </tr>
        </>
    );
}
