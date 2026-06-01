import React from 'react';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-10 w-auto',
    xl: 'h-16 w-auto'
};

/**
 * Komponen Logo SIMPATIK.
 * Menggunakan file logo.webp dari public/images.
 */
const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
    return (
        <img 
            src="/images/logo.webp" 
            alt="SIMPATIK Logo" 
            className={`${SIZES[size]} object-contain ${className}`}
        />
    );
};

export default Logo;
