import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.tsx';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 10 * 60 * 1000, // 10 minutes [default]
            gcTime: 30 * 60 * 1000, // 30 minutes [default]
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <HelmetProvider>
                <App />
            </HelmetProvider>
        </QueryClientProvider>
    </StrictMode>
);
