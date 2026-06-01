import { Trash2, AlertTriangle } from 'lucide-react';
import { Item } from '../../../Types';
import { Input, Combobox, Label } from '../../UI';
import { ComboboxOption } from '../../UI/Combobox';

/** Shape satu baris detail pada form pengajuan. */
export interface OutboundDetailRow {
    item_id: string;
    quantity_requested: string;
    notes: string;
}

export const emptyDetail: OutboundDetailRow = { item_id: '', quantity_requested: '', notes: '' };

interface OutboundDetailRowProps {
    index: number;
    detail: OutboundDetailRow;
    items: Item[];
    usedItemIds: string[];
    errors: Record<string, string>;
    canRemove: boolean;
    onUpdate: (index: number, field: keyof OutboundDetailRow, value: string) => void;
    onRemove: (index: number) => void;
}

/** Satu baris repeater pada form pengajuan barang (pilih barang, jumlah, catatan). */
export default function OutboundDetailRowComponent({
    index, detail, items, usedItemIds, errors, canRemove, onUpdate, onRemove,
}: OutboundDetailRowProps) {
    const selectedItem = items.find(i => i.id.toString() === detail.item_id);
    const qtyExceedsStock = selectedItem && Number(detail.quantity_requested) > selectedItem.current_stock;

    const itemOptions: ComboboxOption[] = items.map((item) => ({
        value: item.id.toString(),
        label: `${item.item_code} — ${item.name}`,
        sublabel: `Stok: ${item.current_stock} ${item.unit_of_measure}`,
        disabled: usedItemIds.includes(item.id.toString()),
    }));

    return (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">
                    Item #{index + 1}
                </span>
                {canRemove && (
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-5">
                    <Label htmlFor={`detail_item_${index}`} required>Barang</Label>
                    <Combobox
                        id={`detail_item_${index}`}
                        options={itemOptions}
                        value={detail.item_id}
                        onChange={(val) => onUpdate(index, 'item_id', val)}
                        placeholder="— Cari barang —"
                        searchPlaceholder="Ketik kode atau nama barang..."
                        error={errors[`details.${index}.item_id`]}
                    />
                    {selectedItem && (
                        <p className="text-xs text-gray-400 mt-1">
                            Stok tersedia: <span className="font-medium text-gray-600">{selectedItem.current_stock} {selectedItem.unit_of_measure}</span>
                        </p>
                    )}
                </div>

                <div className="sm:col-span-3">
                    <Input
                        id={`detail_qty_${index}`}
                        label="Jumlah"
                        type="number"
                        min="1"
                        max="999999"
                        placeholder="0"
                        value={detail.quantity_requested}
                        onChange={(e) => onUpdate(index, 'quantity_requested', e.target.value)}
                        error={errors[`details.${index}.quantity_requested`]}
                        required
                    />
                    {qtyExceedsStock && (
                        <div className="flex items-start gap-1.5 mt-1.5 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-700">
                                Melebihi stok tersedia (<span className="font-semibold">{selectedItem.current_stock} {selectedItem.unit_of_measure}</span>). Pengajuan bisa ditolak saat pengeluaran barang.
                            </p>
                        </div>
                    )}
                </div>

                <div className="sm:col-span-4">
                    <Input
                        id={`detail_notes_${index}`}
                        label="Catatan (opsional)"
                        placeholder="Spesifikasi atau keterangan..."
                        value={detail.notes}
                        onChange={(e) => onUpdate(index, 'notes', e.target.value)}
                        error={errors[`details.${index}.notes`]}
                    />
                </div>
            </div>
        </div>
    );
}
