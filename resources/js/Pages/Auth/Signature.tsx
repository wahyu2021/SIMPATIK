import { useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Trash2, Save, PenTool } from 'lucide-react';
import Button from '../../Components/Atoms/Button';
import { User } from '../../types';

interface Props {
    user: User;
}

export default function Signature({ user }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            setIsDrawing(true);
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.lineTo(x, y);
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleSubmit = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const signatureData = canvas.toDataURL('image/png');
        setIsSubmitting(true);

        router.post(route('signature.store'), {
            signature: signatureData,
        }, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <>
            <Head title="Tanda Tangan Digital" />
            <div 
                className="min-h-screen flex items-center justify-center px-4 py-12"
                style={{ background: 'linear-gradient(135deg, #003366 0%, #0052A3 100%)' }}
            >
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div 
                            className="px-8 py-8 text-center"
                            style={{ background: 'linear-gradient(135deg, #003366 0%, #0052A3 100%)' }}
                        >
                            <div className="flex justify-center mb-4">
                                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                    <PenTool className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-white">Tanda Tangan Digital</h1>
                            <p className="text-blue-100 text-sm mt-2">Selamat datang, {user.name}!</p>
                            <p className="text-blue-100 text-xs mt-1">Silakan menggambar tanda tangan Anda untuk melanjutkan</p>
                        </div>

                        {/* Content */}
                        <div className="px-8 py-8">
                            {/* Canvas */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Kanvas Tanda Tangan
                                </label>
                                <canvas
                                    ref={canvasRef}
                                    width={300}
                                    height={150}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    className="border-2 border-gray-300 rounded-lg cursor-crosshair w-full bg-white"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 mb-6">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={clearCanvas}
                                    className="flex-1 flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Hapus
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Save className="w-5 h-5 animate-pulse" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Simpan Tanda Tangan
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                                <p className="font-semibold mb-2">Informasi Penting</p>
                                <ul className="space-y-1 text-xs">
                                    <li>✓ Tanda tangan Anda akan disimpan secara permanen</li>
                                    <li>✓ Digunakan untuk dokumen resmi (SPB/BAST)</li>
                                    <li>✓ Dapat diperbarui di menu profil</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
