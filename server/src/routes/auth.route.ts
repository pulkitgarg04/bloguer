import { Router } from 'express';
import passport from '../config/passport';

export const authRouter = Router();

authRouter.get('/google', (req, res, next) => {
    const state = (req.query.redirect as string) || '';
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account',
        state,
        session: false,
    })(req, res, next);
});

authRouter.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
        const state = (req.query.state as string) || '';
        const redirectBase = state || `${frontend}`;
        const url = new URL(redirectBase);

        if (err || !user) {
            const errorMessage =
                err?.message || info?.message || 'Google authentication failed';
            url.searchParams.set('error', errorMessage);
            return res.redirect(url.toString());
        }

        const token = (user as any)?.jwt as string | undefined;
        if (token) {
            url.searchParams.set('token', token);
            url.searchParams.set('oauth', 'google');
        } else {
            url.searchParams.set(
                'error',
                'Failed to generate authentication token'
            );
        }

        res.redirect(url.toString());
    })(req, res, next);
});
