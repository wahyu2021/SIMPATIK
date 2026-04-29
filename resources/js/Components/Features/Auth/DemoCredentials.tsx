import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyableProps {
    label: string;
    value: string;
}

function Copyable({ label, value }: CopyableProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="flex items-center justify-between">
            <span><strong>{label}:</strong></span>
            <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer group"
                title={`Copy ${value}`}
            >
                <code className="text-blue-800">{value}</code>
                {copied ? (
                    <Check className="w-3 h-3 text-green-600" />
                ) : (
                    <Copy className="w-3 h-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
            </button>
        </div>
    );
}

export default function DemoCredentials() {
    return (
        <div className="bg-blue-50 border-t border-blue-200 px-8 py-6">
            <p className="font-semibold text-blue-900 text-sm mb-3">Akun Demo:</p>
            <div className="space-y-2 text-xs text-blue-800">
                <Copyable label="Admin Gudang" value="admin@simpatik.test" />
                <Copyable label="Bagian Umum" value="bagianumum@simpatik.test" />
                <Copyable label="Penyelia" value="penyelia@simpatik.test" />
                <Copyable label="Staff" value="staff@simpatik.test" />
                <div className="pt-2 border-t border-blue-200">
                    <Copyable label="Password" value="password" />
                </div>
            </div>
        </div>
    );
}
