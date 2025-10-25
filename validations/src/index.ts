import { z } from 'zod';

export const signupInput = z.object({
    username: z
        .string()
        .min(1, { message: 'Username cannot be empty or contain only spaces.' })
        .transform((s) => s.trim()),
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long.' })
        .regex(/[A-Z]/, { message: 'Password must include at least one uppercase letter.' })
        .regex(/[a-z]/, { message: 'Password must include at least one lowercase letter.' })
        .regex(/\d/, { message: 'Password must include at least one number.' })
        .regex(/[@$!%*?&]/, { message: 'Password must include at least one special character.' }),
    name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
});

export type SignupInput = z.infer<typeof signupInput>;

export const signinInput = z.object({
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});

export type SigninInput = z.infer<typeof signinInput>;

export const createBlogInput = z.object({
    title: z.string().min(5, { message: 'Title must be at least 5 characters long.' }).max(100, { message: 'Title cannot exceed 100 characters.' }),
    content: z.string().min(20, { message: 'Content must be at least 20 characters long.' }),
    category: z.string().min(1, { message: 'Category is required.' }),
});

export type CreateBlogInput = z.infer<typeof createBlogInput>;

export const updateBlogInput = z.object({
    postId: z.string().min(1, { message: 'postId is required.' }),
    title: z.string().min(5, { message: 'Title must be at least 5 characters long.' }).max(100, { message: 'Title cannot exceed 100 characters.' }),
    content: z.string().min(20, { message: 'Content must be at least 20 characters long.' }),
    category: z.string().min(1, { message: 'Category is required.' }).optional(),
});

export type UpdateBlogInput = z.infer<typeof updateBlogInput>;