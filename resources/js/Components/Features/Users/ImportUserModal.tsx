import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Modal, Button, Alert } from '../../UI';
import { UploadCloud, X, FileSpreadsheet } from 'lucide-react';

interface Props {
    open: boolean;
    onClose: () => void;
}

/**
 * Komponen: ImportUserModal
 *
 * [State & Rendering]
 * Merupakan komponen presentasional atau kontainer dalam arsitektur React.
 * Lifecycle dikendalikan oleh Inertia (jika Page) atau parent props (jika Component).
 */
export default function ImportUserModal({ open, onClose }: Props) {
    const { data, setData, post, processing, errors, reset, progress } = useForm<{
        file: File | null;
    }>({
        file: null,
    });

    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        setData('file', file);
    };

    const removeFile = () => {
        setData('file', null);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.import'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal open={open} onClose={onClose} title="Import Data Pengguna">
            <form onSubmit={submit} className="p-6">
                <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-4">
                        Upload file Excel (.xlsx) atau CSV hasil export dari Google Forms. Sistem akan otomatis mendeteksi kolom yang memiliki unsur kata Nama, Email, Role, dan Unit Kerja.
                    </p>

                    <div
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                        } ${data.file ? 'bg-gray-50 border-solid' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleChange}
                            disabled={processing}
                        />

                        {data.file ? (
                            <div className="flex flex-col items-center">
                                <FileSpreadsheet className="w-12 h-12 text-green-500 mb-3" />
                                <p className="text-sm font-medium text-gray-900">{data.file.name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {(data.file.size / 1024).toFixed(1)} KB
                                </p>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeFile();
                                    }}
                                    className="mt-4 px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200 z-10 relative"
                                >
                                    Ganti File
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <UploadCloud className="w-12 h-12 text-gray-400 mb-3" />
                                <p className="text-sm font-medium text-gray-900">
                                    Klik atau seret file ke area ini
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Mendukung .CSV, .XLSX, dan .XLS hingga 5MB
                                </p>
                            </div>
                        )}
                    </div>
                    {errors.file && <p className="mt-2 text-sm text-red-600">{errors.file}</p>}
                </div>

                {progress && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress.percentage}%` }}
                        ></div>
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={!data.file || processing} isLoading={processing}>
                        Mulai Import
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
