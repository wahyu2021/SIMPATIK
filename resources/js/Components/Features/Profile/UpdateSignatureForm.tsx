import { useRef, useState, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { Trash2, Save, RefreshCw } from 'lucide-react';
import { Button } from '../../UI';

interface Props {
    signatureUrl?: string | null;
}

/**
 * Komponen UpdateSignatureForm — tampil tanda tangan saat ini + canvas untuk menggambar ulang.
 * Menggunakan logika canvas yang sama dengan halaman Signature onboarding.
 */
export default function UpdateSignatureForm({ signatureUrl }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [showCanvas, setShowCanvas] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

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
        if (showCanvas) {
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            return () => window.removeEventListener('resize', resizeCanvas);
        }
    }, [showCanvas, resizeCanvas]);

    const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
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

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
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

    const stopDrawing = () => setIsDrawing(false);

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
        setIsSubmitting(true);
        router.put('/profile/signature', {
            signature: canvas.toDataURL('image/png'),
        }, {
            onFinish: () => {
                setIsSubmitting(false);
                setShowCanvas(false);
                setHasDrawn(false);
            },
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Tanda Tangan</h2>
            <p className="text-sm text-gray-500 mb-5">Tanda tangan digital Anda untuk dokumen resmi.</p>

            {/* Tanda tangan saat ini */}
            {signatureUrl && !showCanvas && (
                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Tanda tangan saat ini:</p>
                    <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 inline-block">
                        <img
                            src={signatureUrl}
                            alt="Tanda tangan"
                            className="h-20 object-contain"
                        />
                    </div>
                </div>
            )}

            {/* Toggle canvas */}
            {!showCanvas ? (
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowCanvas(true)}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Ubah Tanda Tangan
                </Button>
            ) : (
                <div className="space-y-3">
                    <div
                        ref={containerRef}
                        className="relative w-full max-w-md border-2 border-gray-300 rounded-lg bg-white overflow-hidden"
                        style={{ height: '150px' }}
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
                        {!hasDrawn && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <p className="text-gray-300 text-sm select-none">Gambar tanda tangan baru</p>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button type="button" variant="secondary" onClick={clearCanvas} className="flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            Hapus
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !hasDrawn}
                            className="flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                        <button
                            type="button"
                            onClick={() => { setShowCanvas(false); setHasDrawn(false); }}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
