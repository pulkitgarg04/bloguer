import { useMemo, useState } from 'react';

interface BlurImageProps {
    src?: string;
    alt: string;
    className?: string;
    wrapperClassName?: string;
    loading?: 'lazy' | 'eager';
}

const buildLqip = (src?: string) => {
    if (!src) return undefined;

    if (src.includes('cloudinary.com')) {
        return src.replace(
            '/upload/',
            '/upload/f_auto,q_10,w_40,e_blur:1000/'
        );
    }

    return src;
};

export default function BlurImage({
    src,
    alt,
    className = '',
    wrapperClassName = '',
    loading = 'lazy',
}: BlurImageProps) {
    const [loaded, setLoaded] = useState(false);
    const placeholder = useMemo(() => buildLqip(src), [src]);

    return (
        <div className={`relative overflow-hidden ${wrapperClassName}`}>
            {placeholder && (
                <img
                    src={placeholder}
                    alt=""
                    aria-hidden
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-0' : 'opacity-100 blur-sm scale-105'}`}
                    loading={loading}
                />
            )}
            <img
                src={src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                loading={loading}
            />
        </div>
    );
}
