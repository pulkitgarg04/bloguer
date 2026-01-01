import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'chart-vendor': ['recharts'],
                    'map-vendor': ['leaflet', 'react-leaflet'],
                    'editor-vendor': ['react-quill', 'dompurify'],
                    'utils': ['axios', 'zustand'],
                },
            },
        },
        minify: 'esbuild',
        chunkSizeWarningLimit: 1000,
        sourcemap: false,
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'axios', 'zustand'],
    },
    ssr: {
        // Disable externalizing @tanstack/react-query to avoid double bundles on Vite 6
        noExternal: ['@tanstack/react-query'],
    },
});
