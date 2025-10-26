import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { signinInput, signupInput } from '@pulkitgarg04/bloguer-validations';
import {
    createUser,
    createUserFromGoogle,
    findPostsByAuthor,
    findUserBasicById,
    findUserByEmail,
    findUserByGoogleId,
    findUserByUsername,
    follow,
    unfollow,
    setVerificationToken,
    findUserByVerificationToken,
    markEmailVerified,
} from '../repositories/user.repository';
import { sendVerificationEmail } from '../utils/email';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

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

    // Email verification token (24h)
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await setVerificationToken((user as any).id, verifyToken, expires);
    // Fire and forget (don't block signup)
    sendVerificationEmail(body.email, body.name, verifyToken).catch(() => {});

    const jwtToken = generateJWT(user.id);
    return { user, token: jwtToken };
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

export async function verifyEmailService(token: string) {
    const user = await findUserByVerificationToken(token);
    if (!user) return { error: 'Invalid or expired verification token' };
    const exp = (user as any).verificationTokenExpires as Date | null;
    if (!exp || exp.getTime() < Date.now())
        return { error: 'Verification token has expired' };
    await markEmailVerified((user as any).id);
    return { ok: true };
}

export async function resendVerificationService(email: string) {
    const user = await findUserByEmail(email);
    if (!user) return { error: 'User not found' };
    if ((user as any).emailVerifiedAt)
        return { error: 'Email is already verified' };
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await setVerificationToken((user as any).id, token, expires);
    await sendVerificationEmail(email, (user as any).name || '', token);
    return { ok: true };
}

export async function googleOAuthService(credential: string) {
    const clientId = process.env.GOOGLE_CLIENT_ID || '';
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: clientId,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email)
        return { error: 'Invalid Google token' };

    const googleId = payload.sub as string;
    let user = await findUserByGoogleId(googleId);
    if (!user) {
        user = await createUserFromGoogle({
            name: payload.name || payload.email.split('@')[0],
            email: payload.email,
            avatar: payload.picture,
            googleId,
        });
    }
    const token = generateJWT((user as any).id);
    return { user, token };
}
