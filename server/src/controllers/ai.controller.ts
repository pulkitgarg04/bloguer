import { Request, Response } from 'express';
import { generateArticle } from '../services/ai.service';

export const AIController = {
    generateArticle: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as string | undefined;
            if (!userId)
                return res
                    .status(401)
                    .json({ message: 'Unauthorized. No user ID found.' });
            const { title, category } = req.body as any;
            if (!title || !category)
                return res
                    .status(400)
                    .json({ message: 'Title and category are required.' });
            const result = await generateArticle(title, category);
            if ((result as any).error)
                return res
                    .status(500)
                    .json({ success: false, message: (result as any).error });
            return res.status(200).json({
                success: true,
                content: (result as any).content,
                message: 'Article generated successfully',
            });
        } catch (error: any) {
            if (
                error.message?.includes('overloaded') ||
                error.message?.includes('503')
            ) {
                return res.status(503).json({
                    success: false,
                    message:
                        'AI service is temporarily busy. Please try again in a few minutes.',
                });
            } else if (
                error.message?.includes('API key') ||
                error.message?.includes('401')
            ) {
                return res.status(500).json({
                    success: false,
                    message:
                        'AI service configuration error. Please contact support.',
                });
            } else if (error.message?.includes('quota')) {
                return res.status(429).json({
                    success: false,
                    message:
                        'AI service quota exceeded. Please try again later.',
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message:
                        'Failed to generate article. Please try again later.',
                });
            }
        }
    },
};
