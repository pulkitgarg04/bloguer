import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { signinInput, signupInput } from '@pulkitgarg04/bloguer-validations';
import {
    createUser,
    findPostsByAuthor,
    findUserBasicById,
    findUserByEmail,
    findUserByUsername,
    follow,
    unfollow,
} from '../repositories/user.repository';

export function generateJWT(id: string) {
    const secret = process.env.JWT_SECRET || '';
    return jwt.sign({ id }, secret);
}

export async function signupService(body: any) {
    const parsed = signupInput.safeParse(body);
    if (!parsed.success) return { error: parsed.error.message };

    const existing = await findUserByEmail(body.email);
    if (existing) return { conflict: 'User already exists.' };

    const hashedPassword = await bcrypt.hash(body.password, 12);
    const user = await createUser({
        name: body.name,
        username: body.username,
        email: body.email,
        password: hashedPassword,
        avatar: `https://avatar.iran.liara.run/username?username=${body.name}`,
        JoinedDate: new Date(),
    });

    const token = generateJWT(user.id);
    return { user, token };
}

export async function loginService(body: any) {
    const parsed = signinInput.safeParse(body);
    if (!parsed.success) return { error: parsed.error.message };

    const user = await findUserByEmail(body.email);
    if (!user || !(await bcrypt.compare(body.password, (user as any).password)))
        return { error: 'Incorrect credentials' };

    const token = generateJWT((user as any).id);
    return { user, token };
}

export async function checkAuthService(userId: string) {
    return findUserBasicById(userId);
}

export async function profileService(username: string) {
    const user = await findUserProfile(username);
    if (!user) return null;

    const posts = await findPostsByAuthor(user.id);

    return { user, posts };
}

export async function followersFollowingCountService(username: string) {
    const user = await findUserByUsername(username);
    if (!user) return null;
    return {
        followersCount: user.followers.length,
        followingCount: user.following.length,
    };
}

export async function followOrUnfollowService(
    userId: string,
    usernameToFollow: string,
    action: 'follow' | 'unfollow'
) {
    const target = await findUserByUsername(usernameToFollow);

    if (!target) return null;
    if (action === 'follow') await follow(userId, target.id);
    else await unfollow(userId, target.id);

    return true;
}

async function findUserProfile(username: string) {
    return await (
        await import('../repositories/user.repository')
    ).findUserProfile(username);
}
