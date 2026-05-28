import { OutboundStatus } from '../../../Types';

interface OutboundProgressTrackerProps {
    status: OutboundStatus;
}

const AFTER_PENDING: OutboundStatus[] = ['Approved', 'Issued', 'Handed Over', 'Completed', 'Rejected'];
const AFTER_APPROVED: OutboundStatus[] = ['Issued', 'Handed Over', 'Completed'];
const AFTER_ISSUED: OutboundStatus[] = ['Handed Over', 'Completed'];
const AFTER_HANDOVER: OutboundStatus[] = ['Completed'];

/**
 * Visualisasi progres pengajuan dalam 5 langkah horizontal.
 *
 * Pengajuan → Penyelia → Admin Gudang → Diserahkan → Diterima
 */
export default function OutboundProgressTracker({ status }: OutboundProgressTrackerProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Progres Pengajuan</h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <StepIndicator
                    step={1}
                    label="Pengajuan"
                    active={status === 'Pending'}
                    completed={AFTER_PENDING.includes(status)}
                    rejected={status === 'Rejected'}
                />
                <StepConnector active={AFTER_APPROVED.includes(status)} />
                <StepIndicator
                    step={2}
                    label="Penyelia"
                    active={status === 'Approved'}
                    completed={AFTER_APPROVED.includes(status)}
                />
                <StepConnector active={AFTER_ISSUED.includes(status)} />
                <StepIndicator
                    step={3}
                    label="Admin Gudang"
                    active={status === 'Issued'}
                    completed={AFTER_ISSUED.includes(status)}
                />
                <StepConnector active={AFTER_HANDOVER.includes(status)} />
                <StepIndicator
                    step={4}
                    label="Diserahkan"
                    active={status === 'Handed Over'}
                    completed={AFTER_HANDOVER.includes(status)}
                />
                <StepConnector active={status === 'Completed'} />
                <StepIndicator
                    step={5}
                    label="Diterima"
                    active={false}
                    completed={status === 'Completed'}
                />
            </div>
        </div>
    );
}

function StepIndicator({ step, label, active, completed, rejected }: {
    step: number;
    label: string;
    active: boolean;
    completed: boolean;
    rejected?: boolean;
}) {
    let circleClass = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ';
    let labelClass = 'text-xs mt-1.5 font-medium text-center ';

    if (rejected) {
        circleClass += 'bg-red-100 text-red-600 border-2 border-red-300';
        labelClass += 'text-red-500';
    } else if (completed) {
        circleClass += 'bg-emerald-500 text-white shadow-sm';
        labelClass += 'text-emerald-600';
    } else if (active) {
        circleClass += 'bg-blue-500 text-white shadow-sm ring-4 ring-blue-100';
        labelClass += 'text-blue-600';
    } else {
        circleClass += 'bg-gray-100 text-gray-400 border-2 border-gray-200';
        labelClass += 'text-gray-400';
    }

    return (
        <div className="flex flex-col items-center min-w-[72px]">
            <div className={circleClass}>
                {completed ? '✓' : rejected ? '✕' : step}
            </div>
            <span className={labelClass}>{label}</span>
        </div>
    );
}

function StepConnector({ active }: { active: boolean }) {
    return (
        <div className={`flex-1 h-0.5 min-w-[24px] mt-[-16px] rounded-full transition-colors ${
            active ? 'bg-emerald-400' : 'bg-gray-200'
        }`} />
    );
}
