import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import {
    userRouter,
    blogRouter,
    aiRouter,
    commentRouter,
    healthRouter,
} from './routes/index.route';

const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://bloguer.vercel.app'];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(null, false);
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-visitor-id'],
        credentials: true,
    })
);

app.use(express.json());

app.get('/', (req, res) => {
    console.log(req.url);
    res.send('Hi! Welcome to Bloguer.');
});

app.use('/api/v1/health', healthRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/blog', blogRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/comment', commentRouter);

const PORT = process.env.PORT || 4000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

export default app;
