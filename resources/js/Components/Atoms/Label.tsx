interface LabelProps {
    htmlFor?: string;
    required?: boolean;
    children: React.ReactNode;
}

export default function Label({ htmlFor, required = false, children }: LabelProps) {
    return (
        <label 
            htmlFor={htmlFor}
            className="block text-sm font-medium text-gray-700 mb-2"
        >
            {children}
            {required && <span className="text-red-500">*</span>}
        </label>
    );
}
