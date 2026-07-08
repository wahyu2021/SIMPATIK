import { Head, router, usePage } from '@inertiajs/react';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { PageProps } from '../../Types';
import { ReconItem, CompletedRecon, ReconFilters } from '../../Types/reconciliation';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { PageHeader, Breadcrumbs, Combobox, Label, Alert, Button } from '../../Components/UI';
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

/**
 * Komponen: Reconciliation
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
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
            <PageHeader 
                title="Rekonsiliasi Bulanan" 
                description="Cocokkan saldo sistem dengan stok fisik aktual" 
                action={
                    <div className="flex gap-2">
                        <a href="/reports/reconciliation/export-worksheet">
                            <Button variant="secondary" className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50">
                                <FileSpreadsheet className="w-4 h-4" />
                                Worksheet Excel
                            </Button>
                        </a>
                        {reconData.status === 'completed' ? (
                            <a href={`/reports/reconciliation/export-pdf?month=${filters.month}&year=${filters.year}`} target="_blank">
                                <Button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white">
                                    <FileText className="w-4 h-4" />
                                    Berita Acara PDF
                                </Button>
                            </a>
                        ) : (
                            <Button variant="secondary" className="flex items-center gap-2 opacity-50 cursor-not-allowed" onClick={() => alert('Submit rekonsiliasi terlebih dahulu untuk bisa mencetak Berita Acara.')}>
                                <FileText className="w-4 h-4" />
                                Berita Acara PDF
                            </Button>
                        )}
                    </div>
                }
            />
            <ReportTabs active="reconciliation" />

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap items-end gap-3">
                    <div className="w-40">
                        <Label htmlFor="month">Bulan</Label>
                        <Combobox id="month" options={MONTH_OPTIONS} value={filters.month.toString()} onChange={(v) => handleFilter('month', v)} placeholder="Bulan" />
                    </div>
                    <div className="w-36">
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
