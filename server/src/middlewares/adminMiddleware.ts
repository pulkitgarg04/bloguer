import { Request, Response, NextFunction } from 'express';
import prisma from '../repositories/prisma';

export default async function adminMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userId = (req as any).userId as string | undefined;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const user = await (prisma as any).user.findUnique({
            where: { id: userId },
        });

        if (!user || !(user as any).isAdmin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        return next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
