import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getCache, setCache, delCache } from '../utils/cache';
import {
    signinInput,
    signupInput,
    forgotPasswordInput,
    resetPasswordInput,
    verifyEmailInput,
    resendVerificationInput,
} from '@pulkitgarg04/bloguer-validations';
import {
    createUser,
    findPostsByAuthor,
    findUserBasicById,
    findUserByEmail,
    findUserByUsername,
    follow,
    unfollow,
    setVerificationToken,
    findUserByVerificationToken,
    markEmailVerified,
    setPasswordResetToken,
    findUserByResetToken,
    updatePassword,
    updateUserProfile,
} from '../repositories/user.repository';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email';
import crypto from 'crypto';

export function generateJWT(id: string) {
    const secret = process.env.JWT_SECRET || '';
    return jwt.sign({ id }, secret);
}

export async function signupService(body: any) {
    const parsed = signupInput.safeParse(body);
    if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        return { error: firstError.message };
    }

    const existing = await findUserByEmail(body.email);
    if (existing) return { conflict: 'User already exists.' };

    const hashedPassword = await bcrypt.hash(body.password, 12);
    const user = await createUser({
        name: body.name,
        username: body.username,
        email: body.email,
        password: hashedPassword,
        avatar: `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(body.name)}&size=128`,
        JoinedDate: new Date(),
    });

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await setVerificationToken((user as any).id, verifyToken, expires);

    try {
        await sendVerificationEmail(body.email, body.name, verifyToken);
        console.log(`Verification email sent to ${body.email}`);
    } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
    }

    const jwtToken = generateJWT(user.id);
    return { user, token: jwtToken };
}

export async function loginService(body: any) {
    const parsed = signinInput.safeParse(body);
    if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        return { error: firstError.message };
    }

    const user = await findUserByEmail(body.email);
    if (!user || !(await bcrypt.compare(body.password, (user as any).password)))
        return { error: 'Incorrect credentials' };

    if (!(user as any).emailVerifiedAt) {
        return { error: 'Please verify your email before logging in.' };
    }

    const token = generateJWT((user as any).id);
    return { user, token };
}

export async function checkAuthService(userId: string) {
    const cacheKey = `user:auth:${userId}`;
    const cached = await getCache(cacheKey);
    if (cached) return JSON.parse(cached);

    const user = await findUserBasicById(userId);
    if (user) {
        await setCache(cacheKey, JSON.stringify(user), 60);
    }
    return user;
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
    const parsed = verifyEmailInput.safeParse({ token });
    if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        return { error: firstError.message };
    }

    console.log('Verifying email with token:', token);
    const user = await findUserByVerificationToken(token);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
        console.log('Token not found in database');
        return { error: 'Invalid or expired verification token' };
    }
    
    const exp = (user as any).verificationTokenExpires as Date | null;
    console.log('Token expiry:', exp, 'Current time:', new Date());
    
    if (!exp || exp.getTime() < Date.now()) {
        console.log('Token has expired');
        return { error: 'Verification token has expired' };
    }
    
    console.log('Marking email as verified for user:', (user as any).id);
    await markEmailVerified((user as any).id);
    return { ok: true };
}

export async function resendVerificationService(email: string) {
    const parsed = resendVerificationInput.safeParse({ email });
    if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        return { error: firstError.message };
    }

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

export async function forgotPasswordService(email: string) {
    const parsed = forgotPasswordInput.safeParse({ email });
    if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        return { error: firstError.message };
    }

    const user = await findUserByEmail(email);
    if (!user) {
        return { ok: true };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await setPasswordResetToken((user as any).id, resetToken, expires);

    try {
        await sendPasswordResetEmail(email, (user as any).name || '', resetToken);
        console.log(`Password reset email sent to ${email}`);
    } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        return { error: 'Failed to send reset email' };
    }

    return { ok: true };
}

export async function resetPasswordService(token: string, newPassword: string) {
    const parsed = resetPasswordInput.safeParse({ token, newPassword });
    if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        return { error: firstError.message };
    }

    const user = await findUserByResetToken(token);
    if (!user) {
        return { error: 'Invalid or expired reset token' };
    }

    const exp = (user as any).resetPasswordTokenExpires as Date | null;
    if (!exp || exp.getTime() < Date.now()) {
        return { error: 'Reset token has expired' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await updatePassword((user as any).id, hashedPassword);

    return { ok: true };
}

export async function updateProfileService(
    userId: string,
    data: { name?: string; bio?: string; location?: string }
) {
    await delCache(`user:auth:${userId}`);
    return await updateUserProfile(userId, data);
}
