import { Router } from 'express';
import passport from '../config/passport';

export const authRouter = Router();

// Start Google OAuth (use state to carry redirect if provided)
authRouter.get('/google', (req, res, next) => {
    const state = (req.query.redirect as string) || '';
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account',
        state,
        session: false,
    })(req, res, next);
});

// Callback handler
authRouter.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google` }),
    (req, res) => {
        const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
        const state = (req.query.state as string) || '';
        const redirectBase = state || `${frontend}`;
        const token = (req.user as any)?.jwt as string | undefined;
        const url = new URL(redirectBase);
        if (token) url.searchParams.set('token', token);
        url.searchParams.set('oauth', 'google');
        res.redirect(url.toString());
    }
);
