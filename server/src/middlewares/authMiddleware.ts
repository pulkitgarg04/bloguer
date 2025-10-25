import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authorizationHeader = req.header('authorization') || '';
    if (!authorizationHeader.startsWith('Bearer ')) {
        return res.status(400).json({ message: 'Token missing or malformed' });
    }
    const token = authorizationHeader.split(' ')[1];
    try {
        const secret = process.env.JWT_SECRET || '';
        const user = jwt.verify(token, secret) as any;
        if (user) {
            (req as any).userId = user.id;
            return next();
        }
        return res.status(401).json({ message: 'Unauthorized' });
    } catch (error: any) {
        if (error && error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'You are not Authorized' });
        }
        console.error('Error in auth middleware: ', error);
        return res.status(400).json({ message: 'Internal Server Error ' + error });
    }
}
