export default function DemoCredentials() {
    return (
        <div className="bg-blue-50 border-t border-blue-200 px-8 py-6">
            <p className="font-semibold text-blue-900 text-sm mb-3">Akun Demo:</p>
            <div className="space-y-2 text-xs text-blue-800">
                <div className="flex justify-between">
                    <span><strong>Admin:</strong></span>
                    <code className="bg-white px-2 py-1 rounded border border-blue-200">admin@simpatik.test</code>
                </div>
                <div className="flex justify-between">
                    <span><strong>Bagian Umum:</strong></span>
                    <code className="bg-white px-2 py-1 rounded border border-blue-200">bagianumum@simpatik.test</code>
                </div>
                <div className="flex justify-between">
                    <span><strong>Pimpinan:</strong></span>
                    <code className="bg-white px-2 py-1 rounded border border-blue-200">pimpinan@simpatik.test</code>
                </div>
                <div className="flex justify-between">
                    <span><strong>Staff:</strong></span>
                    <code className="bg-white px-2 py-1 rounded border border-blue-200">staff@simpatik.test</code>
                </div>
                <div className="pt-2 border-t border-blue-200 flex justify-between">
                    <span><strong>Password:</strong></span>
                    <code className="bg-white px-2 py-1 rounded border border-blue-200">password</code>
                </div>
            </div>
        </div>
    );
}
