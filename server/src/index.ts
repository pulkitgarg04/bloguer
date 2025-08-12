import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { blogRouter } from './routes/blog.route';
import { userRouter } from './routes/user.route';
import { aiRouter } from './routes/ai.route';

const app = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
        GEMINI_API_KEY: string;
    };
}>();

app.get('/', (c) => {
    console.log(c.req.url);
    return c.text('Hi! Welcome to Bloguer.');
});

app.use(
    '/*',
    cors({
        origin: (origin) => {
            const allowedOrigins = [
                'http://localhost:5173',
                'https://bloguer.vercel.app',
            ];
            if (origin && allowedOrigins.includes(origin)) {
                return origin;
            }
            return null;
        },
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);
app.route('/api/v1/ai', aiRouter);

export default app;
