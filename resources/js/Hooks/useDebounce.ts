import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook useDebounce — menunda eksekusi callback sampai user berhenti mengetik.
 * Mencegah spam request ke server saat search/filter.
 *
 * @param callback - Fungsi yang mau di-debounce
 * @param delay - Waktu tunda dalam milidetik (default: 300ms)
 * @returns Fungsi yang sudah di-debounce
 *
 * @example
 * const debouncedSearch = useDebounce((value: string) => {
 *     router.get('/items', { search: value }, { preserveState: true });
 * }, 400);
 *
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 */
export default function useDebounce<T extends (...args: never[]) => void>(
    callback: T,
    delay: number = 300
): (...args: Parameters<T>) => void {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const callbackRef = useRef(callback);

    // Selalu update ref ke callback terbaru (hindari stale closure)
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Cleanup timeout saat unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            callbackRef.current(...args);
        }, delay);
    }, [delay]);
}
