import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import bcrypt from 'bcryptjs';
import { signinInput, signupInput } from '@pulkitgarg04/bloguer-validations';
import authMiddleware from '../middlewares/authMiddleware';
import jwt from 'jsonwebtoken';

export const userRouter = Router();

const generateJWT = (id: string) => {
    const secret = process.env.JWT_SECRET || '';
    return jwt.sign({ id }, secret);
};

userRouter.post('/signup', async (req: Request, res: Response) => {
    const body = req.body;

    const { success, error } = signupInput.safeParse(body);
    if (!success) {
        return res.status(403).json({ message: error.message });
    }

    const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(
        withAccelerate()
    );

    try {
        const existingUser = await prisma.user.findUnique({ where: { email: body.email } });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(body.password, 12);
        const user = await prisma.user.create({
            data: {
                name: body.name,
                username: body.username,
                email: body.email,
                password: hashedPassword,
                avatar: `https://avatar.iran.liara.run/username?username=${body.name}`,
                JoinedDate: new Date(),
            },
        });

        const token = generateJWT(user.id);
        return res.status(201).json({ jwt: token, user });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Server Error' });
    }
});

userRouter.post('/login', async (req: Request, res: Response) => {
    const body = req.body;
    const { success, error } = signinInput.safeParse(body);
    if (!success) {
        return res.status(411).json({ message: error.message });
    }

    const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(
        withAccelerate()
    );

    try {
        const user = await prisma.user.findFirst({ where: { email: body.email } });

        if (!user || !(await bcrypt.compare(body.password, user.password))) {
            return res.status(403).json({ message: 'Incorrect credentials' });
        }

        const token = generateJWT(user.id);
        return res.status(200).json({ jwt: token, user });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Server error' });
    }
});

userRouter.get('/checkAuth', authMiddleware, async (req: Request, res: Response) => {
    const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(
        withAccelerate()
    );

    try {
        const userId = (req as any).userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized. No user ID found.' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, username: true, email: true, avatar: true },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json(user);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Server error.' });
    }
});

userRouter.get('/profile/:username', async (req: Request, res: Response) => {
    const { username } = req.params;
    const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(
        withAccelerate()
    );

    try {
        const user = await prisma.user.findUnique({
            where: { username: username.toLowerCase() },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                avatar: true,
                JoinedDate: true,
                location: true,
                bio: true,
                followers: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const posts = await prisma.post.findMany({
            where: { authorId: user.id },
            select: { id: true, title: true, content: true, featuredImage: true, readTime: true, category: true, views: true, Date: true },
            orderBy: { Date: 'desc' },
        });

        return res.status(200).json({ user, posts });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Server error while fetching posts.' });
    }
});

userRouter.get('/followersFollowingCount/:username', async (req: Request, res: Response) => {
    const { username } = req.params;
    const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(
        withAccelerate()
    );

    try {
        const user = await prisma.user.findUnique({ where: { username: username.toLowerCase() }, include: { followers: true, following: true } });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const followersCount = user.followers.length;
        const followingCount = user.following.length;

        return res.status(200).json({ followersCount, followingCount });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Error fetching followers and following count.' });
    }
});

userRouter.post('/followOrUnfollow', authMiddleware, async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { usernameToFollow, action } = req.body;

    if (!userId || !usernameToFollow || !action) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }).$extends(withAccelerate());

    try {
        const userToFollow = await prisma.user.findUnique({ where: { username: usernameToFollow.toLowerCase() } });

        if (!userToFollow) {
            return res.status(404).json({ message: 'User to follow not found' });
        }

        if (action === 'follow') {
            await prisma.user.update({ where: { id: userId }, data: { following: { connect: { id: userToFollow.id } } } });
            await prisma.user.update({ where: { id: userToFollow.id }, data: { followers: { connect: { id: userId } } } });
        } else if (action === 'unfollow') {
            await prisma.user.update({ where: { id: userId }, data: { following: { disconnect: { id: userToFollow.id } } } });
            await prisma.user.update({ where: { id: userToFollow.id }, data: { followers: { disconnect: { id: userId } } } });
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        return res.status(200).json({ message: `Successfully ${action}ed` });
    } catch (error) {
        console.error('Error in follow/unfollow', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
