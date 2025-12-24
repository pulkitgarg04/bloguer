/**
 * Optimizes Cloudinary image URLs with transformations for better performance
 * @param url - Original image URL
 * @param width - Desired width (optional)
 * @param quality - Quality setting (default: 'auto')
 * @returns Optimized URL
 */
export function optimizeCloudinaryUrl(
    url: string | undefined,
    width?: number,
    quality: string = 'auto'
): string | undefined {
    if (!url) return url;
    
    // Only transform Cloudinary URLs
    if (!url.includes('cloudinary.com')) return url;
    
    const transforms = [`f_auto`, `q_${quality}`];
    if (width) transforms.push(`w_${width}`);
    
    return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
}

/**
 * Optimizes image content in HTML (for blog content)
 * Adds lazy loading and optimizes Cloudinary URLs
 * @param html - HTML content with images
 * @returns Optimized HTML
 */
export function optimizeContentImages(html: string): string {
    if (!html) return html;
    
    // Add lazy loading to all images
    let optimized = html.replace(/<img /g, '<img loading="lazy" ');
    
    // Optimize Cloudinary URLs in content
    optimized = optimized.replace(
        /(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(v\d+\/[^"'\s]+)/g,
        '$1f_auto,q_auto,w_800/$2'
    );
    
    return optimized;
}
