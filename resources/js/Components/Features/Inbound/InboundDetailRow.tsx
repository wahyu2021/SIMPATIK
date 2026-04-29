import { Trash2 } from 'lucide-react';
import { Item } from '../../../Types';
import { Input, Select, Label } from '../../UI';
import { formatCurrency } from '../../../Lib/formatters';

/** Shape satu baris detail repeater. */
export interface DetailRow {
    item_id: string;
    quantity: string;
    unit_price: string;
}


export const emptyDetail: DetailRow = { item_id: '', quantity: '', unit_price: '' };

interface InboundDetailRowProps {
    index: number;
    detail: DetailRow;
    items: Item[];
    usedItemIds: string[];
    errors: Record<string, string>;
    canRemove: boolean;
    onUpdate: (index: number, field: keyof DetailRow, value: string) => void;
    onRemove: (index: number) => void;
}

/** Satu baris repeater detail barang masuk (pilih barang, jumlah, harga, subtotal). */
export default function InboundDetailRow({
    index,
    detail,
    items,
    usedItemIds,
    errors,
    canRemove,
    onUpdate,
    onRemove,
}: InboundDetailRowProps) {
    const selectedItem = items.find(i => i.id.toString() === detail.item_id);

    const getSubtotal = (): number => {
        const qty = parseInt(detail.quantity) || 0;
        const price = parseFloat(detail.unit_price) || 0;
        return qty * price;
    };

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
                    <Select
                        id={`detail_item_${index}`}
                        value={detail.item_id}
                        onChange={(e) => onUpdate(index, 'item_id', e.target.value)}
                        error={errors[`details.${index}.item_id`]}
                    >
                        <option value="">— Pilih Barang —</option>
                        {items.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                                disabled={usedItemIds.includes(item.id.toString())}
                            >
                                {item.item_code} — {item.name} ({item.unit_of_measure})
                            </option>
                        ))}
                    </Select>
                    {selectedItem && (
                        <p className="text-xs text-gray-400 mt-1">
                            Stok saat ini: <span className="font-medium text-gray-600">{selectedItem.current_stock} {selectedItem.unit_of_measure}</span>
                        </p>
                    )}
                </div>

                <div className="sm:col-span-2">
                    <Input
                        id={`detail_qty_${index}`}
                        label="Jumlah"
                        type="number"
                        min="1"
                        max="999999"
                        placeholder="0"
                        value={detail.quantity}
                        onChange={(e) => onUpdate(index, 'quantity', e.target.value)}
                        error={errors[`details.${index}.quantity`]}
                        required
                    />
                </div>

                <div className="sm:col-span-3">
                    <Input
                        id={`detail_price_${index}`}
                        label="Harga Satuan (Rp)"
                        type="number"
                        min="0"
                        step="100"
                        placeholder="0"
                        value={detail.unit_price}
                        onChange={(e) => onUpdate(index, 'unit_price', e.target.value)}
                        error={errors[`details.${index}.unit_price`]}
                        required
                    />
                </div>

                <div className="sm:col-span-2">
                    <Label>Subtotal</Label>
                    <div className="mt-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
                        {formatCurrency(getSubtotal())}
                    </div>
                </div>
            </div>
        </div>
    );
}
