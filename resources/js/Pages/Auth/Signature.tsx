import { useRef, useState, useEffect, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import { Trash2, Save, PenTool } from 'lucide-react';
import Button from '../../Components/UI/Button';
import { User } from '../../Types';

interface Props {
    user: User;
}

export default function Signature({ user }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Sinkronkan ukuran internal canvas dengan ukuran fisik (CSS).
     * Ini yang menghilangkan bug offset — canvas resolution = display size.
     */
    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Set internal resolution sesuai display size × device pixel ratio
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        // Set display size via CSS
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        // Scale context untuk DPR agar goresan tajam di retina display
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.scale(dpr, dpr);
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
    }, []);

    useEffect(() => {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [resizeCanvas]);

    /** Hitung posisi titik relatif terhadap canvas (mouse & touch) */
    const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;

        const { x, y } = getPosition(e);
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            setIsDrawing(true);
            setHasDrawn(true);
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const { x, y } = getPosition(e);
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.lineTo(x, y);
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
            setHasDrawn(false);
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
                                <div
                                    ref={containerRef}
                                    className="relative w-full border-2 border-gray-300 rounded-lg bg-white overflow-hidden"
                                    style={{ height: '180px' }}
                                >
                                    <canvas
                                        ref={canvasRef}
                                        onMouseDown={startDrawing}
                                        onMouseMove={draw}
                                        onMouseUp={stopDrawing}
                                        onMouseLeave={stopDrawing}
                                        onTouchStart={startDrawing}
                                        onTouchMove={draw}
                                        onTouchEnd={stopDrawing}
                                        className="cursor-pen touch-none absolute inset-0"
                                    />
                                    {/* Placeholder text saat belum menggambar */}
                                    {!hasDrawn && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <p className="text-gray-300 text-sm select-none">
                                                Gambar tanda tangan di sini
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={clearCanvas}
                                    className="flex items-center justify-center gap-2 whitespace-nowrap"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Hapus
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !hasDrawn}
                                    className="flex-1 flex items-center justify-center gap-2 whitespace-nowrap"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Save className="w-5 h-5 animate-pulse" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Simpan
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
