import { create } from 'zustand';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`;

axios.defaults.withCredentials = true;

const handleError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || 'An unexpected error occurred.';
    }
    return (error as Error).message || 'An unexpected error occurred.';
};

interface AuthState {
    user: {
        id: string;
        email: string;
        name: string;
        username: string;
        avatar: string;
    } | null;
    isAuthenticated: boolean;
    error: string | null;
    isLoading: boolean;
    isCheckingAuth: boolean;
    message: string | null;
    signup: (
        email: string,
        password: string,
        name: string,
        username: string
    ) => Promise<boolean>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    signup: async (
        email: string,
        password: string,
        name: string,
        username: string
    ) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.post(`${API_URL}/signup`, {
                name,
                username,
                email,
                password,
            });

            const { jwt } = response.data;
            localStorage.setItem('token', jwt);

            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            return true;
        } catch (error) {
            const errorMessage = handleError(error);
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    },

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password,
            });
            const { jwt, user } = response.data;

            localStorage.setItem('token', jwt);
            set({
                user,
                isAuthenticated: true,
                error: null,
                isLoading: false,
            });

            return true;
        } catch (error) {
            const errorMessage = handleError(error);
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    },

    logout: async () => {
        localStorage.clear();
        set({ user: null, isAuthenticated: false, error: null });
    },

    checkAuth: async () => {
        set({ isLoading: true });
        const token = localStorage.getItem('token');

        if (!token) {
            set({
                isAuthenticated: false,
                isCheckingAuth: false,
                isLoading: false,
                user: null,
                error: null,
            });
            return;
        }

        set({ isCheckingAuth: true });

        try {
            const response = await axios.get(`${API_URL}/checkAuth`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            set({
                user: response.data || null,
                isAuthenticated: true,
                isCheckingAuth: false,
                isLoading: false,
            });
        } catch (error) {
            const errorMessage = handleError(error);
            set({
                error: errorMessage,
                isCheckingAuth: false,
                isAuthenticated: false,
                isLoading: false,
                user: null,
            });
        }
    },
}));
