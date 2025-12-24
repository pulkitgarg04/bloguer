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
    authRouter,
    newsletterRouter,
    contactRouter,
} from './routes/index.route';
import passport from './config/passport';

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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(passport.initialize());

app.get('/', (req, res) => {
    console.log(req.url);
    res.send('Hi! Welcome to Bloguer.');
});

app.use('/api/v1/health', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/blog', blogRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/comment', commentRouter);
app.use('/api/v1/newsletter', newsletterRouter);
app.use('/api/v1/contact', contactRouter);

const PORT = process.env.PORT || 4000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

export default app;
