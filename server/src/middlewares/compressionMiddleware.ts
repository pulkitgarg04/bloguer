import compression from 'compression';

// Gzip compression middleware
// Default threshold is 1KB. This will compress JSON/API responses as well as HTML.
export const useCompression = compression({
    // Keep defaults; tweak if needed
});
