import { z } from 'zod';

const passwordRegex = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /\d/,
    special: /[@$!%*?&#]/,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;

export const signupInput = z.object({
    username: z
        .string()
        .min(3, { message: 'Username must be at least 3 characters long.' })
        .max(20, { message: 'Username cannot exceed 20 characters.' })
        .regex(usernameRegex, { message: 'Username can only contain letters, numbers, underscores, and hyphens.' })
        .transform((s) => s.trim().toLowerCase()),
    email: z
        .string()
        .email({ message: 'Invalid email address.' })
        .regex(emailRegex, { message: 'Invalid email format.' })
        .transform((s) => s.trim().toLowerCase()),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long.' })
        .max(128, { message: 'Password cannot exceed 128 characters.' })
        .regex(passwordRegex.uppercase, { message: 'Password must include at least one uppercase letter.' })
        .regex(passwordRegex.lowercase, { message: 'Password must include at least one lowercase letter.' })
        .regex(passwordRegex.number, { message: 'Password must include at least one number.' })
        .regex(passwordRegex.special, { message: 'Password must include at least one special character (@$!%*?&#).' }),
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .max(50, { message: 'Name cannot exceed 50 characters.' })
        .transform((s) => s.trim()),
});

export type SignupInput = z.infer<typeof signupInput>;

export const signinInput = z.object({
    email: z
        .string()
        .email({ message: 'Invalid email address.' })
        .transform((s) => s.trim().toLowerCase()),
    password: z
        .string()
        .min(1, { message: 'Password is required.' }),
});

export type SigninInput = z.infer<typeof signinInput>;

export const forgotPasswordInput = z.object({
    email: z
        .string()
        .email({ message: 'Invalid email address.' })
        .regex(emailRegex, { message: 'Invalid email format.' })
        .transform((s) => s.trim().toLowerCase()),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordInput>;

export const resetPasswordInput = z.object({
    token: z
        .string()
        .min(1, { message: 'Reset token is required.' })
        .regex(/^[a-f0-9]{64}$/, { message: 'Invalid reset token format.' }),
    newPassword: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long.' })
        .max(128, { message: 'Password cannot exceed 128 characters.' })
        .regex(passwordRegex.uppercase, { message: 'Password must include at least one uppercase letter.' })
        .regex(passwordRegex.lowercase, { message: 'Password must include at least one lowercase letter.' })
        .regex(passwordRegex.number, { message: 'Password must include at least one number.' })
        .regex(passwordRegex.special, { message: 'Password must include at least one special character (@$!%*?&#).' }),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordInput>;

export const verifyEmailInput = z.object({
    token: z
        .string()
        .min(1, { message: 'Verification token is required.' })
        .regex(/^[a-f0-9]{64}$/, { message: 'Invalid verification token format.' }),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailInput>;

export const resendVerificationInput = z.object({
    email: z
        .string()
        .email({ message: 'Invalid email address.' })
        .regex(emailRegex, { message: 'Invalid email format.' })
        .transform((s) => s.trim().toLowerCase()),
});

export type ResendVerificationInput = z.infer<typeof resendVerificationInput>;

export const createBlogInput = z.object({
    title: z
        .string()
        .min(5, { message: 'Title must be at least 5 characters long.' })
        .max(100, { message: 'Title cannot exceed 100 characters.' })
        .transform((s) => s.trim()),
    content: z
        .string()
        .min(20, { message: 'Content must be at least 20 characters long.' })
        .max(50000, { message: 'Content cannot exceed 50,000 characters.' }),
    category: z
        .string()
        .min(1, { message: 'Category is required.' })
        .max(30, { message: 'Category cannot exceed 30 characters.' })
        .transform((s) => s.trim()),
    featuredImage: z
        .string()
        .url({ message: 'Featured image must be a valid URL.' })
        .optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogInput>;

export const updateBlogInput = z.object({
    postId: z
        .string()
        .uuid({ message: 'Invalid post ID format.' }),
    title: z
        .string()
        .min(5, { message: 'Title must be at least 5 characters long.' })
        .max(100, { message: 'Title cannot exceed 100 characters.' })
        .transform((s) => s.trim())
        .optional(),
    content: z
        .string()
        .min(20, { message: 'Content must be at least 20 characters long.' })
        .max(50000, { message: 'Content cannot exceed 50,000 characters.' })
        .optional(),
    category: z
        .string()
        .min(1, { message: 'Category is required.' })
        .max(30, { message: 'Category cannot exceed 30 characters.' })
        .transform((s) => s.trim())
        .optional(),
    featuredImage: z
        .string()
        .url({ message: 'Featured image must be a valid URL.' })
        .optional(),
});

export type UpdateBlogInput = z.infer<typeof updateBlogInput>;

export const createCommentInput = z.object({
    postId: z
        .string()
        .uuid({ message: 'Invalid post ID format.' }),
    content: z
        .string()
        .min(1, { message: 'Comment cannot be empty.' })
        .max(1000, { message: 'Comment cannot exceed 1,000 characters.' })
        .transform((s) => s.trim()),
});

export type CreateCommentInput = z.infer<typeof createCommentInput>;

export const usernameInput = z.object({
    username: z
        .string()
        .min(3, { message: 'Username must be at least 3 characters long.' })
        .max(20, { message: 'Username cannot exceed 20 characters.' })
        .regex(usernameRegex, { message: 'Username can only contain letters, numbers, underscores, and hyphens.' })
        .transform((s) => s.trim().toLowerCase()),
});

export type UsernameInput = z.infer<typeof usernameInput>;
