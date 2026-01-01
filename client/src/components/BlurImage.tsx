import { useMemo, useState, useRef, useEffect } from 'react';

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
    const [shouldLoad, setShouldLoad] = useState(loading === 'eager');
    const containerRef = useRef<HTMLDivElement>(null);
    const placeholder = useMemo(() => buildLqip(src), [src]);

    useEffect(() => {
        if (loading === 'eager' || shouldLoad) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '200px',
                threshold: 0.01,
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [loading, shouldLoad]);

    return (
        <div ref={containerRef} className={`relative overflow-hidden ${wrapperClassName}`}>
            {placeholder && (
                <img
                    src={placeholder}
                    alt=""
                    aria-hidden
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-0' : 'opacity-100 blur-sm scale-105'}`}
                    loading="eager"
                />
            )}

            {shouldLoad && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setLoaded(true)}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                    loading={loading}
                    decoding="async"
                />
            )}

            {!placeholder && !loaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
        </div>
    );
}
