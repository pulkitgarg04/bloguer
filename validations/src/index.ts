import z from "zod";

export const signupInput = z.object({
    username: z.string().refine((value) => value.trim() !== "", {
        message: "Username cannot be empty or contain only spaces.",
    }),
    email: z.string().email(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
        .regex(/[a-z]/, "Password must include at least one lowercase letter.")
        .regex(/\d/, "Password must include at least one number.")
        .regex(/[@$!%*?&]/, "Password must include at least one special character."),
    name: z.string().min(2, "Name must be at least 2 characters long."),
});

export type SignupInput = z.infer<typeof signupInput>

export const signinInput = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export type SigninInput = z.infer<typeof signinInput>

export const createBlogInput = z.object({
    title: z
        .string()
        .min(5, "Title must be at least 5 characters long.")
        .max(100, "Title cannot exceed 100 characters."),
    content: z
        .string()
        .min(20, "Content must be at least 20 characters long."),
});

export type CreateBlogInput = z.infer<typeof createBlogInput>

export const updateBlogInput = z.object({
    id: z.number().int("ID must be an integer."),
    title: z
        .string()
        .min(5, "Title must be at least 5 characters long.")
        .max(100, "Title cannot exceed 100 characters."),
    content: z
        .string()
        .min(20, "Content must be at least 20 characters long."),
});

export type UpdateBlogInput = z.infer<typeof updateBlogInput>