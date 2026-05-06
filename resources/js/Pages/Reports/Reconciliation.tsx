import { Head, router, usePage } from '@inertiajs/react';
import { PageProps } from '../../Types';
import { ReconItem, CompletedRecon, ReconFilters } from '../../Types/reconciliation';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Breadcrumbs, Combobox, Label, Alert } from '../../Components/UI';
import { MONTH_OPTIONS, getYearOptions } from '../../Lib/constants';
import ReportTabs from '../../Components/Features/Reports/ReportTabs';
import CompletedReconciliation from '../../Components/Features/Reports/CompletedReconciliation';
import ReconciliationForm from '../../Components/Features/Reports/ReconciliationForm';

interface Props extends PageProps {
    reconData: {
        status: 'pending' | 'completed';
        items?: ReconItem[];
        reconciliation?: CompletedRecon;
    };
    filters: ReconFilters;
}

export default function Reconciliation({ reconData, filters }: Props) {
    const { flash } = usePage<PageProps>().props;

    const handleFilter = (key: string, value: string) => {
        router.get('/reports/reconciliation', { ...filters, [key]: value || undefined },
            { preserveState: true, preserveScroll: true });
    };

    return (
        <AuthenticatedLayout title="Rekonsiliasi">
            <Head title="Rekonsiliasi Bulanan" />
            <Breadcrumbs items={[{ label: 'Laporan', href: '/reports' }, { label: 'Rekonsiliasi' }]} />
            <PageHeader title="Rekonsiliasi Bulanan" description="Cocokkan saldo sistem dengan stok fisik aktual" />
            <ReportTabs active="reconciliation" />

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap items-end gap-3">
                    <div className="w-36">
                        <Label htmlFor="month">Bulan</Label>
                        <Combobox id="month" options={MONTH_OPTIONS} value={filters.month.toString()} onChange={(v) => handleFilter('month', v)} placeholder="Bulan" />
                    </div>
                    <div className="w-28">
                        <Label htmlFor="year">Tahun</Label>
                        <Combobox id="year" options={getYearOptions()} value={filters.year.toString()} onChange={(v) => handleFilter('year', v)} placeholder="Tahun" />
                    </div>
                </div>
            </div>

            {flash?.success && <Alert type="success" className="mb-4">{flash.success}</Alert>}

            {reconData.status === 'completed'
                ? <CompletedReconciliation reconciliation={reconData.reconciliation!} />
                : <ReconciliationForm items={reconData.items!} filters={filters} />
            }
        </AuthenticatedLayout>
    );
}
