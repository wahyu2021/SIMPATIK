import { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

interface WorkflowGuideProps {
    isAdmin: boolean;
    isPenyelia: boolean;
    canCreate: boolean;
}

const STEPS = [
    { step: '1', title: 'Buat Pengajuan', description: 'Klik "Buat Pengajuan" untuk mengajukan kebutuhan barang ATK.', roles: 'create' },
    { step: '2', title: 'Persetujuan Penyelia', description: 'Penyelia unit kerja menyetujui atau menolak melalui halaman Detail.', roles: 'penyelia' },
    { step: '3', title: 'Pengeluaran Barang', description: 'Admin Gudang mengeluarkan barang dan stok otomatis berkurang.', roles: 'admin' },
    { step: '4', title: 'Pengambilan', description: 'Pemohon mengkonfirmasi pengambilan barang di halaman Detail.', roles: 'create' },
] as const;

/** Panduan alur pengajuan — collapsible, step yang relevan di-highlight sesuai role user. */
export default function OutboundWorkflowGuide({ isAdmin, isPenyelia, canCreate }: WorkflowGuideProps) {
    const [open, setOpen] = useState(false);

    const isHighlighted = (roles: string) => {
        if (roles === 'admin') return isAdmin;
        if (roles === 'penyelia') return isPenyelia;
        return canCreate;
    };

    return (
        <div className="mb-4 bg-blue-50/70 border border-blue-200 rounded-xl overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-800">Panduan Alur Pengajuan</span>
                </div>
                {open
                    ? <ChevronUp className="w-4 h-4 text-blue-400" />
                    : <ChevronDown className="w-4 h-4 text-blue-400" />
                }
            </button>

            {open && (
                <div className="px-4 pb-4 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {STEPS.map((s) => (
                            <GuideStep key={s.step} {...s} highlight={isHighlighted(s.roles)} />
                        ))}
                    </div>
                    <p className="text-xs text-blue-500 mt-3">
                        💡 Klik <span className="font-semibold">Detail</span> pada setiap pengajuan untuk melihat riwayat, menyetujui, atau menindaklanjuti.
                    </p>
                </div>
            )}
        </div>
    );
}

/** Satu langkah pada panduan alur. */
function GuideStep({ step, title, description, highlight }: {
    step: string;
    title: string;
    description: string;
    highlight: boolean;
}) {
    return (
        <div className={`flex gap-3 p-3 rounded-lg ${highlight ? 'bg-white shadow-sm border border-blue-200' : 'bg-blue-50/50'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                highlight ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-400'
            }`}>
                {step}
            </div>
            <div>
                <p className={`text-sm font-semibold ${highlight ? 'text-gray-900' : 'text-blue-600/70'}`}>{title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}
