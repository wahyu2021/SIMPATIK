import React, { useState, useEffect } from 'react';
import { Modal, Button, Loading, Badge } from '../../UI';
import { formatNumber } from '../../../Lib/formatters';
import { Info, Building2, Package } from 'lucide-react';
import axios from 'axios';

interface BreakdownEntry {
    department_name: string;
    total_qty: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    itemId: number | null;
    itemName: string;
    month: number;
    year: number;
}

/**
 * Modal untuk menampilkan detail pengeluaran barang per unit kerja.
 */
/**
 * Komponen: BreakdownModal
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function BreakdownModal({ isOpen, onClose, itemId, itemName, month, year }: Props) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<BreakdownEntry[]>([]);

    /**
     * [React Hook: useEffect]
     * Dieksekusi setelah proses render selesai.
     * Berhati-hati dengan Dependency Array agar tidak terjadi infinite loop.
     */
    useEffect(() => {
        if (isOpen && itemId) {
            fetchBreakdown();
        }
    }, [isOpen, itemId]);

    const fetchBreakdown = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/reports/breakdown/${itemId}`, {
                params: { month, year }
            });
            setData(response.data);
        } catch (error) {
            console.error('Failed to fetch breakdown:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalQty = data.reduce((s, r) => s + (r.total_qty || 0), 0);

    return (
        <Modal 
            open={isOpen} 
            onClose={onClose} 
            title="Breakdown Pengeluaran Barang" 
            size="lg"
        >
            <div className="space-y-6">
                {/* Header Info */}
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                        <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-900">{itemName}</h4>
                        <p className="text-xs text-blue-600 font-medium">Periode: {month}/{year}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="py-12 flex justify-center">
                        <Loading />
                    </div>
                ) : data.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Info className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p>Tidak ada data pengeluaran untuk barang ini pada periode terpilih.</p>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Unit Kerja</th>
                                    <th className="px-4 py-3 text-right font-semibold text-gray-600 w-32">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-900 font-medium">{row.department_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono font-bold text-blue-700">
                                            {formatNumber(row.total_qty)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-blue-50/50 font-bold border-t border-blue-100">
                                    <td className="px-4 py-3 text-blue-900">TOTAL SELURUH UNIT</td>
                                    <td className="px-4 py-3 text-right text-blue-900 font-mono">
                                        {formatNumber(totalQty)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <Button variant="outline" onClick={onClose}>Tutup</Button>
                </div>
            </div>
        </Modal>
    );
}
