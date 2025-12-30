import { Request, Response, NextFunction } from 'express';

export const cacheMiddleware = {
    noCache: (req: Request, res: Response, next: NextFunction) => {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        next();
    },

    shortCache: (req: Request, res: Response, next: NextFunction) => {
        res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
        next();
    },

    mediumCache: (req: Request, res: Response, next: NextFunction) => {
        res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=300');
        next();
    },

    longCache: (req: Request, res: Response, next: NextFunction) => {
        res.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
        next();
    },

    conditionalCache: (req: Request, res: Response, next: NextFunction) => {
        const isAuthenticated = req.headers.authorization;
        
        if (isAuthenticated) {
            res.set('Cache-Control', 'private, max-age=300, stale-while-revalidate=60');
        } else {
            res.set('Cache-Control', 'public, max-age=600, stale-while-revalidate=120');
        }
        next();
    },
};
