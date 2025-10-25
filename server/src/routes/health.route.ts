import { Router, Request, Response } from 'express';

const router = Router();

const getStatusPayload = () => ({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
});

router.get('/', (_req: Request, res: Response) => {
    res.status(200).json(getStatusPayload());
});

router.get('/live', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'alive' });
});

export const healthRouter = router;
