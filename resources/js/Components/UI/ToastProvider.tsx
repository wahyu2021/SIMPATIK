import { Toaster, toast } from 'sonner';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { PageProps } from '@/types';

export default function ToastProvider() {
    const { flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return <Toaster richColors position="top-right" expand={false} />;
}
