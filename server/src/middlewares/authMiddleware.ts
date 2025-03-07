import { verify } from 'hono/jwt';

export default async function authMiddleware(c: any, next: () => void) {
    const authorizationHeader = c.req.header('authorization') || '';
    // console.log("authorizationHeader: ", authorizationHeader);
    if (!authorizationHeader.startsWith('Bearer ')) {
        c.status(400);
        return c.json({ message: 'Token missing or malformed' });
    }
    const token = authorizationHeader.split(' ')[1];
    try {
        const user = await verify(token, c.env.JWT_SECRET);
        // console.log("user in middleware", user);
        if (user) {
            c.set('userId', user.id);
            await next();
        }
    } catch (error: any) {
        if (error.name === 'JwtTokenInvalid') {
            c.status(403);
            return c.json({
                message: 'You are not Authorized',
            });
        }
        console.log('Error: ', error);
        c.status(400);
        return c.json({
            message: 'Internal Server Error ' + error,
        });
    }
}
