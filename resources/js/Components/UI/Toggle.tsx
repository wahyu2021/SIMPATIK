interface ToggleProps {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export default function Toggle({ label, description, checked, onChange, disabled = false }: ToggleProps) {
    return (
        <label className={`flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && onChange(!checked)}
                className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
                    ${checked ? 'bg-[#0052A3]' : 'bg-gray-300'}
                `}
            >
                <span
                    className={`
                        inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200
                        ${checked ? 'translate-x-6' : 'translate-x-1'}
                    `}
                />
            </button>
            <div>
                <span className="text-sm font-medium text-gray-900">{label}</span>
                {description && (
                    <p className="text-xs text-gray-500">{description}</p>
                )}
            </div>
        </label>
    );
}
